import { Box, BoxProps, Button, Divider, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
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

type Stage = 'form' | 'pendingFile' | 'pendingTranscription' | 'complete' | 'failed';

export default observer(function Transcribe({ }) {

  const [stage, setStage] = useState<Stage>('form')

  return (
    <Dashboard>
      <PageHeader
        headerLabel="Transcribe"
        introduction="Upload and Transcribe an Audio File." />

      <SmPanel width='100%' maxWidth='900px'>
        {/* <TranscribeForm /> */}
        <ProcessingTranscription />
      </SmPanel>
    </Dashboard>
  );
})


const TranscribeForm = observer(function ({ }) {

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
      <Button variant='speechmatics' fontSize='18' width='100%'>Get Your Transcription</Button>
    </Flex>
  </>
})

const ProcessingTranscription = observer(function () {

  return <Flex alignSelf='stretch' alignItems='center' direction='column' pt={4}>
    <FileProcessingIcon width={64} height={64} />
    <Box fontFamily='RMNeue-Bold' fontSize='3xl' p={2}>Your Transcription Has Been Submitted</Box>
    <Box pt={2}>Status of your job (ID: 2137ABBC) is: <Text as='span' fontFamily='RMNeue-Bold' color='smGreen.500'>Running</Text>.</Box>
    <Box>This page will automatically fetch and show you the results.</Box>

    <FileProcessingProgress stage='pendingFile' py={4} />
    <Divider py={4} color='smBlack.200' />

  </Flex>
})

type FileProcessingProgressProps = { stage: Stage } & BoxProps;

const FileProcessingProgress = observer(function ({ stage, ...boxProps }: FileProcessingProgressProps) {

  return <Box {...boxProps} width='100%' pos='relative' height='4em'>
    <Box rounded='full' width='100%' height={2} bgColor='smBlue.140' pos='absolute' top='50%' zIndex={0} style={{ transform: 'translate(0, -50%)' }} />
    <Box rounded='full' width='50%' height={2} bgGradient='linear(to-r, smBlue.500 25%, smGreen.500)' pos='absolute' top='50%' zIndex={0} style={{ transform: 'translate(0, -50%)' }} />
    <Box rounded='full' width='50%' height={2} pos='absolute' top='50%' zIndex={0}
      style={{ transform: 'translate(0, -50%)' }} className='striped_background animate_background' />

    <ProgressPoint status='done' label='Audio Uploading' posX="15%" step='1' />
    <ProgressPoint status='running' label='Running Transcription' posX="50%" step='2' />
    <ProgressPoint status='pending' label='Transcription Complete' posX="85%" step='3' />
  </Box>
})

type ProgressPointProps = {
  status: 'done' | 'running' | 'pending' | 'failed';
  label: string;
  step: string;
  posX: string;
}

const colors = {
  done: { label: 'smBlue.500', pointBg: 'smBlue.500', step: 'smWhite.500' },
  running: { label: 'smGreen.500', pointBg: 'smGreen.500', step: 'smWhite.500' },
  pending: { label: 'smNavy.280', pointBg: 'smBlue.140', step: '#5E667366' },
  failed: { label: 'smRed.500', pointBg: 'smRed.500', step: 'smWhite.500' }
}

const ProgressPoint = function ({ status, label, step, posX }: ProgressPointProps) {

  return <VStack top='50%' left={posX} style={{ transform: 'translate(-50%, -30%)' }} pos='absolute' spacing={1}>
    <Flex rounded='full' w={8} h={8} bgColor={colors[status].pointBg} border='3px solid white'
      justifyContent='center' alignItems='center' zIndex={2}
      fontFamily='RMNeue-SemiBold' color={colors[status].step} fontSize='.75em' >{status == 'done' ? <OkayIcon /> : step}</Flex>
    <Box fontSize='12' color={colors[status].label}>{label}</Box>
  </VStack>
}

