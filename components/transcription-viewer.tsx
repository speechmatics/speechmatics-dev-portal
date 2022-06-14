import { trackEvent } from "../utils/analytics";
import { BoxProps, VStack, HStack, Box, Button, Menu, MenuButton, Text, useBreakpointValue, Grid } from "@chakra-ui/react";
import { formatTimeDateFromString } from "../utils/date-utils";
import { capitalizeFirstLetter } from "../utils/string-utils";
import { getFullLanguageName } from "../utils/transcribe-elements";
import { CopyIcon, DownloadIcon } from "./icons-library";
import { TranscriptDownloadMenu } from "./transcript-download-menu";

export type TranscriptionViewerProps = {
  transcriptionText: string;
  date: string;
  jobId: string;
  accuracy: string;
  language: string;
  fileName: string;
  transcMaxHeight?: string;
} & BoxProps;

export const TranscriptionViewer = ({
  transcriptionText, fileName, date,
  jobId, accuracy, language,
  transcMaxHeight = '10em', ...boxProps }: TranscriptionViewerProps) => {

  return <VStack border='1px' borderColor='smBlack.200' width='100%' {...boxProps}>
    <HStack justifyContent='space-between' width='100%' px={6} py={3} bgColor='smNavy.200'
      borderBottom='1px'
      borderColor='smBlack.200'>
      <Stat title='Submitted:' value={formatTimeDateFromString(date)} />
      <Stat title='Job ID:' value={jobId} />
      <Stat title='Accuracy:' value={capitalizeFirstLetter(accuracy)} />
      <Stat title='Language:' value={getFullLanguageName(language)} />
    </HStack>
    <Box flex='1' maxHeight={transcMaxHeight} overflowY='auto' px={6} py={2} color='smBlack.300'>
      {transcriptionText ? transcriptionText : '(Transcript is empty)'}
    </Box>
    <Grid width='100%' gap={4} p={4} borderTop='1px' borderColor='smBlack.200'
      gridTemplateColumns='repeat(auto-fit, minmax(14em, 1fr))'>
      <Button variant='speechmatics' flex='1' leftIcon={<CopyIcon />} fontSize='1em'
        onClick={() => {
          navigator?.clipboard?.writeText(transcriptionText);
          trackEvent('copy_transcription', 'Action')
        }}>
        Copy Transcription
      </Button>
      <Menu>
        <MenuButton as={Button} flex='1' variant='speechmaticsGreen' leftIcon={<DownloadIcon />}
          fontSize='1em'
          onClick={() => trackEvent('download_transcription_click', 'Action')}>
          Download Transcription
        </MenuButton>
        <TranscriptDownloadMenu fileName={fileName} jobId={jobId} status={'done'} />
      </Menu>
    </Grid>
  </VStack>
}


const Stat = ({ title, value, ...boxProps }) => (
  <Box {...boxProps}>
    <Text as="span" color="smBlack.300" fontFamily="RMNeue-Bold" fontSize="0.8em">
      {title}{' '}
    </Text>
    <Text as="span" color="smBlack.300" fontSize="0.8em">
      {value}
    </Text>
  </Box>
);
