import {
  Button,
  Grid,
  GridItem,
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
import { PageHeader, SmPanel } from '../components/common';
import Dashboard from '../components/dashboard';
import accountContext from '../utils/account-store-context';
import { callGetPayments, errToast } from '../utils/call-api';

export default observer(function ManageBilling({ }) {
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
      <PageHeader headerLabel='Manage billing'
        introduction='Get started with using our platform your billing.' />
      <Tabs size="lg" variant="speechmatics" width="800px">
        <TabList marginBottom="-1px">
          <Tab>Limits</Tab>
          <Tab>Settings</Tab>
          <Tab>Payments</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <p>Limits!</p>
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
            <Text fontSize="1.5em">Payments</Text>

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