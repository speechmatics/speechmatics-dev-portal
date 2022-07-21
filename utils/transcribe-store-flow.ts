import { makeAutoObservable } from 'mobx';
import { callGetTranscript, callRequestFileTranscription, callRequestJobStatus } from './call-api';
import {
  Accuracy,
  Separation,
  Stage,
  JobStatus,
  FlowError,
  checkIfFileCorrectType
} from './transcribe-elements';

type UploadError = {
  error: FlowError;
  detail?: string;
  name: string;
};

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

  _transcription: string = '';
  set transcription(value: string) {
    this._transcription = value;
  }
  get transcription(): string {
    return this._transcription;
  }

  _transcriptionJSON: any = null;
  set transcriptionJSON(value: any) {
    this._transcriptionJSON = value;
  }
  get transcriptionJSON(): any {
    return this._transcriptionJSON;
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

  _uploadErrors: UploadError[] = [];
  set uploadErrors(value: UploadError[]) {
    this._uploadErrors = value;
  }
  get uploadErrors(): UploadError[] {
    return this._uploadErrors;
  }

  constructor() {
    makeAutoObservable(this);
  }

  addUploadError(name: string, error: FlowError, detail: string) {
    this._uploadErrors.push({
      name,
      error,
      detail
    });
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
    this.transcription = '';
    this.dateSubmitted = '';
    this.error = null;
    this.uploadErrors = [];
  }

  get fileName() {
    return this._file?.name;
  }

  get fileSize() {
    return this._file?.size;
  }

  _uploadedFiles: File[] = [];
  set uploadedFiles(value: File[]) {
    this._uploadedFiles = value;
  }
  get uploadedFiles(): File[] {
    return this._uploadedFiles;
  }

  addFileToUploading(file: File) {
    this.uploadedFiles = [file, ...this.uploadedFiles];
  }

  removeFileFromUploading(file: File) {
    this.uploadedFiles = this.uploadedFiles.filter((f) => f !== file);
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

  attemptSendFile() {
    const { _file, language, accuracy, separation } = this.store;
    this.store.stage = 'pendingFile';

    this.store.addFileToUploading(_file);

    callRequestFileTranscription(_file, language, accuracy, separation).then(
      this.getResponseFn(_file),
      this.getErrorFn(_file)
    );
  }

  getResponseFn(file: File) {
    const store = this.store;
    const owner = this;
    return function (resp: any) {
      owner.store.removeFileFromUploading(file);

      if (file !== store.file) return;
      if (store.stage !== 'pendingFile') return;

      owner.callRequestSuccess(resp);
    };
  }

  callRequestSuccess(resp: any) {
    //dont act on it when we're not waiting for it
    if (this.store.stage != 'pendingFile') return;

    if (resp && 'id' in resp) {
      this.store.jobId = resp.id;
      this.store.stage = 'pendingTranscription';
      this.runStatusPolling();
    } else {
      //todo gotten unexpected response
    }
  }

  getErrorFn(file: File) {
    const store = this.store;
    const owner = this;
    return function (resp: any) {
      owner.store.removeFileFromUploading(file);
      owner.callError(resp, file.name, file === store.file && store.stage === 'pendingFile');
    };
  }

  callError(error: any, name: string = null, forSingleFlow: boolean = false) {
    console.log('attemptSendFile error', error);
    const store = this.store;
    function arrayOrSingleError(name, error, detail) {
      store.addUploadError(name, error, detail);
      if (forSingleFlow) {
        store.error = error;
      }
    }
    const deets = error.response?.detail || '';

    if (forSingleFlow) this.store.stage = 'failed';
    if (
      error.response.code == 403 &&
      (error.response.detail?.endsWith('Your limit is 2 hours.') ||
        error.response.detail?.endsWith('Your limit is 3 hours.'))
    ) {
      arrayOrSingleError(name, FlowError.BeyondFreeQuota, deets);
    } else if (
      error.response.code == 403 &&
      error.response.detail?.endsWith('Your limit is 1000 hours.')
    ) {
      arrayOrSingleError(name, FlowError.BeyondAllowedQuota, deets);
    } else if (
      error.response.code == 403 &&
      error.response.detail?.startsWith('Entitlement check failed')
    ) {
      arrayOrSingleError(name, FlowError.ContractExpired, deets);
    } else if (error.response.code == 403) {
      arrayOrSingleError(name, FlowError.UndefinedForbiddenError, deets);
    } else {
      arrayOrSingleError(name, FlowError.UndefinedError, deets);
    }
    this.store.errorDetail = deets;
    //add BeyondAllowedQuota, FileTooBig, FileWrongType
  }

  interv = 0;

  runStatusPolling() {
    const { jobId } = this.store;

    this.interv = window.setInterval(async () => {
      const resp = await callRequestJobStatus(jobId);
      const status = (this.store.jobStatus = resp.job.status);
      if (status === 'done') {
        this.store.dateSubmitted = resp.job.created_at;
        this.store.stage = 'complete';
        this.fetchTranscription();
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

  async fetchTranscription() {
    const { jobId } = this.store;

    const transcr = await callGetTranscript(jobId, 'json-v2');

    this.store.transcriptionJSON = transcr;
  }

  reset() {
    this.stopPolling();
    this.store.resetStore();
  }
}

export const fileTranscriptionFlow = new FileTranscribeFlow();
