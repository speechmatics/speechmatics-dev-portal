import { PublicClientApplication } from '@azure/msal-browser';
import { accountStore } from './account-store-context';
import { msalConfig } from './auth-config';

export const msalInstance = new PublicClientApplication(msalConfig);

export function msalLogout() {
  const account = msalInstance.getActiveAccount();
  accountStore.clear();
  msalInstance.logoutRedirect({ account: account });
}
