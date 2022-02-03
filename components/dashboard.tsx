import { useRouter } from 'next/router';
import Link from 'next/link';
import menuData from '../static_data/menu-data';
import { useEffect, useState } from 'react';
import { SpeechmaticsLogo, ExternalLink, AccountIcon, LogoutIcon } from './Icons';
import { Tooltip, Link as ChakraLink, Button } from '@chakra-ui/react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import TestApiBlock from './call-test';
import { useB2CToken } from '../utils/get-b2c-token-hook';

export default function Dashboard({ children }) {
  const router = useRouter();

  const { instance, accounts, inProgress } = useMsal();

  useEffect(() => {
    let st: number;
    if (inProgress == 'none' && accounts.length == 0) {
      st = window.setTimeout(() => router.push('/login/'), 1000);
    }
    return () => window.clearTimeout(st);
  }, [inProgress, accounts, accounts?.length]);

  const tokenPayload = useB2CToken(instance);

  const account = instance.getActiveAccount();

  if (accounts.length == 0) {
    return <div>not logged in, redirecting...</div>;
  }

  return (
    <div className="dashboard_container">
      <div className="dashboard_sidenav">
        <SpeechmaticsLogo w={250} h={130} />
        <div className="hi_name">Hi, {account.name || account.username}!</div>
        <div className="nav_menu">
          {menuData.map((item) => (
            <MenuElem item={item} key={item.path} selected={router.asPath == item.path} />
          ))}
        </div>

        <TestApiBlock tokenPayload={tokenPayload} />
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
          <span style={{ cursor: 'pointer' }} onClick={() => instance.logoutRedirect()}>
            <LogoutIcon w={30} h={30} />
          </span>
        </Tooltip>
      </div>
    </div>
  );
}

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
