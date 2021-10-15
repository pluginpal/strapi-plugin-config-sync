const { logMessage, sanitizeConfig } = require('../utils');
const difference = require('../utils/getObjectDiff');

const ConfigType = class ConfigType {
  constructor(queryString, configPrefix, uid, jsonFields) {
    if (!queryString) {
      strapi.log.error(logMessage('Query string is missing for ConfigType'));
    }
    this.queryString = queryString;
    this.configPrefix = configPrefix;
    this.uid = uid;
    this.jsonFields = jsonFields || [];
  }

  /**
   * Export all core-store config to files.
   *
   * @returns {void}
   */
  exportAll = async () => {
    const formattedDiff = {
      fileConfig: {},
      databaseConfig: {},
      diff: {},
    };

    const fileConfig = await strapi.plugin('config-sync').service('main').getAllConfigFromFiles(this.configPrefix);
    const databaseConfig = await strapi.plugin('config-sync').service('main').getAllConfigFromDatabase(this.configPrefix);
    const diff = difference(databaseConfig, fileConfig);

    formattedDiff.diff = diff;

    Object.keys(diff).map((changedConfigName) => {
      formattedDiff.fileConfig[changedConfigName] = fileConfig[changedConfigName];
      formattedDiff.databaseConfig[changedConfigName] = databaseConfig[changedConfigName];
    });

    await Promise.all(Object.entries(diff).map(async ([configName, config]) => {
      // Check if the config should be excluded.
      const shouldExclude = strapi.config.get('plugin.config-sync.exclude').includes(`${configName}`);
      if (shouldExclude) return;

      const currentConfig = formattedDiff.databaseConfig[configName];

      if (
        !currentConfig
        && formattedDiff.fileConfig[configName]
      ) {
        await strapi.plugin('config-sync').service('main').deleteConfigFile(configName);
      } else {
        await strapi.plugin('config-sync').service('main').writeConfigFile(this.configPrefix, currentConfig[this.uid], currentConfig);
      }
    }));
  }

  /**
   * Import a single core-store config file into the db.
   *
   * @param {string} configName - The name of the config file.
   * @param {string} configContent - The JSON content of the config file.
   * @returns {void}
   */
  importSingle = async (configName, configContent) => {
    // Check if the config should be excluded.
    const shouldExclude = strapi.config.get('plugin.config-sync.exclude').includes(`${this.configPrefix}.${configName}`);
    if (shouldExclude) return;

    const queryAPI = strapi.query(this.queryString);

    const configExists = await queryAPI
      .findOne({ where: { [this.uid]: configName } });

    if (configExists && configContent === null) {
      await queryAPI.delete({ where: { [this.uid]: configName } });

      return;
    }

    if (!configExists) {
      const query = { ...configContent };
      this.jsonFields.map((field) => query[field] = JSON.stringify(configContent[field]));
      await queryAPI.create({ data: query });
    } else {
      const query = { ...configContent };
      this.jsonFields.map((field) => query[field] = JSON.stringify(configContent[field]));
      await queryAPI.update({ where: { [this.uid]: configName }, data: { ...query } });
    }
  }

  /**
   * Get all core-store config from the db.
   *
   * @returns {object} Object with key value pairs of configs.
   */
   getAllFromDatabase = async () => {
    const AllConfig = await strapi.query(this.queryString).findMany({ _limit: -1 });
    const configs = {};

    Object.values(AllConfig).map((config) => {
      // Check if the config should be excluded.
      const shouldExclude = strapi.config.get('plugin.config-sync.exclude').includes(`${this.configPrefix}.${config[this.uid]}`);
      if (shouldExclude) return;

      config = sanitizeConfig(config);

      const formattedObject = { ...config };
      this.jsonFields.map((field) => formattedObject[field] = JSON.parse(config[field]));

      configs[`${this.configPrefix}.${config[this.uid]}`] = formattedObject;
    });

    return configs;
  }

  /**
   * Import all core-store config files into the db.
   *
   * @returns {void}
   */
   importAll = async () => {
    // The main.importAllConfig service will loop the core-store.importSingle service.
    await strapi.plugin('config-sync').service('main').importAllConfig(this.configPrefix);
  }

  /**
   * Export a single core-store config to a file.
   *
   * @param {string} configName - The name of the config file.
   * @returns {void}
   */
   exportSingle = async (configName) => {
     // @TODO: write export for a single core-store config.
  }
};

module.exports = ConfigType;
