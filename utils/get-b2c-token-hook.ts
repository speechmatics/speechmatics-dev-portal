import { IPublicClientApplication, SilentRequest } from '@azure/msal-browser';
import { useContext, useEffect, useState } from 'react';
import { AuthenticationResult, InteractionRequiredAuthError } from '@azure/msal-common';
import accountStoreContext from './account-store-context';

export function useB2CToken(msalInstance: IPublicClientApplication) {
  const account = msalInstance.getActiveAccount();
  const [token, setToken] = useState<AuthenticationResult>();
  const [error, setError] = useState<any>();
  const { accountStore, tokenStore } = useContext(accountStoreContext);

  useEffect(() => {
    console.log('acquiring B2CToken', account);
    console.log('tokenStore.authorityToUse', tokenStore.authorityToUse);

    const request = {
      scopes: [],
      account,
      authority: tokenStore.authorityToUse,
    } as SilentRequest;

    msalInstance
      .acquireTokenSilent(request)
      .then((tokenResponse) => {
        setToken(tokenResponse);
        console.log('useB2CToken', { idToken: tokenResponse?.idToken, account });
      })
      .catch(async (error) => {
        console.log('acquireTokenSilent error', error);
        setError(error);
        if (error instanceof InteractionRequiredAuthError) {
          // fallback to interaction when silent call fails
          return msalInstance.acquireTokenPopup(request).then((tokenResponse) => {
            setToken(tokenResponse);
            console.log('useB2CToken', { idToken: tokenResponse?.idToken, account });
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
