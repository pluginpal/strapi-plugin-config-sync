'use strict';

module.exports = {
  default: {
    syncDir: "config/sync/",
    minify: false,
    importOnBootstrap: false,
    customTypes: [{}],
    excludedTypes: [],
    excludedConfig: [
      "core-store.plugin_users-permissions_grant",
    ],
  },
  validator() {},
};
