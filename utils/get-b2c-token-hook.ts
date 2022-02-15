import { IPublicClientApplication } from '@azure/msal-browser';
import { useEffect, useState } from 'react';
import { AuthenticationResult, InteractionRequiredAuthError } from '@azure/msal-common';
import { defaultB2CScope } from '../utils/auth-config';

export function useB2CToken(msalInstance: IPublicClientApplication) {
  const account = msalInstance.getActiveAccount();
  const [token, setToken] = useState<AuthenticationResult>();

  console.log('useB2CToken', { idToken: token?.idToken, account });

  useEffect(() => {
    console.log('acquiring B2CToken');

    const request = {
      scopes: [...defaultB2CScope],
      account,
    };

    msalInstance
      .acquireTokenSilent(request)
      .then((tokenResponse) => {
        setToken(tokenResponse);
      })
      .catch(async (error) => {
        console.log('acquireTokenSilent error', error);
        if (error instanceof InteractionRequiredAuthError) {
          // fallback to interaction when silent call fails
          return msalInstance.acquireTokenPopup(request).then((tokenResponse) => {
            setToken(tokenResponse);
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [msalInstance]);

  return token;
}
