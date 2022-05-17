import { makeObservable, observable, computed, action, makeAutoObservable } from 'mobx';

class FileTranscriptionStore {
  constructor() {
    makeAutoObservable(this);
  }
}
