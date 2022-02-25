import Link from 'next/link';
import React, { CSSProperties, useContext, useEffect, useState } from 'react';
import Dashboard from '../components/dashboard';
import { Box, Grid, GridItem, Text, tokenToCSSVar } from '@chakra-ui/react';
import { callGetUsage } from '../utils/call-api';
import accountContext, { accountStore } from '../utils/account-store-context';
import { observer } from 'mobx-react-lite';

export default observer(function Usage() {
  const [usageJson, setUsageJson] = useState<any>({});
  const { accountStore, tokenStore } = useContext(accountContext);
  const idToken = tokenStore.tokenPayload?.idToken;

  useEffect(() => {
    let isActive = true;
    console.log(`Usage useEff`, !!idToken, !!accountStore.account);
    if (idToken && accountStore.account) {
      callGetUsage(idToken, accountStore.getContractId(), accountStore.getProjectId())
        .then((respJson) => {
          if (isActive && !!respJson && 'aggregate' in respJson) {
            setUsageJson({ ...respJson });
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
      <h1>Usage</h1>

      <Text fontSize="2xl">Usage this month: {currentUsage?.billingRange}</Text>

      <Grid templateColumns="repeat(4, 1fr)" gap={5} marginTop="2em">
        <GridItem>Model</GridItem>
        <GridItem>Limit (hours / month)</GridItem>
        <GridItem>Hours used</GridItem>
        <GridItem>Requests made</GridItem>

        <GridItem>Standard Model</GridItem>
        <GridItem>{accountStore.getContractLimitHrs()} hours</GridItem>
        <GridItem>{currentUsage?.usageStandard} hours</GridItem>
        <GridItem>0</GridItem>

        <GridItem>Enhanced Model</GridItem>
        <GridItem>{accountStore.getContractLimitHrs()} hours</GridItem>
        <GridItem>{currentUsage?.usageEnhanced} hours</GridItem>
        <GridItem>0</GridItem>
      </Grid>

      <Text fontSize="2xl" marginTop="3em">
        Breakdown
      </Text>

      <Grid templateColumns="repeat(2, 1fr)" gap={5} marginTop="2em">
        <GridItem>Day</GridItem>
        <GridItem>Hours used</GridItem>

        {breakdown?.map((el: UsageUnit) => {
          // const usg = prepCurrentUsage(el);
          return (
            <React.Fragment key={el.since}>
              <GridItem>{el.since}</GridItem>
              <GridItem>{el.total_hrs}</GridItem>
            </React.Fragment>
          );
        })}
      </Grid>
    </Dashboard>
  );
});

const prepCurrentUsage = (aggregate: UsageUnit) => {
  const usageStandard =
    aggregate?.summary.find((s) => s.type == 'transcription' && s.operating_point == 'standard')
      ?.duration_hrs || 0;

  const usageEnhanced =
    aggregate?.summary.find((s) => s.type == 'transcription' && s.operating_point == 'enhanced')
      ?.duration_hrs || 0;

  return {
    billingRange: `${aggregate?.since} - ${aggregate?.until}`,
    usageStandard,
    usageEnhanced,
  };
};

type UsageRespJson = { aggregate: UsageUnit; breakdown: UsageUnit[] };

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
