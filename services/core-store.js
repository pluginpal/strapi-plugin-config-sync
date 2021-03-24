'use strict';

const coreStoreQueryString = 'core_store';
const configPrefix = 'core-store'; // Should be the same as the filename.

/**
 * Import/Export for core-store configs.
 */

module.exports = {
  /**
   * Export all core-store config to files.
   *
   * @returns {void}
   */
   exportAll: async () => {
    const coreStore = await strapi.query(coreStoreQueryString).find({ _limit: -1 });

    await Promise.all(Object.values(coreStore).map(async ({ id, ...config }) => {
      config.value = JSON.parse(config.value);
      await strapi.plugins['config-sync'].services.main.writeConfigFile(configPrefix, config.key, config);
    }));
  },

  /**
   * Import a single core-store config file into the db.
   *
   * @param {string} configName - The name of the config file.
   * @param {string} configContent - The JSON content of the config file.
   * @returns {void}
   */
  importSingle: async (configName, configContent) => {
    const { value, ...fileContent } = configContent;
    const coreStoreAPI = strapi.query(coreStoreQueryString);

    const configExists = await coreStoreAPI
      .findOne({ key: configName, environment: fileContent.environment });

    if (!configExists) {
      await coreStoreAPI.create({ value: JSON.stringify(value), ...fileContent });
    } else {
      await coreStoreAPI.update({ key: configName }, { value: JSON.stringify(value), ...fileContent });
    }
  },

  /**
   * Import all core-store config files into the db.
   *
   * @returns {void}
   */
   importAll: async () => {
    // The main.importAllConfig service will loop the core-store.importSingle service.
    await strapi.plugins['config-sync'].services.main.importAllConfig(configPrefix);
  },

  /**
   * Export a single core-store config to a file.
   *
   * @param {string} configName - The name of the config file.
   * @returns {void}
   */
   exportSingle: async (configName) => {
     // @TODO: write export for a single core-store config.
  },
};
