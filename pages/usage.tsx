import Link from 'next/link';
import React, { useContext, useEffect, useMemo, useState } from 'react';
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
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react';
import { callGetUsage } from '../utils/call-api';
import accountContext, { accountStore } from '../utils/account-store-context';
import { observer } from 'mobx-react-lite';
import {
  DataGridComponent,
  DescriptionLabel,
  GridSpinner,
  HeaderLabel,
  PageHeader,
  UsageInfoBanner,
  ViewPricingBar,
} from '../components/common';
import {
  BaloonIcon,
  CallSupportIcon,
  ExclamationIcon,
  RocketIcon,
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

  const currentUsage = useMemo(() => prepCurrentUsage(aggregate), [aggregate]);

  return (
    <Dashboard>
      <PageHeader headerLabel="Track Usage" introduction="Review Usage of the API." />
      <Tabs size="lg" variant="speechmatics" width="100%" maxWidth='900px'>
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
              <ModelDescriptionBox
                mainColor='smGreen'
                icon={<RocketIcon />}
                title='ENHANCED'
                usageLimitType='enhanced'
                description='Enhanced provides the highest transcription accuracy.'
              />
              <ModelDescriptionBox
                mainColor='smBlue'
                icon={<BaloonIcon />}
                title='STANDARD'
                usageLimitType='standard'
                description='Standard provides faster transcription with high accuracy.'
              />

              <GridItem colSpan={2}>
                {accountStore.isLoading ? <Box bg='smNavy.500' width='100%' />
                  : (paymentMethodAdded ?
                    <GetInTouchBox icon={<CallSupportIcon />}
                      title='Need more usage?'
                      ctaText='Contact our Sales Team for custom pricing.'
                      hrefLink='https://www.speechmatics.com/about-us/contact'
                      buttonLabel='Get in touch' /> :
                    <GetInTouchBox icon={<CallSupportIcon />} title='Increase Usage Limits'
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
                ? <>Usage until {formatDate(new Date(currentUsage?.until))}</>
                : <>Usage for the period: {formatDate(new Date(aggregate?.since)) || ''} - {formatDate(new Date(aggregate?.until)) || ''}</>}
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
            <UsageInfoBanner text="Usage is reported on a UTC calendar-day basis and is updated every 5 minutes." />

          </TabPanel>
          <TabPanel>
            <HeaderLabel>Usage Metrics</HeaderLabel>

            <DataGridComponent
              data={breakdown}
              DataDisplayComponent={UsageBreakdownGrid}
              isLoading={isLoading}
            />

            <UsageInfoBanner text="Usage is reported on a UTC calendar-day basis and is updated every 5 minutes." />

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


const GetInTouchBox = ({ icon, title, ctaText, hrefLink, buttonLabel }) => {

  const breakVal = useBreakpointValue({
    xs: false,
    sm: true,
  });

  const Containter = useMemo(
    () => (breakVal ?
      ({ children, ...props }) => <HStack {...props}
      >{children}</HStack>
      :
      ({ children, ...props }) => <VStack {...props}
      >{children}</VStack>
    ), [breakVal]);

  return <Containter
    width="100%"
    bg="smNavy.500"
    justifyContent="space-between"
    padding="1em 1.5em"
  >
    <Box flex="0 0 auto">
      {icon}
    </Box>
    <VStack alignItems="flex-start" flex="1" pl="1em" spacing="0px">
      <Text fontFamily="Matter-Bold" fontSize="1.4em" color="smWhite.500">
        {title}
      </Text>
      <Text fontFamily="RMNeue-Regular" fontSize="1em" color="smWhite.500" pb='0.5em'>
        {ctaText}
      </Text>
    </VStack>
    <Link href={hrefLink}>
      <Button variant="speechmaticsWhite" >
        {buttonLabel}
      </Button>
    </Link>
  </Containter>
}


const ModelDescriptionBox = ({ mainColor, icon, title, usageLimitType, description }) => {

  const breakVal = useBreakpointValue({
    xs: false,
    sm: true,
  })

  const Containter = useMemo(
    () => (breakVal ?
      ({ children, ...props }) => <HStack {...props}
      >{children}</HStack>
      :
      ({ children, ...props }) => <VStack {...props}
      >{children}</VStack>
    ), [breakVal]);

  return <GridItem bg={`${mainColor}.200`} className="flexColumnBetween">
    <Containter p={breakVal ? "1em 1em 1em 1em" : "0.5em"} alignItems='flex-start'>
      <Box p='1em 0em 0em 0.2em'>
        {icon}
      </Box>
      <Box pt='1em' pl="0.5em">
        <Text fontSize="0.85em" color="smBlack.400">
          {title}
        </Text>
        <Text fontFamily="RMNeue-Bold" fontSize="1.5em" color={`${mainColor}.500`} mt="0.15em" data-qa={`limit-${usageLimitType}`}>
          {accountStore.isLoading ? (
            <Spinner size="sm" />
          ) : (
            accountStore.getUsageLimit(usageLimitType)
          )}{' '}
          hours per month
        </Text>
      </Box>
    </Containter>
    <Box
      bg={`${mainColor}.100`}
      p=".8em 1em .8em 1em"
      borderTop="1px solid"
      borderColor={`${mainColor}.400`}
    >
      <Text fontSize="0.8em" color="smBlack.400">
        {description}
      </Text>
    </Box>
  </GridItem>
}