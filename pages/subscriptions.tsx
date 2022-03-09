import { Grid, GridItem, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import Dashboard from '../components/dashboard';
import accountContext from '../utils/account-store-context';
import { callGetPayments, errToast } from '../utils/call-api';

export default observer(function Subscriptions({}) {
  const { accountStore, tokenStore } = useContext(accountContext);
  const paymentMethod = accountStore.getPaymentMethod();
  const idToken = tokenStore?.tokenPayload?.idToken;

  const [payments, setPayments] = useState(null);

  useEffect(() => {
    if (idToken) callGetPayments(idToken).then(setPayments).catch(errToast);
  }, [idToken]);

  return (
    <Dashboard>
      <h1>Active subscriptions</h1>
      <div
        className="rounded_shadow_box active_subscriptions_status"
        style={{ margin: '0px 0px 40px 0px' }}
      >
        {paymentMethod
          ? `You already have a subscription with payment method (${paymentMethod.card_type}, ${paymentMethod.masked_card_number})`
          : 'You have no active subscriptions'}
      </div>
      <Link href="/subscribe/">
        <div className="default_button">
          {paymentMethod ? 'replace payment method' : '+ add subscription'}{' '}
        </div>
      </Link>

      <Text fontSize={18}>Payments</Text>

      <Grid gridTemplateColumns="repeat(4, 1fr)">
        <GridItem>Model</GridItem>
        <GridItem>Hours used</GridItem>
        <GridItem>Total cost</GridItem>
        <GridItem>Payment status</GridItem>
        {payments?.map((el: PaymentItem, i: number) => (
          <>
            <GridItem>
              {el.start_date} - {el.end_date}
            </GridItem>
            <GridItem>{el.total_hrs}</GridItem>
            <GridItem>{el.total_cost}</GridItem>
            <GridItem>{el.status === 'due' ? `Due on ${el.billing_date}` : `Paid`}</GridItem>
          </>
        ))}
      </Grid>
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
