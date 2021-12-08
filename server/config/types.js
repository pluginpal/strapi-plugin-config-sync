'use strict';

const ConfigType = require("./type");

module.exports = {
  'i18n-locale': new ConfigType('plugin::i18n.locale', 'i18n-locale', 'code'),
  'core-store': new ConfigType('strapi::core-store', 'core-store', 'key', ['value']),
  'user-role': new ConfigType(
    'plugin::users-permissions.role',
    'user-role',
    'type',
    [],
    [{
      queryString: 'plugin::users-permissions.permission',
      relationName: 'permissions',
      parentName: 'role',
      relationSortField: 'action',
    }]
  ),
  'admin-role': new ConfigType(
    'admin::role',
    'admin-role',
    'code',
    [],
    [{
      queryString: 'admin::permission',
      relationName: 'permissions',
      parentName: 'role',
      relationSortField: 'action',
    }]
  ),
};
