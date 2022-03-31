import {
  Box,
  Button,
  ChakraComponent,
  Flex,
  Grid,
  GridItem,
  HStack,
  Skeleton,
  SkeletonText,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  ConfirmRemoveModal,
  DataGridComponent,
  DescriptionLabel,
  errToast,
  GridSpinner,
  HeaderLabel,
  InfoBarbox,
  pad,
  PageHeader,
  SmPanel,
  UsageInfoBanner,
  ViewPricingBar,
} from '../components/common';
import Dashboard from '../components/dashboard';
import { CardGreyImage, CardImage, ExclamationIcon, PricingTags } from '../components/icons-library';
import accountContext from '../utils/account-store-context';
import { callGetPayments, callRemoveCard } from '../utils/call-api';
import { formatDate } from '../utils/date-utils';

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
        .catch((err) => {
          setError(err);
          errToast(err);
          setIsLoading(false);
        });
    }
  }, [idToken]);

  return { data, isLoading, error };
};

export default observer(function ManageBilling({ }) {
  const { accountStore, tokenStore } = useContext(accountContext);
  const idToken = tokenStore?.tokenPayload?.idToken;

  const { isOpen, onOpen, onClose } = useDisclosure();


  const { data: paymentsData, isLoading, error } = useGetPayments(idToken);

  const deleteCard = useCallback(() => {
    onOpen();
  }, [])

  const onRemoveConfirm = () => {
    callRemoveCard(idToken, accountStore.getContractId()).then((res) =>
      accountStore.fetchServerState(idToken)
    );
    onClose();
  };

  return (
    <Dashboard>
      <PageHeader
        headerLabel="Manage billing"
        introduction="Manage your payments and usage limits."
      />
      <ConfirmRemoveModal isOpen={isOpen} onClose={onClose}
        mainTitle={`Are you sure want to remove your card?`}
        subTitle='This operation cannot be undone and will invalidate the API key'
        onRemoveConfirm={onRemoveConfirm}
        confirmLabel='Confirm deletion'
      />
      <Tabs size="lg" variant="speechmatics" width="800px">
        <TabList marginBottom="-1px">
          <Tab>Settings</Tab>
          <Tab>Payments</Tab>
        </TabList>
        <TabPanels>
          <TabPanel p="1.5em">
            <AddReplacePaymentCard
              paymentMethod={accountStore.getPaymentMethod()}
              isLoading={accountStore.isLoading}
              deleteCard={deleteCard}
            />

            <ViewPricingBar mt='2em' />
          </TabPanel>
          <TabPanel>
            <HeaderLabel>Payments</HeaderLabel>

            <DataGridComponent
              data={paymentsData}
              DataDisplayComponent={PaymentsGrid}
              isLoading={isLoading}
            />

            <UsageInfoBanner />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Dashboard>
  );
});

const AddReplacePaymentCard = ({ paymentMethod, isLoading, deleteCard }) =>
  isLoading ? (
    <HStack width="100%" justifyContent="space-between" alignItems="flex-start">
      <VStack alignItems="flex-start" spacing="1.6em">
        <Box className="skeleton" height="2em" width="15em" />
        <Box className="skeleton" height="1em" width="18em" />
        <Box className="skeleton" height="3em" width="10em" />
      </VStack>
      <Box className="skeleton" height="185px" width="282px" />
    </HStack>
  ) : (
    <HStack width="100%" justifyContent="space-between" alignItems="flex-start">
      <VStack alignItems="flex-start">
        <HeaderLabel>{paymentMethod ? 'Payment card active' : 'No payment card added'}</HeaderLabel>
        <DescriptionLabel>
          {paymentMethod
            ? `${paymentMethod?.card_type?.toUpperCase() || 'Card'} ending \
      ${paymentMethod?.masked_card_number?.slice(-4)}, expiring on \
      ${pad(paymentMethod?.expiration_month)}/${paymentMethod.expiration_year}`
            : 'Please, add a payment card to increase your usage limits.'}
        </DescriptionLabel>
        <Box>
          <Link href="/subscribe/">
            <Button variant="speechmatics" alignSelf="flex-start">
              {paymentMethod ? 'Update Card' : 'Add a payment card'}
            </Button>
          </Link>
        </Box>
        {paymentMethod && <Box fontFamily='RMNeue-Regular' fontSize="0.8em" pt='1em' >To delete your card, please{' '}
          <Text
            onClick={deleteCard}
            as='span' color='var(--chakra-colors-smBlue-500)'
            cursor='pointer' _hover={{ textDecoration: 'underline' }}>click here</Text>
        </Box>}
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
  <Grid gridTemplateColumns="repeat(4, 1fr)" className="sm_grid" mt="1.5em" alignSelf="stretch" data-qa='payments'>
    <GridItem className="grid_header">Month</GridItem>
    <GridItem className="grid_header">Hours used</GridItem>
    <GridItem className="grid_header">Total cost</GridItem>
    <GridItem className="grid_header">Payment status</GridItem>
    {data?.map((el: PaymentItem, i: number) => (
      <React.Fragment key={i}>
        <GridItem className="grid_row_divider">{i != 0 && <hr />}</GridItem>
        <GridItem whiteSpace="nowrap" data-qa={`payments-month-${i}`}>
          {formatDate(new Date(el.start_date))} - {formatDate(new Date(el.end_date))}
        </GridItem>
        <GridItem data-qa={`payments-hours-used-${i}`}>{Number(el.total_hrs).toFixed(2)} hours</GridItem>
        <GridItem data-qa={`payments-total-cost-${i}`}>${Number(el.total_cost).toFixed(2)}</GridItem>
        <GridItem whiteSpace="nowrap" data-qa={`payments-status-${i}`}>
          {el.status === 'due' ? `Due on ${formatDate(new Date(el.billing_date))}` : `Paid on ${formatDate(new Date(el.billing_date))}`}
        </GridItem>
      </React.Fragment>
    ))}
    {!isLoading && (!data || data?.length == 0) && (
      <GridItem colSpan={4}>
        <Flex width="100%" justifyContent="center">
          <ExclamationIcon />
          <Text ml="1em">You don’t currently have any due or paid invoices.</Text>
        </Flex>
      </GridItem>
    )}
    {isLoading && (
      <GridItem colSpan={4}>
        <Flex width="100%" justifyContent="center">
          <GridSpinner />
          <Text ml="1em">One moment please...</Text>
        </Flex>
      </GridItem>
    )}
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
