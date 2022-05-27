export type Stage = 'form' | 'pendingFile' | 'pendingTranscription' | 'failed' | 'complete';
export type Accuracy = 'enhanced' | 'standard';
export type Separation = 'none' | 'speaker';
export type JobStatus = 'running' | 'done' | 'rejected' | '';

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

export const enum FlowError {
  CouldntFetchSecret,
  FileTooBig,
  FileWrongType,
  ServerFileReceivedWrong,
  ServerJobFailed,
}

export const checkIfFileCorrectType = (file: File) =>
  ['audio/mp4', 'audio/mpeg', 'audio/x-wav', 'audio/wav', 'application/ogg'].includes(file.type);
