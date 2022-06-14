import { Box, Progress, VStack } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef } from 'react';
import { pluralize } from '../../utils/string-utils';
import { fileTranscriptionFlow } from '../../utils/transcribe-store-flow';
import { ErrorBanner } from '../common';
import { handleErrors } from '../transcribe-form';

interface FilesBeingUploadedProps {
  forceGetJobs: () => void;
}

export default observer(function FilesBeingUploaded({ forceGetJobs }: FilesBeingUploadedProps) {
  const count = fileTranscriptionFlow.store.uploadedFiles.length;
  const { uploadErrors } = fileTranscriptionFlow.store;

  useTrackUploadedJobs(count, forceGetJobs);

  useEffect(() => {
    return () => {
      fileTranscriptionFlow.store.uploadErrors = []
    };
  }, []);

  return (
    <>
      {count > 0 && (
        <VStack width="100%" p={2} pt={4}>
          <Box color="smNavy.400">
            {pluralize(count, 'file is', 'files are')} being uploaded in the background.
          </Box>
          <Progress size="xs" isIndeterminate width="40%" colorScheme="smBlue" />
        </VStack>
      )}
      {uploadErrors.map((item) => (
        <ErrorBanner
          content={
            <>
              Error uploading {item.name}. {handleErrors(item.error, item.detail)}
            </>
          }
        />
      ))}
    </>
  );
});

export const useTrackUploadedJobs = (jobsCount: number, forceGetJobs: () => void) => {
  const recentJobsCount = useRef<number>(0);

  if (jobsCount < recentJobsCount.current) {
    forceGetJobs();
    recentJobsCount.current = jobsCount;
  }

  if (recentJobsCount.current == 0) recentJobsCount.current = jobsCount;
};
