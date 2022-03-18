import {
  VStack,
  Text,
  Divider,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Code,
  HStack,
  Box,
  Button,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { CodeExamples, PageHeader, PageIntroduction, SimplePanel } from '../components/common';
import Dashboard from '../components/dashboard';

export default observer(function GettingStarted({}) {
  return (
    <Dashboard>
      <PageHeader
        headerLabel="Getting Started"
        introduction="Get started with using our platform in a few simple steps."
      />
      <VStack alignItems="flex-start">
        <SimplePanel>
          <Text fontFamily="RMNeue-Bold" color="smGreen.500">
            STEP 1
          </Text>
          <Text fontFamily="RMNeue-Bold" fontSize="1.3em">
            Create an API key
          </Text>
          <Text fontFamily="RMNeue-Regular" fontSize="0.9em">
            You need to{' '}
            <Link href="/manage-access/">
              <a>
                <Text color="smBlue.500" as="span">
                  create an API key
                </Text>
              </a>
            </Link>{' '}
            to make transcription requests.
          </Text>
        </SimplePanel>
      </VStack>
      <VStack alignItems="flex-start" mt="3em">
        <SimplePanel>
          <Text fontFamily="RMNeue-Bold" color="smGreen.500">
            STEP 2
          </Text>
          <Text fontFamily="RMNeue-Bold" fontSize="1.3em">
            Make an API request
          </Text>
          <Text fontFamily="RMNeue-Regular" fontSize="0.9em">
            Download our{' '}
            <Link href="/manage-access/">
              <a>
                <Text color="smBlue.500" as="span">
                  sample audio file
                </Text>
              </a>
            </Link>{' '}
            into the folder, or use your own. <br />
            Copy the following curl command and replace the API key with your own.
            <br />
            Run the command to generate a transcript.
            <CodeExamples />
          </Text>
        </SimplePanel>
      </VStack>
    </Dashboard>
  );
});
