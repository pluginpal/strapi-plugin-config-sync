const { sanitizeConfig } = require('../utils');
const ConfigType = require("../services/type");

const AdminRolePermissionsConfigType = class AdminRolePermissionsConfigType extends ConfigType {
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

    const existingConfig = await queryAPI
      .findOne({ where: { [this.uid]: configName } });

    if (existingConfig && configContent === null) {
      await queryAPI.delete({ where: { [this.uid]: configName } });

      return;
    }

    if (!existingConfig) {
      const { permissions } = configContent;
      delete configContent.permissions;
      const query = { ...configContent };
      this.jsonFields.map((field) => query[field] = JSON.stringify(configContent[field]));
      const newConfig = await queryAPI.create({ data: query });
      await strapi.admin.services.role.assignPermissions(newConfig.id, permissions);
    } else {
      await strapi.admin.services.role.assignPermissions(existingConfig.id, configContent.permissions);
      delete configContent.permissions;
      const query = { ...configContent };
      this.jsonFields.map((field) => query[field] = JSON.stringify(configContent[field]));
      await queryAPI.update({ where: { [this.uid]: configName }, data: query });
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

      config = sanitizeConfig(config);

      const existingPermissions = await strapi.admin.services.permission.findMany({
        where: { role: { code: config.code } },
      });

      existingPermissions.map((permission) => sanitizeConfig(permission));

      const formattedObject = { ...config, permissions: existingPermissions };
      this.jsonFields.map((field) => formattedObject[field] = JSON.parse(config[field]));

      configs[`${this.configPrefix}.${config[this.uid]}`] = formattedObject;
    }));

    return configs;
  }
};

module.exports = AdminRolePermissionsConfigType;
