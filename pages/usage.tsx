import Link from 'next/link';
import React, { CSSProperties, useContext, useEffect, useState } from 'react';
import Dashboard from '../components/dashboard';
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
  tokenToCSSVar,
  VStack,
} from '@chakra-ui/react';
import { callGetUsage } from '../utils/call-api';
import accountContext, { accountStore } from '../utils/account-store-context';
import { observer } from 'mobx-react-lite';
import { DescriptionLabel, HeaderLabel, PageHeader, SmPanel } from '../components/common';

export default observer(function Usage() {
  const [usageJson, setUsageJson] = useState<UsageRespJson>({});
  const { accountStore, tokenStore } = useContext(accountContext);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const idToken = tokenStore.tokenPayload?.idToken;

  useEffect(() => {
    let isActive = true;
    console.log(`Usage useEff`, !!idToken, !!accountStore.account);
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
        .catch(console.error);
    }
    return () => {
      isActive = false;
    };
  }, [idToken, accountStore.account]);

  const { aggregate, breakdown } = usageJson;

  const currentUsage = prepCurrentUsage(aggregate);

  return (
    <Dashboard>
      <PageHeader
        headerLabel="Track usage"
        introduction="Get started with using our platform and track usage."
      />
      <Tabs size="lg" variant="speechmatics" width="800px">
        <TabList marginBottom="-1px">
          <Tab>Limits</Tab>
          <Tab>Summary</Tab>
          <Tab>Details</Tab>
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
            <HeaderLabel>
              {currentUsage?.since?.startsWith('1970-01-01')
                ? `Usage until ${currentUsage?.until}`
                : `Usage for the period: ${currentUsage?.billingRange}`}
            </HeaderLabel>

            <Grid
              templateColumns="repeat(4, 1fr)"
              marginTop="2em"
              className="sm_grid"
              alignSelf="stretch"
            >
              <GridItem className="grid_header">Model</GridItem>
              <GridItem className="grid_header">Limit (hours / month)</GridItem>
              <GridItem className="grid_header">Hours used</GridItem>
              <GridItem className="grid_header">Requests made</GridItem>

              <GridItem>Standard Model</GridItem>
              <GridItem>{accountStore.getUsageLimit('standard')} hours</GridItem>
              <GridItem data-qa="usage-standard">
                {Number(currentUsage?.usageStandard).toFixed(2)} hours
              </GridItem>
              <GridItem data-qa="requests-standard">{currentUsage?.countStandard}</GridItem>
              <GridItem className="grid_row_divider">
                <hr />
              </GridItem>
              <GridItem>Enhanced Model</GridItem>
              <GridItem>{accountStore.getUsageLimit('enhanced')} hours</GridItem>
              <GridItem data-qa="usage-enhanced">
                {Number(currentUsage?.usageEnhanced).toFixed(2)} hours
              </GridItem>
              <GridItem data-qa="requests-enhanced">{currentUsage?.countEnhanced}</GridItem>
            </Grid>
          </TabPanel>
          <TabPanel>
            <HeaderLabel>Usage metrics</HeaderLabel>
            <Grid
              templateColumns="repeat(2, 1fr)"
              marginTop="2em"
              className="sm_grid"
              alignSelf="stretch"
            >
              <GridItem className="grid_header">Day</GridItem>
              <GridItem className="grid_header">Hours used</GridItem>

              {breakdown?.map((el: UsageUnit) => {
                return (
                  <React.Fragment key={el.since}>
                    <GridItem>{el.since}</GridItem>
                    <GridItem>{Number(el.total_hrs).toFixed(2)} hours</GridItem>
                  </React.Fragment>
                );
              })}
            </Grid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Dashboard>
  );
});

const prepCurrentUsage = (aggregate: UsageUnit) => {
  return {
    billingRange: `${aggregate?.since || ''} - ${aggregate?.until || ''}`,
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
