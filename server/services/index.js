'use strict';

const main = require('./main');
const coreStore = require('./core-store');
const i18nLocale = require('./i18n-locale');
const rolePermissions = require('./role-permissions');
const webhooks = require('./webhooks');

module.exports = {
  main,
  'role-permissions': rolePermissions,
  'i18n-locale': i18nLocale,
  'core-store': coreStore,
  webhooks,
};
