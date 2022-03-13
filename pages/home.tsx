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
import Link from 'next/link';
import { CodeExamples, PageHeader, PageIntroduction, SimplePanel } from '../components/common';
import Dashboard from '../components/dashboard';

export default function Home({}) {
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
            <Link href="/api-token/">
              <a>
                <Text color="smBlue.500" as="span">
                  create an API key
                </Text>
              </a>
            </Link>{' '}
            to make transcripion requests.
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
            <Link href="/api-token/">
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

      <HStack
        width="800px"
        bg="smGreen.500"
        height="100px"
        mt="2em"
        justifyContent="space-between"
        padding="2.5em 1.5em"
      >
        <Box flex="0 0 auto">
          <img src="/assets/temp_trackIcon.png" />
        </Box>
        <VStack alignItems="flex-start" flex="1" pl="1em" spacing="0px">
          <Text fontFamily="Matter-Bold" fontSize="1.4em" color="smWhite.500">
            Track your usage
          </Text>
          <Text fontFamily="Matter-Medium" fontSize="1em" color="smWhite.500">
            Usage is measured in minutes of audio processed
          </Text>
        </VStack>
        <Link href="/usage/">
          <Button variant="speechmaticsWhite">View Usage</Button>
        </Link>
      </HStack>
    </Dashboard>
  );
}
