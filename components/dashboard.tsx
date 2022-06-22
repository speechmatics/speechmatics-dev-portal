import { useRouter } from 'next/router';
import Link from 'next/link';
import { useContext, useEffect } from 'react';
import { Box, useDisclosure, Spinner, Button, VStack } from '@chakra-ui/react';
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
  ModalBody
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { msalLogout } from '../utils/msal-utils';
import { SpeechmaticsLogo } from './icons-library';
import { HeaderBar } from './header';
import { MenuContainer } from './side-menu';

const animationVariants = {
  hidden: { opacity: 0, x: -40, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: -100 }
};

export default observer(function Dashboard({ children }) {
  const router = useRouter();

  const {
    isOpen: isUserCreationModalOpen,
    onOpen: onUserCreationModalOpen,
    onClose: onUserCreationModalClose
  } = useDisclosure();

  const { instance, inProgress } = useMsal();

  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    let st: number;
    if (!isAuthenticated) {
      st = window.setTimeout(() => router.push('/login/'), 2000);
    }
    return () => window.clearTimeout(st);
  }, [isAuthenticated]);

  const { accountStore, tokenStore } = useContext(accountContext);

  const { token: tokenPayload, error: b2cError } = useB2CToken(instance);

  useEffect(() => {
    let st: number;
    if (!!b2cError) {
      st = window.setTimeout(() => router.push('/login/'), 2000);
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
      isAuthenticated &&
      tokenPayload?.idToken
    ) {
      tokenStore.setTokenPayload(tokenPayload);
      accountStore
        .accountsFetchFlow(tokenPayload.idToken, isSettingUpAccount)
        .then((resp) => {
          accountStore.assignServerState(resp);
          onUserCreationModalClose();
        })
        .catch(err => console.error("dashboard accountStore catch", err));
    }
  }, [isAuthenticated, tokenPayload?.idToken]);

  const account = instance.getActiveAccount();

  const logout = () => {
    msalLogout();
  };

  return (
    <Box className='dashboard_container'>
      <UserNotAuthModal isModalOpen={!isAuthenticated && inProgress != 'logout'} />
      <UserCreationModal
        isModalOpen={isUserCreationModalOpen}
        onModalClose={onUserCreationModalClose}
      />
      <HeaderBar logout={logout} accountEmail={(account?.idTokenClaims as any)?.email} />
      <Box className='dashboard' tabIndex={0}>
        <MenuContainer />
        <Box className='dashboard_content'>
          <motion.main
            variants={animationVariants} // Pass the variant object into Framer Motion
            initial='hidden' // Set the initial state to variants.hidden
            animate='enter' // Animated state to variants.enter
            exit='exit' // Exit state (used later) to variants.exit
            transition={{ type: 'tween', ease: 'easeOut', duration: 0.2 }} // Set the transition to linear
          >
            {children}
          </motion.main>
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

function UserNotAuthModal({ isModalOpen }) {
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
          <Link href='/login'>
            <Button variant='speechmatics'>Go to Login</Button>
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
