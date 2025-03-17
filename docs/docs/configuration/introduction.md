---
sidebar_label: 'Introduction'
displayed_sidebar: configSyncSidebar
slug: /configuration
---

# 🔧 Configuration
The settings of the plugin can be overridden in the `config/plugins.js` file. 
In the example below you can see how, and also what the default settings are.

```md title="config/plugins.js"
module.exports = ({ env }) => ({
  // ...
  'config-sync': {
    enabled: true,
    config: {
      syncDir: "config/sync/",
      minify: false,
      soft: false,
      importOnBootstrap: false,
      customTypes: [],
      excludedTypes: [],
      excludedConfig: [
        "core-store.plugin_users-permissions_grant",
        "core-store.plugin_upload_metrics",
        "core-store.strapi_content_types_schema",
        "core-store.ee_information",
      ],
    },
  },
});
```
