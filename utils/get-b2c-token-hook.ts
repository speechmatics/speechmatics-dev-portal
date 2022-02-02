import { IPublicClientApplication } from "@azure/msal-browser";
import { useEffect, useState } from "react";
import {
  AuthenticationResult,
  InteractionRequiredAuthError,
} from "@azure/msal-common";
import { protectedResources } from "../utils/auth-config";

export default function useB2CToken(msalInstance: IPublicClientApplication) {
  const account = msalInstance.getActiveAccount();

  const [token, setToken] = useState<AuthenticationResult>();

  useEffect(() => {
    const request = {
      scopes: [...protectedResources.apiHello.scopes],
      account,
    };

    msalInstance
      .acquireTokenSilent(request)
      .then((tokenResponse) => {
        setToken(tokenResponse);
      })
      .catch(async (error) => {
        if (error instanceof InteractionRequiredAuthError) {
          // fallback to interaction when silent call fails
          return msalInstance.acquireTokenPopup(request);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [msalInstance]);

  return token;
}
