'use strict';

const fs = require('fs');
const util = require('util');

/**
 * config.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

module.exports = {
  writeConfigFile: async (configName, fileContents) => {
    await strapi.fs.writePluginFile(
      'config',
      `files/${configName}.json`,
      fileContents
    );
  },

  readConfigFile: async (configName) => {
    const readFile = util.promisify(fs.readFile);
    return await readFile(`${strapi.plugins.config.config.destination}${configName}.json`)
      .then((data) => {
        return JSON.parse(data);
      })
      .catch(() => {
        return null;
      });
  },

  importFromFile: async (configName) => {
    const coreStoreAPI = strapi.query('core_store');
    const fileContents = await strapi.plugins.config.services.config.readConfigFile(configName);

    // If there is no corresponding config file we should not try to import.
    if (!fileContents) return;

    try {
      const configExists = await strapi
      .query('core_store')
      .findOne({ key: configName });

      if (!configExists) {
        await coreStoreAPI.create({ key: configName, value: fileContents });
      } else {
        await coreStoreAPI.update({ key: configName }, { value: fileContents });
      }

      return { success: true };
    } catch (err) {
      throw new Error(err);
    }
  }
};
