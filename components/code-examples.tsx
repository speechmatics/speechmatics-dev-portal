import { Tabs, TabList, Tab, TabPanels, TabPanel, Box, Link } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { DescriptionLabel, CopyButton } from './common';
import accountContext from '../utils/account-store-context';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { nord as codeTheme } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import { trackEvent } from '../utils/analytics';

export const CodeExamples = observer(({ token }: { token?: string }) => {
  const { accountStore } = useContext(accountContext);

  return (
    <>
      <Tabs size='lg' pt='1em' variant='speechmaticsCode' width='100%'>
        <TabList marginBottom='-1px'>
          <Tab data-qa={'tab-windows-cmd'}>Windows CMD</Tab>
          <Tab data-qa={'tab-mac-and-linux'}>Mac and Linux</Tab>
        </TabList>
        <TabPanels
          border='0px'
          borderTop='1px'
          borderTopColor='var(--chakra-colors-smBlack-180)'
          boxShadow='none'
          pt='1.5em'>
          <TabPanel width='100%'>
            <DescriptionLabel>Submit a transcription job:​</DescriptionLabel>
            <CodeHighlight
              data_qa={'code-post-job-standard'}
              copyButtonExtraOnClick={() =>
                trackEvent('copy_code_submit', 'Action', 'Copied submit transcript code', {
                  os: 'win'
                })
              }
              code={`curl.exe -L -X POST ${
                accountStore.getRuntimeURL() || '$HOST'
              }/v2/jobs/ -H "Authorization: Bearer ${
                token || `Ex4MPl370k3n`
              }" -F data_file=@example.wav -F config="{\\"type\\": \\"transcription\\", \\"transcription_config\\": { \\"operating_point\\":\\"enhanced\\", \\"language\\": \\"en\\" }}"`}
            />
            <DescriptionLabel pt='2em'>
              Get a transcript using the job ID returned by the POST request above:
            </DescriptionLabel>
            <CodeHighlight
              data_qa={'code-get-job-standard'}
              copyButtonExtraOnClick={() =>
                trackEvent('copy_code_fetch', 'Action', 'Copied fetch transcript code', {
                  os: 'win'
                })
              }
              code={`curl.exe -L -X GET ${
                accountStore.getRuntimeURL() || '$HOST'
              }/v2/jobs/INSERT_JOB_ID/transcript?format=txt -H "Authorization: Bearer ${
                token || `Ex4MPl370k3n`
              }"`}
            />
            <DescriptionLabel pt='2em'>
              To get output in JSON format, remove the format=txt query parameter from the GET
              request.
            </DescriptionLabel>
          </TabPanel>
          <TabPanel width='100%'>
            <DescriptionLabel>Submit a transcription job:​</DescriptionLabel>

            <CodeHighlight
              data_qa={'code-post-job-enhanced'}
              copyButtonExtraOnClick={() =>
                trackEvent('copy_code_submit', 'Action', 'Copied submit transcript code', {
                  os: 'linux/macos'
                })
              }
              code={`curl -L -X POST ${
                accountStore.getRuntimeURL() || '$HOST'
              }/v2/jobs/ -H "Authorization: Bearer ${
                token || `Ex4MPl370k3n`
              }" -F data_file=@example.wav -F config='{"type": "transcription","transcription_config": { "operating_point":"enhanced", "language": "en" }}'`}
            />

            <DescriptionLabel pt='2em'>
              Get a transcript using the job ID returned by the POST request above:
            </DescriptionLabel>
            <CodeHighlight
              data_qa={'code-get-job-enhanced'}
              copyButtonExtraOnClick={() =>
                trackEvent('copy_code_fetch', 'Action', 'Copied fetch transcript code', {
                  os: 'linux/macos'
                })
              }
              code={`curl -L -X GET "${
                accountStore.getRuntimeURL() || '$HOST'
              }/v2/jobs/INSERT_JOB_ID/transcript?format=txt" -H "Authorization: Bearer ${
                token || `Ex4MPl370k3n`
              }"`}
            />
            <DescriptionLabel pt='2em'>
              To get output in JSON format, remove the format=txt query parameter from the GET
              request.
            </DescriptionLabel>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <DescriptionLabel pt='1em'>
        See our{' '}
        <Link
          href='https://docs.speechmatics.com/en/cloud/howto/'
          style={{ cursor: 'pointer', textDecoration: 'underline' }}
          _hover={{ color: 'smBlue.500' }}
          target='_blank'>
          <a>examples and guidance</a>
        </Link>{' '}
        on using the Speechmatics SaaS.
      </DescriptionLabel>
    </>
  );
});

export const CodeHighlight = ({ code, data_qa, copyButtonExtraOnClick = null }) => {
  return (
    <Box position='relative' width='100%' height='50px'>
      <CopyButton
        copyContent={code}
        position='absolute'
        top='12px'
        additionalOnClick={copyButtonExtraOnClick}
      />
      <Box position='absolute' width='100%'>
        <SyntaxHighlighter
          language='bash'
          style={{ ...codeTheme }}
          className='code_block'
          data-qa={data_qa}
          aria-label={code}>
          {code}
        </SyntaxHighlighter>
      </Box>
    </Box>
  );
};
