import {
  Box,
  Button,
  Divider,
  HStack,
  IconButton,
  Link,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { IoCopyOutline } from 'react-icons/io5';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { nord as codeTheme } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import accountContext from '../utils/account-store-context';

export const InfoBarbox = ({
  bgColor = 'smGreen.500',
  icon,
  title,
  description,
  buttonLabel,
  hrefUrl,
}) => (
  <HStack
    width="100%"
    bg={bgColor}
    height="110px"
    mt="3em"
    justifyContent="space-between"
    padding="2.5em 1.5em"
  >
    <Box flex="0 0 auto">{icon}</Box>
    <VStack alignItems="flex-start" flex="1" pl="1em" spacing="0px">
      <Text fontFamily="Matter-Bold" fontSize="1.4em" color="smWhite.500">
        {title}
      </Text>
      <Text fontFamily="RMNeue-Regular" fontSize="1em" color="smWhite.500">
        {description}
      </Text>
    </VStack>
    <Link href={hrefUrl}>
      <Button variant="speechmaticsWhite" mb="1em">
        {buttonLabel}
      </Button>
    </Link>
  </HStack>
);

export const ViewUsageBox = ({}) => (
  <InfoBarbox
    icon={<img src="/assets/temp_trackIcon.png" />}
    title="Track your usage"
    description="Usage is measured in minutes of audio processed"
    buttonLabel="View Usage"
    hrefUrl="/usage/"
  />
);

export const SmPanel = ({ children, ...props }) => (
  <VStack className="sm_panel" alignItems="flex-start" {...props}>
    {children}
  </VStack>
);

export const PageHeaderLabel = ({ children }) => (
  <Text fontFamily="RMNeue-Bold" fontSize="2.2em" mt="2em">
    {children}
  </Text>
);

export const PageIntroduction = ({ children }) => (
  <Text fontFamily="RMNeue-Regular" fontSize="1.1em" color="smNavy.400">
    {children}
  </Text>
);

export const HeaderLabel = ({ children, ...props }) => (
  <Text fontFamily="RMNeue-Bold" fontSize="1.4em" mb="0.3em" {...props}>
    {children}
  </Text>
);

export const DescriptionLabel = ({ children }) => (
  <Text fontFamily="RMNeue-Regular" fontSize="1em" mb="1em" color="smBlack.300">
    {children}
  </Text>
);

export const PageHeader = ({ headerLabel, introduction }) => {
  return (
    <>
      <PageHeaderLabel>{headerLabel}</PageHeaderLabel>
      <PageIntroduction>{introduction}</PageIntroduction>
      <hr
        style={{
          marginTop: '2em',
          width: '800px',
          marginBottom: '3em',
          borderColor: 'var(--chakra-colors-smNavy-270)',
        }}
      />
    </>
  );
};
export const CodeExamples = observer(({ token }: { token?: string }) => {
  const { accountStore } = useContext(accountContext);

  return (
    <Tabs size="lg" variant="speechmatics" mt="1em">
      <TabList marginBottom="-1px">
        <Tab>Windows</Tab>
        <Tab>Mac</Tab>
        <Tab>Linux</Tab>
      </TabList>
      <TabPanels>
        <TabPanel width="750px">
          <CodeHighlight
            code={`curl -L -X POST ${
              accountStore.getRuntimeURL() || '$HOST'
            }/v2/jobs/ -H "Authorization: Bearer ${
              token || `NDFjOTE3NGEtOWVm`
            }" -F data_file=@example.wav -F config="$(cat config.json)" | jq`}
          />
        </TabPanel>
        <TabPanel width="750px">
          <CodeHighlight
            code={`/* mac */ curl -L -X POST ${accountStore.getRuntimeURL()}/v2/jobs/ -H "Authorization: Bearer ${
              token || `NDFjOTE3NGEtOWVm`
            }" -F data_file=@example.wav -F config="$(cat config.json)" | jq`}
          />
        </TabPanel>
        <TabPanel width="750px">
          <CodeHighlight
            code={`/* linux */ curl -L -X POST ${accountStore.getRuntimeURL()}/jobs/ -H "Authorization: Bearer ${
              token || `NDFjOTE3NGEtOWVm`
            }" -F data_file=@example.wav -F config="$(cat config.json)" | jq`}
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
});

export const CodeHighlight = ({ code }) => {
  return (
    <Box position="relative">
      <Button
        top="6px"
        right="6px"
        position="absolute"
        alignSelf="flex-start"
        fontSize="0.8em"
        aria-label="copy"
        color="smNavy.500"
        backgroundColor="#fff"
        size="sm"
        borderRadius="2px"
        onClick={() => {
          navigator?.clipboard?.writeText(code);
        }}
        _hover={{ color: '#fff', backgroundColor: 'smNavy.400' }}
      >
        COPY
      </Button>
      <SyntaxHighlighter language="bash" style={{ ...codeTheme }} className="code_block">
        {code}
      </SyntaxHighlighter>
    </Box>
  );
};

export const SimplePanel = ({ children }) => (
  <VStack
    width="800px"
    p="1em 1em 1.5em 1.5em"
    alignItems="flex-start"
    backgroundColor="smWhite.500"
    border="1px solid"
    borderColor="smBlack.200"
    borderRadius="3px"
  >
    {children}
  </VStack>
);
