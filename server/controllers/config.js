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
    await strapi.plugin('config-sync').service('main').exportAllConfig();

    ctx.send({
      message: `Config was successfully exported to ${strapi.config.get('plugin.config-sync.destination')}.`,
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
    if (!fs.existsSync(strapi.config.get('plugin.config-sync.destination'))) {
      ctx.send({
        message: 'No config files were found.',
      });

      return;
    }

    await strapi.plugin('config-sync').service('main').importAllConfig();

    ctx.send({
      message: 'Config was successfully imported.',
    });
  },

  /**
   * Get config diff between filesystem & db.
   *
   * @param {object} ctx - Request context object.
   * @returns {object} formattedDiff - The formatted diff object.
   * @returns {object} formattedDiff.fileConfig - The config as found in the filesystem.
   * @returns {object} formattedDiff.databaseConfig - The config as found in the database.
   * @returns {object} formattedDiff.diff - The diff between the file config and databse config.
   */
  getDiff: async (ctx) => {
    // Check for existance of the config file destination dir.
    if (!fs.existsSync(strapi.config.get('plugin.config-sync.destination'))) {
      ctx.send({
        message: 'No config files were found.',
      });

      return;
    }

    return strapi.plugin('config-sync').service('main').getFormattedDiff();
  },
};
