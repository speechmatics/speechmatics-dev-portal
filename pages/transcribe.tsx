import { Box, BoxProps, Button, Divider, Flex, HStack, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, VStack } from "@chakra-ui/react";
import faker from "@faker-js/faker";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { DescriptionLabel, HeaderLabel, PageHeader, SmPanel } from "../components/common";
import Dashboard from "../components/dashboard";
import { CompleteIcon, CopyIcon, DownloadIcon, FileProcessingFailedIcon, FileProcessingIcon, OkayIcon } from "../components/icons-library";
import { FileUploadComponent, ChoiceButtons, SelectField, ProgressPoint, FileProcessingProgress, Stage } from "../components/transcribe-form";

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

export default observer(function Transcribe({ }) {

  const [stage, setStage] = useState<Stage>('form')

  return (
    <Dashboard>
      <PageHeader
        headerLabel="Transcribe"
        introduction="Upload and Transcribe an Audio File." />

      <SmPanel width='100%' maxWidth='900px'>
        {stage == 'form' && <TranscribeForm onAdvance={() => setStage('pendingFile')} />}
        {['pendingFile', 'pendingTranscription', 'failed', 'complete'].includes(stage) &&
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
      <SelectField data-qa="select-transcribe-language" label="Language" tooltip='Expected language of transcription' data={languagesData} onSelect={() => { }} />
      <SelectField data-qa="select-transcribe-separation" label="Separation" tooltip='Separation of transcription' data={separation} onSelect={() => { }} />
      <SelectField data-qa="select-transcribe-accuracy" label="Accuracy" tooltip="Accuracy model" data={accuracyModels} onSelect={() => { }} />
    </Flex>
    <Flex width='100%' justifyContent='center' py={2}>
      <Button data-qa="button-get-transcription" variant='speechmatics' fontSize='18' width='100%' onClick={onGetTranscriptionClick}>Get Your Transcription</Button>
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
  const fileName = 'alpha.mp3';

  return <Flex alignSelf='stretch' alignItems='center' direction='column' pt={4}>

    {stage == 'pendingFile' &&
      <PendingLabelsSlots
        icon={FileProcessingIcon}
        title={'Your Transcription File Is Being Sent.'}
        subtitle={<>Your file size is:
          <Text as='span' fontFamily='RMNeue-Bold' color='smGreen.500'> {fileSize}</Text>.
        </>}
        subtitle2={'This page will automatically fetch and show you the results.'}
      />}

    {stage == 'pendingTranscription' && <PendingLabelsSlots
      icon={FileProcessingIcon}
      title={'Your Transcription File Is Being Sent.'}
      subtitle={<>Status of your job (ID: {jobId}) is:
        <Text as='span' fontFamily='RMNeue-Bold' color='smGreen.500'> Running</Text>.
      </>}
      subtitle2={'This page will automatically fetch and show you the results.'}
    />}


    {stage == 'failed' && <PendingLabelsSlots
      icon={FileProcessingFailedIcon}
      title='Your Transcription Has Failed.'
      subtitle={<>Status of your job (ID: {jobId}) is:
        <Text as='span' fontFamily='RMNeue-Bold' color='smRed.500'> Failed</Text>.
      </>}
      subtitle2={<>You have reached your monthly usage limit.{' '}
        Please <Link href='/manage-billing'><a className="text_link">Add a Payment Card</a></Link> to increase your limit.</>}
    />}

    {stage == 'complete' && <PendingLabelsSlots
      icon={CompleteIcon}
      title='Your Transcription Is Ready.'
      subtitle={`Transcription of: "${fileName}"`}
      subtitle2={<></>}
    />}

    {stage != 'complete' && <FileProcessingProgress stage={stage} my={4} />}

    {stage == 'complete' &&
      <TranscriptionViewer my={4} date='2 May 2022 4:18pm' jobId="ASDFZXCV"
        accuracy="Enhanced" language="English" downloadLink="http://asdvcxv.fd"
        transcriptionText={faker.lorem.sentences(20)} />}


    {stage != 'complete' && <Divider my={8} color='smBlack.200' />}

    <Box width='100%' textAlign='center' fontSize='1.2em' color='smNavy.400' my={4}>
      Go to the <Link data-qa="link-recent-jobs" href='/usage#recent-jobs'><a className="text_link">Recent Jobs</a></Link>
      {' '}page to view all your recent transcriptions.
    </Box>
    <Button data-qa="button-transcribe-another-file" variant='speechmaticsOutline' onClick={onTranscribeAnotherFile}>Transcribe Another File</Button>
  </Flex>
}

const PendingLabelsSlots = ({ icon, title, subtitle, subtitle2 }) => (<>

  {icon({ width: 64, height: 64 })}

  <Box fontFamily='RMNeue-Bold' fontSize='3xl' p={2} textAlign='center'>
    {title}
  </Box>

  <Box color='smNavy.400' fontSize='1.2em'>{subtitle}</Box>
  <Box textAlign='center' color='smBlack.300'>{subtitle2}</Box>
</>
)


type TranscriptionViewerProps = {
  transcriptionText: string;
  date: string;
  jobId: string;
  accuracy: string;
  language: string;
  downloadLink: string;
} & BoxProps

const TranscriptionViewer = ({ transcriptionText, date, jobId, accuracy, language, downloadLink, ...boxProps }: TranscriptionViewerProps) => (
  <VStack border='1px' borderColor='smBlack.200' width='100%' {...boxProps}>
    <HStack justifyContent='space-between' width='100%' px={6} py={3} bgColor='smNavy.200'
      borderBottom='1px'
      borderColor='smBlack.200'>
      <Stat title='Submitted:' value={date} />
      <Stat title='Job ID:' value={jobId} />
      <Stat title='Accuracy:' value={accuracy} />
      <Stat title='Language:' value={language} />
    </HStack>
    <Box flex='1' maxHeight={150} overflowY='auto' px={6} py={2} color='smBlack.300'>
      {transcriptionText}
    </Box>
    <HStack width='100%' spacing={4} p={4} borderTop='1px' borderColor='smBlack.200'>
      <Button variant='speechmatics' flex='1' leftIcon={<CopyIcon />} fontSize='1em'>Copy Transcription</Button>
      {/* <Button variant='speechmaticsGreen' flex='1' leftIcon={<DownloadIcon />} fontSize='1em'>Download Transcription</Button> */}
      <Menu>
        <MenuButton as={Button} flex='1' variant='speechmaticsGreen' leftIcon={<DownloadIcon />} fontSize='1em'>
          Download Transcription
        </MenuButton>
        <MenuList>
          <MenuItem py={1}>Download as text</MenuItem>
          <MenuDivider color='smNavy.270' />
          <MenuItem py={1}>Download as JSON</MenuItem>
          <MenuDivider color='smNavy.270' />
          <MenuItem py={1}>Download as srt</MenuItem>
          <MenuDivider color='smNavy.270' />
          <MenuItem py={1}>Download audio</MenuItem>
        </MenuList>
      </Menu>
    </HStack>
  </VStack>
)

const Stat = ({ title, value, ...boxProps }) => (
  <Box {...boxProps}>
    <Text as='span' color='smBlack.300' fontFamily='RMNeue-Bold' fontSize='0.8em'>{title} </Text>
    <Text as='span' color='smBlack.300' fontSize='0.8em'>{value}</Text>
  </Box>
)