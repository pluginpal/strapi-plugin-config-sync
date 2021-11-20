const { logMessage, sanitizeConfig, dynamicSort } = require('../utils');
const difference = require('../utils/getArrayDiff');

const ConfigType = class ConfigType {
  constructor(queryString, configPrefix, uid, jsonFields, relations) {
    if (!queryString) {
      strapi.log.error(logMessage('Query string is missing for ConfigType'));
    }
    this.queryString = queryString;
    this.configPrefix = configPrefix;
    this.uid = uid;
    this.jsonFields = jsonFields || [];
    this.relations = relations || [];
  }

  /**
   * Import a single role-permissions config file into the db.
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

    let existingConfig = await queryAPI
      .findOne({
        where: { [this.uid]: configName },
        populate: this.relations.map(({ relationName }) => relationName),
      });

    if (existingConfig && configContent === null) {
      const entity = await queryAPI.findOne({
        where: { [this.uid]: configName },
        populate: this.relations.map(({ relationName }) => relationName),
      });

      await Promise.all(this.relations.map(async ({ queryString, parentName }) => {
        const relations = await strapi.query(queryString).findMany({
          where: {
            [parentName]: entity.id,
          },
        });

        await Promise.all(relations.map(async (relation) => {
          await strapi.query(queryString).delete({
            where: { id: relation.id },
          });
        }));
      }));

      await queryAPI.delete({
        where: { id: entity.id },
      });

      return;
    }

    if (!existingConfig) {
      // Format JSON fields.
      const query = { ...configContent };
      this.jsonFields.map((field) => query[field] = JSON.stringify(configContent[field]));

      // Create entity.
      this.relations.map(({ relationName }) => delete query[relationName]);
      const newEntity = await queryAPI.create({ data: query });

      // Create relation entities.
      this.relations.map(async ({ queryString, relationName, parentName }) => {
        const relationQueryApi = strapi.query(queryString);

        configContent[relationName].map(async (relationEntity) => {
          const relationQuery = { ...relationEntity, [parentName]: newEntity };
          await relationQueryApi.create({ data: relationQuery });
        });
      });
    } else {
      // Format JSON fields.
      configContent = sanitizeConfig(configContent);
      const query = { ...configContent };
      this.jsonFields.map((field) => query[field] = JSON.stringify(configContent[field]));

      // Update entity.
      this.relations.map(({ relationName }) => delete query[relationName]);
      const entity = await queryAPI.update({ where: { [this.uid]: configName }, data: query });

      // Delete/create relations.
      await Promise.all(this.relations.map(async ({ queryString, relationName, parentName, relationSortField }) => {
        const relationQueryApi = strapi.query(queryString);
        existingConfig = sanitizeConfig(existingConfig, relationName, relationSortField);
        configContent = sanitizeConfig(configContent, relationName, relationSortField);

        const configToAdd = difference(configContent[relationName], existingConfig[relationName], relationSortField);
        const configToDelete = difference(existingConfig[relationName], configContent[relationName], relationSortField);

        await Promise.all(configToDelete.map(async (config) => {
          await relationQueryApi.delete({
            where: {
              [relationSortField]: config[relationSortField],
              [parentName]: entity.id,
            },
          });
        }));

        await Promise.all(configToAdd.map(async (config) => {
          await relationQueryApi.create({
            data: { ...config, [parentName]: entity.id },
          });
        }));
      }));
    }
  }

  /**
   * Export a single core-store config to a file.
   *
   * @param {string} configName - The name of the config file.
   * @returns {void}
   */
   exportSingle = async (configName) => {
    const formattedDiff = await strapi.plugin('config-sync').service('main').getFormattedDiff(this.configPrefix);

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
  }

  /**
   * Get all role-permissions config from the db.
   *
   * @returns {object} Object with key value pairs of configs.
   */
   getAllFromDatabase = async () => {
    const AllConfig = await strapi.query(this.queryString).findMany({ limit: 0 });
    const configs = {};

    await Promise.all(Object.values(AllConfig).map(async (config) => {
      // Check if the config should be excluded.
      const shouldExclude = strapi.config.get('plugin.config-sync.exclude').includes(`${this.configPrefix}.${config[this.uid]}`);
      if (shouldExclude) return;

      const formattedConfig = { ...sanitizeConfig(config) };
      await Promise.all(this.relations.map(async ({ queryString, relationName, relationSortField, parentName }) => {
        const relations = await strapi.query(queryString).findMany({
          where: { [parentName]: { [this.uid]: config[this.uid] } },
        });

        relations.map((relation) => sanitizeConfig(relation));
        relations.sort(dynamicSort(relationSortField));
        formattedConfig[relationName] = relations;
      }));

      this.jsonFields.map((field) => formattedConfig[field] = JSON.parse(config[field]));
      configs[`${this.configPrefix}.${config[this.uid]}`] = formattedConfig;
    }));


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
   * Export all core-store config to files.
   *
   * @returns {void}
   */
   exportAll = async () => {
    // The main.importAllConfig service will loop the core-store.importSingle service.
    await strapi.plugin('config-sync').service('main').exportAllConfig(this.configPrefix);
  }
};

module.exports = ConfigType;
