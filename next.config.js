
module.exports = {
  trailingSlash: true,
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