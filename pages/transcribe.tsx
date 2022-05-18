import { Box, BoxProps, Button, Divider, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { DescriptionLabel, HeaderLabel, PageHeader, SmPanel } from "../components/common";
import Dashboard from "../components/dashboard";
import { FileProcessingIcon, OkayIcon } from "../components/icons-library";
import { FileUploadComponent, ChoiceButtons, SelectField } from "../components/transcribe-form";

const languagesData = [
  { label: 'English', value: 'en', selected: true },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
]

const separation = [
  { label: 'None', value: 'none', selected: true },
  { label: 'Speaker', value: 'speaker' },
]

const accuracyModels = [
  { label: 'Enhanced', value: 'enhanced', selected: true },
  { label: 'Standard', value: 'standard' },

]

type Stage = 'form' | 'pendingFile' | 'pendingTranscription' | 'failed' | 'complete';

export default observer(function Transcribe({ }) {

  const [stage, setStage] = useState<Stage>('form')

  return (
    <Dashboard>
      <PageHeader
        headerLabel="Transcribe"
        introduction="Upload and Transcribe an Audio File." />

      <SmPanel width='100%' maxWidth='900px'>
        {stage == 'form' && <TranscribeForm onAdvance={() => setStage('pendingFile')} />}
        {['pendingFile', 'pendingTranscription', 'failed'].includes(stage) &&
          <ProcessingTranscription stage={stage} onTranscribeAnotherFile={() => setStage('form')} />}
      </SmPanel>
    </Dashboard>
  );
})

type TranscribeFormProps = {
  onAdvance: () => void;
}

const TranscribeForm = observer(function ({ onAdvance }: TranscribeFormProps) {

  const onGetTranscriptionClick = useCallback(() => {
    onAdvance();
  }, [])

  return <>
    <HeaderLabel>Upload a File</HeaderLabel>
    <DescriptionLabel>The audio file can be aac, amr, flac, m4a, mp3, mp4, mpeg, ogg, wav.</DescriptionLabel>
    <Box alignSelf='stretch' pt={4}>
      <FileUploadComponent />
    </Box>

    <HeaderLabel pt={8}>Configure Transcription Options</HeaderLabel>
    <DescriptionLabel>Choose the best features to suit your transcription requirements.</DescriptionLabel>

    <Flex width='100%' wrap='wrap' gap={6} pt={4}>
      <SelectField label="Language" tooltip='Expected language of transcription' data={languagesData} onSelect={() => { }} />
      <SelectField label="Separation" tooltip='Separation of transcription' data={separation} onSelect={() => { }} />
      <SelectField label="Accuracy" tooltip="Accuracy model" data={accuracyModels} onSelect={() => { }} />
    </Flex>
    <Flex width='100%' justifyContent='center' py={2}>
      <Button variant='speechmatics' fontSize='18' width='100%' onClick={onGetTranscriptionClick}>Get Your Transcription</Button>
    </Flex>
  </>
})

type ProcessingTranscriptionProps = {
  stage: Stage;
  onTranscribeAnotherFile: () => void;
}

const ProcessingTranscription = function ({ stage, onTranscribeAnotherFile }: ProcessingTranscriptionProps) {

  const fileSize = '1MB'; // get from files[]
  const jobId = 'AABBCCDD'; // get from store after uploading a file

  return <Flex alignSelf='stretch' alignItems='center' direction='column' pt={4}>
    <FileProcessingIcon width={64} height={64} />

    <Box fontFamily='RMNeue-Bold' fontSize='3xl' p={2} textAlign='center'>
      {stage == 'pendingFile' && 'Your Transcription File Is Being Sent.'}
      {stage == 'pendingTranscription' && 'Your Transcription Has Been Submitted.'}
      {stage == 'failed' && 'Your Transcription Has Failed.'}
    </Box>

    {stage == 'pendingFile' && <>
      <Box pt={2}>You file size is:
        <Text as='span' fontFamily='RMNeue-Bold' color='smGreen.500'> {fileSize}</Text>.
      </Box>
      <Box>This page will automatically fetch and show you the results.</Box>
    </>}

    {stage == 'pendingTranscription' && <>
      <Box pt={2}>Status of your job (ID: {jobId}) is:
        <Text as='span' fontFamily='RMNeue-Bold' color='smGreen.500'> Running</Text>.
      </Box>
      <Box>This page will automatically fetch and show you the results.</Box>
    </>}


    <FileProcessingProgress stage={stage} my={4} />
    <Divider my={8} color='smBlack.200' />
    <Box width='100%' textAlign='center' color='smNavy.500' mb={4}>Go to the <Text as='span' className="text_link"><Link href='/usage#recent-jobs'>Recent Jobs</Link></Text> page to view all your recent transcriptions.</Box>
    <Button variant='speechmaticsOutline' onClick={onTranscribeAnotherFile}>Transcribe Another File</Button>
  </Flex>
}

type FileProcessingProgressProps = { stage: Stage } & BoxProps;

const FileProcessingProgress = function ({ stage, ...boxProps }: FileProcessingProgressProps) {

  return <Box {...boxProps} width='100%' pos='relative' height='4em'>
    <Box rounded='full' width='100%' height={2} bgColor='smBlue.140' pos='absolute'
      top='50%' zIndex={0} style={{ transform: 'translate(0, -50%)' }} />
    <Box rounded='full' width='50%' height={2} bgGradient='linear(to-r, smBlue.500 25%, smGreen.500)'
      pos='absolute' top='50%' zIndex={0} style={{ transform: 'translate(0, -50%)' }} />
    <Box rounded='full' width='50%' height={2} pos='absolute' top='50%' zIndex={0}
      style={{ transform: 'translate(0, -50%)' }} className='striped_background animate_background' />

    <ProgressPoint status='done' label='Audio Uploading' posX="15%" step='1' />
    <ProgressPoint status='running' label='Running Transcription' posX="50%" step='2' />
    <ProgressPoint status='pending' label='Transcription Complete' posX="85%" step='3' />
  </Box>
}

type ProgressPointProps = {
  status: 'done' | 'running' | 'pending' | 'failed';
  label: string;
  step: string;
  posX: string;
}

const statusColors = {
  done: { label: 'smBlue.500', pointBg: 'smBlue.500', step: 'smWhite.500' },
  running: { label: 'smGreen.500', pointBg: 'smGreen.500', step: 'smWhite.500' },
  pending: { label: 'smNavy.280', pointBg: 'smBlue.140', step: '#5E667366' },
  failed: { label: 'smRed.500', pointBg: 'smRed.500', step: 'smWhite.500' }
}

const ProgressPoint = function ({ status, label, step, posX }: ProgressPointProps) {

  return <VStack top='50%' left={posX} style={{ transform: 'translate(-50%, -1em)' }}
    pos='absolute' spacing={1}>
    <Flex rounded='full' w={8} h={8} bgColor={statusColors[status].pointBg}
      border='3px solid white'
      justifyContent='center' alignItems='center' zIndex={2}
      fontFamily='RMNeue-SemiBold' color={statusColors[status].step} fontSize='.75em' >
      {status == 'done' ? <OkayIcon /> : step}
    </Flex>
    <Box fontSize='12' color={statusColors[status].label} textAlign='center'>{label}</Box>
  </VStack>
}

