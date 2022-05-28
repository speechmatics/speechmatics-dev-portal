export type Stage = 'form' | 'pendingFile' | 'pendingTranscription' | 'failed' | 'complete';
export type Accuracy = 'enhanced' | 'standard';
export type Separation = 'none' | 'speaker' | 'channel';
export type JobStatus = 'running' | 'done' | 'rejected' | '';

export type Language = { label: string; value: string; default?: boolean };

export const separation: {
  label: string;
  value: Separation;
  default?: boolean;
}[] = [
  { label: 'None', value: 'none', default: true },
  { label: 'Speaker', value: 'speaker' },
  { label: 'Channel', value: 'channel' },
];

export const accuracyModels: {
  label: string;
  value: Accuracy;
  default?: boolean;
}[] = [
  { label: 'Enhanced', value: 'enhanced', default: true },
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

export const getFullLanguageName = (value: string) =>
  languagesData.find((el) => el.value == value)?.label;

export const languagesData: Language[] = [
  {
    label: 'Arabic',
    value: 'ar',
  },
  {
    label: 'Dutch',
    value: 'nl',
  },
  {
    label: 'Catalan',
    value: 'ca',
  },
  {
    label: 'Danish',
    value: 'da',
  },
  {
    label: 'English',
    value: 'en',
    default: true,
  },
  {
    label: 'French',
    value: 'fr',
  },
  {
    label: 'German',
    value: 'de',
  },
  {
    label: 'Hindi',
    value: 'hi',
  },
  {
    label: 'Italian',
    value: 'it',
  },
  {
    label: 'Japanese',
    value: 'ja',
  },
  {
    label: 'Korean',
    value: 'ko',
  },
  {
    label: 'Polish',
    value: 'pl',
  },
  {
    label: 'Portuguese',
    value: 'pt',
  },
  {
    label: 'Russian',
    value: 'ru',
  },
  {
    label: 'Spanish',
    value: 'es',
  },
  {
    label: 'Swedish',
    value: 'sv',
  },
  {
    label: 'Mandarin',
    value: 'cmn',
  },
  {
    label: 'Norwegian',
    value: 'no',
  },
  {
    label: 'Bulgarian',
    value: 'bg',
  },
  {
    label: 'Czech',
    value: 'cs',
  },
  {
    label: 'Finnish',
    value: 'fi',
  },
  {
    label: 'Hungarian',
    value: 'hu',
  },
  {
    label: 'Croatian',
    value: 'hr',
  },
  {
    label: 'Lithuanian',
    value: 'lt',
  },
  {
    label: 'Latvian',
    value: 'lv',
  },
  {
    label: 'Romanian',
    value: 'ro',
  },
  {
    label: 'Slovak',
    value: 'sk',
  },
  {
    label: 'Slovenian',
    value: 'sl',
  },
  {
    label: 'Turkish',
    value: 'tr',
  },
  {
    label: 'Malay',
    value: 'ms',
  },
];
