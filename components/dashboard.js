import { useRouter } from 'next/router'
import Link from 'next/link';
import menuData from '../static_data/menu-data'
import { useContext, useEffect, useState } from 'react';
import { SpeechmaticsLogo, ExternalLink, AccountIcon, LogoutIcon } from '../components/Icons';
import { Tooltip, Link as ChakraLink, Button } from '@chakra-ui/react';
import { useMsal } from "@azure/msal-react";
import { InteractionRequiredAuthError } from "@azure/msal-common";


export default function Dashboard({ children }) {

  const router = useRouter();

  const { instance, accounts, inProgress } = useMsal();

  if (accounts.length == 0) return <div>not logged in, go to <Link href='/login/'>login</Link></div>

  const account = instance.getActiveAccount();

  const [token, setToken] = useState();
  const [response, setResponse] = useState();

  useEffect(() => {
    const request = {
      scopes: ["Mail.Read"],
      account
    };

    instance.acquireTokenSilent(request).then(tokenResponse => {
      setToken(tokenResponse)
    }).catch(async (error) => {
      if (error instanceof InteractionRequiredAuthError) {
        // fallback to interaction when silent call fails
        return instance.acquireTokenPopup(request);
      }
    }).catch(error => {
      console.error(error);
    });

  }, [instance]);

  useEffect(() => {
    if (token) {
      console.log({token});
      callApiWithToken(token.accessToken, 'https://testapp-mipo.azurewebsites.net/hello').then(setResponse)
    }

  }, [token])


  return <div className="dashboard_container">
    <div className="dashboard_sidenav">
      <SpeechmaticsLogo w={250} h={130} />
      <div className='hi_name'>Hi, {account.name || account.username}!<br />{response}</div>
      <div className='nav_menu'>
        {menuData.map((item) => <MenuElem item={item} key={item.path}
          selected={router.asPath == item.path} />)}
      </div>
      <Link href='/faq/'>
        <div className='open_docs_button'>
          <span>See FAQs</span>
        </div>
      </Link>
    </div>
    <div className="dashboard_content">
      {children}
    </div>
    <div className="dashboard_side_bar">
      <Link href='/account/' passHref>
        <ChakraLink>
          <Tooltip label='Account' placement="left">
            <div style={{ cursor: 'pointer' }}><AccountIcon w={30} h={30} /></div>
          </Tooltip>
        </ChakraLink>
      </Link>
      <Tooltip label='Log out' placement="left">
        <span style={{ cursor: 'pointer' }} onClick={() => instance.logoutRedirect()}>
          <LogoutIcon w={30} h={30} />
        </span>
      </Tooltip>
    </div>
  </div >
}

// onClick={loginContext.clear()}


function MenuElem({ item, selected }) {
  return <Link href={item.path}><div className={`menu_elem ${selected ? 'selected' : ''}`}>
    <div>{item.icon({})}</div>
    <div>{item.title}</div>
  </div></Link>
}




export const callApiWithToken = async (accessToken, apiEndpoint) => {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append("Authorization", bearer);

  const options = {
    method: "GET",
    headers: headers
  };

  return fetch(apiEndpoint, options)
    .then(response => response.json())
    .catch(error => console.log(error));
}