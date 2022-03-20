import {
  Box,
  Button,
  ChakraComponent,
  ComponentWithAs,
  Divider,
  HStack,
  IconButton,
  Link,
  ResponsiveValue,
  StackProps,
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
import { useCallback, useContext, useState } from 'react';
import { IoCopyOutline } from 'react-icons/io5';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { nord as codeTheme } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import accountContext from '../utils/account-store-context';
import {
  usePagination,
  Pagination,
  PaginationContainer,
  PaginationPrevious,
  PaginationPageGroup,
  PaginationPage,
  PaginationNext,
} from './pagination';

export const InfoBarbox = ({
  bgColor = 'smGreen.500',
  icon,
  title,
  description,
  buttonLabel,
  hrefUrl,
  ...props
}) => (
  <HStack
    width="100%"
    bg={bgColor}
    height="110px"
    justifyContent="space-between"
    padding="2.5em 1.5em"
    {...props}
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

export const SmPanel: ComponentWithAs<'div', StackProps> = ({ children, ...props }) => (
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
        {/* //TODO remove strict width */}
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
      <CopyButton copyContent={code} position="absolute" />
      <SyntaxHighlighter language="bash" style={{ ...codeTheme }} className="code_block">
        {code}
      </SyntaxHighlighter>
    </Box>
  );
};

export const CopyButton = ({ copyContent, position = 'initial', top = '9px' }) => (
  <Button
    top={top}
    right="9px"
    position={position as ResponsiveValue<any>}
    alignSelf="flex-start"
    fontSize="0.8rem"
    aria-label="copy"
    color="smNavy.500"
    backgroundColor="#fff"
    size="sm"
    borderRadius="2px"
    onClick={() => {
      navigator?.clipboard?.writeText(copyContent);
    }}
    _hover={{ color: '#fff', backgroundColor: 'smNavy.400' }}
  >
    COPY
  </Button>
);

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

export const DataGridComponent = ({ data, DataDisplayComponent, itemsPerPage = 5 }) => {
  const [page, setPage] = useState(0);

  const pagesCount = Math.ceil(data?.length / itemsPerPage);

  let onSelectPage = useCallback(
    (_page: number) => {
      setPage(_page - 1);
    },
    [data]
  );

  return (
    <>
      <DataDisplayComponent
        data={data?.slice(page * itemsPerPage, page * itemsPerPage + itemsPerPage)}
      />

      {data?.length > itemsPerPage && (
        <GridPagination onSelectPage={onSelectPage} pagesCountInitial={pagesCount} />
      )}
    </>
  );
};

export type GridPaginationProps = {
  onSelectPage: (page: number) => void;
  pagesCountInitial: number;
};

export const GridPagination: ChakraComponent<'div', GridPaginationProps> = ({
  onSelectPage,
  pagesCountInitial,
  ...props
}) => {
  const { currentPage, setCurrentPage, pagesCount, pages } = usePagination({
    pagesCount: pagesCountInitial,
    initialState: { currentPage: 1 },
  });

  const onPageChange = useCallback(
    (page) => {
      setCurrentPage(page);
      onSelectPage?.(page);
    },
    [currentPage]
  );

  return (
    <Box width="100%" d="flex" justifyContent="flex-end" mt="1em" {...props}>
      <Pagination pagesCount={pagesCount} currentPage={currentPage} onPageChange={onPageChange}>
        <PaginationContainer>
          <PaginationPrevious
            color="smBlack.300"
            bg="smWhite.500"
            borderRadius="2px"
            fontSize="0.8em"
            fontFamily="RMNeue-Light"
          >
            &lt; Previous
          </PaginationPrevious>
          <PaginationPageGroup>
            {pages.map((page: number) => (
              <PaginationPage
                fontSize="0.8em"
                p="1em"
                bg="smWhite.500"
                borderRadius="2px"
                _current={{
                  bg: 'smBlue.200',
                  color: 'smBlue.500',
                }}
                _focus={{ boxShadow: null }}
                fontFamily="RMNeue-Light"
                key={`pagination_page_${page}`}
                color="smBlack.300"
                page={page}
              />
            ))}
          </PaginationPageGroup>
          <PaginationNext
            color="smBlack.300"
            bg="smWhite.500"
            borderRadius="2px"
            fontSize="0.8em"
            fontFamily="RMNeue-Light"
          >
            Next &gt;
          </PaginationNext>
        </PaginationContainer>
      </Pagination>
    </Box>
  );
};

export const pad = (n: number) => n.toString().padStart(2, '0');
