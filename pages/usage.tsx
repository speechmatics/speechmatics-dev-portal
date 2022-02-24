import Link from 'next/link';
import { CSSProperties, useContext, useEffect, useState } from 'react';
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
            setUsageJson({ ...respJson, currentUsage: prepCurrentUsage(respJson) });
          }
        })
        .catch(console.error);
    }
    return () => {
      isActive = false;
    };
  }, [idToken, accountStore.account]);

  const { data, currentUsage } = usageJson;

  return (
    <Dashboard>
      <h1>Usage</h1>

      <Text fontSize="2xl">Usage this month: {currentUsage?.billingMonth}</Text>

      <Grid templateColumns="repeat(4, 1fr)" gap={5}>
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

      <Link href={'/subscribe'}>
        <Text as="span" style={{ textDecoration: 'underline', cursor: 'pointer' }}>
          Setup up the payment.
        </Text>
      </Link>
    </Dashboard>
  );
});

const prepCurrentUsage = ({ data }: UsageRespJson) => {
  const currentPeriod = data[0]; //todo find current period

  const usageStandard = currentPeriod.summary.find(
    (s) => s.type == 'transcription' && s.operating_point == 'standard'
  )?.duration_hrs;

  const usageEnhanced = currentPeriod.summary.find(
    (s) => s.type == 'transcription' && s.operating_point == 'enhanced'
  )?.duration_hrs;

  return {
    billingMonth: `${currentPeriod.since} - ${currentPeriod.until}`,
    usageStandard,
    usageEnhanced,
  };
};

type UsageRespJson = { data: UsageUnit[] };

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
