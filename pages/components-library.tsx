import {
  Button,
  Divider,
  Grid,
  GridItem,
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
import { PageHeader, PageIntroduction, SmPanel } from '../components/common';
import Dashboard from '../components/dashboard';

export default function ComponentsLibrary() {
  return (
    <Dashboard>
      <PageHeader
        headerLabel="Manage Access"
        introduction="Get started with using our platform in a few simple steps."
      />
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

        <Input variant="speechmatics" width="80%" placeholder="hello" />

        <SmPanel>
          <Text>hello</Text>

          <Grid gridTemplateColumns="repeat(4, 1fr)" className="sm_grid">
            <GridItem className="grid_header">Start date</GridItem>
            <GridItem className="grid_header">Total hours</GridItem>
            <GridItem className="grid_header">Total cost</GridItem>
            <GridItem className="grid_header">Status</GridItem>

            {testData.map((el, i) => (
              <React.Fragment key={i}>
                <GridItem className="grid_row_divider">{i != 0 && <hr />}</GridItem>
                <GridItem>{el.start_date}</GridItem>
                <GridItem>{el.total_hrs}</GridItem>
                <GridItem>${el.total_cost}</GridItem>
                <GridItem>{el.status}</GridItem>
              </React.Fragment>
            ))}
          </Grid>
        </SmPanel>
      </VStack>
    </Dashboard>
  );
}

const testData = [
  {
    start_date: '2022-02-01',
    end_date: '2022-02-28',
    total_hrs: '10.5',
    total_cost: '5.43',
    status: 'paid',
    billing_date: '2022-03-01',
    url: 'https://www.chargifypay.com/invoice/inv_abcd1234?token=efgh5678',
  },
  {
    start_date: '2022-03-01',
    end_date: '2022-03-31',
    total_hrs: '12.3',
    total_cost: '10.27',
    status: 'due',
    billing_date: '2022-04-01',
    url: 'https://www.chargifypay.com/invoice/inv_abcd4321?token=efgh8765',
  },
  {
    start_date: '2022-04-01',
    end_date: '2022-04-03',
    total_hrs: '1.2',
    total_cost: '0',
    status: 'due',
    billing_date: '2022-05-01',
  },
];
