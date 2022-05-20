import { makeObservable, observable, computed, action, makeAutoObservable } from 'mobx';

export type Stage = 'form' | 'pendingFile' | 'pendingTranscription' | 'failed' | 'complete';

export class FileTranscriptionStore {
  language: string = 'en';
  accuracy: 'enhanced' | 'standard' = 'enhanced';
  separation: 'none' | 'speaker' = 'none';

  file: File = null;

  jobId: string = '';

  stage: Stage = 'form';

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
  value: typeof fileTranscrStore.separation;
  selected?: boolean;
}[] = [
  { label: 'None', value: 'none', selected: true },
  { label: 'Speaker', value: 'speaker' },
];

export const accuracyModels: {
  label: string;
  value: typeof fileTranscrStore.accuracy;
  selected?: boolean;
}[] = [
  { label: 'Enhanced', value: 'enhanced', selected: true },
  { label: 'Standard', value: 'standard' },
];
