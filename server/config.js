'use strict';

module.exports = {
  default: {
    destination: "src/extensions/config-sync/files/",
    minify: false,
    importOnBootstrap: false,
    include: [
      "core-store",
      "user-role",
      "admin-role",
      "i18n-locale",
    ],
    exclude: [
      "core-store.plugin_users-permissions_grant",
    ],
  },
  validator() {},
};
