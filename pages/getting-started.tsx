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
import {
  CodeExamples,
  DescriptionLabel,
  HeaderLabel,
  PageHeader,
  PageIntroduction,
  SimplePanel,
  SmPanel,
} from '../components/common';
import Dashboard from '../components/dashboard';
import { GenerateTokenComponent } from './manage-access';

export default observer(function GettingStarted({}) {
  return (
    <Dashboard>
      <PageHeader
        headerLabel="Getting Started"
        introduction="Get started with using our platform in a few simple steps."
      />

      <SmPanel width="800px">
        <Box>
          <HeaderLabel>Download example audio file</HeaderLabel>
          <DescriptionLabel>
            Download our{' '}
            <Link href="/manage-access/">
              <a>
                <Text color="smBlue.500" as="span">
                  sample audio file
                </Text>
              </a>
            </Link>{' '}
            into the folder, or use your own. <br />
          </DescriptionLabel>
        </Box>
        <Box
          bg="smBlack.200"
          height="1px"
          width="calc(100% + 3em)"
          style={{ marginLeft: '-1.5em', marginTop: '1em' }}
        />
        <GenerateTokenComponent paddingTop="0.5em" />
        <Box
          bg="smBlack.200"
          height="1px"
          width="calc(100% + 3em)"
          style={{ marginLeft: '-1.5em', marginTop: '2em' }}
        />
        <Box paddingTop="0.5em">
          <HeaderLabel>Make an API request</HeaderLabel>
          <DescriptionLabel>Run the command to generate a transcript.</DescriptionLabel>{' '}
          <CodeExamples />
        </Box>
      </SmPanel>
    </Dashboard>
  );
});
