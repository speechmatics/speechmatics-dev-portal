import { VStack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { PageHeader, PageIntroduction } from '../components/common';
import Dashboard from '../components/dashboard';

export default function Home({}) {
  return (
    <Dashboard>
      <PageHeader>Getting Started!</PageHeader>
      <PageIntroduction>
        Get started with using our platform in a few simple steps.
      </PageIntroduction>
      <hr style={{ marginTop: '2em', width: '800px' }} />
      <VStack alignItems="flex-start" mt="3em">
        <Panel>
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
        </Panel>
      </VStack>
      <VStack alignItems="flex-start" mt="3em">
        <Panel>
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
          </Text>
        </Panel>
      </VStack>
    </Dashboard>
  );
}

const Panel = ({ children }) => (
  <VStack
    width="800px"
    p="1em 1em 1.5em 1.5em"
    alignItems="flex-start"
    backgroundColor="smWhite.500"
    border="1px solid"
    borderColor="smBlack.200"
    borderRadius="3px"
  >
    {children}
  </VStack>
);
