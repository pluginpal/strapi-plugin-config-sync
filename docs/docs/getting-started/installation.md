---
sidebar_label: 'Installation'
displayed_sidebar: configSyncSidebar
slug: /
---

# ⏳ Installation

:::prerequisites
Complete installation requirements are the exact same as for Strapi itself and can be found in the Strapi documentation.

**Supported Strapi versions:**

Strapi v5 use `strapi-plugin-config-sync@^3`

Strapi v4 use `strapi-plugin-config-sync@^1`

:::

Install the plugin in your Strapi project.

<Tabs groupId="yarn-npm">
  <TabItem value="yarn" label="Yarn">
    ```
    yarn add strapi-plugin-config-sync
    ```
  </TabItem>
  <TabItem value="npm" label="NPM">
    ```
    npm install strapi-plugin-config-sync --save
    ```
  </TabItem>
</Tabs>
 
Add the export path to the `watchIgnoreFiles` list in the `config/admin.js` file.
This way your app won't reload when you export the config in development.

```md title="config/admin.js"
module.exports = ({ env }) => ({
  // ...
  watchIgnoreFiles: [
    '**/config/sync/**',
  ],
});
```

After successful installation you have to rebuild the admin UI so it'll include this plugin. To rebuild and restart Strapi run:

<Tabs groupId="yarn-npm">
  <TabItem value="yarn" label="Yarn">
    ```
    yarn build
    yarn develop
    ```
  </TabItem>
  <TabItem value="npm" label="NPM">
    ```
    npm run build
    npm run develop
    ```
  </TabItem>
</Tabs>

The **Config Sync** plugin should now appear in the **Settings** section of your Strapi app.

To start tracking your config changes you have to make the first export. This will dump all your configuration data to the `/config/sync` directory. You can export either through [the CLI](/cli) or [Strapi admin panel](/admin-gui)

Enjoy 🎉
