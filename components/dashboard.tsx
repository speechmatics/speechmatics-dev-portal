import { useRouter } from 'next/router';
import Link from 'next/link';
import menuData from '../static_data/menu-data';
import { useContext, useEffect, useState } from 'react';

import {
  Tooltip,
  Link as ChakraLink,
  Box,
  useDisclosure,
  Spinner,
  Text,
  Divider,
  HStack,
  Button,
  Flex,
} from '@chakra-ui/react';
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
  ModalCloseButton,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { msalLogout } from '../utils/msal-utils';
import { SpeechmaticsLogoHorizontalWhite, SpeechmaticsLogo, AccountIcon, LogoutIcon } from './icons-library';
import { HeaderBar } from './header';
import { Menu } from './side-menu';

const animationVariants = {
  hidden: { opacity: 0, x: -40, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: -100 },
};

export default observer(function Dashboard({ children }) {
  const router = useRouter();

  const {
    isOpen: isUserCreationModalOpen,
    onOpen: onUserCreationModalOpen,
    onClose: onUserCreationModalClose,
  } = useDisclosure({ isOpen: false });

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
    if (val) onUserCreationModalOpen();
  };

  useEffect(() => {
    if (!accountStore.account && isAuthenticated && tokenPayload?.idToken) {
      tokenStore.setTokenPayload(tokenPayload);
      accountStore
        .accountsFetchFlow(tokenPayload.idToken, isSettingUpAccount)
        .then((resp) => {
          accountStore.assignServerState(resp);
          onUserCreationModalClose();
        })
        .catch(console.error);
    }
  }, [isAuthenticated, tokenPayload?.idToken]);

  const account = instance.getActiveAccount();

  const logout = () => {
    msalLogout();
  };

  return (
    <div className="dashboard_container">
      <UserNotAuthModal isModalOpen={!isAuthenticated && inProgress != 'logout'} />
      <UserCreationModal
        isModalOpen={isUserCreationModalOpen}
        onModalClose={onUserCreationModalClose}
      />
      <HeaderBar logout={logout} accountEmail={(account?.idTokenClaims as any)?.email} />
      <div className="dashboard_contents" tabIndex={0}>
        <div className="dashboard_sidenav">
          <Menu />
        </div>
        <div className="dashboard_content">
          <motion.main
            variants={animationVariants} // Pass the variant object into Framer Motion
            initial="hidden" // Set the initial state to variants.hidden
            animate="enter" // Animated state to variants.enter
            exit="exit" // Exit state (used later) to variants.exit
            transition={{ type: 'tween', ease: 'easeOut', duration: 0.2 }} // Set the transition to linear
            style={{ width: '100%' }}
          >
            {children}
          </motion.main>
        </div>
      </div>
    </div>
  );
});





function UserCreationModal({ isModalOpen, onModalClose }) {
  return (
    <Modal isOpen={isModalOpen} onClose={onModalClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Just one or two seconds more...</ModalHeader>
        <ModalBody textAlign={'center'}>
          Setting up the account for You! <Spinner ml={2} />
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
        <ModalBody textAlign={'center'}>
          <SpeechmaticsLogo w={160} h={100} />
          <Box>Your session expired. </Box>
          <Box>You'll be redirected to login page.</Box>
          <Box>If the redirect won't work you can use this link: </Box>
        </ModalBody>
        <ModalFooter>
          <Link href="/login">
            <Button variant="speechmatics">Go to Login</Button>
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}