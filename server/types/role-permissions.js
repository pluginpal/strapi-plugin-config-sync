const ConfigType = require("../services/type");

const RolePermissionsConfigType = class RolePermissionsConfigType extends ConfigType {
  /**
   * Import a single role-permissions config file into the db.
   *
   * @param {string} configName - The name of the config file.
   * @param {string} configContent - The JSON content of the config file.
   * @returns {void}
   */
  importSingle = async (configName, configContent) => {
    // Check if the config should be excluded.
    const shouldExclude = strapi.plugins['config-sync'].config.exclude.includes(`${this.configPrefix}.${configName}`);
    if (shouldExclude) return;

    const roleService = strapi.plugin('users-permissions').service('role');

    const role = await strapi
      .query(this.queryString)
      .findOne({ where: { type: configName } });

    if (role && configContent === null) {
      const publicRole = await strapi.query(this.queryString).findOne({ where: { type: 'public' } });
      const publicRoleID = publicRole.id;

      await roleService.deleteRole(role.id, publicRoleID);

      return;
    }

    const users = role ? role.users : [];
    configContent.users = users;

    if (!role) {
      await roleService.createRole(configContent);
    } else {
      await roleService.updateRole(role.id, configContent);
    }
  }

  /**
   * Get all role-permissions config from the db.
   *
   * @returns {object} Object with key value pairs of configs.
   */
   getAllFromDatabase = async () => {
    const UPService = strapi.plugin('users-permissions').service('users-permissions');
    const roleService = strapi.plugin('users-permissions').service('role');

    const [roles, plugins] = await Promise.all([
      roleService.getRoles(),
      UPService.getPlugins(),
    ]);

    const rolesWithPermissions = await Promise.all(
      roles.map(async (role) => roleService.getRole(role.id, plugins))
    );

    const configs = {};

    rolesWithPermissions.map(({ id, ...config }) => {
      // Check if the config should be excluded.
      const shouldExclude = strapi.config.get('plugin.config-sync.exclude').includes(`${this.configPrefix}.${config.type}`);
      if (shouldExclude) return;

      // Do not export the _id field, as it is immutable
      delete config._id;

      configs[`${this.configPrefix}.${config.type}`] = config;
    });

    return configs;
  }
};

module.exports = RolePermissionsConfigType;
