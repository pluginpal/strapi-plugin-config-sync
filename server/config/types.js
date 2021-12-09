'use strict';

const ConfigType = require("./type");

const types = (strapi) => {
  const typesObject = {
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
      }],
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
      }],
    ),
  };

  // Remove types for which the corresponding plugin is not installed.
  Object.keys(typesObject).map((type) => {
    if (type === 'i18n-locale' && !strapi.plugin('i18n')) {
      delete typesObject[type];
    }

    if (type === 'user-role' && !strapi.plugin('users-permissions')) {
      delete typesObject[type];
    }
  });

  return typesObject;
};

module.exports = types;
