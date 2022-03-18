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
    DEFAULT_B2C_SCOPE: process.env.DEFAULT_B2C_SCOPE,
    CHARGIFY_PUBLIC_KEY: process.env.CHARGIFY_PUBLIC_KEY,
    CHARGIFY_SERVER_HOST: process.env.CHARGIFY_SERVER_HOST,
  },
  exportPathMap: async function () {
    const paths = {
      '/': { page: '/' },
      '/login': { page: '/login' },
      '/home': { page: '/home' },
      '/manage-billing': { page: '/manage-billing' },
      '/subscribe': { page: '/subscribe' },
      '/usage': { page: '/usage' },
      '/manage-access': { page: '/manage-access' },
      '/account': { page: '/account' },
      '/recent-jobs': { page: '/recent-jobs' },
    };

    return paths;
  },
};
