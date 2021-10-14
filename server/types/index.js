'use strict';

const ConfigType = require("../services/type");
const RolePermissionsConfigType = require("./role-permissions");

module.exports = {
  'i18n-locale': new ConfigType('plugin::i18n.locale', 'i18n-locale', 'code'),
  'core-store': new ConfigType('strapi::core-store', 'core-store', 'key', ['value']),
  'role-permissions': new RolePermissionsConfigType('plugin::users-permissions.role', 'role-permissions', 'type'),
};
