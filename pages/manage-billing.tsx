import {
  Box,
  Button,
  ChakraComponent,
  Flex,
  Grid,
  GridItem,
  HStack,
  Spinner,
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
import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  DataGridComponent,
  DescriptionLabel,
  HeaderLabel,
  InfoBarbox,
  pad,
  PageHeader,
  SmPanel,
} from '../components/common';
import Dashboard from '../components/dashboard';
import { CardGreyImage, CardImage, ExclamationIcon, PricingTags } from '../components/Icons';
import accountContext from '../utils/account-store-context';
import { callGetPayments, errToast } from '../utils/call-api';

const useGetPayments = (idToken: string) => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (idToken) {
      setIsLoading(true);
      callGetPayments(idToken)
        .then((resp) => {
          setData(resp.payments.reverse());
          setIsLoading(false);
        })
        .catch(err => {
          setError(err);
          errToast(err);
          setIsLoading(false)
        });
    }
  }, [idToken]);

  return { data, isLoading, error }
}

export default observer(function ManageBilling({ }) {
  const { accountStore, tokenStore } = useContext(accountContext);
  const idToken = tokenStore?.tokenPayload?.idToken;


  const { data: paymentsData, isLoading, error } = useGetPayments(idToken);

  return (
    <Dashboard>
      <PageHeader
        headerLabel="Manage billing"
        introduction="Get started with using our platform your billing."
      />
      <Tabs size="lg" variant="speechmatics" width="800px">
        <TabList marginBottom="-1px">
          <Tab>Settings</Tab>
          <Tab>Payments</Tab>
        </TabList>
        <TabPanels>
          <TabPanel p="1.5em">
            <AddReplacePaymentCard paymentMethod={accountStore.getPaymentMethod()} />

            <InfoBarbox
              icon={<PricingTags />}
              title="View our pricing"
              description="Check our competitive prices for an hour of transcription."
              buttonLabel="View Pricing"
              hrefUrl="/usage/"
              mt="2em"
            />
          </TabPanel>
          <TabPanel>
            <HeaderLabel>Payments</HeaderLabel>

            <DataGridComponent data={paymentsData} DataDisplayComponent={PaymentsGrid} isLoading={isLoading} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Dashboard>
  );
});

const AddReplacePaymentCard = ({ paymentMethod }) => (
  <HStack width="100%" justifyContent="space-between" alignItems="flex-start">
    <VStack alignItems="flex-start">
      <HeaderLabel>{paymentMethod ? 'Payment card active' : 'No payment card added'}</HeaderLabel>
      <DescriptionLabel>
        {paymentMethod
          ? `${paymentMethod.card_type.toUpperCase()} ending \
      ${paymentMethod.masked_card_number.slice(-4)} expiring on \
      ${pad(paymentMethod.expiration_month)}/${paymentMethod.expiration_year}`
          : 'Please add a payment card to increase your usage limits'}
      </DescriptionLabel>
      <Box>
        <Link href="/subscribe/">
          <Button variant="speechmatics" alignSelf="flex-start">
            {paymentMethod ? 'Update Card' : 'Add a payment card'}
          </Button>
        </Link>
      </Box>
    </VStack>
    <Box position="relative">
      <Text
        position="absolute"
        color="#fff7"
        fontFamily="RMNeue-Regular"
        fontSize="1em"
        top="110px"
        right="14px"
        style={{ wordSpacing: '6px' }}
      >
        {paymentMethod?.masked_card_number || 'XXXX XXXX XXXX XXXX'}
      </Text>
      <Text
        position="absolute"
        color="#fff7"
        fontFamily="RMNeue-Regular"
        fontSize=".8em"
        top="135px"
        right="14px"
      >
        EXPIRY DATE{' '}
        {paymentMethod
          ? `${pad(paymentMethod.expiration_month)}/${paymentMethod.expiration_year}`
          : 'XX/XX'}
      </Text>
      {paymentMethod ? <CardImage /> : <CardGreyImage />}
    </Box>
  </HStack>
);

const PaymentsGrid = ({ data, isLoading }) => (
  <Grid gridTemplateColumns="repeat(4, 1fr)" className="sm_grid" mt="1.5em" alignSelf="stretch">
    <GridItem className="grid_header">Month</GridItem>
    <GridItem className="grid_header">Hours used</GridItem>
    <GridItem className="grid_header">Total cost</GridItem>
    <GridItem className="grid_header">Payment status</GridItem>
    {data?.map((el: PaymentItem, i: number) => (
      <React.Fragment key={i}>
        <GridItem className="grid_row_divider">{i != 0 && <hr />}</GridItem>
        <GridItem whiteSpace="nowrap">
          {el.start_date} - {el.end_date}
        </GridItem>
        <GridItem>{Number(el.total_hrs).toFixed(2)} hours</GridItem>
        <GridItem>${el.total_cost}</GridItem>
        <GridItem whiteSpace="nowrap">
          {el.status === 'due' ? `Due on ${el.billing_date}` : `Paid`}
        </GridItem>
      </React.Fragment>
    ))}
    {(!data || data?.length == 0) && (
      <GridItem colSpan={4}>
        <Flex width="100%" justifyContent="center">
          <ExclamationIcon />
          <Text ml="1em">You don’t currently have any due or paid invoices.</Text>
        </Flex>
      </GridItem>
    )}
    {isLoading && <GridItem colSpan={4}>
      <Flex width="100%" justifyContent="center">
        <Spinner />
        <Text ml="1em">One moment please...</Text>
      </Flex>
    </GridItem>}
  </Grid>
);

interface PaymentItem {
  start_date: string;
  end_date: string;
  total_hrs: string;
  total_cost: string;
  status: string;
  billing_date: string;
  url: string;
}
