import { makeObservable, observable, computed, action, makeAutoObservable } from 'mobx';
import { callRequestFileTranscription, callRequestJobStatus } from './call-api';

export type Stage = 'form' | 'pendingFile' | 'pendingTranscription' | 'failed' | 'complete';
export type Accuracy = 'enhanced' | 'standard';
export type Separation = 'none' | 'speaker';

export class FileTranscriptionStore {
  language: string = 'en';
  accuracy: Accuracy = 'enhanced';
  separation: Separation = 'none';

  file: File = null;

  jobId: string = '';

  stage: Stage = 'form';

  jobStatus: 'running' | 'done' | 'rejected';

  constructor() {
    makeAutoObservable(this);
  }

  resetStore() {
    this.language = 'en';
    this.accuracy = 'enhanced';
    this.separation = 'none';
    this.file = null;
    this.jobId = '';
    this.stage = 'form';
  }

  get fileName() {
    return this.file?.name;
  }

  get fileSize() {
    return this.file?.size;
  }
}

export const fileTranscrStore = new FileTranscriptionStore();

export const languagesData = [
  { label: 'English', value: 'en', selected: true },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
];

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

class FileTranscribeFlow {
  async sendFile(
    secretKey: string,
    file: File,
    language: string,
    accuracy: Accuracy,
    separation: Separation
  ) {
    if (file.size > 1_000_000_000) {
      throw new Error('file size too large');
    }

    if (!['audio/mp4', 'audio/mpeg', 'audio/x-wav', 'application/ogg'].includes(file.type)) {
      throw new Error('file wrong type');
    }

    fileTranscrStore.stage = 'pendingFile';

    const resp = await callRequestFileTranscription(
      secretKey,
      file,
      language,
      accuracy,
      separation
    );

    const { id } = resp;

    fileTranscrStore.stage = 'pendingTranscription';

    this.runStatusPooling(secretKey, id);

    //check server response if all right, does it send 4xx when wrong?
  }

  interv = 0;

  runStatusPooling(secretKey: string, jobId: string) {
    this.interv = window.setInterval(async () => {
      const resp = await callRequestJobStatus(secretKey, jobId);
      const { status } = resp;
      fileTranscrStore.jobStatus = status;
      if (status !== 'running') window.clearInterval(this.interv);
    }, 5000);
  }
}
