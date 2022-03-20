import { useRouter } from 'next/router';
import Link from 'next/link';
import menuData from '../static_data/menu-data';
import { useContext, useEffect, useState } from 'react';
import { AccountIcon, LogoutIcon, SpeechmaticsLogoHorizontalWhite } from './Icons';
import {
  Tooltip,
  Link as ChakraLink,
  Box,
  useDisclosure,
  Spinner,
  Text,
  Divider,
  HStack,
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
import { SmPanel } from './common';
import { motion } from 'framer-motion';

const animationVariants = {
  hidden: { opacity: 0, x: -40, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: -100 },
};

export default observer(function Dashboard({ children }) {
  const router = useRouter();

  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
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
    if (val) onModalOpen();
  };

  useEffect(() => {
    if (!accountStore.account && isAuthenticated && tokenPayload?.idToken) {
      tokenStore.setTokenPayload(tokenPayload);
      accountStore.accountsFetchFlow(tokenPayload.idToken, isSettingUpAccount)
        .then((resp) => {
          accountStore.assignServerState(resp);
          onModalClose();
        })
        .catch(console.error);
    }
  }, [isAuthenticated, tokenPayload?.idToken]);

  const account = instance.getActiveAccount();

  const logout = () => {
    accountStore.clear();
    instance.logoutRedirect({ account: account });
  };

  if (!isAuthenticated) {
    return <>not logged in</>;
  }

  return (
    <div className="dashboard_container">
      <UserCreationModal isModalOpen={isModalOpen} onModalClose={onModalClose} />
      <HeaderBar logout={logout} accountEmail={account.username} />
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

function HeaderBar({ logout, accountEmail }) {
  return (
    <Box className="header_bar">
      <Box p="0.5em 0em 0.5em 2em">
        <SpeechmaticsLogoHorizontalWhite w={200} h={50} />
      </Box>
      <Box>
        <RightSidePanel logout={logout} accountEmail={accountEmail} />
      </Box>
    </Box>
  );
}

function Menu() {
  const router = useRouter();
  return (
    <div className="nav_menu">
      {menuData.map((item) => (
        <MenuElem item={item} key={item.path} selected={router.asPath == item.path} />
      ))}
    </div>
  );
}

function MenuElem({ item, selected }) {
  return (
    <Link href={item.path}>
      <div className={`menu_elem ${selected ? 'selected' : ''}`}>
        <div>
          {item.icon({
            color: selected ? 'var(--chakra-colors-smBlue-500)' : 'var(--chakra-colors-smNavy-400)',
          })}
        </div>
        <div>{item.title}</div>
      </div>
    </Link>
  );
}

function NotLoggedin() {
  const router = useRouter();

  useEffect(() => {
    let st: number;
    st = window.setTimeout(() => router.push('/login/'), 2000);
    window.clearTimeout(st);
    return () => window.clearTimeout(st);
  });

  return (
    <Box
      style={{
        width: '100%',
        height: '100%',
        paddingTop: '100px',
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
        flex: '1 1 auto',
        backgroundColor: 'var(--chakra-colors-smNavy-200)',
      }}
    >
      <Box p="2em">You're not logged in, attempting to redirect you automatically...</Box>
      <Box p="2em">
        You can also use{' '}
        <Link href="/login/">
          <a>the link</a>
        </Link>
        .
      </Box>
    </Box>
  );
}

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

function RightSidePanel({ logout, accountEmail }) {
  return (
    <Box className="dashboard_side_bar">
      <HStack>
        <Link href="https://docs.speechmatics.com">
          <a target="_blank">
            <Text
              color="#DFE0E3"
              pr="1em"
              mt="-3px"
              fontFamily="RMNeue-Regular"
              _hover={{ color: '#F8FAFD' }}
            >
              Documentation
            </Text>
          </a>
        </Link>

        <Divider orientation="vertical" color="#5E6673" pr="1.5em" height="295%" />
      </HStack>
      <Link href="/account/" passHref>
        <ChakraLink>
          <Tooltip label="Account" placement="bottom">
            <div style={{ cursor: 'pointer', display: 'flex' }}>
              <Text
                whiteSpace="nowrap"
                color="#DFE0E3"
                mr="1em"
                mt="-3px"
                fontFamily="RMNeue-Regular"
                _hover={{ color: '#F8FAFD' }}
              >
                {accountEmail}
              </Text>
              <AccountIcon w={20} h={20} color="#DFE0E3" />
            </div>
          </Tooltip>
        </ChakraLink>
      </Link>
      <Tooltip label="Log out" placement="bottom">
        <span
          style={{ cursor: 'pointer', marginLeft: '1em' }}
          data-qa="logout"
          onClick={() => logout()}
        >
          <LogoutIcon w={20} h={20} color="#DFE0E3" />
        </span>
      </Tooltip>
    </Box>
  );
}
