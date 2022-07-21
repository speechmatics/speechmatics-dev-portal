import { ToastId } from '@chakra-ui/react';

export type TranscriptResultType = 'word' | 'punctuation' | 'speaker_change' | 'entity';

export type TranscriptResult = {
  type: TranscriptResultType;
  start_time: number;
  end_time: number;
  channel?: string;
  is_eos?: boolean;
  spoken_form?: TranscriptResult[];
  written_form?: TranscriptResult[];
  entity_class?: string;
  alternatives: {
    content: string;
    confidence: number;
    display: {
      direction: 'ltr' | 'rtl';
    };
    language: string;
    speaker?: string;
    tags: string[];
  }[];
};

export type SpeakerDiarization = 'none' | 'speaker' | 'channel';

export type TranscriptionConfig = {
  diarization: SpeakerDiarization;
  language: string;
  operating_point: 'standard' | 'enhanced';
};

export type BatchTranscriptionResponse = {
  format: string;
  metadata?: {
    created_at: string;
    type: 'transcription' | string;
    transcription_config?: TranscriptionConfig;
    transcript: string;
  };
  results?: TranscriptResult[];
};

export type RequestThrowType = {
  type: string;
  status: number;
  response: any;
  toastId: ToastId;
};