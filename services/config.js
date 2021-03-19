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
    const shouldExclude = strapi.plugins.config.config.exclude.includes(configName);
    if (shouldExclude) return;

    const json = 
      !strapi.plugins.config.config.minify ? 
        JSON.stringify(JSON.parse(fileContents), null, 2)
        : fileContents;

    // Create the export folder if it does not yet exist.
    if (!fs.existsSync(strapi.plugins.config.config.destination)) {
      fs.mkdirSync(strapi.plugins.config.config.destination, { recursive: true });
    }

    const writeFile = util.promisify(fs.writeFile);
    await writeFile(`${strapi.plugins.config.config.destination}${configName}.json`, json);
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
    const shouldExclude = strapi.plugins.config.config.exclude.includes(configName);
    if (shouldExclude) return;

    const coreStoreAPI = strapi.query('core_store');
    const fileContents = await strapi.plugins.config.services.config.readConfigFile(configName);

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
