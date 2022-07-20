import {
  Flex,
  Grid,
  GridItem,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  toast,
  useBreakpointValue,
  useDisclosure
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import React, { useCallback, useContext, useEffect, useState, useMemo } from 'react';
import {
  ConfirmRemoveModal,
  DataGridComponent,
  ErrorBanner,
  errToast,
  errTopToast,
  GridSpinner,
  HeaderLabel,
  PageHeader,
  UsageInfoBanner,
  ViewPricingBar
} from '../components/common';
import Dashboard from '../components/dashboard';
import { ExclamationIcon } from '../components/icons-library';
import accountContext from '../utils/account-store-context';
import { callGetPayments, callRemoveCard } from '../utils/call-api';
import { formatDate } from '../utils/date-utils';
import { AddReplacePaymentCard, DownloadInvoiceHoverable } from '../components/billing';
import { trackEvent } from '../utils/analytics';
import { useRouter } from 'next/router';
import { useIsAuthenticated } from '@azure/msal-react';
import { RequestThrowType } from '../custom';

const useGetPayments = () => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const authenticated = useIsAuthenticated();

  useEffect(() => {
    if (authenticated) {
      setIsLoading(true);
      callGetPayments()
        .then((resp) => {
          setData(resp.payments.reverse());
          setIsLoading(false);
        })
        .catch((err) => {
          setError(err);
          setIsLoading(false);
        });
    }
  }, [authenticated]);

  return { data, isLoading, error };
};

export default observer(function ManageBilling({ }) {
  const router = useRouter();
  const { accountStore } = useContext(accountContext);
  const [tabIndex, setTabIndex] = useState(0);
  const [highlight, setHighlight] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: paymentsData, isLoading, error } = useGetPayments();

  const deleteCard = useCallback(() => {
    onOpen();
    trackEvent('billing_remove_card_click', 'Action');
  }, []);

  const onRemoveConfirm = () => {
    callRemoveCard(accountStore.getContractId()).then(
      (res) =>
        accountStore.fetchServerState()
      ,
      (err: RequestThrowType) => {
        if (err.status == 403) {
          toast.close(err.toastId);
          errTopToast(`Check for unpaid invoices before removing your payment card.`)

        } else if (err.status == 404) {
          toast.close(err.toastId);
          errToast(`Something went wrong with removing your payment card. The contract (id: ${accountStore.getContractId()}) has not been found. Please, try again or contact support.`)

        } else {
          errToast(`Something went wrong with removing your payment card. Please, try again or contact support.`)
        }
      }
    )
    onClose();
    trackEvent('billing_remove_card_confirm', 'Action');
  };

  const tabsOnChange = useCallback((index) => {
    trackEvent(`billing_tab_${['settings', 'payments'][index]}`, 'Navigation');
  }, []);

  useEffect(() => {
    if (router.asPath.includes('#update_card')) {
      setHighlight(true);
      setTabIndex(0)
    }
  }, [router]);

  return (
    <Dashboard>
      <PageHeader
        headerLabel='Manage Billing'
        introduction='Manage Your Payments and Usage Limits.'
      />
      <ConfirmRemoveModal
        isOpen={isOpen}
        onClose={onClose}
        data-qa='modal-delete-card-confirm'
        mainTitle={`Are you sure want to remove your card?`}
        subTitle=''
        onRemoveConfirm={onRemoveConfirm}
        confirmLabel='Confirm'
      />
      <Tabs index={tabIndex} onChange={index => setTabIndex(index)} size='lg' variant='speechmatics' width='100%' maxWidth='900px'>
        <TabList marginBottom='-1px'>
          <Tab data-qa='tab-settings'>Settings</Tab>
          <Tab data-qa='tab-payments'>Payments</Tab>
        </TabList>
        <TabPanels>
          <TabPanel p='1.5em'>
            {accountStore.responseError ?
              <ErrorBanner mt="0" content={`Unable to retreive payment information`} />
              :
              <AddReplacePaymentCard
                paymentMethod={accountStore.getPaymentMethod()}
                accountState={accountStore.accountState}
                isLoading={accountStore.isLoading}
                deleteCard={deleteCard}
                highlight={highlight}
                setHighlight={setHighlight}
              />
            }

            <ViewPricingBar mt='2em' />
          </TabPanel>
          <TabPanel>
            <HeaderLabel>Payments</HeaderLabel>
            {accountStore.responseError ?
              <ErrorBanner mt="0" content={`Unable to retreive payment information`} />
              :
              <>
                <DataGridComponent
                  data={paymentsData}
                  DataDisplayComponent={PaymentsGrid}
                  isLoading={isLoading}
                />
                <UsageInfoBanner
                  text='All usage is reported on a UTC calendar-day basis and excludes the current day.'
                  mt='2em'
                />
              </>
            }

          </TabPanel>
        </TabPanels>
      </Tabs>
    </Dashboard>
  );
});

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

  const columns = 5;

  return (
    <Grid
      gridTemplateColumns={`1fr 1fr 1fr 1fr 0fr`}
      className='sm_grid'
      mt='1.5em'
      alignSelf='stretch'
      data-qa='payments'>
      <GridItem className='grid_header'>Billing Period</GridItem>
      <GridItem className='grid_header'>Hours Used</GridItem>
      <GridItem className='grid_header'>Total Cost</GridItem>
      <GridItem className='grid_header'>Payment Status</GridItem>
      <GridItem className='grid_header'></GridItem>

      {data?.map((el: PaymentItem, i: number) => (
        <React.Fragment key={i}>
          <GridItem className='grid_row_divider' colSpan={columns}>
            {i != 0 && <hr />}
          </GridItem>
          <GridItem whiteSpace={breakVal > 2 ? 'nowrap' : 'unset'} data-qa={`payments-month-${i}`}>
            {formatDate(new Date(el.start_date))} &#8211; {formatDate(new Date(el.end_date))}
          </GridItem>
          <GridItem data-qa={`payments-hours-used-${i}`}>
            {Number(el.total_hrs).toFixed(2)} hours
          </GridItem>
          <GridItem data-qa={`payments-total-cost-${i}`}>
            ${Number(el.total_cost).toFixed(2)}
          </GridItem>
          <GridItem whiteSpace={breakVal > 2 ? 'nowrap' : 'unset'} data-qa={`payments-status-${i}`}>
            {el.status === 'due' ? (
              <>Due on {formatDate(new Date(el.billing_date))}</>
            ) : (
              <>Paid on {formatDate(new Date(el.billing_date))}</>
            )}
          </GridItem>
          <GridItem data-qa={`payments-download-invoice-${i}`}>
            {el.url && (
              <Link href={el.url}>
                <a
                  target='_blank'
                  download
                  onClick={() => trackEvent('billing_payments_download_invoice', 'Action')}>
                  <DownloadInvoiceHoverable />
                </a>
              </Link>
            )}
          </GridItem>
        </React.Fragment>
      ))}
      {!isLoading && (!data || data?.length == 0) && (
        <GridItem colSpan={columns}>
          <Flex width='100%' justifyContent='center'>
            <ExclamationIcon />
            <Text ml='1em'>You don’t currently have any due or paid invoices.</Text>
          </Flex>
        </GridItem>
      )}
      {isLoading && (
        <GridItem colSpan={columns}>
          <Flex width='100%' justifyContent='center'>
            <GridSpinner />
            <Text ml='1em'>One moment please...</Text>
          </Flex>
        </GridItem>
      )}
    </Grid>
  );
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
