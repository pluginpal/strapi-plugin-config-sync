'use strict';

const fs = require('fs');
const util = require('util');
const types = require('../config/types');
const difference = require('../utils/getObjectDiff');

/**
 * Main services for config import/export.
 */

module.exports = () => ({
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
    const shouldExclude = strapi.config.get('plugin.config-sync.exclude').includes(`${configType}.${configName}`);
    if (shouldExclude) return;

    // Check if the JSON content should be minified.
    const json = !strapi.config.get('plugin.config-sync').minify
      ? JSON.stringify(fileContents, null, 2)
      : JSON.stringify(fileContents);

    if (!fs.existsSync(strapi.config.get('plugin.config-sync.destination'))) {
      fs.mkdirSync(strapi.config.get('plugin.config-sync.destination'), { recursive: true });
    }

    const writeFile = util.promisify(fs.writeFile);
    await writeFile(`${strapi.config.get('plugin.config-sync.destination')}${configType}.${configName}.json`, json)
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
   * Delete config file.
   *
   * @param {string} configName - The name of the config file.
   * @returns {void}
   */
   deleteConfigFile: async (configName) => {
    // Check if the config should be excluded.
    const shouldExclude = strapi.config.get('plugin.config-sync.exclude').includes(`${configName}`);
    if (shouldExclude) return;

    fs.unlinkSync(`${strapi.config.get('plugin.config-sync.destination')}${configName}.json`);
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
    return readFile(`${strapi.config.get('plugin.config-sync.destination')}${configType}.${configName}.json`)
      .then((data) => {
        return JSON.parse(data);
      })
      .catch(() => {
        return null;
      });
  },


  /**
   * Get all the config JSON from the filesystem.
   *
   * @param {string} configType - Type of config to gather. Leave empty to get all config.
   * @returns {object} Object with key value pairs of configs.
   */
  getAllConfigFromFiles: async (configType = null) => {
    if (!fs.existsSync(strapi.config.get('plugin.config-sync.destination'))) {
      return {};
    }

    const configFiles = fs.readdirSync(strapi.config.get('plugin.config-sync.destination'));

    const getConfigs = async () => {
      const fileConfigs = {};

      await Promise.all(configFiles.map(async (file) => {
        const type = file.split('.')[0]; // Grab the first part of the filename.
        const name = file.split(/\.(.+)/)[1].split('.').slice(0, -1).join('.'); // Grab the rest of the filename minus the file extension.

        if (
          configType && configType !== type
          || !strapi.config.get('plugin.config-sync.include').includes(type)
          || strapi.config.get('plugin.config-sync.exclude').includes(`${type}.${name}`)
        ) {
          return;
        }

        const fileContents = await strapi.plugin('config-sync').service('main').readConfigFile(type, name);
        fileConfigs[`${type}.${name}`] = fileContents;
      }));

      return fileConfigs;
    };

    return getConfigs();
  },

  /**
   * Get all the config JSON from the database.
   *
   * @param {string} configType - Type of config to gather. Leave empty to get all config.
   * @returns {object} Object with key value pairs of configs.
   */
  getAllConfigFromDatabase: async (configType = null) => {
    const getConfigs = async () => {
      let databaseConfigs = {};

      await Promise.all(strapi.config.get('plugin.config-sync.include').map(async (type) => {
        if (configType && configType !== type) {
          return;
        }

        const config = await types[type].getAllFromDatabase();
        databaseConfigs = Object.assign(config, databaseConfigs);
      }));

      return databaseConfigs;
    };

    return getConfigs();
  },

  /**
   * Import all config files into the db.
   *
   * @param {string} configType - Type of config to impor. Leave empty to import all config.
   * @param {object} onSuccess - Success callback to run on each single successfull import.
   * @returns {void}
   */
  importAllConfig: async (configType = null, onSuccess) => {
    const fileConfig = await strapi.plugin('config-sync').service('main').getAllConfigFromFiles();
    const databaseConfig = await strapi.plugin('config-sync').service('main').getAllConfigFromDatabase();

    const diff = difference(databaseConfig, fileConfig);

    await Promise.all(Object.keys(diff).map(async (file) => {
      const type = file.split('.')[0]; // Grab the first part of the filename.
      const name = file.split(/\.(.+)/)[1]; // Grab the rest of the filename minus the file extension.

      if (configType && configType !== type) {
        return;
      }

      await strapi.plugin('config-sync').service('main').importSingleConfig(`${type}.${name}`, onSuccess);
    }));
  },

  /**
   * Export all config files.
   *
   * @param {string} configType - Type of config to export. Leave empty to export all config.
   * @param {object} onSuccess - Success callback to run on each single successfull import.
   * @returns {void}
   */
   exportAllConfig: async (configType = null, onSuccess) => {
    const fileConfig = await strapi.plugin('config-sync').service('main').getAllConfigFromFiles();
    const databaseConfig = await strapi.plugin('config-sync').service('main').getAllConfigFromDatabase();

    const diff = difference(databaseConfig, fileConfig);

    await Promise.all(Object.keys(diff).map(async (file) => {
      const type = file.split('.')[0]; // Grab the first part of the filename.
      const name = file.split(/\.(.+)/)[1]; // Grab the rest of the filename minus the file extension.

      if (configType && configType !== type) {
        return;
      }

      await strapi.plugin('config-sync').service('main').exportSingleConfig(`${type}.${name}`, onSuccess);
    }));
  },

  /**
   * Import a single config file into the db.
   *
   * @param {string} configName - The name of the config file.
   * @param {object} onSuccess - Success callback to run on each single successfull import.
   * @returns {void}
   */
  importSingleConfig: async (configName, onSuccess) => {
    // Check if the config should be excluded.
    const shouldExclude = strapi.config.get('plugin.config-sync.exclude').includes(configName);
    if (shouldExclude) return;

    const [type, name] = configName.split('.'); // Split the configName.
    const fileContents = await strapi.plugin('config-sync').service('main').readConfigFile(type, name);

    try {
      await types[type].importSingle(name, fileContents);
      if (onSuccess) {
        onSuccess(`${type}.${name}`);
      }
    } catch (e) {
      throw new Error(e);
    }
  },

  /**
   * Export a single config file.
   *
   * @param {string} configName - The name of the config file.
   * @param {object} onSuccess - Success callback to run on each single successfull import.
   * @returns {void}
   */
   exportSingleConfig: async (configName, onSuccess) => {
     // Check if the config should be excluded.
    const shouldExclude = strapi.config.get('plugin.config-sync.exclude').includes(configName);
    if (shouldExclude) return;

    const [type, name] = configName.split('.'); // Split the configName.

    try {
      await types[type].exportSingle(configName);
      if (onSuccess) {
        onSuccess(`${type}.${name}`);
      }
    } catch (e) {
      throw new Error(e);
    }
  },

  /**
   * Get the formatted diff.
   *
   * @param {string} configType - Type of config to get the diff of. Leave empty to get the diff of all config.
   *
   * @returns {object} - the formatted diff.
   */
  getFormattedDiff: async (configType = null) => {
    const formattedDiff = {
      fileConfig: {},
      databaseConfig: {},
      diff: {},
    };

    const fileConfig = await strapi.plugin('config-sync').service('main').getAllConfigFromFiles(configType);
    const databaseConfig = await strapi.plugin('config-sync').service('main').getAllConfigFromDatabase(configType);

    const diff = difference(databaseConfig, fileConfig);

    formattedDiff.diff = diff;

    Object.keys(diff).map((changedConfigName) => {
      formattedDiff.fileConfig[changedConfigName] = fileConfig[changedConfigName];
      formattedDiff.databaseConfig[changedConfigName] = databaseConfig[changedConfigName];
    });

    return formattedDiff;
  },
});
