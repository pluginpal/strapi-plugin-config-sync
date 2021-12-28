'use strict';

const types = (strapi) => {
  // Initiate Strapi 'core-store' and 'admin-role' types.
  const typesArray = [
    {
      configName: 'core-store',
      queryString: 'strapi::core-store',
      uid: 'key',
      jsonFields: ['value'],
    },
    {
      configName: 'admin-role',
      queryString: 'admin::role',
      uid: 'code',
      relations: [{
        queryString: 'admin::permission',
        relationName: 'permissions',
        parentName: 'role',
        relationSortField: 'action',
      }],
    },
  ];

  // Register plugin users-permissions 'role' type.
  if (strapi.plugin('users-permissions')) {
    typesArray.push({
      configName: 'user-role',
      queryString: 'plugin::users-permissions.role',
      uid: 'type',
      relations: [{
        queryString: 'plugin::users-permissions.permission',
        relationName: 'permissions',
        parentName: 'role',
        relationSortField: 'action',
      }],
    });
  }

  // Register plugin i18n 'locale' type.
  if (strapi.plugin('i18n')) {
    typesArray.push({
      configName: 'i18n-locale',
      queryString: 'plugin::i18n.locale',
      uid: 'code',
    });
  }

  return typesArray;
};

module.exports = types;
