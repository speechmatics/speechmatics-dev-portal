import { EventType, PublicClientApplication } from '@azure/msal-browser';
import { makeAutoObservable, makeObservable } from 'mobx';
import { accountStore, tokenStore } from './account-store-context';
import { msalConfig } from './auth-config';

export const msalInstance = new PublicClientApplication(msalConfig);

// Account selection logic is app dependent. Adjust as needed for different use cases.
const accounts = msalInstance.getAllAccounts();

if (accounts.length > 0) {
  msalInstance.setActiveAccount(accounts[0]);
}

msalInstance.addEventCallback((event) => {
  console.log('msalInstance.addEventCallback', { event });
  if (event.eventType === EventType.LOGIN_SUCCESS && (event.payload as any).account) {
    const account = (event.payload as any).account;
    msalInstance.setActiveAccount(account);
  }
});

export function msalLogout(inactive: boolean = false) {
  const account = msalInstance.getActiveAccount();

  const authority = `https://${process.env.AUTHORITY_DOMAIN}/${process.env.POLICY_DOMAIN}/${
    (account?.idTokenClaims as any)?.acr
  }`;

  accountStore.clear();
  msalInstance.logoutRedirect({
    account: account,
    authority: account ? authority : process.env.SIGNIN_POLICY,
    postLogoutRedirectUri: `${process.env.POST_LOGOUT_REDIRECT_URI}${
      inactive ? '#inactive' : '#logout'
    }`,
  });
}

class MsalStore {
  constructor() {
    makeObservable(this);
  }
}
