import {
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { DescriptionLabel, HeaderLabel, PageHeader, SmPanel } from '../components/common';
import Dashboard from '../components/dashboard';
import accountContext from '../utils/account-store-context';
import { callGetPayments, errToast } from '../utils/call-api';

export default observer(function ManageBilling({}) {
  const { accountStore, tokenStore } = useContext(accountContext);
  const paymentMethod = accountStore.getPaymentMethod();
  const idToken = tokenStore?.tokenPayload?.idToken;

  const [payments, setPayments] = useState(null);

  useEffect(() => {
    if (idToken)
      callGetPayments(idToken)
        .then((resp) => setPayments(resp.payments))
        .catch(errToast);
  }, [idToken]);

  return (
    <Dashboard>
      <PageHeader
        headerLabel="Manage billing"
        introduction="Get started with using our platform your billing."
      />
      <Tabs size="lg" variant="speechmatics" width="800px">
        <TabList marginBottom="-1px">
          <Tab>Limits</Tab>
          <Tab>Settings</Tab>
          <Tab>Payments</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <HeaderLabel>Usage limits</HeaderLabel>
            <DescriptionLabel>Hours of audio per month</DescriptionLabel>
            <Grid gridTemplateColumns="1fr 1fr" gap="1.5em">
              <GridItem bg="smBlue.150">
                <HStack p="1.3em 1em 1em 1em">
                  <img src="/assets/temp_baloonIcon.png" />
                  <Box mt="1em" pl="1em">
                    <Text fontFamily="RMNeue-Regular" fontSize="0.85em" color="smBlack.400">
                      STANDARD MODEL
                    </Text>
                    <Text fontFamily="RMNeue-Bold" fontSize="1.5em" color="smBlue.500" mt="0.15em">
                      {accountStore.getUsageLimit('standard')} hours / month
                    </Text>
                  </Box>
                </HStack>
              </GridItem>
              <GridItem bg="smGreen.150">
                <HStack p="1em 1em 1em 1em">
                  <img src="/assets/temp_rocketIcon.png" />
                  <Box mt="1em" pl="1em">
                    <Text fontFamily="RMNeue-Regular" fontSize="0.85em" color="smBlack.400">
                      ENHANCED MODEL
                    </Text>
                    <Text fontFamily="RMNeue-Bold" fontSize="1.5em" color="smGreen.500" mt="0.15em">
                      {accountStore.getUsageLimit('enhanced')} hours / month
                    </Text>
                  </Box>
                </HStack>
              </GridItem>
              <GridItem colSpan={2}>
                <HStack
                  width="100%"
                  bg="smNavy.500"
                  height="100px"
                  justifyContent="space-between"
                  padding="2.5em 1.5em"
                >
                  <Box flex="0 0 auto">
                    <img src="/assets/temp_increaseLimitsIcon.png" />
                  </Box>
                  <VStack alignItems="flex-start" flex="1" pl="1em" spacing="0px">
                    <Text fontFamily="Matter-Bold" fontSize="1.4em" color="smWhite.500">
                      Increase usage limits
                    </Text>
                    <Text fontFamily="RMNeue-Regular" fontSize="1em" color="smWhite.500">
                      Add Payment Card in order to increase these limits
                    </Text>
                  </VStack>
                  <Link href="/subscribe/">
                    <Button variant="speechmaticsWhite">Add card</Button>
                  </Link>
                </HStack>
              </GridItem>
            </Grid>
          </TabPanel>
          <TabPanel>
            <div
              className="rounded_shadow_box active_subscriptions_status"
              style={{ margin: '0px 0px 40px 0px', alignSelf: 'center' }}
            >
              {paymentMethod
                ? `You already have a subscription with payment method (${paymentMethod.card_type}, ${paymentMethod.masked_card_number})`
                : 'You have no active subscriptions'}
            </div>
            <Link href="/subscribe/">
              <Button variant="speechmatics" alignSelf="flex-start">
                {paymentMethod ? 'replace payment method' : '+ add subscription'}
              </Button>
            </Link>
          </TabPanel>
          <TabPanel>
            <HeaderLabel>Payments</HeaderLabel>
            <Grid
              gridTemplateColumns="repeat(4, 1fr)"
              className="sm_grid"
              mt="1.5em"
              alignSelf="stretch"
            >
              <GridItem className="grid_header">Model</GridItem>
              <GridItem className="grid_header">Hours used</GridItem>
              <GridItem className="grid_header">Total cost</GridItem>
              <GridItem className="grid_header">Payment status</GridItem>
              {payments?.map((el: PaymentItem, i: number) => (
                <>
                  <GridItem className="grid_row_divider">{i != 0 && <hr />}</GridItem>
                  <GridItem>
                    {el.start_date} - {el.end_date}
                  </GridItem>
                  <GridItem>{Number(el.total_hrs).toFixed(1)} hours</GridItem>
                  <GridItem>{el.total_cost}</GridItem>
                  <GridItem>{el.status === 'due' ? `Due on ${el.billing_date}` : `Paid`}</GridItem>
                </>
              ))}
            </Grid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Dashboard>
  );
});

interface PaymentItem {
  start_date: string;
  end_date: string;
  total_hrs: string;
  total_cost: string;
  status: string;
  billing_date: string;
  url: string;
}
