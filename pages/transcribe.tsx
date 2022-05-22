import { Box, BoxProps, Button, Divider, Flex, HStack, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, VStack } from "@chakra-ui/react";
import faker from "@faker-js/faker";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { DescriptionLabel, HeaderLabel, PageHeader, SmPanel } from "../components/common";
import Dashboard from "../components/dashboard";
import { CompleteIcon, CopyIcon, DownloadIcon, FileProcessingFailedIcon, FileProcessingIcon } from "../components/icons-library";
import { FileUploadComponent, SelectField, FileProcessingProgress } from "../components/transcribe-form";
import { Stage, fileTranscriptionFlow as flow, FileTranscriptionStore, accuracyModels, languagesData, separation } from "../utils/transcribe-store";



export default observer(function Transcribe({ }) {

  const { stage } = flow.store;

  useEffect(() => {
    flow.reset();
  }, [])


  return (
    <Dashboard>
      <PageHeader
        headerLabel="Transcribe"
        introduction="Upload and Transcribe an Audio File." />

      <SmPanel width='100%' maxWidth='900px'>

        {stage == 'form' && <TranscribeForm store={flow.store} />}

        {['pendingFile', 'pendingTranscription', 'failed', 'complete'].includes(stage) &&
          <ProcessingTranscription store={flow.store} />}
      </SmPanel>
    </Dashboard>
  );
})

type TranscribeFormProps = {
  store: FileTranscriptionStore;
}

const TranscribeForm = observer(function ({ store }: TranscribeFormProps) {

  const onGetTranscriptionClick = useCallback(() => {
    store.stage = 'pendingFile';
  }, [])

  return <>
    <HeaderLabel>Upload a File</HeaderLabel>
    <DescriptionLabel>The audio file can be aac, amr, flac, m4a, mp3, mp4, mpeg, ogg, wav.</DescriptionLabel>
    <Box alignSelf='stretch' pt={4}>
      <FileUploadComponent onFileSelect={file => store.file = file} />
    </Box>

    <HeaderLabel pt={8}>Configure Transcription Options</HeaderLabel>
    <DescriptionLabel>Choose the best features to suit your transcription requirements.</DescriptionLabel>

    <Flex width='100%' wrap='wrap' gap={6} pt={4}>
      <SelectField label="Language" tooltip='Expected language of transcription'
        data={languagesData} onSelect={val => store.language = val} />

      <SelectField label="Separation" tooltip='Separation of transcription'
        data={separation} onSelect={val => store.separation = val as any} />

      <SelectField label="Accuracy" tooltip="Accuracy model"
        data={accuracyModels} onSelect={val => store.accuracy = val as any} />
    </Flex>
    <Flex width='100%' justifyContent='center' py={2}>
      <Button variant='speechmatics' fontSize='18' width='100%' onClick={onGetTranscriptionClick}>
        Get Your Transcription
      </Button>
    </Flex>
  </>
})

type ProcessingTranscriptionProps = {
  store: FileTranscriptionStore;
}

const ProcessingTranscription = function ({ store }: ProcessingTranscriptionProps) {

  const { stage, fileName, fileSize, jobId } = store;


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
      Go to the <Link href='/usage#recent-jobs'><a className="text_link">Recent Jobs</a></Link>
      {' '}page to view all your recent transcriptions.
    </Box>
    <Button variant='speechmaticsOutline' onClick={() => store.resetStore()}>Transcribe Another File</Button>
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