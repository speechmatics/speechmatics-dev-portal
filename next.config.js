
module.exports = {
  trailingSlash: true,
  env: {
    TEST_IF_WORKS_ENV_VAR: process.env.TEST_IF_WORKS_ENV_VAR,
    REDIRECT_URI: process.env.REDIRECT_URI,
    POST_LOGOUT_REDIRECT_URI: process.env.POST_LOGOUT_REDIRECT_URI
  },
  exportPathMap: async function () {
    const paths = {
      '/': { page: '/' },
      '/login': { page: '/login' },
      '/getting-started': { page: '/getting-started' },
      '/recent-jobs': { page: '/recent-jobs' },
      '/account': { page: '/account' },
      '/usage': { page: '/usage' },
      '/access-token': { page: '/access-token' },
    };

    return paths;
  },
};