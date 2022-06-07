import { BoxProps, VStack, HStack, Box, Button, Menu, MenuButton, Text } from "@chakra-ui/react";
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
  transcMaxHeight?: string;
} & BoxProps;

export const TranscriptionViewer = ({ transcriptionText, date, jobId, accuracy, language, transcMaxHeight = '1em', ...boxProps }: TranscriptionViewerProps) => (
  <VStack border='1px' borderColor='smBlack.200' width='100%' {...boxProps}>
    <HStack justifyContent='space-between' width='100%' px={6} py={3} bgColor='smNavy.200'
      borderBottom='1px'
      borderColor='smBlack.200'>
      <Stat title='Submitted:' value={formatTimeDateFromString(date)} />
      <Stat title='Job ID:' value={jobId} />
      <Stat title='Accuracy:' value={capitalizeFirstLetter(accuracy)} />
      <Stat title='Language:' value={getFullLanguageName(language)} />
    </HStack>
    <Box flex='1' maxHeight={transcMaxHeight} overflowY='auto' px={6} py={2} color='smBlack.300'>
      {transcriptionText}
    </Box>
    <HStack width='100%' spacing={4} p={4} borderTop='1px' borderColor='smBlack.200'>
      <Button variant='speechmatics' flex='1' leftIcon={<CopyIcon />} fontSize='1em'
        onClick={() => navigator?.clipboard?.writeText(transcriptionText)}>
        Copy Transcription
      </Button>
      <Menu>
        <MenuButton as={Button} flex='1' variant='speechmaticsGreen' leftIcon={<DownloadIcon />} fontSize='1em'>
          Download Transcription
        </MenuButton>
        <TranscriptDownloadMenu jobId={jobId} status={'done'} />
      </Menu>
    </HStack>
  </VStack>
)


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
