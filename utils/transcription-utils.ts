import { BatchTranscriptionResponse } from '../custom';

export function getTranscription(input: string | BatchTranscriptionResponse) {
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

  let prevSpeaker = '';
  let speakerChange = '';
  let speakerChangeWTags = '';

  let copyText = '';

  const output = json.results.reduce((prev, curr) => {
    const alt = curr.alternatives?.[0];
    if (prevSpeaker != alt.speaker) {
      speakerChange = alt.speaker.replace('S', 'Speaker ');
      speakerChangeWTags = `<span class='speakerChangeLabel'>${speakerChange}:</span>`;
      speakerChange = `\n${speakerChange}: `;
      prevSpeaker = alt.speaker;
    }
    let separtor = curr.type == 'punctuation' ? '' : ' ';

    const ret = `${prev}${speakerChangeWTags}${separtor}<span>${alt.content}</span>`;
    copyText = `${copyText}${speakerChange}${separtor}${alt.content}`;
    speakerChangeWTags = '';
    speakerChange = '';
    return ret;
  }, '');

  return { type: 'json', output, copyText };
}
