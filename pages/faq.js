import Dashboard from '../components/dashboard';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from "@chakra-ui/react"

export default function Faq({ }) {

  return <Dashboard>
    <h1>Frequently Asked Questions</h1>
    <Accordion width='600px'>
      {faqData.map((item, i) => (
        <AccordionItem key={i}>
          <h2>
            <AccordionButton className='faq_button_header'>
              <Box flex="1" textAlign="left">
                {item.q}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={10}>
            <div dangerouslySetInnerHTML={{ __html: replacer(item.a) }}></div>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  </Dashboard>
}

const replacer = (str) => str.replace(/\n/g, '<br/>').replace(/\*/g, '<li/>')

const faqData = [
  {
    q: 'What audio files are supported?',
    a: `Speechmatics support many audio and video file formats including wav, mp3, aac, ogg, flac, wma, mpeg, amr, caf, mp4, mov, wmv, mpeg, m4v, flv, mkv. Other formats may work but should be validated under user acceptance testing.
    For best possible results try to avoid using file formats that use compression technologies.
    
    For a full list of features including file input formats, please see our product sheets.`
  },
  {
    q: 'What languages do you support? ',
    a: `A full list of our available languages can be found on the languages page.`
  }, {
    q: 'Do I have to submit a job with a supported language specified? ',
    a: `Yes. All audio/video files submitted to the Speechmatics ASR require a language code to be supplied. A list of all the language codes are provided in related customer documentation.`
  }, {
    q: 'What sampling rate do I need on my audio files? ',
    a: `All Speechmatics language packs are optimised for sample rates of 8kHz and 16kHz. If you are unsure or your audio files are varied and have mixed sample rates, please submit them as is, and the Speechmatics engine will automatically optimise them for the best possible results.`
  }, {
    q: 'Do we support multi-channel transcription? ',
    a: `Yes. Our Batch ASR solutions support audio/video files with up to 6 channels. When enabled the audio/video file submitted will have each channel processed separately but will be combined in a single output. Some benefits of Channel Diarisation:
    
    * Custom channel labels can be submitted for example Agent & Caller
    * Can eliminate cross talk
    * A single output is generated that has channel labelling and timing information for each word recognised
    * Perfect speaker identification based on 1 user per channel`
  }, {
    q: 'What impacts the accuracy of the transcription? ',
    a: `Things we have seen impact accuracy include:

    * Clarity of speech
    * Background noise
    * Cross talk
    * Distance from microphone
    
    Other factors that can impact include multiple languages in a single audio file.`
  }, {
    q: 'How can I improve transcription accuracy? ',
    a: `Speech recognition is limited by the quality of the audio presented to the system. To get the best out of our system, try to follow these simple steps below.
    You:
    
    * Speak clearly. However, there is no need to speak slowly
    * Ideally, your voice should flow over the microphone, not directly into it for optimal results
    * Literal translation of people ‘thinking out loud’ is very hard to read, so – if possible – think about what you want to say before you say it
    * If you have time, record some test audio and play it back to check it all sounds okay before you try it live
    
    
    Your environment:
    
    * Record in a quiet environment to minimise background noise
    * Try to avoid multiple people speaking at the same time
    * Minimise reverberation. Sound can sometimes bounce off flat walls and muddy the signal
    
    Your technology:
    
    * Use a good microphone, such as a USB noise cancelling (or directional) microphone – a head mounted microphone is preferable
    * Record at 16kHz or greater if possible
    * There is no need to compress the audio, if you do, please don’t over compress – use 96 kbps AAC or 128 kbps MP3 or better.
    * Use two channels if available.
    * Do not apply any transcoding prior to submitting to the Speechmatics ASR`
  }, {
    q: 'What forms of diarisation do you support? ',
    a: `We support various forms of diarisation and speaker separation to suit different use-cases. These are:
    
    * Speaker diarisation detects and labels the gender (male and female) speakers in an audio/video file. Available in our batch ASR solutions
    * Channel diarisation allows a single audio file with multiple tracks to be submitted to the ASR with custom labels (eg. agent and customer). Available in our batch ASR solutions`
  }, {
    q: 'How accurate are you? ',
    a: `Actions speak louder than words. We like our customers to try audio files representative of their use-case. This provides a true measurement of accuracy and what it means for you. Why not try transcribing a media file or live speech using our free demo and see for yourself?`
  }, {
    q: 'What data do you collect and store when your service is used? ',
    a: `Users of our public cloud ASR can refer to our <a href='https://www.speechmatics.com/terms-of-website/' target='_blank'>Terms & Conditions</a> and <a href='https://www.speechmatics.com/privacy-policy/' target='_blank'>Privacy Policy</a>.
    Speechmatics’ on-premises solutions do not collect or store any video/audio files or transcribed output, this gives you full control over your data.`
  }, {
    q: 'How long does it take to transcribe a file? ',
    a: `The processing time taken to transcribe a media file compared to the length the file is referred to as the real time factor (RTF).
    Our batch ASR will transcribe a file with an RTF of 0.5. For example, a 10-minute file will be transcribed within 5 minutes.
    
    We cannot guarantee an RTF of 0.5 for files less than 3 minutes in length.`
  }, {
    q: 'Are there any limitations to the number of Jobs I can submit on your Cloud? ',
    a: `The processing time taken to transcribe a media file compared to the length the file is referred to as the real time factor (RTF).
    Unless agreed otherwise with Speechmatics, the following behaviour will be considered acceptable use of the Cloud Services ASR (for V2 customers only). Speechmatics reserve the right to change the rate limits at any time in order to ensure continuity of service for all customers of the Cloud.
    
    a. The Customer shall limit the rate of submission of files to a maximum of 2 jobs per second with a maximum of 100 jobs in progress at any one time.
    b. The Customer shall limit the rate of polling for the status of submitted jobs to a maximum of 20 queries per second (across all jobs).`
  }
]

