import { Box, Progress, VStack } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useRef } from 'react';
import { pluralize } from '../../utils/string-utils';
import { fileTranscriptionFlow } from '../../utils/transcribe-store-flow';


interface FilesBeingUploadedProps {
  forceGetJobs: () => void;
}

export default observer(function FilesBeingUploaded({ forceGetJobs }: FilesBeingUploadedProps) {
  const count = fileTranscriptionFlow.store.uploadedFiles.length;

  useTrackUploadedJobs(count, forceGetJobs);

  return <>{count > 0 &&
    <VStack width='100%' p={2}>
      <Box color='smNavy.400'>{pluralize(count, 'file is', 'files are')} being uploaded in the background.</Box>
      <Progress size='xs' isIndeterminate width='40%' colorScheme='smBlue' />
    </VStack>}
  </>
})


export const useTrackUploadedJobs = (jobsCount: number, forceGetJobs: () => void) => {
  const recentJobsCount = useRef<number>(0);

  if (jobsCount < recentJobsCount.current) {
    forceGetJobs();
    recentJobsCount.current = jobsCount;
  }

  if (recentJobsCount.current == 0) recentJobsCount.current = jobsCount;

}