import Link from 'next/link';
import { CSSProperties, useContext, useEffect, useState } from 'react';
import Dashboard from '../components/dashboard';
import { Box, Text, tokenToCSSVar } from '@chakra-ui/react';
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
          if (isActive && !!respJson && 'data' in respJson) {
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

      <Text fontSize="2xl">Billing Month: {currentUsage?.billingMonth}</Text>

      <Box marginTop={10}>
        <Text fontSize="xl">
          <strong>{currentUsage?.usageStandard}</strong> hours Standard
        </Text>
        <Text color="#999">
          You have <strong>{currentUsage?.leftStandard}</strong> hours of free usage left this
          month.
        </Text>
      </Box>
      <br />
      <Text fontSize="xl">
        <strong>{currentUsage?.usageEnhanced}</strong> hours Enhanced
      </Text>
      <Text color="#DA3A4A">
        You have used your allowance of <strong>{currentUsage?.leftEnhanced}</strong> hours this
        month.{' '}
        <Link href={'/subscribe'}>
          <Text as="span" style={{ textDecoration: 'underline', cursor: 'pointer' }}>
            Setup up the payment.
          </Text>
        </Link>
      </Text>

      <div style={{ height: '300px' }} />

      <div style={{ display: 'flex', width: '600px' }}>
        {data?.map((usageUnit: UsageUnit, index: number) => {
          const usageStandard = usageUnit.summary.find(
            (s) => s.type == 'transcription' && s.operating_point == 'standard'
          )?.duration_hrs;

          const usageEnhanced = usageUnit.summary.find(
            (s) => s.type == 'transcription' && s.operating_point == 'enhanced'
          )?.duration_hrs;

          return (
            <div key={index} style={styles.elemContainer}>
              <div
                style={{
                  height: accountStore.getContractLimitHrs() * 100,
                  ...styles.columnContainer,
                }}
              >
                <div
                  style={{
                    height: usageStandard * 100,
                    backgroundColor: 'var(--new-teal-dark)',
                    ...styles.column,
                  }}
                >
                  {`${usageStandard}h`}
                </div>
                <div
                  style={{
                    height: usageEnhanced * 100,
                    backgroundColor: 'var(--new-blue-light)',
                    ...styles.column,
                  }}
                >
                  {`${usageEnhanced}h`}
                </div>
              </div>
              <div style={{ ...styles.columnLabel }}>
                <div>stand.</div>
                <div>enhan.</div>
              </div>
              <div style={{ ...styles.columnYear }}>
                {usageUnit.since} - <br />
                {usageUnit.until}
              </div>
            </div>
          );
        })}
      </div>
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
    leftStandard: (((accountStore.getContractLimitHrs() - usageStandard) * 100) >> 0) / 100,
    usageEnhanced,
    leftEnhanced: (((accountStore.getContractLimitHrs() - usageEnhanced) * 100) >> 0) / 100,
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

const months = [
  '',
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const styles = {
  elemContainer: {
    height: 300,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  } as CSSProperties,

  columnContainer: {
    flex: 1,
    padding: 10,
    display: 'flex',
    alignItems: 'flex-end',
  } as CSSProperties,

  column: {
    flex: 1,
    color: 'white',
    fontSize: 12,
    display: 'flex',
    justifyContent: 'center',
    paddingTop: 10,
    width: 50,
  } as CSSProperties,

  columnLabel: {
    display: 'flex',
    color: 'gray',
    fontSize: 10,
    justifyContent: 'space-between',
    padding: '0px 15px 2px 15px',
  } as CSSProperties,

  columnYear: {
    alignSelf: 'center',
    paddingTop: 5,
  } as CSSProperties,
};
