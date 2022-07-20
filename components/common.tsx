import { theme as baseTheme } from '@chakra-ui/theme';

import {
  Box,
  Button,
  ChakraComponent,
  ComponentWithAs,
  Flex,
  FlexProps,
  HStack,
  ResponsiveValue,
  Spinner,
  StackProps,
  Text,
  Link,
  Tooltip,
  VStack,
  createStandaloneToast,
  useBreakpointValue,
  Modal,
  ModalContent,
  ModalCloseButton,
  ModalOverlay,
  ModalBody,
  ModalFooter,
  ListItem,
  OrderedList
} from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CalendarIcon,
  ExclamationIcon,
  ExclamationIconLarge,
  ViewPricingIcon,
  WarningIcon
} from './icons-library';

import {
  usePagination,
  Pagination,
  PaginationContainer,
  PaginationPrevious,
  PaginationPageGroup,
  PaginationPage,
  PaginationNext
} from './pagination';
import { Limits } from './pagination/lib/hooks/usePagination';
import { ContractState } from '../utils/account-store-context';

export const UsageInfoBanner = ({ text, centered = false, ...props }) => (
  <Flex width='100%' bg='smBlue.150' p='1em' {...props} justifyContent={centered ? 'center' : ''}>
    <Flex alignItems='center'>
      <CalendarIcon width='1.5em' height='1.5em' />
    </Flex>
    <Text
      width={centered ? '' : '100%'}
      color='smBlack.400'
      fontFamily='RMNeue-Regular'
      fontSize='1em'
      ml='1em'>
      {text}
    </Text>
  </Flex>
);

export const WarningBanner = ({ text = null, content = null, centered = false, ...props }) => (
  <Flex width='100%' bg='smOrange.200' p='1em' {...props} justifyContent={centered ? 'center' : ''}>
    <Flex alignItems='center'>
      <WarningIcon width='1.5em' height='1.5em' />
    </Flex>
    {content ? (
      <Box justifyContent={centered ? 'center' : ''} color='smBlack.400' ml='1em'>
        {content}
      </Box>
    ) : (
      <Text
        width={centered ? '' : '100%'}
        color='smBlack.400'
        fontFamily='RMNeue-Regular'
        fontSize='1em'
        ml='1em'>
        {text}
      </Text>
    )}
  </Flex>
);

export const NoSomethingBanner = ({ children }) => (
  <Flex width='100%' justifyContent='center'>
    <ExclamationIcon />
    <Text ml='1em'>{children}</Text>
  </Flex>
);

export const InfoBarbox = ({
  bgColor = 'smGreen.500',
  icon,
  title,
  description,
  buttonLabel,
  hrefUrl = null,
  setStateUp = null,
  buttonOnClick = null,
  ...props
}) => {
  const breakVal = useBreakpointValue({
    xs: false,
    sm: true
  });

  const Containter = useMemo(
    () =>
      breakVal
        ? ({ children }) => (
          <HStack
            width='100%'
            bg={bgColor}
            justifyContent='space-between'
            alignItems='center'
            padding='1.5em 1.5em'
            {...props}>
            {children}
          </HStack>
        )
        : ({ children }) => (
          <VStack
            width='100%'
            bg={bgColor}
            justifyContent='space-between'
            padding='1.2em 0.5em'
            spacing='1em'
            {...props}>
            {children}
          </VStack>
        ),
    [breakVal]
  );

  return (
    <Containter>
      <Box flex='0 0 auto'>{icon}</Box>
      <VStack alignItems='flex-start' flex='1' pl='1em' spacing='0px'>
        <Text fontFamily='Matter-Bold' fontSize='1.4em' color='smWhite.500'>
          {title}
        </Text>
        <Text fontFamily='RMNeue-Regular' fontSize='1em' color='smWhite.500'>
          {description}
        </Text>
      </VStack>
      {hrefUrl && (
        <Link href={hrefUrl} style={{ textDecoration: 'none' }}>
          <Button
            variant='speechmaticsWhite'
            mt='0px'
            data-qa={`button-${buttonLabel.toLowerCase().replace(' ', '-')}`}
            onClick={() => buttonOnClick?.()}>
            {buttonLabel}
          </Button>
        </Link>
      )}
      {setStateUp && (
        <Button variant='speechmaticsWhite' onClick={setStateUp}>
          {buttonLabel}
        </Button>
      )}
    </Containter>
  );
};

export const ViewUsageBox = ({ }) => (
  <InfoBarbox
    icon={<img src='/assets/temp_trackIcon.png' />}
    title='Track your usage'
    description='Usage is measured in minutes of audio processed'
    buttonLabel='View Usage'
    hrefUrl='/usage/'
  />
);

export const SmPanel: ComponentWithAs<'div', StackProps> = ({ children, ...props }) => (
  <VStack className='sm_panel' alignItems='flex-start' {...props}>
    {children}
  </VStack>
);

export const PageHeaderLabel = ({ children }) => (
  <Text fontFamily='RMNeue-Bold' fontSize='2.2em' mt={{ base: '0.7em', md: '2em' }} >
    {children}
  </Text>
);

export const PageIntroduction = ({ children }) => (
  <Text fontFamily='RMNeue-Regular' fontSize='1.1em' color='smNavy.400'>
    {children}
  </Text>
);

export const HeaderLabel = ({ children, ...props }) => (
  <Text fontFamily='RMNeue-Bold' fontSize='1.4em' mb='0.3em' {...props}>
    {children}
  </Text>
);

export const DescriptionLabel = ({ children, ...props }) => (
  <Text as='div' fontSize='1em' mb='1em' color='smBlack.300' {...props}>
    {children}
  </Text>
);

export const PageHeader = ({ headerLabel, introduction }) => {
  return (
    <Box width='100%' maxWidth='900px' className='page_header'>
      <PageHeaderLabel>{headerLabel}</PageHeaderLabel>
      <PageIntroduction>{introduction}</PageIntroduction>
      <hr
        style={{
          marginTop: '2em',
          width: '100%',
          marginBottom: '3em',
          borderColor: 'var(--chakra-colors-smNavy-270)'
        }}
      />
    </Box>
  );
};

interface CopyButtonProps {
  copyContent: string;
  position: string;
  top: string;
  additionalOnClick?: () => void;
}

export const CopyButton = ({
  copyContent,
  position = 'initial',
  top = '9px',
  additionalOnClick = null
}: CopyButtonProps) => {
  const [isTTOpen, setIsTTOpen] = useState(false);

  useEffect(() => {
    let st: number;

    if (isTTOpen)
      setTimeout(() => {
        setIsTTOpen(false);
      }, 3000);

    return () => clearTimeout(st);
  }, [isTTOpen]);

  return (
    <Tooltip
      label='copied'
      isOpen={isTTOpen}
      placement='top'
      hasArrow
      bg='smNavy.400'
      color='smWhite.500'>
      <Button
        _focus={{ boxShadow: 'none' }}
        top={top}
        right='9px'
        position={position as ResponsiveValue<any>}
        alignSelf='flex-start'
        fontSize='0.8rem'
        aria-label='copy'
        color='smNavy.500'
        backgroundColor='#fff'
        size='sm'
        borderRadius='2px'
        zIndex={99}
        onClick={() => {
          setIsTTOpen(true);
          navigator?.clipboard?.writeText(copyContent);
        }}
        _hover={{ color: '#fff', backgroundColor: 'smNavy.400' }}>
        COPY
      </Button>
    </Tooltip>
  );
};

export const DataGridComponent = ({
  data,
  DataDisplayComponent,
  isLoading,
  itemsPerPage = 5,
  onTrackUse = null
}) => {
  const [page, setPage] = useState(0);

  const pagesCount = Math.ceil(data?.length / itemsPerPage);

  let onSelectPage = useCallback(
    (_page: number) => {
      setPage(_page - 1);
      onTrackUse?.();
    },
    [data]
  );

  return (
    <>
      <DataDisplayComponent
        data={data?.slice(page * itemsPerPage, page * itemsPerPage + itemsPerPage)}
        isLoading={isLoading}
      />

      {data?.length > itemsPerPage && (
        <GridPagination
          onSelectPage={onSelectPage}
          pagesCountInitial={pagesCount}
          limits={{ inner: 1, outer: 1 }}
        />
      )}
    </>
  );
};

export type GridPaginationProps = {
  onSelectPage: (page: number) => void;
  pagesCountInitial: number;
  limits?: Limits;
};

export const GridPagination: ChakraComponent<'div', GridPaginationProps> = ({
  onSelectPage,
  pagesCountInitial,
  limits,
  ...props
}) => {
  const { currentPage, setCurrentPage, pagesCount, pages } = usePagination({
    pagesCount: pagesCountInitial,
    initialState: { currentPage: 1 },
    limits: limits
  });

  const onPageChange = useCallback(
    (page) => {
      setCurrentPage(page);
      onSelectPage?.(page);
    },
    [currentPage]
  );

  return (
    <Box width='100%' d='flex' justifyContent='flex-end' mt='1em' {...props}>
      <Pagination pagesCount={pagesCount} currentPage={currentPage} onPageChange={onPageChange}>
        <PaginationContainer>
          <PaginationPrevious
            color='smBlack.300'
            bg='smWhite.500'
            borderRadius='2px'
            fontSize='0.8em'
            fontFamily='RMNeue-Light'>
            &lt; Previous
          </PaginationPrevious>
          <PaginationPageGroup>
            {pages.map((page: number) => (
              <PaginationPage
                fontSize='0.8em'
                p='1em'
                bg='smWhite.500'
                borderRadius='2px'
                _current={{
                  bg: 'smBlue.200',
                  color: 'smBlue.500'
                }}
                _focus={{ boxShadow: null }}
                fontFamily='RMNeue-Light'
                key={`pagination_page_${page}`}
                color='smBlack.300'
                page={page}
              />
            ))}
          </PaginationPageGroup>
          <PaginationNext
            color='smBlack.300'
            bg='smWhite.500'
            borderRadius='2px'
            fontSize='0.8em'
            fontFamily='RMNeue-Light'>
            Next &gt;
          </PaginationNext>
        </PaginationContainer>
      </Pagination>
    </Box>
  );
};

export const pad = (n: number) => n.toString().padStart(2, '0');

export const ViewPricingBar: ComponentWithAs<'div', FlexProps> = (props) => {
  const breakVal = useBreakpointValue({
    xs: false,
    sm: true
  });

  return (
    <Flex
      justifyContent='center'
      p='1em'
      alignItems='center'
      direction={breakVal ? 'row' : 'column'}
      {...props}
      {...{ [breakVal ? 'columnGap' : 'rowGap']: '1em' }}>
      <ViewPricingIcon />
      <Text fontFamily='RMNeue-Bold' fontSize='20px'>
        View our Pricing
      </Text>
      <Link
        href='https://www.speechmatics.com/our-technology/pricing'
        target='_blank'
        style={{ textDecoration: 'none' }}>
        <Button variant='speechmaticsOutline' mt='0em'>
          Pricing
        </Button>
      </Link>
    </Flex>
  );
};

export const GridSpinner = () => <Spinner size='sm' style={{ padding: '0px', marginTop: '2px' }} />;

export const ConfirmRemoveModal = ({
  isOpen,
  onClose,
  mainTitle,
  subTitle,
  onRemoveConfirm,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  returnFocusOnClose = true
}) => (
  <Modal returnFocusOnClose={returnFocusOnClose} isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent borderRadius='2px'>
      <ModalCloseButton _focus={{ boxShadow: '' }} />
      <ModalBody>
        <Flex justifyContent='center' width='100%'>
          <Box mt='1em'>
            <ExclamationIconLarge />
          </Box>
        </Flex>
        <Box fontFamily='RMNeue-Bold' fontSize='1.5em' textAlign='center' px='1.5em' mt='0.5em'>
          {mainTitle}
        </Box>
        <Box
          fontFamily='RMNeue-Light'
          fontSize='0.8em'
          textAlign='center'
          px='5em'
          color='smBlack.400'
          mt='1em'>
          {subTitle}
        </Box>
      </ModalBody>
      <ModalFooter justifyContent='center'>
        <Flex alignItems='center'>
          <Button
            data-qa='button-confirm'
            variant='speechmatics'
            bg='smRed.500'
            _hover={{ bg: 'smRed.400' }}
            mr={3}
            py='1.1em'
            onClick={onRemoveConfirm}>
            {confirmLabel}
          </Button>
          <Button
            data-qa='button-cancel'
            variant='speechmatics'
            bg='smBlack.200'
            color='smBlack.400'
            py='1.1em'
            _hover={{ bg: 'smBlack.150' }}
            onClick={onClose}>
            {cancelLabel}
          </Button>
        </Flex>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

const toast = createStandaloneToast({
  theme: {
    ...baseTheme,
    colors: {
      red: {
        500: 'var(--chakra-colors-smRed-500)'
      },
      green: {
        500: 'var(--chakra-colors-smGreen-500)'
      },
      blue: {
        500: 'var(--chakra-colors-smBlue-500)'
      }
    }
  }
});


export const errToast = (descr: string | any) =>
  toast({
    title: '',
    description: typeof descr === 'string' ? descr : JSON.stringify(descr),
    status: 'error',
    duration: 10000,
    position: 'bottom-right',
    isClosable: true,
    containerStyle: {
      fontFamily: 'RMNeue-Regular'
    }
  });

export const errTopToast = (descr: string | any) =>
  toast({
    title: '',
    description: typeof descr === 'string' ? descr : JSON.stringify(descr),
    status: 'error',
    duration: 10000,
    position: 'top',
    isClosable: true,
    containerStyle: {
      fontFamily: 'RMNeue-Regular'
    }
  });

export const positiveToast = (descr: string) =>
  toast({
    description: descr,
    status: 'success',
    duration: 10000,
    position: 'bottom-right',
    isClosable: true,
    containerStyle: {
      fontFamily: 'RMNeue-Regular'
    }
  });

export const infoToast = (descr: string | any) =>
  toast({
    title: '',
    description: typeof descr === 'string' ? descr : JSON.stringify(descr),
    status: 'info',
    duration: 10000,
    position: 'bottom-right',
    isClosable: true,
    containerStyle: {
      fontFamily: 'RMNeue-Regular'
    }
  });

export const AttentionBar = ({ description, data_qa = 'attentionBar', centered = false }) => (
  <HStack
    width='100%'
    bg='smRed.100'
    p='1em'
    spacing='1em'
    justifyContent={centered ? 'center' : ''}>
    <Box>
      <ExclamationIcon />
    </Box>
    <Text
      as='span'
      data-qa={data_qa}
      color='smRed.500'
      fontSize='0.95em'
      flex={centered ? '' : '1'}>
      {description}
    </Text>
  </HStack>
);

//michal: let's not use default chakra colours
export const ErrorBanner = ({ text = '', content = null, alignment = "center", mt = "2em" }) => (
  <Flex
    flexDir='column'
    width='100%'
    bg='smRed.100'
    p='1em'
    mt={mt}
    align={alignment}
    justify={alignment}
    alignItems={alignment}>
    <Flex>
      <Box>
        <ExclamationIcon width='1.5em' height='1.5em' />
      </Box>
      {content ? (
        <Box width='100%' color='smRed.500' ml='1em'>
          {content}
        </Box>
      ) : (
        <Text width='100%' color='smRed.500' fontSize='1em' ml='1em'>
          {text}
        </Text>
      )}
    </Flex>
  </Flex>
);

type PaymentWarningBannerProps = {
  accountState: ContractState
}

export function PaymentWarningBanner({ accountState }: PaymentWarningBannerProps) {
  return (
    <HStack zIndex={20} position="sticky" top="62px">
      {accountState === 'past_due' &&
        <WarningBanner
          centered={true}
          content={
            <>
              We’ve had trouble taking payment. Please{' '}
              <Link href='/manage-billing/#update_card'>
                <a style={{ cursor: 'pointer', textDecoration: 'underline' }}>update your card details</a>
              </Link> to avoid disruptions to your account.{' '}
            </>
          } />
      }
      {accountState === 'unpaid' &&
        <ErrorBanner
          mt="0"
          content={
            <>
              We’ve had trouble taking payment. Please{' '}
              <Link href='/manage-billing/#update_card'>
                <a style={{ cursor: 'pointer', textDecoration: 'underline' }}>update your card details</a>
              </Link> to transcribe more files.{' '}
            </>
          } />
      }
    </HStack>
  )
};


export function AccountErrorBox() {
  return <Flex
    flexDir="column"
    width={["70%", "80%", "100%"]}
    bg="smRed.100"
    p={["2em", "2em", "1em"]}
    mt="2em"
    ml={[2, 2, 0]}
    align="center"
    justify="center"
    alignItems="center"
  >
    <VStack color="smRed.500" alignItems='flex-start'>
      <HStack>
        <Box>
          <ExclamationIcon width="1.5em" height="1.5em" />
        </Box>
        <Text fontFamily="RMNeue-Regular" fontSize="1em" ml="1em">
          We were unable to get your account. Many of the app features will be disabled. To fix this problem, you should try:
        </Text>
      </HStack>
      <OrderedList alignItems="center" pl={12}>
        <ListItem>Refreshing the browser</ListItem>
        <ListItem>Logging out and logging back in</ListItem>
        <ListItem>Visiting our <span style={{ textDecorationLine: "underline" }}>
          <Link href="https://docs.speechmatics.com/en/cloud/troubleshooting/">troubleshooting</Link>
        </span> page</ListItem>
        <ListItem>Contacting <span style={{ textDecorationLine: "underline" }}>
          <Link href="https://www.speechmatics.com/about-us/contact">support</Link>
        </span> if all else fails
        </ListItem>
      </OrderedList>
    </VStack>
  </Flex>
}