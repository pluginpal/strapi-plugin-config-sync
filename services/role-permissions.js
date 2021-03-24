'use strict';

const { sanitizeEntity } = require('strapi-utils');

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

    await Promise.all(sanitizedRolesArray.map(async (config) => {
      await strapi.plugins['config-sync'].services.main.writeConfigFile(configPrefix, config.type, config);
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
    const service =
      strapi.plugins['users-permissions'].services.userspermissions;
      
    const role = await strapi
      .query('role', 'users-permissions')
      .findOne({ type: configName });

    const users = role ? role.users : [];
    configContent.users = users;

    if (!role) {
      await service.createRole(configContent);
    } else {
      await service.updateRole(role.id, configContent);
    }
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
