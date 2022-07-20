import { useRouter } from 'next/router';
import Link from 'next/link';
import { useCallback, useContext, useEffect } from 'react';
import { Box, useDisclosure, Spinner, Button, VStack, useBreakpointValue } from '@chakra-ui/react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { useB2CToken } from '../utils/get-b2c-token-hook';
import accountContext from '../utils/account-store-context';
import { observer } from 'mobx-react-lite';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  HStack
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { msalLogout } from '../utils/msal-utils';
import { ExclamationIconLarge, SpeechmaticsLogo } from './icons-library';
import { HeaderBar } from './header';
import { MenuContainer } from './side-menu';
import useInactiveLogout from '../utils/inactive-hook'
import { PaymentWarningBanner, AccountErrorBox } from './common'
import { callStore } from '../utils/call-api';
import { getCookieConsentValue } from "react-cookie-consent";
import { dataDogRum } from '../utils/analytics';
import { SmCookiesConsent } from './cookies-consent';

const animationVariants = {
  hidden: { opacity: 0, x: -40, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: -100 }
};

export default observer(function Dashboard({ children }) {
  const router = useRouter();

  const redirectUrl = router.route;

  const {
    isOpen: isUserCreationModalOpen,
    onOpen: onUserCreationModalOpen,
    onClose: onUserCreationModalClose
  } = useDisclosure();

  const { instance, inProgress } = useMsal();

  const isAuthenticated = useIsAuthenticated();

  const breakVal = useBreakpointValue({ base: true, md: false })

  useInactiveLogout()



  useEffect(() => {
    let st: number;
    if (!isAuthenticated) {
      st = window.setTimeout(() => router.push(`/login/?returnUrl=${redirectUrl}`), 2000);
    }
    return () => window.clearTimeout(st);
  }, [isAuthenticated]);

  const { accountStore, tokenStore } = useContext(accountContext);

  const { error: b2cError } = useB2CToken(instance);

  useEffect(() => {
    let st: number;
    if (!!b2cError) {
      st = window.setTimeout(() => router.push(`/login/?returnUrl=${redirectUrl}`), 2000);
    }
    return () => window.clearTimeout(st);
  }, [b2cError]);

  const isSettingUpAccount = (val: boolean) => {
    console.log('isSettingUpAccount', val);
    if (val) onUserCreationModalOpen();
  };

  useEffect(() => {
    if (
      !accountStore.requestSent &&
      !accountStore.account &&
      isAuthenticated
    ) {
      tokenStore.lastActive = new Date();
      accountStore
        .accountsFetchFlow(isSettingUpAccount)
        .then((resp) => {
          accountStore.assignServerState(resp);
        })
        .catch(err => {
          console.error("dashboard accountStore catch", err)
        })
        .finally(() => {
          onUserCreationModalClose();
        });
    }
  }, [isAuthenticated]);

  const account = instance.getActiveAccount();

  const logout = useCallback(() => {
    msalLogout();
  }, []);

  useEffect(() => {
    if (getCookieConsentValue() === 'true') dataDogRum.dataDogInit();
  }, [getCookieConsentValue()])

  const onAcceptCookies = useCallback(() => {
    dataDogRum.dataDogInit();
  }, [])


  return (
    <Box className='dashboard_container'>
      <SmCookiesConsent onAccept={onAcceptCookies} />

      <UserNotAuthModal isModalOpen={!isAuthenticated && inProgress != 'logout'} returnUrl={redirectUrl} />
      <UserCreationModal
        isModalOpen={isUserCreationModalOpen}
        onModalClose={onUserCreationModalClose}
      />
      <ErrorModal isModalOpen={callStore.has500Error} errorTitle='Something went wrong.'
        errorDescription="Please, try again in few minutes."
        buttonLabel='Try again' buttonCallback={() => { window.location.reload() }} />

      <ErrorModal isModalOpen={callStore.hasConnectionError} errorTitle='Connection problem.'
        errorDescription="Please check your internet connection."
        buttonLabel='Try again' buttonCallback={() => { window.location.reload() }} />

      <HeaderBar logout={logout} accountEmail={(account?.idTokenClaims as any)?.email} />
      <PaymentWarningBanner accountState={accountStore.accountState} />

      <Box className='dashboard' tabIndex={0}>

        <Box className='dashboard_content' flexDirection={breakVal ? 'column' : 'row'}>
          <MenuContainer />

          <Box className='dashboard_padding'>
            <motion.main
              variants={animationVariants} // Pass the variant object into Framer Motion
              initial='hidden' // Set the initial state to variants.hidden
              animate='enter' // Animated state to variants.enter
              exit='exit' // Exit state (used later) to variants.exit
              transition={{ type: 'tween', ease: 'easeOut', duration: 0.2 }} // Set the transition to linear
            >
              {accountStore.responseError && <AccountErrorBox />}
              {children}
            </motion.main>
          </Box>
        </Box>
      </Box>
    </Box>
  );
});

function UserCreationModal({ isModalOpen, onModalClose }) {
  return (
    <Modal isOpen={isModalOpen} onClose={onModalClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent borderRadius='2px'>
        <ModalHeader fontFamily='RMNeue-Bold'>Please wait...</ModalHeader>
        <ModalBody textAlign={'center'} data-qa={'user-creation-modal'}>
          Setting up the Account <Spinner ml={2} size='sm' />
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}

function UserNotAuthModal({ isModalOpen, returnUrl }) {
  return (
    <Modal isOpen={isModalOpen} onClose={() => { }} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <VStack>
            <SpeechmaticsLogo width={160} height={100} />
            <Box>Your session expired. </Box>
            <Box>You'll be redirected to login page.</Box>
            <Box>If the redirect won't work you can use this link: </Box>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Link href={`/login/?returnUrl=${returnUrl}`}>
            <Button variant='speechmatics'>Go to Login</Button>
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}


function ErrorModal({ isModalOpen, errorTitle, errorDescription, buttonLabel, buttonCallback }) {
  return (
    <Modal isOpen={isModalOpen} onClose={() => { }} closeOnOverlayClick={false} size='2xl'>
      <ModalOverlay className='blurOverlay' bgColor='#fff5' />
      <ModalContent borderRadius='sm' bg='smRed.500'>
        <ModalBody color='smWhite.500' >
          <HStack py={4} width='100%' justifyContent='space-between'>
            <HStack spacing={4}>
              <Box>
                <ExclamationIconLarge color='var(--chakra-colors-smWhite-500)' />
              </Box>
              <VStack alignItems='flex-start' spacing={0}>
                <Box fontSize='xl' fontWeight='bold'>{errorTitle}</Box>
                <Box fontSize='sm'>{errorDescription}</Box>
              </VStack>
            </HStack>
            <Button variant='speechmaticsWhite' onClick={buttonCallback}>
              {buttonLabel}
            </Button>
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}




