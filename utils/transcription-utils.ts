import { BatchTranscriptionResponse } from '../custom';
import { capitalizeFirstLetter } from './string-utils';

export function getDiarizedTranscription(input: string | BatchTranscriptionResponse) {
  let json: BatchTranscriptionResponse;

  if (typeof input !== 'string' && 'results' in (input as BatchTranscriptionResponse)) {
    json = input as BatchTranscriptionResponse;
  } else {
    try {
      json = JSON.parse(input as string);
    } catch (e) {
      return { type: 'text', output: input as string, copyText: input as string };
    }
  }

  const diarization = json.metadata.transcription_config.diarization;

  let html = '';
  let prevSpeaker = '';
  let speaker = '';
  let speakerWTags = '';
  let copyText = '';
  let prevChannel = '';
  let channel = '';
  let channelWTags = '';

  json.results.forEach((curr) => {
    const alt = curr.alternatives?.[0];

    if (diarization == 'speaker' && prevSpeaker != alt.speaker) {
      speaker = alt.speaker.replace('S', 'Speaker ');
      speakerWTags = `<span class='speakerChangeLabel'>${speaker}:</span>`;
      speaker = `\n${speaker}: `;
      prevSpeaker = alt.speaker;
    }

    if (diarization == 'channel' && prevChannel != curr.channel) {
      channel = capitalizeFirstLetter(curr.channel?.replace('_', ' '));
      channelWTags = `<span class='channelLabel'>${channel}:</span>`;
      channel = `\n${channel}\n`;
      prevChannel = curr.channel;
    }

    const separtor = curr.type == 'punctuation' ? '' : ' ';
    html = `${html}${channelWTags}${speakerWTags}${separtor}${alt.content}`;
    copyText = `${copyText}${channel}${speaker}${separtor}${alt.content}`;

    speakerWTags = '';
    speaker = '';
    channel = '';
    channelWTags = '';
  }, '');

  return { type: 'json', output: html, copyText };
}
