import '../styles/reset.css';
import '../styles/main.css';
import '../styles/landing.css';
import '../styles/login.css';
import '../styles/dashboard.css';
import { useRouter } from 'next/router';
import { MsalProvider } from '@azure/msal-react';
import { CustomNavigationClient } from '../utils/navigation-client';

import { PublicClientApplication, EventType } from '@azure/msal-browser';
import { msalConfig } from '../utils/auth-config';

export const msalInstance = new PublicClientApplication(msalConfig);

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
    <MsalProvider instance={msalInstance}>
      <div className="all_container">
        <div className="header"></div>
        <div className="content">
          <Component {...pageProps} />
        </div>
        <div className="footer"></div>
      </div>
    </MsalProvider>
  );
}
