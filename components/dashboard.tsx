import { useRouter } from 'next/router';
import Link from 'next/link';
import menuData from '../static_data/menu-data';
import { useContext, useEffect, useState } from 'react';
import { SpeechmaticsLogo, ExternalLink, AccountIcon, LogoutIcon } from './Icons';
import { Tooltip, Link as ChakraLink, Button, Box, useDisclosure, Spinner } from '@chakra-ui/react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import TestApiBlock from './call-test';
import { useB2CToken } from '../utils/get-b2c-token-hook';
import accountContext from '../utils/account-store-context';
import { accountsFlow } from '../utils/call-api';
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

export default observer(function Dashboard({ children }) {
  const router = useRouter();

  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure({ isOpen: false });

  const { instance, accounts, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    let st: number;
    if (inProgress == 'none' && !isAuthenticated) {
      st = window.setTimeout(() => router.push('/login/'), 1000);
    }
    return () => window.clearTimeout(st);
  }, [isAuthenticated]);

  const { accountStore, tokenStore } = useContext(accountContext);

  const tokenPayload = useB2CToken(instance);

  const isSettingUpAccount = (val: boolean) => {
    if (val) onModalOpen();
    //else onModalClose();
  };

  useEffect(() => {
    console.log('Dashboard effect accountFlow', accountStore.account, isAuthenticated);
    if (!accountStore.account && isAuthenticated && tokenPayload?.idToken) {
      tokenStore.setTokenPayload(tokenPayload);
      accountsFlow(tokenPayload.idToken, isSettingUpAccount)
        .then((resp) => {
          accountStore.assignServerState(resp);
          onModalClose();
        })
        .catch(console.error);
    }
  }, [isAuthenticated, tokenPayload?.idToken]);

  const [showTestTools, setShowTestTools] = useState(false);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    setShowTestTools(event.ctrlKey);
  };

  const account = instance.getActiveAccount();

  const logout = () => {
    accountStore.clear();
    instance.logoutRedirect({ account: account });
  };

  if (!isAuthenticated) {
    return <NotLoggedin />;
  }

  return (
    <div className="dashboard_container" onKeyDown={onKeyDown} tabIndex={0}>
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
      <div className="dashboard_sidenav">
        <Box marginTop="0.5em">
          <SpeechmaticsLogo w={230} h={120} />
        </Box>
        <div className="hi_name">Hi, {account.name || account.username}!</div>
        <div className="nav_menu">
          {menuData.map((item) => (
            <MenuElem item={item} key={item.path} selected={router.asPath == item.path} />
          ))}
        </div>

        {showTestTools && <TestApiBlock tokenPayload={tokenPayload} />}
      </div>
      <div className="dashboard_content">{children}</div>
      <div className="dashboard_side_bar">
        <Link href="/account/" passHref>
          <ChakraLink>
            <Tooltip label="Account" placement="left">
              <div style={{ cursor: 'pointer' }}>
                <AccountIcon w={30} h={30} />
              </div>
            </Tooltip>
          </ChakraLink>
        </Link>
        <Tooltip label="Log out" placement="left">
          <span style={{ cursor: 'pointer' }} onClick={() => logout()}>
            <LogoutIcon w={30} h={30} />
          </span>
        </Tooltip>
      </div>
    </div>
  );
});

function MenuElem({ item, selected }) {
  return (
    <Link href={item.path}>
      <div className={`menu_elem ${selected ? 'selected' : ''}`}>
        <div>{item.icon({})}</div>
        <div>{item.title}</div>
      </div>
    </Link>
  );
}

function NotLoggedin() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
      }}
    >
      not logged in, redirecting...
    </div>
  );
}
