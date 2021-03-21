'use strict';

const fs = require('fs');
const util = require('util');

/**
 * Main services for config import/export.
 */

module.exports = {
  /**
   * Write a single config file.
   *
   * @param {string} configName - The name of the config file.
   * @param {string} fileContents - The JSON content of the config file.
   * @returns {void}
   */
  writeConfigFile: async (configName, fileContents) => {
    // Check if the config should be excluded.
    const shouldExclude = strapi.plugins['config-sync'].config.exclude.includes(configName);
    if (shouldExclude) return;

    // Check if the JSON content should be minified. 
    const json = 
      !strapi.plugins['config-sync'].config.minify ? 
        JSON.stringify(JSON.parse(fileContents), null, 2)
        : fileContents;

    if (!fs.existsSync(strapi.plugins['config-sync'].config.destination)) {
      fs.mkdirSync(strapi.plugins['config-sync'].config.destination, { recursive: true });
    }

    const writeFile = util.promisify(fs.writeFile);
    await writeFile(`${strapi.plugins['config-sync'].config.destination}${configName}.json`, json);
  },

  /**
   * Read from a config file.
   *
   * @param {string} configName - The name of the config file.
   * @returns {object} The JSON content of the config file.
   */
  readConfigFile: async (configName) => {
    const readFile = util.promisify(fs.readFile);
    return await readFile(`${strapi.plugins['config-sync'].config.destination}${configName}.json`)
      .then((data) => {
        return JSON.parse(data);
      })
      .catch(() => {
        return null;
      });
  },

  /**
   * Import a config file into the db.
   *
   * @param {string} configName - The name of the config file.
   * @returns {void}
   */
  importFromFile: async (configName) => {
    // Check if the config should be excluded.
    const shouldExclude = strapi.plugins['config-sync'].config.exclude.includes(configName);
    if (shouldExclude) return;

    const coreStoreAPI = strapi.query('core_store');
    const fileContents = await strapi.plugins['config-sync'].services.config.readConfigFile(configName);

    const configExists = await strapi
      .query('core_store')
      .findOne({ key: configName });

    if (!configExists) {
      await coreStoreAPI.create({ key: configName, value: fileContents });
    } else {
      await coreStoreAPI.update({ key: configName }, { value: fileContents });
    }
  }
};
