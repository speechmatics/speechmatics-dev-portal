import { makeAutoObservable } from 'mobx';
import { callGetTranscript, callRequestFileTranscription, callRequestJobStatus } from './call-api';
import {
  Accuracy,
  Separation,
  Stage,
  JobStatus,
  FlowError,
  checkIfFileCorrectType,
} from './transcribe-elements';

export class FileTranscriptionStore {
  _language: string = 'en';
  set language(value: string) {
    this._language = value;
  }
  get language(): string {
    return this._language;
  }

  _accuracy: Accuracy = 'enhanced';
  set accuracy(value: Accuracy) {
    this._accuracy = value;
  }
  get accuracy(): Accuracy {
    return this._accuracy;
  }

  _separation: Separation = 'none';
  set separation(value: Separation) {
    this._separation = value;
  }
  get separation(): Separation {
    return this._separation;
  }

  _file: File = null;
  setFile(file: File) {
    this._file = file;
  }
  get file(): File {
    return this._file;
  }

  _jobId: string = '';
  set jobId(value: string) {
    this._jobId = value;
  }
  get jobId(): string {
    return this._jobId;
  }

  _stage: Stage = 'form';
  set stage(value: Stage) {
    this._stage = value;
    setTimeout(() => (this.stageDelayed = value), 500);
  }
  get stage(): Stage {
    return this._stage;
  }

  _stageDelayed: Stage = 'form';
  set stageDelayed(value: Stage) {
    this._stageDelayed = value;
  }
  get stageDelayed(): Stage {
    return this._stageDelayed;
  }

  _jobStatus: JobStatus = '';
  set jobStatus(value: JobStatus) {
    this._jobStatus = value;
  }
  get jobStatus(): JobStatus {
    return this._jobStatus;
  }

  _secretKey: string = '';
  set secretKey(value: string) {
    this._secretKey = value;
  }
  get secretKey(): string {
    return this._secretKey;
  }

  _transcriptionText: string = '';
  set transcriptionText(value: string) {
    this._transcriptionText = value;
  }
  get transcriptionText(): string {
    return this._transcriptionText;
  }

  _dateSubmitted: string = '';
  set dateSubmitted(value: string) {
    this._dateSubmitted = value;
  }
  get dateSubmitted(): string {
    return this._dateSubmitted;
  }

  _error: FlowError | null = null;
  set error(value: FlowError | null) {
    this._error = value;
  }
  get error(): FlowError | null {
    return this._error;
  }

  _errorDetail: string = '';
  set errorDetail(value: string) {
    this._errorDetail = value;
  }
  get errorDetail(): string {
    return this._errorDetail;
  }

  constructor() {
    makeAutoObservable(this);
  }

  resetStore() {
    this.language = 'en';
    this.accuracy = 'enhanced';
    this.separation = 'none';
    this._file = null;
    this.jobId = '';
    this.stage = 'form';
    this.jobStatus = '';
    this.secretKey = '';
    this.transcriptionText = '';
    this.dateSubmitted = '';
    this.error = null;
  }

  get fileName() {
    return this._file?.name;
  }

  get fileSize() {
    return this._file?.size;
  }
}

class FileTranscribeFlow {
  store = new FileTranscriptionStore();

  savedIdToken: string = '';

  assignFile(file: File) {
    if (file == null) {
      this.store.setFile(null);
      return;
    }

    if (file.size > 1_000_000_000) {
      this.store.error = FlowError.FileTooBig;
    } else if (!checkIfFileCorrectType(file)) {
      this.store.error = FlowError.FileWrongType;
    } else {
      this.store.error = null;
      this.store.setFile(file);
    }
  }

  attemptSendFile(idToken: string) {
    const { _file, language, accuracy, separation } = this.store;
    this.store.stage = 'pendingFile';
    this.savedIdToken = idToken;

    callRequestFileTranscription(idToken, _file, language, accuracy, separation).then(
      this.getResponseFn(_file),
      this.getErrorFn(_file)
    );
  }

  getResponseFn(file: File) {
    const { stage, file: storeFile } = this.store;
    const owner = this;
    return function (resp: any) {
      if (file !== storeFile) return;
      if (stage !== 'pendingFile') return;

      owner.callRequestSuccess(resp);
    };
  }

  callRequestSuccess(resp: any) {
    console.log('attemptSendFile then', resp);

    //dont act on it when we're not waiting for it
    if (this.store.stage != 'pendingFile') return;

    if (resp && 'id' in resp) {
      this.store.jobId = resp.id;
      this.store.stage = 'pendingTranscription';
      this.runStatusPolling(this.savedIdToken);
    } else {
      //todo gotten unexpected response
    }
  }

  getErrorFn(file: File) {
    const { stage, file: storeFile } = this.store;
    const owner = this;
    return function (resp: any) {
      if (file !== storeFile) return;
      if (stage !== 'pendingFile') return;

      owner.callError(resp);
    };
  }

  callError(error: any) {
    console.log('attemptSendFile error', error);
    if (this.store.stage != 'pendingFile') return;

    this.store.stage = 'failed';
    if (error.response.code == 403 && error.response.detail?.endsWith('Your limit is 2 hours.')) {
      this.store.error = FlowError.BeyondFreeQuota;
    } else if (
      error.response.code == 403 &&
      error.response.detail?.endsWith('Your limit is 1000 hours.')
    ) {
      this.store.error = FlowError.BeyondAllowedQuota;
    } else if (
      error.response.code == 403 &&
      error.response.detail?.startsWith('Entitlement check failed')
    ) {
      this.store.error = FlowError.ContractExpired;
    } else if (error.response.code == 403) {
      this.store.error = FlowError.UndefinedForbiddenError;
    } else {
      this.store.error = FlowError.UndefinedError;
    }

    this.store.errorDetail = error.response?.detail || '';

    //add BeyondAllowedQuota, FileTooBig, FileWrongType
  }

  interv = 0;

  runStatusPolling(idToken) {
    const { jobId } = this.store;

    this.interv = window.setInterval(async () => {
      const resp = await callRequestJobStatus(idToken, jobId);
      const status = (this.store.jobStatus = resp.job.status);
      if (status === 'done') {
        this.store.dateSubmitted = resp.job.created_at;
        this.store.stage = 'complete';
        this.fetchTranscription(idToken);
      }
      if (status === 'rejected') {
        this.store.stage = 'failed';
        //todo add display reason
      }
      if (status !== 'running') this.stopPolling();
    }, 5000);
  }

  stopPolling() {
    window.clearInterval(this.interv);
  }

  async fetchTranscription(idToken) {
    const { jobId } = this.store;

    const transcr = await callGetTranscript(idToken, jobId, 'text');

    this.store.transcriptionText = transcr;
  }

  reset() {
    this.stopPolling();
    this.store.resetStore();
  }
}

export const fileTranscriptionFlow = new FileTranscribeFlow();
