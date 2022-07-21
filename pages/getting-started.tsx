import { Text, Box, VStack } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { useContext, useState } from 'react';
import { DescriptionLabel, HeaderLabel, PageHeader, SmPanel } from '../components/common';
import Dashboard from '../components/dashboard';
import accountContext from '../utils/account-store-context';
import { CodeExamples } from '../components/code-examples';
import { trackEvent } from '../utils/analytics';
import { GenerateTokenComponent, TokenGenStages } from '../components/generate-token-component';

export default observer(function GettingStarted({ }) {
  const [showDefaultCodeExample, setShowDefaultCodeExample] = useState(true);

  const { accountStore } = useContext(accountContext);

  const tokenGenerationStage = (stage: TokenGenStages) => {
    setShowDefaultCodeExample(stage != 'generated');
  };

  return (
    <Dashboard>
      <PageHeader
        headerLabel='Start Using API'
        introduction='Start using our speech-to-text SaaS in a few simple steps.'
      />

      <SmPanel width='100%' maxWidth='900px'>
        <Box width='100%' paddingBottom='0.5em'>
          <HeaderLabel>Download an Example Audio File</HeaderLabel>
          <DescriptionLabel>
            Download our{' '}
            <a
              href='/example.wav'
              download='example.wav'
              title='Download an example file'
              onClick={() => {
                trackEvent('download_example', 'Actions', 'example.wav');
              }}>
              <Text color='smBlue.500' as='span'>
                sample audio file
              </Text>
            </a>{' '}
            into the folder, or use your own. <br />
          </DescriptionLabel>
        </Box>
        <PanelDivider />
        <Box paddingTop='1.5em' paddingBottom='2em' width='100%'>
          {accountStore.account ? (
            <GenerateTokenComponent
              raiseTokenStage={tokenGenerationStage}
              tokensFullDescr={
                <>
                  You are using all of your available API keys. To generate a new API Key, delete an existing API key{' '}
                  <Link href='/manage-access/'>
                    <a
                      style={{ cursor: 'pointer', textDecoration: 'underline' }}
                      onClick={() => {
                        trackEvent('link_to_manage_access', 'Navigation', 'link_in_start_in_api');
                      }}>
                      here
                    </a>
                  </Link>
                  {'.'}
                </>
              }
            />
          ) : (
            <VStack alignItems='flex-start'>
              <Box className='skeleton' height='2em' width='15em' />
              <Box className='skeleton' height='1em' width='28em' />
              <Box className='skeleton' height='6em' width='100%' />
            </VStack>
          )}
        </Box>
        {showDefaultCodeExample && (
          <>
            <PanelDivider />
            <Box paddingTop='1.5em' width='100%'>
              <HeaderLabel>Make an API Request</HeaderLabel>
              <DescriptionLabel>Run the commands to generate a transcript.</DescriptionLabel>{' '}
              <CodeExamples />
            </Box>
          </>
        )}
      </SmPanel>
    </Dashboard>
  );
});

const PanelDivider = () => <Box bg='smBlack.200' height='1px' width='100%' />;
