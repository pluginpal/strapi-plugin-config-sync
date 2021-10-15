'use strict';

const getCoreStore = () => {
  return strapi.store({ type: 'plugin', name: 'config-sync' });
};

const getService = (name) => {
  return strapi.plugin('config-sync').service(name);
};

const logMessage = (msg = '') => `[strapi-plugin-config-sync]: ${msg}`;

const sanitizeConfig = (config) => {
  delete config._id;
  delete config.id;
  delete config.updatedAt;
  delete config.createdAt;

  return config;
};

module.exports = {
  getService,
  getCoreStore,
  logMessage,
  sanitizeConfig,
};
