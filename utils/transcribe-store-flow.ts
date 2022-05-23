import { createStandaloneToast } from '@chakra-ui/react';
import { makeObservable, observable, computed, action, makeAutoObservable } from 'mobx';
import {
  callFileTranscriptionSecret,
  callRequestFileTranscription,
  callRequestJobStatus,
} from './call-api';

const toast = createStandaloneToast({});

export type Stage = 'form' | 'pendingFile' | 'pendingTranscription' | 'failed' | 'complete';
export type Accuracy = 'enhanced' | 'standard';
export type Separation = 'none' | 'speaker';

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

const enum FlowError {
  CouldntFetchSecret,
  FileTooBig,
  FileWrongType,
  ServerFileReceivedWrong,
  ServerJobFailed,
}

export class FileTranscriptionStore {
  language: string = 'en';
  accuracy: Accuracy = 'enhanced';
  separation: Separation = 'none';
  file: File = null;
  jobId: string = '';
  stage: Stage = 'form';
  jobStatus: 'running' | 'done' | 'rejected' | '' = '';
  secretKey: string = '';
  transcriptionText: string = '';
  dateSubmitted: string = '';
  error: FlowError | null = null;

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
    this.jobStatus = '';
    this.secretKey = '';
    this.transcriptionText = '';
    this.dateSubmitted = '';
    this.error = null;
  }

  get fileName() {
    return this.file?.name;
  }

  get fileSize() {
    return this.file?.size;
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
      this.store.file = null;
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
      this.store.file = file;
    }
  }

  async attemptSendFile() {
    const { secretKey, file, language, accuracy, separation } = this.store;

    this.store.stage = 'pendingFile';

    const resp = await callRequestFileTranscription(
      secretKey,
      file,
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

  fetchTranscription() {}

  reset() {
    this.store.resetStore();
  }
}

export const fileTranscriptionFlow = new FileTranscribeFlow();
