'use strict';

const { sanitizeEntity } = require('strapi-utils');
const difference = require('../utils/getObjectDiff');

const configPrefix = 'role-permissions'; // Should be the same as the filename.

/**
 * Import/Export for role-permissions configs.
 */

module.exports = {
  /**
   * Export all role-permissions config to files.
   *
   * @returns {void}
   */
   exportAll: async () => {
    const formattedDiff = {
      fileConfig: {},
      databaseConfig: {},
      diff: {}
    };
    
    const fileConfig = await strapi.plugins['config-sync'].services.main.getAllConfigFromFiles(configPrefix);
    const databaseConfig = await strapi.plugins['config-sync'].services.main.getAllConfigFromDatabase(configPrefix);
    const diff = difference(databaseConfig, fileConfig);

    formattedDiff.diff = diff;

    Object.keys(diff).map((changedConfigName) => {
      formattedDiff.fileConfig[changedConfigName] = fileConfig[changedConfigName];
      formattedDiff.databaseConfig[changedConfigName] = databaseConfig[changedConfigName];
    })

    await Promise.all(Object.entries(diff).map(async ([configName, config]) => {
      // Check if the config should be excluded.
      const shouldExclude = strapi.plugins['config-sync'].config.exclude.includes(`${configName}`);
      if (shouldExclude) return;

      const currentConfig = formattedDiff.databaseConfig[configName];

      if (
        !currentConfig &&
        formattedDiff.fileConfig[configName]
      ) {
        await strapi.plugins['config-sync'].services.main.deleteConfigFile(configName);
      } else {
        await strapi.plugins['config-sync'].services.main.writeConfigFile(configPrefix, currentConfig.type, currentConfig);
      }

    }));
  },

  /**
   * Import a single role-permissions config file into the db.
   *
   * @param {string} configName - The name of the config file.
   * @param {string} configContent - The JSON content of the config file.
   * @returns {void}
   */
  importSingle: async (configName, configContent) => {
    // Check if the config should be excluded.
    const shouldExclude = strapi.plugins['config-sync'].config.exclude.includes(`${configPrefix}.${configName}`);
    if (shouldExclude) return;

    const service =
      strapi.plugins['users-permissions'].services.userspermissions;
      
    const role = await strapi
      .query('role', 'users-permissions')
      .findOne({ type: configName });

    if (role && configContent === null) {
      const publicRole = await strapi.query('role', 'users-permissions').findOne({ type: 'public' });
      const publicRoleID = publicRole.id;

      await service.deleteRole(role.id, publicRoleID);

      return;
    }

    const users = role ? role.users : [];
    configContent.users = users;

    if (!role) {
      await service.createRole(configContent);
    } else {
      await service.updateRole(role.id, configContent);
    }
  },

  /**
   * Get all role-permissions config from the db.
   *
   * @returns {object} Object with key value pairs of configs.
   */
   getAllFromDatabase: async () => {
    const service =
      strapi.plugins['users-permissions'].services.userspermissions;

    const [roles, plugins] = await Promise.all([
      service.getRoles(),
      service.getPlugins(),
    ]);

    const rolesWithPermissions = await Promise.all(
      roles.map(async role => service.getRole(role.id, plugins))
    );

    const sanitizedRolesArray = rolesWithPermissions.map(role =>
      sanitizeEntity(role, {
        model: strapi.plugins['users-permissions'].models.role,
      })
    );

    let configs = {};

    Object.values(sanitizedRolesArray).map(({ id, ...config }) => {
      // Check if the config should be excluded.
      const shouldExclude = strapi.plugins['config-sync'].config.exclude.includes(`${configPrefix}.${config.type}`);
      if (shouldExclude) return;

      configs[`${configPrefix}.${config.type}`] = config;
    });

    return configs;
  },

  /**
   * Import all role-permissions config files into the db.
   *
   * @returns {void}
   */
   importAll: async () => {
    // The main.importAllConfig service will loop the role-permissions.importSingle service.
    await strapi.plugins['config-sync'].services.main.importAllConfig(configPrefix);
  },

  /**
   * Export a single role-permissions config to a file.
   *
   * @param {string} configName - The name of the config file.
   * @returns {void}
   */
   exportSingle: async (configName) => {
     // @TODO: write export for a single role-permissions config.
  },
};
