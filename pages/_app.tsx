import '../styles/reset.css';
import '../styles/main.css';
import '../styles/landing.css';
import '../styles/login.css';
import '../styles/dashboard.css';
import { useRouter } from 'next/router';
import { MsalProvider } from '@azure/msal-react';
import { CustomNavigationClient } from '../utils/navigation-client';
import { ChakraProvider } from '@chakra-ui/react';
import { PublicClientApplication, EventType } from '@azure/msal-browser';
import { msalConfig } from '../utils/auth-config';
import theme from '../static_data/theme';
import AccountContext, { accountStore, tokenStore } from '../utils/account-store-context';
import Head from 'next/head';
import Image from 'next/image'


export const msalInstance = new PublicClientApplication(msalConfig);

// console.log('msalInstance', msalConfig);

// Account selection logic is app dependent. Adjust as needed for different use cases.
const accounts = msalInstance.getAllAccounts();
if (accounts.length > 0) {
  msalInstance.setActiveAccount(accounts[0]);
}

msalInstance.addEventCallback((event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && (event.payload as any).account) {
    const account = (event.payload as any).account;
    msalInstance.setActiveAccount(account);
  }
});

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const navigationClient = new CustomNavigationClient(router);
  msalInstance.setNavigationClient(navigationClient);

  return (
    <AccountContext.Provider value={{ accountStore, tokenStore }}>
      <ChakraProvider resetCSS={true} theme={theme}>
        <MsalProvider instance={msalInstance}>
          <div className="all_container">
            <div className='header'>
              <Image
                src="/assets/speechmatics-logo.svg"
                alt="Speechmatics Logo"
                width={208}
                height={20}
              />
              <div className='profile'>
                michaelalmond@live.co.uk <span className='arrow'>></span>
                <div className='profile_dropdown absolute bg-speech-navy w-full'>
                  <ul>
                    <li>Profile</li>
                    <li>Logout</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="content">
              <Head>
                <title>Speechmatics Portal</title>
              </Head>
              <Component {...pageProps} />
            </div>
            <div className="footer"></div>
          </div>
        </MsalProvider>
      </ChakraProvider>
    </AccountContext.Provider>
  );
}
