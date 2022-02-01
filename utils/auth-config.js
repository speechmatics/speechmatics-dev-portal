import { LogLevel } from "@azure/msal-browser";

export const b2cPolicies = {
  names: {
    signUpSignIn: process.env.SIGNUP_SIGNIN_POLICY || "B2C_1_susi",
    forgotPassword: process.env.RESET_PASS_POLICY || "B2C_1_reset",
    editProfile: process.env.EDIT_PROFILE_POLICY || "B2C_1_edit_profile",
  },

  authorityDomain:
    process.env.AUTHORITY_DOMAIN || "testb2cmichalp.b2clogin.com",
  policyDomain: process.env.POLICY_DOMAIN || "testb2cmichalp.onmicrosoft.com",
};

b2cPolicies.authorities = {
  signUpSignIn: {
    authority: `https://${b2cPolicies.authorityDomain}/${b2cPolicies.policyDomain}/B2C_1_susi`,
  },
  forgotPassword: {
    authority: `https://${b2cPolicies.authorityDomain}/${b2cPolicies.policyDomain}/B2C_1_reset`,
  },
  editProfile: {
    authority: `https://${b2cPolicies.authorityDomain}/${b2cPolicies.policyDomain}/B2C_1_edit_profile`,
  },
};

// Config object to be passed to Msal on creation
export const msalConfig = {
  auth: {
    clientId:
      process.env.AUTH_CLIEND_ID || "cc0ee2fd-cf10-4d64-b87c-727e1a130502", // This is the ONLY mandatory field that you need to supply.
    authority: b2cPolicies.authorities.signUpSignIn.authority, // Choose SUSI as your default authority.
    knownAuthorities: [b2cPolicies.authorityDomain], // Mark your B2C tenant's domain as trusted.
    redirectUri: process.env.REDIRECT_URI || "http://localhost:3000/", // You must register this URI on Azure Portal/App Registration. Defaults to window.location.origin
    postLogoutRedirectUri:
      process.env.POST_LOGOUT_REDIRECT_URI || "http://localhost:3000/", // Indicates the page to navigate after logout.
    navigateToLoginRequestUrl: true, // If "true", will navigate back to the original request location before processing the auth code response.
  },
  cache: {
    cacheLocation: "sessionStorage", // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
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
      },
    },
  },
};

//console.log(`msal auth redirectUri ${msalConfig.auth.redirectUri}`);

/**
 * Add here the endpoints and scopes when obtaining an access token for protected web APIs. For more information, see:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
const endpoint = process.env.ENDPOINT;

export const protectedResources = {
  apiHello: {
    endpoint: `${endpoint}/hello`,
    scopes: [`https://${b2cPolicies.policyDomain}/helloapi/demo.read`], // e.g. api://xxxxxx/access_as_user
  },
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit:
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
  scopes: [...protectedResources.apiHello.scopes],
};
