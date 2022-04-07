import Link from 'next/link';
import React, { CSSProperties, useContext, useEffect, useState } from 'react';
import Dashboard from '../components/dashboard';
import {
  Box,
  Button,
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
  tokenToCSSVar,
  VStack,
} from '@chakra-ui/react';
import { callGetUsage } from '../utils/call-api';
import accountContext, { accountStore } from '../utils/account-store-context';
import { observer } from 'mobx-react-lite';
import {
  DataGridComponent,
  DescriptionLabel,
  errToast,
  GridSpinner,
  HeaderLabel,
  InfoBarbox,
  PageHeader,
  SmPanel,
  UsageInfoBanner,
  ViewPricingBar,
} from '../components/common';
import {
  BaloonIcon,
  CallSupportIcon,
  ExclamationIcon,
  PricingTags,
  RocketIcon,
  UsageInfoIcon,
  UsageLimitsIcon,
} from '../components/icons-library';
import { formatDate } from '../utils/date-utils';

export default observer(function Usage() {
  const [usageJson, setUsageJson] = useState<UsageRespJson>({});
  const { accountStore, tokenStore } = useContext(accountContext);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const idToken = tokenStore.tokenPayload?.idToken;
  const paymentMethodAdded = !!accountStore.getPaymentMethod();

  useEffect(() => {
    let isActive = true;
    if (idToken && accountStore.account) {
      setIsLoading(true);
      callGetUsage(idToken, accountStore.getContractId(), accountStore.getProjectId())
        .then((respJson) => {
          if (isActive && !!respJson && 'aggregate' in respJson) {
            setUsageJson({
              aggregate: respJson.aggregate,
              breakdown: respJson.breakdown.reverse(),
            });
            setIsLoading(false);
          }
        })
        .catch((err) => {
          setIsLoading(false);
        });
    }
    return () => {
      isActive = false;
    };
  }, [idToken, accountStore.account]);

  const { aggregate, breakdown } = usageJson;

  const currentUsage = prepCurrentUsage(aggregate);

  return (
    <Dashboard>
      <PageHeader headerLabel="Track Usage" introduction="Review Usage of the API." />
      <Tabs size="lg" variant="speechmatics" width="800px">
        <TabList marginBottom="-1px">
          <Tab data-qa="tab-limits">Limits</Tab>
          <Tab data-qa="tab-summary">Summary</Tab>
          <Tab data-qa="tab-details">Details</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <HeaderLabel>Usage Limits</HeaderLabel>
            <DescriptionLabel>Hours of Audio Per Month.</DescriptionLabel>
            <Grid gridTemplateColumns="1fr 1fr" gap="1.5em">
              <GridItem bg="smGreen.200" className="flexColumnBetween">
                <HStack p="1em 1em 1em 1em" alignItems='flex-start'>
                  <Box p='1em 0em 0em 0.2em'>
                    <RocketIcon />
                  </Box>
                  <Box pt='1em' pl="0.5em">
                    <Text fontFamily="RMNeue-Regular" fontSize="0.85em" color="smBlack.400">
                      ENHANCED
                    </Text>
                    <Text fontFamily="RMNeue-Bold" fontSize="1.5em" color="smGreen.500" mt="0.15em" data-qa="limit-enhanced">
                      {accountStore.isLoading ? (
                        <Spinner size="sm" />
                      ) : (
                        accountStore.getUsageLimit('enhanced')
                      )}{' '}
                      hours per month
                    </Text>
                  </Box>
                </HStack>
                <Box
                  bg="smGreen.100"
                  p=".8em 1em .8em 1em"
                  borderTop="1px solid"
                  borderColor="smGreen.400"
                >
                  <Text fontFamily="RMNeue-Regular" fontSize="0.8em" color="smBlack.400">
                    Enhanced provides the highest transcription accuracy.
                  </Text>
                </Box>
              </GridItem>
              <GridItem bg="smBlue.200" className="flexColumnBetween">
                <HStack p="1em 1em 1em 1em" alignItems='flex-start'>
                  <Box p='1em 0em 0em 0.2em'>
                    <BaloonIcon />
                  </Box>
                  <Box pt='1em' pl="0.5em" >
                    <Text fontFamily="RMNeue-Regular" fontSize="0.85em" color="smBlack.400">
                      STANDARD
                    </Text>
                    <Text fontFamily="RMNeue-Bold" fontSize="1.5em" color="smBlue.500"
                      mt="0.15em" data-qa="limit-standard">
                      {accountStore.isLoading ? (
                        <Spinner size="sm" />
                      ) : (
                        accountStore.getUsageLimit('standard')
                      )}{' '}
                      hours per month
                    </Text>
                  </Box>
                </HStack>
                <Box
                  bg="smBlue.100"
                  p=".8em 1em .8em 1em"
                  borderTop="1px solid"
                  borderColor="smBlue.400"
                >
                  <Text fontFamily="RMNeue-Regular" fontSize="0.8em" color="smBlack.400">
                    Standard provides faster transcription with high accuracy.
                  </Text>
                </Box>
              </GridItem>

              <GridItem colSpan={2}>
                {accountStore.isLoading ? <Box bg='smNavy.500' width='100%' height='100px' />
                  : (paymentMethodAdded ?
                    <GetInTouchBox icon={<CallSupportIcon />}
                      title='Need more usage?'
                      ctaText='Contact our Sales Team for custom pricing.'
                      hrefLink='https://www.speechmatics.com/about-us/contact'
                      buttonLabel='Get in touch' /> :
                    <GetInTouchBox icon={<UsageLimitsIcon />} title='Increase Usage Limits'
                      ctaText='Add a payment card to increase these limits.'
                      hrefLink='/subscribe/'
                      buttonLabel='Add Card' />)}
              </GridItem>
              <GridItem colSpan={2}>
                <ViewPricingBar />
              </GridItem>
            </Grid>

          </TabPanel>
          <TabPanel>
            <HeaderLabel>
              {currentUsage?.since?.startsWith('1970-01-01')
                ? `Usage until ${formatDate(new Date(currentUsage?.until))}`
                : `Usage for the period: ${formatDate(new Date(aggregate?.since)) || ''} - ${formatDate(new Date(aggregate?.until)) || ''}`}
            </HeaderLabel>

            <Grid
              templateColumns="repeat(4, 1fr)"
              marginTop="2em"
              className="sm_grid"
              alignSelf="stretch"
            >
              <GridItem className="grid_header">Accuracy</GridItem>
              <GridItem className="grid_header">Limit (Hours per Month)</GridItem>
              <GridItem className="grid_header">Hours Used</GridItem>
              <GridItem className="grid_header">Requests Made</GridItem>

              <GridItem>Enhanced</GridItem>
              <GridItem>
                {accountStore.isLoading ? '...' : accountStore.getUsageLimit('enhanced')} hours
              </GridItem>
              <GridItem data-qa="usage-enhanced">
                {Number(currentUsage?.usageEnhanced).toFixed(2)} hours
              </GridItem>
              <GridItem data-qa="requests-enhanced">{currentUsage?.countEnhanced}</GridItem>

              <GridItem className="grid_row_divider">
                <hr />
              </GridItem>

              <GridItem>Standard</GridItem>
              <GridItem>
                {accountStore.isLoading ? '...' : accountStore.getUsageLimit('standard')} hours
              </GridItem>
              <GridItem data-qa="usage-standard">
                {Number(currentUsage?.usageStandard).toFixed(2)} hours
              </GridItem>
              <GridItem data-qa="requests-standard">{currentUsage?.countStandard}</GridItem>

            </Grid>
            <UsageInfoBanner />

          </TabPanel>
          <TabPanel>
            <HeaderLabel>Usage Metrics</HeaderLabel>

            <DataGridComponent
              data={breakdown}
              DataDisplayComponent={UsageBreakdownGrid}
              isLoading={isLoading}
            />

            <UsageInfoBanner />

          </TabPanel>
        </TabPanels>
      </Tabs>
    </Dashboard>
  );
});



const UsageBreakdownGrid = ({ data, isLoading }) => (
  <Grid templateColumns="repeat(2, 1fr)" marginTop="2em" className="sm_grid" alignSelf="stretch">
    <GridItem className="grid_header">Day</GridItem>
    <GridItem className="grid_header">Hours Used</GridItem>

    {data?.map((el: UsageUnit, i: number) => {
      return (
        <React.Fragment key={el.since}>
          <GridItem className="grid_row_divider">{i != 0 && <hr />}</GridItem>
          <GridItem>{formatDate(new Date(el.since))}</GridItem>
          <GridItem>{Number(el.total_hrs).toFixed(2)} hours</GridItem>
        </React.Fragment>
      );
    })}
    {!isLoading && (!data || data?.length == 0) && (
      <GridItem colSpan={2}>
        <Flex width="100%" justifyContent="center">
          <ExclamationIcon />
          <Text ml="1em">You don't currently have any usage data.</Text>
        </Flex>
      </GridItem>
    )}
    {isLoading && (
      <GridItem colSpan={2}>
        <Flex width="100%" justifyContent="center">
          <GridSpinner />
          <Text ml="1em">One moment please...</Text>
        </Flex>
      </GridItem>
    )}
  </Grid>
);

const prepCurrentUsage = (aggregate: UsageUnit) => {
  return {
    since: aggregate?.since,
    until: aggregate?.until,
    usageStandard:
      aggregate?.summary.find((s) => s.type == 'transcription' && s.operating_point == 'standard')
        ?.duration_hrs || 0,
    usageEnhanced:
      aggregate?.summary.find((s) => s.type == 'transcription' && s.operating_point == 'enhanced')
        ?.duration_hrs || 0,
    countStandard:
      aggregate?.summary.find((s) => s.type == 'transcription' && s.operating_point == 'standard')
        ?.count || 0,
    countEnhanced:
      aggregate?.summary.find((s) => s.type == 'transcription' && s.operating_point == 'enhanced')
        ?.count || 0,
  };
};

type UsageRespJson = { aggregate?: UsageUnit; breakdown?: UsageUnit[] };

type SummaryItem = {
  mode: 'batch' | 'real-time';
  type: 'transcription' | 'alignment';
  operating_point?: 'standard' | 'enhanced';
  count: number;
  duration_hrs: number;
};

type UsageUnit = {
  since: string;
  until: string;
  total_hrs: number;
  summary: SummaryItem[];
};


const GetInTouchBox = ({ icon, title, ctaText, hrefLink, buttonLabel }) => (<HStack
  width="100%"
  bg="smNavy.500"
  height="100px"
  justifyContent="space-between"
  padding="0em 1.5em"
>
  <Box flex="0 0 auto">
    {icon}
  </Box>
  <VStack alignItems="flex-start" flex="1" pl="1em" spacing="0px">
    <Text fontFamily="Matter-Bold" fontSize="1.4em" color="smWhite.500">
      {title}
    </Text>
    <Text fontFamily="RMNeue-Regular" fontSize="1em" color="smWhite.500">
      {ctaText}
    </Text>
  </VStack>
  <Link href={hrefLink}>
    <Button variant="speechmaticsWhite">
      {buttonLabel}
    </Button>
  </Link>
</HStack>)