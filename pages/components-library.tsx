import {
  Button,
  Divider,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import Dashboard from '../components/dashboard';

export default function ComponentsLibrary() {
  return (
    <Dashboard>
      <PageHeader>Manage Access</PageHeader>
      <PageIntroduction>Review usage of the API</PageIntroduction>
      <Divider color="#999" mt="2em" />

      <Tabs size="lg" mt="2em" variant="unstyled">
        <TabList marginBottom="-1px">
          <SmTab>One</SmTab>
          <SmTab>Two</SmTab>
          <SmTab>Three</SmTab>
        </TabList>
        <TabPanels border="1px solid #D1D7D6" boxShadow="4px 4px 7px #5A5D5F15">
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
    </Dashboard>
  );
}

const SmTab = ({ children }) => (
  <Tab
    bg="blue.900"
    borderLeft="0.5px solid #D1D7D6"
    borderRight="0.5px solid #D1D7D6"
    fontSize="0.9em"
    py="1em"
    px="2em"
    fontFamily="Matter-Bold"
    color="black.800"
    _selected={{
      color: 'blue.600',
      bg: 'white',
      borderTop: '2px solid #5398FC',
      borderLeft: '1px solid #D1D7D6',
    }}
    _focus={{
      border: null,
    }}
  >
    {children}
  </Tab>
);

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
