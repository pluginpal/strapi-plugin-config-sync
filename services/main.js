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
   * @param {string} configType - The type of the config.
   * @param {string} configName - The name of the config file.
   * @param {string} fileContents - The JSON content of the config file.
   * @returns {void}
   */
  writeConfigFile: async (configType, configName, fileContents) => {
    // Check if the config should be excluded.
    const shouldExclude = strapi.plugins['config-sync'].config.exclude.includes(`${configType}.${configName}`);
    if (shouldExclude) return;

    // Check if the JSON content should be minified. 
    const json = 
      !strapi.plugins['config-sync'].config.minify ? 
        JSON.stringify(fileContents, null, 2)
        : JSON.stringify(fileContents);

    if (!fs.existsSync(strapi.plugins['config-sync'].config.destination)) {
      fs.mkdirSync(strapi.plugins['config-sync'].config.destination, { recursive: true });
    }

    const writeFile = util.promisify(fs.writeFile);
    await writeFile(`${strapi.plugins['config-sync'].config.destination}${configType}.${configName}.json`, json)
      .then(() => {
        // @TODO:
        // Add logging for successfull config export.
      })
      .catch(() => {
        // @TODO:
        // Add logging for failed config export.
      });
  },

  /**
   * Read from a config file.
   *
   * @param {string} configType - The type of config.
   * @param {string} configName - The name of the config file.
   * @returns {object} The JSON content of the config file.
   */
  readConfigFile: async (configType, configName) => {
    const readFile = util.promisify(fs.readFile);
    return await readFile(`${strapi.plugins['config-sync'].config.destination}${configType}.${configName}.json`)
      .then((data) => {
        return JSON.parse(data);
      })
      .catch(() => {
        return null;
      });
  },

  /**
   * Import all config files into the db.
   *
   * @returns {void}
   */
  importAllConfig: async (configType = null) => {
    const configFiles = fs.readdirSync(strapi.plugins['config-sync'].config.destination);

    configFiles.map((file) => {
      const type = file.split('.')[0]; // Grab the first part of the filename.
      const name = file.split(/\.(.+)/)[1].split('.').slice(0, -1).join('.'); // Grab the rest of the filename minus the file extension.

      if (configType && configType !== type) {
        return;
      }

      strapi.plugins['config-sync'].services.main.importSingleConfig(type, name);
    });
  },

  /**
   * Export all config files.
   *
   * @returns {void}
   */
   exportAllConfig: async (configType = null) => {
    await Promise.all(strapi.plugins['config-sync'].config.include.map(async (type) => {
      if (configType && configType !== type) {
        return;
      }

      await strapi.plugins['config-sync'].services[type].exportAll();
    }));
  },

  /**
   * Import a single config file into the db.
   *
   * @param {string} configType - The type of config.
   * @param {string} configName - The name of the config file.
   * @returns {void}
   */
  importSingleConfig: async (configType, configName) => {
    // Check if the config should be excluded.
    const shouldExclude = strapi.plugins['config-sync'].config.exclude.includes(`${configType}.${configName}`);
    if (shouldExclude) return;

    const fileContents = await strapi.plugins['config-sync'].services.main.readConfigFile(configType, configName);

    await strapi.plugins['config-sync'].services[configType].importSingle(configName, fileContents);
  },

  /**
   * Export a single config file.
   *
   * @param {string} configType - The type of config.
   * @param {string} configName - The name of the config file.
   * @returns {void}
   */
   exportSingleConfig: async (configType, configName) => {
    
  },
};
