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
  useBreakpointValue,
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
        headerLabel="Manage Billing"
        introduction="Manage your payments and usage limits."
      />
      <ConfirmRemoveModal isOpen={isOpen} onClose={onClose}
        mainTitle={`Are you sure want to remove your card?`}
        subTitle=''
        onRemoveConfirm={onRemoveConfirm}
        confirmLabel='Confirm'
      />
      <Tabs size="lg" variant="speechmatics" width="100%" maxWidth='1000px'>
        <TabList marginBottom="-1px">
          <Tab data-qa="tab-settings">Settings</Tab>
          <Tab data-qa="tab-payments">Payments</Tab>
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

const AddReplacePaymentCard = ({ paymentMethod, isLoading, deleteCard }) => {
  const breakVal = useBreakpointValue({
    base: 0,
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
    '2xl': 6
  });

  return isLoading ? (
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
        <HeaderLabel>
          {paymentMethod ? 'Payment Card Active' : 'No Payment Card Added'}
          {breakVal < 2 && <span style={{ display: 'inline-block', marginLeft: '1em' }}>
            {paymentMethod ? <CardImage width={40} height={30} /> :
              <CardGreyImage width={40} height={30} />}</span>}
        </HeaderLabel>
        <DescriptionLabel>
          {paymentMethod
            ? `${paymentMethod?.card_type?.toUpperCase().replace(/_/g, ' ') || 'Card'} ending \
      ${paymentMethod?.masked_card_number?.slice(-4)}, expiring on \
      ${pad(paymentMethod?.expiration_month)}/${paymentMethod.expiration_year}`
            : 'Add a payment card to increase these limits.'}
        </DescriptionLabel>
        <Box>
          <Link href="/subscribe/">
            <Button variant="speechmatics" alignSelf="flex-start" data-qa="button-add-replace-payment">
              {paymentMethod ? 'Replace Your Existing Payment Card' : 'Add a Payment Card'}
            </Button>
          </Link>
        </Box>
        {paymentMethod && <Box fontSize="0.8em" pt='1em' >To delete your card, please{' '}
          <Text
            onClick={deleteCard}
            as='span' color='var(--chakra-colors-smBlue-500)'
            cursor='pointer' _hover={{ textDecoration: 'underline' }}>click here.</Text>
        </Box>}
      </VStack>
      <Box position="relative">
        {breakVal > 2 && <> <Text
          position="absolute"
          color="#fff7"
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
            fontSize=".8em"
            top="135px"
            right="14px"
          >
            EXPIRY DATE{' '}
            {paymentMethod
              ? `${pad(paymentMethod.expiration_month)}/${paymentMethod.expiration_year}`
              : 'XX/XX'}
          </Text></>}
        {breakVal > 1 ?
          paymentMethod ?
            <CardImage width={breakVal > 3 ? '' : 100} height={breakVal > 3 ? '' : 70} /> :
            <CardGreyImage width={breakVal > 3 ? '' : 100} height={breakVal > 3 ? '' : 70} />
          : null
        }
      </Box>
    </HStack>
  )
};

const PaymentsGrid = ({ data, isLoading }) => {
  const breakVal = useBreakpointValue({
    base: 0,
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
    '2xl': 6
  });
  return <Grid gridTemplateColumns="repeat(4, 1fr)" className="sm_grid" mt="1.5em" alignSelf="stretch" data-qa='payments'>
    <GridItem className="grid_header">Month</GridItem>
    <GridItem className="grid_header">Hours Used</GridItem>
    <GridItem className="grid_header">Total Cost</GridItem>
    <GridItem className="grid_header">Payment Status</GridItem>
    {data?.map((el: PaymentItem, i: number) => (
      <React.Fragment key={i}>
        <GridItem className="grid_row_divider">{i != 0 && <hr />}</GridItem>
        <GridItem whiteSpace={breakVal > 2 ? 'nowrap' : 'unset'} data-qa={`payments-month-${i}`}>
          {formatDate(new Date(el.start_date))} - {formatDate(new Date(el.end_date))}
        </GridItem>
        <GridItem data-qa={`payments-hours-used-${i}`}>{Number(el.total_hrs).toFixed(2)} hours</GridItem>
        <GridItem data-qa={`payments-total-cost-${i}`}>${Number(el.total_cost).toFixed(2)}</GridItem>
        <GridItem whiteSpace={breakVal > 2 ? 'nowrap' : 'unset'} data-qa={`payments-status-${i}`}>
          {el.status === 'due' ?
            <>Due on {formatDate(new Date(el.billing_date))}</> :
            <>Paid on ${formatDate(new Date(el.billing_date))}</>}
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
};

interface PaymentItem {
  start_date: string;
  end_date: string;
  total_hrs: string;
  total_cost: string;
  status: string;
  billing_date: string;
  url: string;
}
