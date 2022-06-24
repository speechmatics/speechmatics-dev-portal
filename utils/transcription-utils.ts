import { BatchTranscriptionResponse } from '../custom';

export function getDiarizedTranscription(input: string | BatchTranscriptionResponse) {
  let json: BatchTranscriptionResponse;

  if (Object.hasOwn(input as any, 'results')) {
    json = input as BatchTranscriptionResponse;
  } else {
    try {
      json = JSON.parse(input as string);
    } catch (e) {
      return { type: 'text', output: input as string, copyText: input as string };
    }
  }

  let html = '';
  let prevSpeaker = '';
  let speakerChange = '';
  let speakerChangeWTags = '';
  let copyText = '';

  json.results.forEach((curr) => {
    const alt = curr.alternatives?.[0];

    if (prevSpeaker != alt.speaker && json.metadata.transcription_config.diarization == 'speaker') {
      speakerChange = alt.speaker.replace('S', 'Speaker ');
      speakerChangeWTags = `<span class='speakerChangeLabel'>${speakerChange}:</span>`;
      speakerChange = `\n${speakerChange}: `;
      prevSpeaker = alt.speaker;
    }

    const separtor = curr.type == 'punctuation' ? '' : ' ';
    html = `${html}${speakerChangeWTags}${separtor}<span>${alt.content}</span>`;
    copyText = `${copyText}${speakerChange}${separtor}${alt.content}`;

    speakerChangeWTags = '';
    speakerChange = '';
  }, '');

  return { type: 'json', output: html, copyText };
}
