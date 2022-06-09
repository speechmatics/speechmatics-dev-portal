import { Box, Progress, VStack } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { pluralize } from '../../utils/string-utils';
import { fileTranscriptionFlow } from '../../utils/transcribe-store-flow';


export default observer(function FilesBeingUploaded({ }) {
  const count = fileTranscriptionFlow.store.uploadedFiles.length;

  console.log('FilesBeingUploaded count', count);

  return <>{count > 0 &&
    <VStack width='100%' p={2}>
      <Box color='smNavy.400'>{pluralize(count, 'file is', 'files are')} being uploaded in the background.</Box>
      <Progress size='xs' isIndeterminate width='40%' colorScheme='smBlue' />
    </VStack>}
  </>
})