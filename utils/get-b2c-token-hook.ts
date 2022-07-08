import { IPublicClientApplication, SilentRequest } from '@azure/msal-browser';
import { useContext, useEffect, useState } from 'react';
import { AuthenticationResult, InteractionRequiredAuthError } from '@azure/msal-common';
import accountStoreContext from './account-store-context';
import { msalLogout } from './msal-utils';

export function useB2CToken(msalInstance: IPublicClientApplication) {
  const account = msalInstance.getActiveAccount();
  const [token, setToken] = useState<AuthenticationResult>();
  const [error, setError] = useState<any>();
  const { accountStore, tokenStore } = useContext(accountStoreContext);
  const activity_timeout: number = parseInt(process.env.INACTIVITY_TIMEOUT) || 1;

  useEffect(() => {
    const authority = `https://${process.env.AUTHORITY_DOMAIN}/${process.env.POLICY_DOMAIN}/${
      (account?.idTokenClaims as any)?.acr
    }`;

    const request = {
      scopes: [process.env.DEFAULT_B2C_SCOPE],
      account,
      authority: account ? authority : process.env.SIGNIN_POLICY,
      extraQueryParameters: { id_token_hint: accountStore.userHint },
      forceRefresh: false,
    } as SilentRequest;

    const currentTime = new Date()
    if (currentTime.getTime() - tokenStore?.lastActive?.getTime() > activity_timeout*60*1000) {
      msalLogout(true)
      return
    }
    tokenStore.lastActive = currentTime
    msalInstance
      .acquireTokenSilent(request)
      .then((tokenResponse) => {
        setToken(tokenResponse);
      })
      .catch(async (error) => {
        setError(error);
        if (error instanceof InteractionRequiredAuthError) {
          // fallback to interaction when silent call fails
          return msalInstance.acquireTokenPopup(request).then((tokenResponse) => {
            setToken(tokenResponse);
          });
        }
      })
      .catch((error) => {
        setError(error);
        msalInstance.acquireTokenRedirect(request);
      });
  }, [msalInstance]);

  return { token, error };
}
