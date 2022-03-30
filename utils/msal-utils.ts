import { PublicClientApplication } from '@azure/msal-browser';
import { accountStore, tokenStore } from './account-store-context';
import { msalConfig } from './auth-config';

export const msalInstance = new PublicClientApplication(msalConfig);

export function msalLogout(inactive: boolean = false) {
  const account = msalInstance.getActiveAccount();
  accountStore.clear();
  msalInstance.logoutRedirect({
    account: account,
    authority: tokenStore.authorityToUse,
    ...(inactive ? { postLogoutRedirectUri: '/login/?inactive=true' } : null),
  });
}
