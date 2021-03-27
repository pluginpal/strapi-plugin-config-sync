'use strict';

/**
 * Import/Export for webhook configs.
 */

const webhookQueryString = 'strapi_webhooks';
const configPrefix = 'webhooks'; // Should be the same as the filename.
const difference = require('../utils/getObjectDiff');

module.exports = {
  /**
   * Export all webhooks to config files.
   *
   * @returns {void}
   */
   exportAll: async () => {
    const formattedDiff = {
      fileConfig: {},
      databaseConfig: {},
      diff: {}
    };
    
    const fileConfig = await strapi.plugins['config-sync'].services.main.getAllConfigFromFiles(configPrefix);
    const databaseConfig = await strapi.plugins['config-sync'].services.main.getAllConfigFromDatabase(configPrefix);
    const diff = difference(databaseConfig, fileConfig);

    formattedDiff.diff = diff;

    Object.keys(diff).map((changedConfigName) => {
      formattedDiff.fileConfig[changedConfigName] = fileConfig[changedConfigName];
      formattedDiff.databaseConfig[changedConfigName] = databaseConfig[changedConfigName];
    })

    await Promise.all(Object.entries(diff).map(async ([configName, config]) => {
      // Check if the config should be excluded.
      const shouldExclude = strapi.plugins['config-sync'].config.exclude.includes(`${configName}`);
      if (shouldExclude) return;

      const currentConfig = formattedDiff.databaseConfig[configName];

      if (
        !currentConfig &&
        formattedDiff.fileConfig[configName]
      ) {
        await strapi.plugins['config-sync'].services.main.deleteConfigFile(configName);
      } else {
        await strapi.plugins['config-sync'].services.main.writeConfigFile(configPrefix, currentConfig.id, currentConfig);
      }
    }));
  },

  /**
   * Import a single webhook config file into the db.
   *
   * @param {string} configName - The name of the config file.
   * @param {string} configContent - The JSON content of the config file.
   * @returns {void}
   */
  importSingle: async (configName, configContent) => {
    // Check if the config should be excluded.
    const shouldExclude = strapi.plugins['config-sync'].config.exclude.includes(`${configPrefix}.${configName}`);
    if (shouldExclude) return;

    const webhookAPI = strapi.query(webhookQueryString);

    const configExists = await webhookAPI.findOne({ id: configName });

    if (!configExists) {
      await webhookAPI.create(configContent);
    } else {
      if (configContent === null) {
        await webhookAPI.delete({ id: configName });
      }
      await webhookAPI.update({ id: configName }, configContent);
    }
  },

  /**
   * Get all webhook config from the db.
   *
   * @returns {object} Object with key value pairs of configs.
   */
   getAllFromDatabase: async () => {
    const webhooks = await strapi.query(webhookQueryString).find({ _limit: -1 });
    let configs = {};

    Object.values(webhooks).map( (config) => {
      // Check if the config should be excluded.
      const shouldExclude = strapi.plugins['config-sync'].config.exclude.includes(`${configPrefix}.${config.id}`);
      if (shouldExclude) return;

      configs[`${configPrefix}.${config.id}`] = config;
    });

    return configs;
  },

  /**
   * Import all webhook config files into the db.
   *
   * @returns {void}
   */
  importAll: async () => {
    // The main.importAllConfig service will loop the webhooks.importSingle service.
    await strapi.plugins['config-sync'].services.main.importAllConfig(configPrefix);
  },

  /**
   * Export a single webhook into a config file.
   *
   * @param {string} configName - The name of the config file.
   * @returns {void}
   */
   exportSingle: async (configName) => {
     // @TODO: write export for a single webhook config.
  },
};
