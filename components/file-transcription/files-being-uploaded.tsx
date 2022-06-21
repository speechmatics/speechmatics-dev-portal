import { Box, Collapse, Progress, useStyleConfig, VStack } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { pluralize } from '../../utils/string-utils';
import { fileTranscriptionFlow } from '../../utils/transcribe-store-flow';
import { ErrorBanner } from '../common';
import { handleErrors } from '../transcribe-form';

interface FilesBeingUploadedProps {
  forceGetJobs: () => void;
}

export default observer(function FilesBeingUploaded({ forceGetJobs }: FilesBeingUploadedProps) {
  const count = fileTranscriptionFlow.store.uploadedFiles.length;
  const [showLoader, setShowLoader] = useState<boolean>(false)
  const { uploadErrors } = fileTranscriptionFlow.store;

  useTrackUploadedJobs(count, forceGetJobs);

  useEffect(() => {
    return () => {
      fileTranscriptionFlow.store.uploadErrors = [];
    };
  }, []);

  useEffect(() => {
    if (count > 0) {
      setShowLoader(true)
    } else {
      setTimeout(() => {
        setShowLoader(false)
      }, 700)
    }
  }, [count]);

  return (
    <>
      <Collapse in={showLoader} style={{ width: '100%' }} unmountOnExit={true}>
        <VStack  p={2} pt={4}>
          <Box color='smNavy.400'>
            {count > 0 ? `${pluralize(count, 'file is', 'files are')} being uploaded in the background.`
              : 'Finishing upload...'}
          </Box>
          <Progress size='xs' isIndeterminate width='40%' colorScheme='smBlue' />
        </VStack>
      </Collapse>
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

export const useTrackUploadedJobs = async (jobsCount: number, forceGetJobs: () => void) => {
  const recentJobsCount = useRef<number>(0);

  if (jobsCount < recentJobsCount.current) {
    forceGetJobs();
    recentJobsCount.current = jobsCount;
  }

  if (recentJobsCount.current == 0) recentJobsCount.current = jobsCount;
};
