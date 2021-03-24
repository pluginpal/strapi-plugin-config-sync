'use strict';

const fs = require('fs');

/**
 * Main controllers for config import/export.
 */

module.exports = {
  /**
   * Export all config, from db to filesystem.
   *
   * @param {object} ctx - Request context object.
   * @returns {void}
   */
  exportAll: async (ctx) => {
    await strapi.plugins['config-sync'].services.main.exportAllConfig();

    ctx.send({
      message: `Config was successfully exported to ${strapi.plugins['config-sync'].config.destination}.`
    });
  },

  /**
   * Import all config, from filesystem to db.
   *
   * @param {object} ctx - Request context object.
   * @returns {void}
   */
  importAll: async (ctx) => {
    // Check for existance of the config file destination dir.
    if (!fs.existsSync(strapi.plugins['config-sync'].config.destination)) {
      ctx.send({
        message: 'No config files were found.'
      });

      return;
    }
    
    await strapi.plugins['config-sync'].services.main.importAllConfig();

    ctx.send({
      message: 'Config was successfully imported.'
    });
  },

  /**
   * Get all configs as defined in your filesystem.
   *
   * @param {object} ctx - Request context object.
   * @returns {object} Object with key value pairs of configs.
   */
   getConfigsFromFiles: async (ctx) => {
    // Check for existance of the config file destination dir.
    if (!fs.existsSync(strapi.plugins['config-sync'].config.destination)) {
      ctx.send({
        message: 'No config files were found.'
      });

      return;
    }
    
    const configFiles = fs.readdirSync(strapi.plugins['config-sync'].config.destination);
    let formattedConfigs = {};

    const getConfigs = async () => {
      return Promise.all(configFiles.map(async (file) => {
        const formattedConfigName = file.slice(0, -5); // remove the .json extension.
        const fileContents = await strapi.plugins['config-sync'].services.main.readConfigFile(formattedConfigName);
        formattedConfigs[formattedConfigName] = fileContents;
      }));
    };

    await getConfigs();

    ctx.send(formattedConfigs);
  },

  /**
   * Get all configs as defined in your database.
   *
   * @param {object} ctx - Request context object.
   * @returns {object} Object with key value pairs of configs.
   */
   getConfigsFromDatabase: async (ctx) => {
    const coreStoreAPI = strapi.query('core_store');
    const coreStore = await coreStoreAPI.find({ _limit: -1 });
    
    let formattedConfigs = {};
    Object.values(coreStore).map(async ({ key, value }) => {
      formattedConfigs[key] =  JSON.parse(value);
    });

    ctx.send(formattedConfigs);
  }
};
