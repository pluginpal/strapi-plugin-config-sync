const { isEmpty } = require('lodash');
const { logMessage, sanitizeConfig, dynamicSort, noLimit, getCombinedUid, getCombinedUidWhereFilter, getUidParamsFromName } = require('../utils');
const { difference, same } = require('../utils/getArrayDiff');

const ConfigType = class ConfigType {
  constructor({ queryString, configName, uid, jsonFields, relations }) {
    if (!configName) {
      strapi.log.error(logMessage('A config type was registered without a config name.'));
      process.exit(0);
    }
    if (!queryString) {
      strapi.log.error(logMessage(`No query string found for the '${configName}' config type.`));
      process.exit(0);
    }
    // uid could be a single key or an array for a combined uid. So the type of uid is either string or string[]
    if (typeof uid === "string") {
      this.uidKeys = [uid];
    } else if (Array.isArray(uid)) {
      this.uidKeys = uid.sort();
    } else {
      strapi.log.error(logMessage(`Wrong uid config for the '${configName}' config type.`));
      process.exit(0);
    }
    this.queryString = queryString;
    this.configPrefix = configName;
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
    const shouldExclude = !isEmpty(strapi.config.get('plugin.config-sync.excludedConfig').filter((option) => `${this.configPrefix}.${configName}`.startsWith(option)));
    if (shouldExclude) return;

    const queryAPI = strapi.query(this.queryString);
    const uidParams = getUidParamsFromName(this.uidKeys, configName);
    const combinedUidWhereFilter = getCombinedUidWhereFilter(this.uidKeys, uidParams);
    let existingConfig = await queryAPI
      .findOne({
        where: combinedUidWhereFilter,
        populate: this.relations.map(({ relationName }) => relationName),
      });

    if (existingConfig && configContent === null) { // Config exists in DB but no configfile content --> delete config from DB
      await Promise.all(this.relations.map(async ({ queryString, parentName }) => {
        const relations = await noLimit(strapi.query(queryString), {
          where: {
            [parentName]: existingConfig.id,
          },
        });

        await Promise.all(relations.map(async (relation) => {
          await strapi.query(queryString).delete({
            where: { id: relation.id },
          });
        }));
      }));

      await queryAPI.delete({
        where: { id: existingConfig.id },
      });

      return;
    }

    if (!existingConfig) { // Config does not exist in DB --> create config in DB
      // Format JSON fields.
      const query = { ...configContent };
      this.jsonFields.map((field) => query[field] = JSON.stringify(configContent[field]));

      // Create entity.
      this.relations.map(({ relationName }) => delete query[relationName]);
      const newEntity = await queryAPI.create({ data: query });

      await Promise.all(this.relations.map(async ({ queryString, relationName, relationSortFields }) => {
        const relationQueryApi = strapi.query(queryString);

        const existingRows = await relationQueryApi.findMany({
          where: {
            $and: relationSortFields.map((field) => ({ [field]: { $in: configContent[relationName].map(c => c[field] ) } }))
          }
        })

        // Create relation entities.
        await queryAPI.update({
          where: { id: newEntity.id },
          data: {
            ...configContent,
            [relationName]: existingRows.map(r => r.id)
          }
        });
      }))
    } else { // Config does exist in DB --> update config in DB
      // Format JSON fields.
      configContent = sanitizeConfig(configContent);
      const query = { ...configContent };
      this.jsonFields.map((field) => query[field] = JSON.stringify(configContent[field]));

      // Update entity.
      // TODO: See if this is redundaunt now?
      this.relations.map(({ relationName }) => delete query[relationName]);
      const entity = await queryAPI.update({ where: combinedUidWhereFilter, data: query });

      // Delete/create relations.
      await Promise.all(this.relations.map(async ({ queryString, relationName, parentName, relationSortFields }) => {
        const relationQueryApi = strapi.query(queryString);
        existingConfig = sanitizeConfig(existingConfig, relationName, relationSortFields);
        configContent = sanitizeConfig(configContent, relationName, relationSortFields);

        const configToAdd = difference(configContent[relationName], existingConfig[relationName], relationSortFields);

        const existingRows = await relationQueryApi.findMany({
          where: {
            $and: relationSortFields.map((field) => ({ [field]: { $in: configToAdd.map(c => c[field] ) } }))
          }
        })

        await queryAPI.update({
          where: combinedUidWhereFilter,
          data: {
            ...configContent,
            [relationName]: existingRows.map(r => r.id)
          }
        });
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
    const shouldExclude = !isEmpty(strapi.config.get('plugin.config-sync.excludedConfig').filter((option) => configName.startsWith(option)));
    if (shouldExclude) return;

    const currentConfig = formattedDiff.databaseConfig[configName];

    if (
      !currentConfig
      && formattedDiff.fileConfig[configName]
    ) {
      await strapi.plugin('config-sync').service('main').deleteConfigFile(configName);
    } else {
      const combinedUid = getCombinedUid(this.uidKeys, currentConfig);
      await strapi.plugin('config-sync').service('main').writeConfigFile(this.configPrefix, combinedUid, currentConfig);
    }
  }

  /**
   * Get all role-permissions config from the db.
   *
   * @returns {object} Object with key value pairs of configs.
   */
   getAllFromDatabase = async () => {
    const AllConfig = await noLimit(strapi.query(this.queryString), {});
    const configs = {};

    await Promise.all(Object.values(AllConfig).map(async (config) => {
      const combinedUid = getCombinedUid(this.uidKeys, config);
      const combinedUidWhereFilter = getCombinedUidWhereFilter(this.uidKeys, config);

      if (!combinedUid) {
        strapi.log.warn(logMessage(`Missing data for entity with id ${config.id} of type ${this.configPrefix}`));
        return;
      }

      // Check if the config should be excluded.
      const shouldExclude = !isEmpty(strapi.config.get('plugin.config-sync.excludedConfig').filter((option) => `${this.configPrefix}.${combinedUid}`.startsWith(option)));
      if (shouldExclude) return;

      const formattedConfig = { ...sanitizeConfig(config) };
      await Promise.all(this.relations.map(async ({ queryString, relationName, relationSortFields, parentName }) => {
        const relations = await noLimit(strapi.query(this.queryString), {
          where: combinedUidWhereFilter,
          populate: [relationName]
        }).then(rows => rows.flatMap(r => r[relationName]));

        relations.map((relation) => sanitizeConfig(relation));
        relationSortFields.map((sortField) => {
          relations.sort(dynamicSort(sortField));
        });
        formattedConfig[relationName] = relations;
      }));

      this.jsonFields.map((field) => formattedConfig[field] = JSON.parse(config[field]));
      configs[`${this.configPrefix}.${combinedUid}`] = formattedConfig;
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
