'use strict';

const getCoreStore = () => {
  return strapi.store({ type: 'plugin', name: 'config-sync' });
};

const getService = (name) => {
  return strapi.plugin('config-sync').service(name);
};

const logMessage = (msg = '') => `[strapi-plugin-config-sync]: ${msg}`;

module.exports = {
  getService,
  getCoreStore,
  logMessage,
};
