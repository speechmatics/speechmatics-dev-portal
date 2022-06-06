import { Box, Button, Divider, Flex, Text } from "@chakra-ui/react";

import { observer } from "mobx-react-lite";
import Link from "next/link";
import { useContext, useEffect } from "react";
import { DescriptionLabel, HeaderLabel, PageHeader, SmPanel } from "../components/common";
import Dashboard from "../components/dashboard";
import { ClockIcon, CompleteIcon, FileProcessingFailedIcon, FileProcessingIcon } from "../components/icons-library";
import { FileUploadComponent, SelectField, FileProcessingProgress } from "../components/transcribe-form";
import { TranscriptionViewer } from "../components/transcription-viewer";
import accountStoreContext from "../utils/account-store-context";
import { RuntimeAuthStore, runtimeAuthFlow as authFlow } from "../utils/runtime-auth-flow";
import { humanFileSize } from "../utils/string-utils";
import { languagesData, separation, accuracyModels } from "../utils/transcribe-elements";
import { fileTranscriptionFlow as flow, FileTranscriptionStore } from "../utils/transcribe-store-flow";


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

        {stage === 'form' ?
          <TranscribeForm store={flow.store} auth={authFlow.store} /> :
          <ProcessingTranscription store={flow.store} />}

      </SmPanel>
    </Dashboard>
  );
})

type TranscribeFormProps = {
  store: FileTranscriptionStore;
  auth: RuntimeAuthStore;
}

export const TranscribeForm = observer(function ({ store, auth }: TranscribeFormProps) {

  const { tokenStore } = useContext(accountStoreContext);

  useEffect(() => {
    authFlow.restoreToken()
    if (tokenStore.tokenPayload?.idToken)
      authFlow.refreshToken(tokenStore.tokenPayload.idToken);

  }, [tokenStore.tokenPayload?.idToken])

  return <>
    <HeaderLabel>Upload a File</HeaderLabel>
    <DescriptionLabel>The audio file can be aac, amr, flac, m4a, mp3, mp4, mpeg, ogg, wav.</DescriptionLabel>
    <Box alignSelf='stretch' pt={4}>
      <FileUploadComponent onFileSelect={file => flow.assignFile(file)} />
    </Box>

    <HeaderLabel pt={8}>Configure Transcription Options</HeaderLabel>
    <DescriptionLabel>Choose the best features to suit your transcription requirements.</DescriptionLabel>

    <Flex width='100%' wrap='wrap' gap={6} pt={4}>
      <SelectField data-qa="select-transcribe-language" label="Language" tooltip='Select the language of your audio file‘s spoken content to get the best transcription accuracy'
        data={languagesData} onSelect={val => store.language = val} />

      <SelectField data-qa="select-transcribe-separation" label="Separation" tooltip='Speaker - detects and labels individual speakers within a single audio channel. Channel - labels each audio channel and aggregates into a single transcription output.'
        data={separation} onSelect={val => store.separation = val as any} />

      <SelectField data-qa="select-transcribe-accuracy" label="Accuracy" tooltip="Enhanced - highest transcription accuracy. Standard - faster transcription with high accuracy."
        data={accuracyModels} onSelect={val => store.accuracy = val as any} />
    </Flex>
    <Flex width='100%' justifyContent='center' py={3}>
      <Button data-qa="button-get-transcription" variant='speechmatics' fontSize='18' width='100%'
        onClick={() => {
          flow.attemptSendFile(tokenStore.tokenPayload?.idToken)
        }}
        disabled={!store._file || !auth.isLoggedIn}>
        Get Your Transcription
      </Button>
    </Flex>
    <Flex justifyContent='center' alignItems='center' width='100%'>
      <Box mr={2}><ClockIcon /></Box>
      <Box fontSize='0.85em' color='smNavy.300'>A one hour file will return your transcript in 30 minutes or less.</Box>
    </Flex>
  </>
})

type ProcessingTranscriptionProps = {
  store: FileTranscriptionStore;
}

export const ProcessingTranscription = observer(function ({ store }: ProcessingTranscriptionProps) {

  const { stage, stageDelayed, fileName, fileSize, jobId } = store;

  useEffect(() => {
    return () => {
      flow.stopPolling();
    }
  }, [])


  return <Flex alignSelf='stretch' alignItems='center' direction='column' pt={4} className="fadeIn">

    {stage == 'pendingFile' &&
      <PendingLabelsSlots
        icon={FileProcessingIcon}
        title={'Your Transcription File Is Being Sent.'}
        subtitle={<>Your file size is:
          <Text as='span' fontFamily='RMNeue-Bold' color='smGreen.500'> {humanFileSize(fileSize, true)}</Text>.
        </>}
        subtitle2={'This page will automatically refresh and show your results.'}
      />}

    {stage == 'pendingTranscription' && <PendingLabelsSlots
      icon={FileProcessingIcon}
      title={'Your Transcription Has Been Submitted.'}
      subtitle={<>Status of your job (ID: {jobId.toLowerCase()}) is:
        <Text as='span' fontFamily='RMNeue-Bold' color='smGreen.500'> Running</Text>.
      </>}
      subtitle2={'This page will automatically refresh and show your results.'}
    />}


    {stage == 'failed' && <PendingLabelsSlots
      icon={FileProcessingFailedIcon}
      title='Your Transcription Has Failed.'
      subtitle={<>Status of your job (ID: {jobId.toLowerCase()}) is:
        <Text as='span' fontFamily='RMNeue-Bold' color='smRed.500'> Failed</Text>.
      </>}
      subtitle2={<>You have reached your monthly usage limit. Please
        {' '}<Link href='/manage-billing'>
          <a className="text_link">Add a Payment Card</a>
        </Link> to increase your limit.</>}
    />}

    {stage == 'complete' && <PendingLabelsSlots
      icon={CompleteIcon}
      title='Your Transcription Is Ready.'
      subtitle={`Transcription of: "${fileName}"`}
      subtitle2={<></>}
    />}

    {stageDelayed != 'complete' && <>
      <FileProcessingProgress stage={stage} my={4} />
      <Divider my={8} color='smBlack.200' />
    </>}

    {stageDelayed == 'complete' &&
      <TranscriptionViewer my={4} date={store.dateSubmitted} jobId={store.jobId}
        accuracy={store.accuracy} language={store.language}
        transcriptionText={store.transcriptionText} className="fadeIn" />}


    <Box width='100%' textAlign='center' fontSize='1.2em' color='smNavy.400' my={4}>
      Go to the <Link data-qa="link-recent-jobs" href='/view-jobs/'>
        <a className="text_link">Recent Jobs</a></Link>
      {' '}page to view all your recent transcriptions.
    </Box>

    <Button data-qa="button-transcribe-another-file" variant='speechmaticsOutline' onClick={() => flow.reset()}>Transcribe Another File</Button>

  </Flex>
})

const PendingLabelsSlots = ({ icon, title, subtitle, subtitle2 }) => (<>

  {icon({ width: 64, height: 64 })}

  <Box fontFamily='RMNeue-Bold' fontSize='3xl' p={2} textAlign='center'>
    {title}
  </Box>

  <Box color='smNavy.400' fontSize='1.2em'>{subtitle}</Box>
  <Box textAlign='center' color='smBlack.300'>{subtitle2}</Box>
</>
)
