"use strict";

export default {
  default: {
    syncDir: "config/sync/",
    minify: false,
    soft: false,
    importOnBootstrap: false,
    customTypes: [],
    includedTypes: [],
    excludedTypes: [],
    includedConfig: [],
    excludedConfig: [
      "core-store.plugin_users-permissions_grant",
      "core-store.plugin_upload_metrics",
      "core-store.plugin_upload_api-folder",
      "core-store.strapi_content_types_schema",
      "core-store.ee_information",
    ],
  },
  validator() {},
};
