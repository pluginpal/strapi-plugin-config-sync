---
sidebar_label: 'Plugin config types'
displayed_sidebar: configSyncSidebar
slug: /api/plugin-config-types
---

# Plugin config types

When you're writing a plugin, which registers a content type, you might want to consider that content type as a config type as defined in the Config Sync specification.

## Register a config type programatically

You can register a config type by adding some code to the register function of your plugin.

```md title="register.js"
// Register the config type when using the config-sync plugin.
if (strapi.plugin('config-sync')) {
  if (!strapi.plugin('config-sync').pluginTypes) {
    strapi.plugin('config-sync').pluginTypes = [];
  }

  strapi.plugin('config-sync').pluginTypes.push({
    configName: 'url-pattern',
    queryString: 'plugin::webtools.url-pattern',
    uid: 'code',
  });
}
```

If you want to read more about what the different values of a config type actually mean please read the in depth [custom types](/config-types#custom-types) docs
