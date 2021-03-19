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
  export: async (ctx) => {
    const coreStoreAPI = strapi.query('core_store');
    const coreStore = await coreStoreAPI.find({ _limit: -1 });

    Object.values(coreStore).map(async ({ key, value }) => {
      await strapi.plugins.config.services.config.writeConfigFile(key, value);
    });

    ctx.send({
      message: `Config was successfully exported to ${strapi.plugins.config.config.destination}.`
    });
  },

  /**
   * Import all config, from filesystem to db.
   *
   * @param {object} ctx - Request context object.
   * @returns {void}
   */
  import: async (ctx) => {
    // Check for existance of the config file destination dir.
    if (!fs.existsSync(strapi.plugins.config.config.destination)) {
      ctx.send({
        message: 'No config files were found.'
      });

      return;
    }
    
    const configFiles = fs.readdirSync(strapi.plugins.config.config.destination);

    configFiles.map((file) => {
      strapi.plugins.config.services.config.importFromFile(file.slice(0, -5));
    });

    ctx.send({
      message: 'Config was successfully imported.'
    });
  }
};
