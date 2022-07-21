import '../styles/reset.css';
import '../styles/fonts.css';
import '../styles/main.css';
import '../styles/login.css';
import '../styles/dashboard.css';
import '../styles/components-styles.css';
import '../styles/animate.css'
import { Router, useRouter } from 'next/router';
import { MsalProvider } from '@azure/msal-react';
import { CustomNavigationClient } from '../utils/navigation-client';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../static_data/theme';
import AccountContext, { accountStore, tokenStore } from '../utils/account-store-context';
import Head from 'next/head';
import { msalInstance } from '../utils/msal-utils';
import { trackPageview } from '../utils/analytics';

Router.events.on('routeChangeComplete', (url) => {
  trackPageview(url);
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
          <Head>
            <title>Speechmatics Portal</title>
            <meta
              name='viewport'
              content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
            />
          </Head>
          <div className='all_container'>
            <div className='content'>
              <Component {...pageProps} />
            </div>
            {/* <div className="footer"></div> */}
          </div>
        </MsalProvider>
      </ChakraProvider>
    </AccountContext.Provider>
  );
}
