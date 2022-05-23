import { createStandaloneToast } from '@chakra-ui/react';
import { makeObservable, observable, computed, action, makeAutoObservable } from 'mobx';
import {
  callFileTranscriptionSecret,
  callRequestFileTranscription,
  callRequestJobStatus,
  callRequestJobTranscription,
} from './call-api';

const toast = createStandaloneToast({});

export type Stage = 'form' | 'pendingFile' | 'pendingTranscription' | 'failed' | 'complete';
export type Accuracy = 'enhanced' | 'standard';
export type Separation = 'none' | 'speaker';
type JobStatus = 'running' | 'done' | 'rejected' | '';

export const languagesData = [
  { label: 'English', value: 'en', selected: true },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
];

export const getFullLanguageName = (value: string) =>
  languagesData.find((el) => el.value == value)?.label;

export const separation: {
  label: string;
  value: Separation;
  selected?: boolean;
}[] = [
  { label: 'None', value: 'none', selected: true },
  { label: 'Speaker', value: 'speaker' },
];

export const accuracyModels: {
  label: string;
  value: Accuracy;
  selected?: boolean;
}[] = [
  { label: 'Enhanced', value: 'enhanced', selected: true },
  { label: 'Standard', value: 'standard' },
];

const enum FlowError {
  CouldntFetchSecret,
  FileTooBig,
  FileWrongType,
  ServerFileReceivedWrong,
  ServerJobFailed,
}

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
  }
  get stage(): Stage {
    return this._stage;
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

  async fetchSecret(idToken: string) {
    try {
      const json = await callFileTranscriptionSecret(idToken);
      this.store.secretKey = json.key;
    } catch (err) {
      this.store.error = FlowError.CouldntFetchSecret;
    }
  }

  assignFile(file: File) {
    if (file == null) {
      this.store.setFile(null);
      return;
    }

    if (file.size > 1_000_000_000) {
      this.store.error = FlowError.FileTooBig;
    } else if (
      !['audio/mp4', 'audio/mpeg', 'audio/x-wav', 'audio/wav', 'application/ogg'].includes(
        file.type
      )
    ) {
      this.store.error = FlowError.FileWrongType;
    } else {
      this.store.error = null;
      this.store.setFile(file);
    }
  }

  async attemptSendFile() {
    const { secretKey, _file, language, accuracy, separation } = this.store;

    this.store.stage = 'pendingFile';

    const resp = await callRequestFileTranscription(
      secretKey,
      _file,
      language,
      accuracy,
      separation
    );

    if (resp && 'id' in resp) {
      this.store.jobId = resp.id;
      this.store.stage = 'pendingTranscription';

      this.runStatusPolling();
    } else {
      //todo handle errors
      toast({ description: 'error' });
    }

    //check server response if all right, does it send 4xx when wrong?
  }

  interv = 0;

  runStatusPolling() {
    const { secretKey, jobId } = this.store;

    this.interv = window.setInterval(async () => {
      const resp = await callRequestJobStatus(secretKey, jobId);
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
    const { secretKey, jobId } = this.store;

    const transcr = await callRequestJobTranscription(secretKey, jobId, 'txt');

    this.store.transcriptionText = transcr;
  }

  reset() {
    this.store.resetStore();
  }
}

export const fileTranscriptionFlow = new FileTranscribeFlow();
