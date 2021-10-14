'use strict';

module.exports = {
  default: {
    destination: "extensions/config-sync/files/",
    minify: false,
    importOnBootstrap: false,
    include: [
      "core-store",
      "role-permissions",
      "i18n-locale",
    ],
    exclude: [
      "core-store.plugin_users-permissions_grant",
    ],
  },
  validator() {},
};