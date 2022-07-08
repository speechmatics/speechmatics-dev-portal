import { EventType, PublicClientApplication } from '@azure/msal-browser';
import { makeAutoObservable, makeObservable } from 'mobx';
import { accountStore, tokenStore, acquireTokenFlow } from './account-store-context';
import { runtimeAuthFlow } from './runtime-auth-flow';
import { msalConfig } from './auth-config';

export const msalInstance = new PublicClientApplication(msalConfig);

// Account selection logic is app dependent. Adjust as needed for different use cases.
const accounts = msalInstance.getAllAccounts();

if (accounts.length > 0) {
  msalInstance.setActiveAccount(accounts[0]);
}

msalInstance.addEventCallback((event) => {
  console.log('msalInstance.addEventCallback', { event });
  if (event.eventType === EventType.LOGIN_FAILURE)
    tokenStore.loginFailureError = event?.error?.message?.includes('AADB2C90208');

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
  runtimeAuthFlow.reset();
  accountStore.clear();
  msalInstance.logoutRedirect({
    account: account,
    authority: account ? authority : process.env.SIGNIN_POLICY,
    postLogoutRedirectUri: `${process.env.POST_LOGOUT_REDIRECT_URI}${
      inactive ? '#inactive' : '#logout'
    }`
  });
}

export async function msalRefresh(): Promise<string> {
  const activity_timeout: number = parseInt(process.env.INACTIVITY_TIMEOUT) || 1;
  console.log('activity_timeout')
  // check if they've been inactive for more than 15 mins
  const currentTime = new Date()
  if (currentTime.getTime() - tokenStore.lastActive.getTime() > activity_timeout*60*1000) {
    msalLogout(true);
    return '';
  }
  tokenStore.lastActive = currentTime;
  const account = msalInstance.getActiveAccount();
  return acquireTokenFlow(msalInstance, account).then(response => {
    if (!!response) {
      tokenStore.tokenPayload = response
      return response.idToken
    } else {
      throw null
    }
  })
  .catch(error => {
    msalLogout(true)
    return ''
  })
}

class MsalStore {
  constructor() {
    makeObservable(this);
  }
}
