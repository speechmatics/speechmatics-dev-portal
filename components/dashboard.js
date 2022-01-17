import { useRouter } from 'next/router'
import Link from 'next/link';
import menuData from '../static_data/menu-data'
import { useContext, useEffect } from 'react';
import { LoginContext } from '../utils/login-context';
import { SpeechmaticsLogo, ExternalLink, AccountIcon, LogoutIcon } from '../components/Icons';
import { Tooltip, Link as ChakraLink } from '@chakra-ui/react';
import { useMsal } from "@azure/msal-react";


export default function Dashboard({ children }) {

  const router = useRouter();

  const { instance, accounts, inProgress } = useMsal();

  if (accounts.length == 0) return <div>not logged in, go to <Link href='/login/'>login</Link></div>

  return <div className="dashboard_container">
    <div className="dashboard_sidenav">
      <SpeechmaticsLogo w={250} h={130} />
      <div className='hi_name'>Hi, {"placeholder"}!</div>
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
      <Link href='/login/'>
        <ChakraLink>
          <Tooltip label='Log out' placement="left">
            <div style={{ cursor: 'pointer' }}><LogoutIcon w={30} h={30} /></div>
          </Tooltip>
        </ChakraLink>
      </Link>
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


