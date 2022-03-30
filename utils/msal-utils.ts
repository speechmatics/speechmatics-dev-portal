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
    postLogoutRedirectUri: `${process.env.POST_LOGOUT_REDIRECT_URI}${
      inactive ? '#inactive' : '#logout'
    }`,
  });
}
