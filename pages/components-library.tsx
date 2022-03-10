import {
  Button,
  Divider,
  Input,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import Dashboard from '../components/dashboard';

export default function ComponentsLibrary() {
  return (
    <Dashboard>
      <PageHeader>Manage Access</PageHeader>
      <PageIntroduction>Review usage of the API</PageIntroduction>
      <Divider color="#999" mt="2em" />
      <VStack gap={4} pt={10} bg="smNavy.200">
        <Tabs size="lg" variant="speechmatics">
          <TabList marginBottom="-1px">
            <Tab>One</Tab>
            <Tab>Two</Tab>
            <Tab>Three</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <p>one!</p>
            </TabPanel>
            <TabPanel>
              <p>two!</p>
            </TabPanel>
            <TabPanel>
              <p>two2!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>

        <Button variant="speechmatics" mt="1em">
          Hello
        </Button>

        <Input variant="speechmatics" width="80%" />
      </VStack>
    </Dashboard>
  );
}

const PageHeader = ({ children }) => (
  <Text fontFamily="RMNeue-Bold" fontSize="2.2em" mt="2em">
    {children}
  </Text>
);

const PageIntroduction = ({ children }) => (
  <Text fontFamily="RMNeue-Light" fontSize="1.1em" mt="0.5em">
    {children}
  </Text>
);
