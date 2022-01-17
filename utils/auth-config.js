import { LogLevel } from "@azure/msal-browser";

// Config object to be passed to Msal on creation
export const msalConfig = {
  auth: {
      clientId: "69c988f8-a944-44e2-9adf-53346bbee5f0",
      authority: "https://login.microsoftonline.com/common/",
      redirectUri: "http://localhost:3000/",
      postLogoutRedirectUri: "http://localhost:3000/"
  },
  system: {	
      loggerOptions: {	
          loggerCallback: (level, message, containsPii) => {	
              if (containsPii) {		
                  return;		
              }		
              switch (level) {		
                  case LogLevel.Error:		
                      console.error(message);		
                      return;		
                  case LogLevel.Info:		
                      console.info(message);		
                      return;		
                  case LogLevel.Verbose:		
                      console.debug(message);		
                      return;		
                  case LogLevel.Warning:		
                      console.warn(message);		
                      return;		
              }	
          }	
      }	
  }
};

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export const loginRequest = {
  scopes: ["openid", "User.Read"]
};

// Add here the endpoints for MS Graph API services you would like to use.
export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft-ppe.com/v1.0/me"
};
