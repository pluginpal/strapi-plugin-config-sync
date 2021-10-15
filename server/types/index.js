'use strict';

const ConfigType = require("../services/type");
const UserRoleConfigType = require("./user-role");
const AdminRoleConfigType = require("./admin-role");

module.exports = {
  'i18n-locale': new ConfigType('plugin::i18n.locale', 'i18n-locale', 'code'),
  'core-store': new ConfigType('strapi::core-store', 'core-store', 'key', ['value']),
  'user-role': new UserRoleConfigType('plugin::users-permissions.role', 'user-role', 'type'),
  'admin-role': new AdminRoleConfigType('admin::role', 'admin-role', 'code'),
};
