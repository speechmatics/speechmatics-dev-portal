import Link from 'next/link';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  HStack,
  Spinner,
  Text,
  useBreakpointValue,
  VStack
} from '@chakra-ui/react';
import { callGetUsage } from '../utils/call-api';
import accountContext, { accountStore } from '../utils/account-store-context';
import { observer } from 'mobx-react-lite';
import { DataGridComponent, GridSpinner, HeaderLabel, UsageInfoBanner } from './common';
import { ExclamationIcon } from './icons-library';
import { formatDate } from '../utils/date-utils';
import { useIsAuthenticated } from '@azure/msal-react';
import { trackEvent } from '../utils/analytics';

export const UsageSummary = observer(function Usage() {
  const [usageSummaryJson, setUsageSummaryJson] = useState<UsageRespJson>({});
  const { accountStore } = useContext(accountContext);
  const [usageError, setUsageError] = useState<Boolean>(false);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const authenticated = useIsAuthenticated();

  const getMonthSpan: any = () => {
    const date: Date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return {
      since: `${year}-${month > 9 ? month : '0' + month}-01`
    };
  };

  useEffect(() => {
    let isActive = true;
    if (authenticated && accountStore.account) {
      setUsageError(false);
      setIsLoading(true);
      const month_span: any = getMonthSpan();
      callGetUsage(accountStore.getContractId(), accountStore.getProjectId(), month_span)
        .then((respJson) => {
          if (isActive && !!respJson && 'aggregate' in respJson) {
            setUsageSummaryJson({
              aggregate: respJson.aggregate,
              breakdown: respJson.breakdown.reverse()
            });
            setIsLoading(false);
          }
        })
        .catch((err) => {
          setUsageError(true);
          setIsLoading(false);
        });
    }
    return () => {
      isActive = false;
    };
  }, [authenticated, accountStore.account]);

  const { aggregate } = usageSummaryJson;

  const currentUsage = useMemo(() => prepCurrentUsage(aggregate), [aggregate]);

  return (
    <>
      <HeaderLabel>
        {currentUsage?.since?.startsWith('1970-01-01') ? (
          <>Usage Summary</>
        ) : currentUsage?.since ? (
          <>
            Usage for {new Date(currentUsage?.since).toLocaleString('default', { month: 'long' })}{' '}
            {new Date(currentUsage?.since).toLocaleString('default', { year: 'numeric' })}
          </>
        ) : (
          <>Usage Summary</>
        )}
      </HeaderLabel>

      <Grid
        templateColumns='repeat(4, 1fr)'
        marginTop='2em'
        className='sm_grid'
        alignSelf='stretch'>
        <GridItem className='grid_header'>Accuracy</GridItem>
        <GridItem className='grid_header'>Limit (Hours per Month)</GridItem>
        <GridItem className='grid_header'>Hours Used</GridItem>
        <GridItem className='grid_header'>Requests Made</GridItem>

        {isLoading && (
          <GridItem colSpan={4}>
            <Flex width='100%' justifyContent='center'>
              <GridSpinner />
              <Text ml='1em'>One moment please...</Text>
            </Flex>
          </GridItem>
        )}
        {!isLoading && !currentUsage && !usageError && (
          <GridItem colSpan={4}>
            <Flex width='100%' justifyContent='center'>
              <ExclamationIcon />
              <Text ml='1em'>You don't currently have any usage data.</Text>
            </Flex>
          </GridItem>
        )}
        {!isLoading && !currentUsage && usageError && (
          <GridItem colSpan={4}>
            <Flex width='100%' justifyContent='center'>
              <ExclamationIcon />
              <Text ml='1em'>We couldn't get your usage summary.</Text>
            </Flex>
          </GridItem>
        )}
        {!isLoading && currentUsage && (
          <>
            <GridItem>Enhanced</GridItem>
            <GridItem>
              {accountStore.isLoading ? '...' : accountStore.getUsageLimit('enhanced')} hours
            </GridItem>
            <GridItem data-qa='usage-enhanced'>
              {Number(currentUsage?.usageEnhanced).toFixed(2)} hours
            </GridItem>
            <GridItem data-qa='requests-enhanced'>{currentUsage?.countEnhanced}</GridItem>

            <GridItem className='grid_row_divider'>
              <hr />
            </GridItem>

            <GridItem>Standard</GridItem>
            <GridItem>
              {accountStore.isLoading ? '...' : accountStore.getUsageLimit('standard')} hours
            </GridItem>
            <GridItem data-qa='usage-standard'>
              {Number(currentUsage?.usageStandard).toFixed(2)} hours
            </GridItem>
            <GridItem data-qa='requests-standard'>{currentUsage?.countStandard}</GridItem>
          </>
        )}
      </Grid>
      <UsageInfoBanner
        text='Usage is reported on a UTC calendar-day basis and is updated every 5 minutes.'
        mt='2em'
      />
    </>
  );
});

export const UsageBreakdown = observer(function Usage() {
  const [usageDetailsJson, setUsageDetailsJson] = useState<UsageRespJson>({});
  const { accountStore } = useContext(accountContext);
  const [usageError, setUsageError] = useState<Boolean>(false);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const authenticated = useIsAuthenticated();

  useEffect(() => {
    let isActive = true;
    if (authenticated && accountStore.account) {
      setUsageError(false);
      setIsLoading(true);
      callGetUsage(accountStore.getContractId(), accountStore.getProjectId(), {})
        .then((respJson) => {
          if (isActive && !!respJson && 'aggregate' in respJson) {
            setUsageDetailsJson({
              aggregate: respJson.aggregate,
              breakdown: respJson.breakdown.reverse()
            });
            setIsLoading(false);
          }
        })
        .catch((err) => {
          setUsageError(true);
          setIsLoading(false);
        });
    }
    return () => {
      isActive = false;
    };
  }, [authenticated, accountStore.account]);

  const { breakdown } = usageDetailsJson;

  return (
    <>
      {!usageError && (
        <DataGridComponent
          data={breakdown}
          DataDisplayComponent={UsageBreakdownGrid}
          isLoading={isLoading}
          onTrackUse={() => trackEvent('usage_details_pagination', 'Navigation')}
        />
      )}
      {usageError && (
        <Grid
          templateColumns='repeat(2, 1fr)'
          marginTop='2em'
          className='sm_grid'
          alignSelf='stretch'>
          <GridItem className='grid_header'>Day</GridItem>
          <GridItem className='grid_header'>Hours Used</GridItem>
          <GridItem colSpan={2}>
            <Flex width='100%' justifyContent='center'>
              <ExclamationIcon />
              <Text ml='1em'>We couldn't get your usage details.</Text>
            </Flex>
          </GridItem>
        </Grid>
      )}
    </>
  );
});

const UsageBreakdownGrid = ({ data, isLoading }) => (
  <Grid templateColumns='repeat(2, 1fr)' marginTop='2em' className='sm_grid' alignSelf='stretch'>
    <GridItem className='grid_header'>Day</GridItem>
    <GridItem className='grid_header'>Hours Used</GridItem>

    {data?.map((el: UsageUnit, i: number) => {
      return (
        <React.Fragment key={el.since}>
          <GridItem className='grid_row_divider'>{i != 0 && <hr />}</GridItem>
          <GridItem>{formatDate(new Date(el.since))}</GridItem>
          <GridItem>{Number(el.total_hrs).toFixed(2)} hours</GridItem>
        </React.Fragment>
      );
    })}
    {!isLoading && (!data || data?.length == 0) && (
      <GridItem colSpan={2}>
        <Flex width='100%' justifyContent='center'>
          <ExclamationIcon />
          <Text ml='1em'>You don't currently have any usage data.</Text>
        </Flex>
      </GridItem>
    )}
    {isLoading && (
      <GridItem colSpan={2}>
        <Flex width='100%' justifyContent='center'>
          <GridSpinner />
          <Text ml='1em'>One moment please...</Text>
        </Flex>
      </GridItem>
    )}
  </Grid>
);

export const prepCurrentUsage = (aggregate: UsageUnit) => {
  if (aggregate) {
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
          ?.count || 0
    };
  } else return null;
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

export const GetInTouchBox = ({ icon, title, ctaText, hrefLink, buttonLabel }) => {
  const breakVal = useBreakpointValue({
    xs: false,
    sm: true
  });

  const Containter = useMemo(
    () =>
      breakVal
        ? ({ children, ...props }) => <HStack {...props}>{children}</HStack>
        : ({ children, ...props }) => <VStack {...props}>{children}</VStack>,
    [breakVal]
  );

  return (
    <Containter width='100%' bg='smNavy.500' justifyContent='space-between' padding='1em 1.5em'>
      <Box flex='0 0 auto'>{icon}</Box>
      <VStack alignItems='flex-start' flex='1' pl='1em' spacing='0px'>
        <Text fontFamily='Matter-Bold' fontSize='1.4em' color='smWhite.500'>
          {title}
        </Text>
        <Text fontFamily='RMNeue-Regular' fontSize='1em' color='smWhite.500' pb='0.5em'>
          {ctaText}
        </Text>
      </VStack>
      <Link href={hrefLink}>
        <Button variant='speechmaticsWhite'>{buttonLabel}</Button>
      </Link>
    </Containter>
  );
};

export const ModelDescriptionBox = ({ mainColor, icon, title, usageLimitType, description }) => {
  const breakVal = useBreakpointValue({
    xs: false,
    sm: true
  });

  const Containter = useMemo(
    () =>
      breakVal
        ? ({ children, ...props }) => <HStack {...props}>{children}</HStack>
        : ({ children, ...props }) => <VStack {...props}>{children}</VStack>,
    [breakVal]
  );

  return (
    <GridItem bg={`${mainColor}.200`} className='flexColumnBetween'>
      <Containter p={breakVal ? '1em 1em 1em 1em' : '0.5em'} alignItems='flex-start'>
        <Box p='1em 0em 0em 0.2em'>{icon}</Box>
        <Box pt='1em' pl='0.5em'>
          <Text fontSize='0.85em' color='smBlack.400'>
            {title}
          </Text>
          <Text
            fontFamily='RMNeue-Bold'
            fontSize='1.5em'
            color={`${mainColor}.500`}
            mt='0.15em'
            data-qa={`limit-${usageLimitType}`}>
            {accountStore.isLoading ? (
              <Spinner size='sm' />
            ) : (
              accountStore.getUsageLimit(usageLimitType)
            )}{' '}
            hours per month
          </Text>
        </Box>
      </Containter>
      <Box
        bg={`${mainColor}.100`}
        p='.8em 1em .8em 1em'
        borderTop='1px solid'
        borderColor={`${mainColor}.400`}>
        <Text fontSize='0.8em' color='smBlack.400'>
          {description}
        </Text>
      </Box>
    </GridItem>
  );
};
