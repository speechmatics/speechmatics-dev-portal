// const withTM = require("next-transpile-modules");
// const withPlugins = require("next-compose-plugins");

module.exports = {
  trailingSlash: true,
  env: {
    TEST_IF_WORKS_ENV_VAR: process.env.TEST_IF_WORKS_ENV_VAR,
    REDIRECT_URI: process.env.REDIRECT_URI,
    POST_LOGOUT_REDIRECT_URI: process.env.POST_LOGOUT_REDIRECT_URI,
    SIGNUP_SIGNIN_POLICY: process.env.SIGNUP_SIGNIN_POLICY,
    RESET_PASS_POLICY: process.env.RESET_PASS_POLICY,
    EDIT_PROFILE_POLICY: process.env.EDIT_PROFILE_POLICY,
    AUTHORITY_DOMAIN: process.env.AUTHORITY_DOMAIN,
    POLICY_DOMAIN: process.env.POLICY_DOMAIN,
    AUTH_CLIENT_ID: process.env.AUTH_CLIENT_ID,
    TEST_API_CALL_ENDPOINT: process.env.TEST_API_CALL_ENDPOINT,
    ENDPOINT_API_URL: process.env.ENDPOINT_API_URL,
    RUNTIME_API_URL: process.env.RUNTIME_API_URL,
    DEFAULT_B2C_SCOPE: process.env.DEFAULT_B2C_SCOPE,
    CHARGIFY_PUBLIC_KEY: process.env.CHARGIFY_PUBLIC_KEY,
    CHARGIFY_SERVER_HOST: process.env.CHARGIFY_SERVER_HOST,
    SIGNIN_POLICY: process.env.SIGNIN_POLICY,
    INVITATION_SIGNUP_POLICY: process.env.INVITATION_SIGNUP_POLICY,
    REDIRECT_URI_INVITATION: process.env.REDIRECT_URI_INVITATION,
    RESET_PASSWORD_POLICY: process.env.RESET_PASSWORD_POLICY,
    RUNTIME_AUTH_TTL: process.env.RUNTIME_AUTH_TTL,
    INACTIVITY_TIMEOUT: process.env.INACTIVITY_TIMEOUT,
    GTAG: process.env.GTAG
  },
  exportPathMap: async function () {
    const paths = {
      '/': { page: '/' },
      '/login': { page: '/login' },
      '/getting-started': { page: '/getting-started' },
      '/signup': { page: '/signup' },
      '/home': { page: '/home' },
      '/manage-billing': { page: '/manage-billing' },
      '/subscribe': { page: '/subscribe' },
      '/usage': { page: '/usage' },
      '/manage-access': { page: '/manage-access' },
      '/learn': { page: '/learn' },
      '/account': { page: '/account' },
      '/transcribe': { page: '/transcribe' },
      '/view-jobs': { page: '/view-jobs' }
    };

    return paths;
  }
};
