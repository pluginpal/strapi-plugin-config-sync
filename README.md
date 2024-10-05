<div align="center">
<h1>Strapi config-sync plugin</h1>
	
<p style="margin-top: 0;">This plugin is a multi-purpose tool to manage your Strapi database records through JSON files. Mostly used to version controlconfig data for automated deployment, automated tests and data sharing for collaboration purposes.</p>

<a href="https://docs.pluginpal.io/config-sync">Read the documentation</a>
	
<p>
  <a href="https://www.npmjs.org/package/strapi-plugin-config-sync">
    <img src="https://img.shields.io/npm/v/strapi-plugin-config-sync/latest.svg" alt="NPM Version" />
  </a>
  <a href="https://www.npmjs.org/package/strapi-plugin-config-sync">
    <img src="https://img.shields.io/npm/dm/strapi-plugin-config-sync" alt="Monthly download on NPM" />
  </a>
  <a href="https://codecov.io/gh/boazpoolman/strapi-plugin-config-sync">
    <img src="https://img.shields.io/github/actions/workflow/status/boazpoolman/strapi-plugin-config-sync/tests.yml?branch=master" alt="CI build status" />
  </a>
  <a href="https://codecov.io/gh/boazpoolman/strapi-plugin-config-sync">
    <img src="https://codecov.io/gh/boazpoolman/strapi-plugin-config-sync/coverage.svg?branch=master" alt="codecov.io" />
  </a>
</p>
</div>

## ✨ Features

- **CLI** - `config-sync` CLI for syncing the config from the command line
- **GUI** - Settings page for syncing the config in Strapi admin
- **Partial sync** - Import or export only specific portions of config
- **Custom types** - Include your custom collection types in the sync process
- **Import on bootstrap** - Easy automated deployment with `importOnBootstrap`
- **Exclusion** - Exclude single config entries or all entries of a given type
- **Diff viewer** - A git-style diff viewer to inspect the config changes

## ⏳ Getting started

[Read the Getting Started tutorial](https://docs.pluginpal.io/config-sync) or follow the steps below:

```bash
# using yarn
yarn add strapi-plugin-config-sync

# using npm
npm install strapi-plugin-config-sync --save
```
 
Add the export path to the `watchIgnoreFiles` list in the `config/admin.js` file.
This way your app won't reload when you export the config in development.

##### `config/admin.js`:
```
module.exports = ({ env }) => ({
  // ...
  watchIgnoreFiles: [
    '**/config/sync/**',
  ],
});
```

After successful installation you have to rebuild the admin UI so it'll include this plugin. To rebuild and restart Strapi run:

```bash
# using yarn
yarn build
yarn develop

# using npm
npm run build
npm run develop
```

The **Config Sync** plugin should now appear in the **Settings** section of your Strapi app.

To start tracking your config changes you have to make the first export. This will dump all your configuration data to the `/config/sync` directory. You can export either through [the CLI](https://docs.pluginpal.io/config-sync/cli) or [Strapi admin panel](https://docs.pluginpal.io/config-sync/admin-gui)

Enjoy 🎉

## 📓 Documentation

See our dedicated [repository](https://github.com/pluginpal/docs) for all of PluginPal's documentation, or view the Config Sync documentation live:

- [Config Sync documentation](https://docs.pluginpal.io/config-sync)

## 🤝 Contributing

Feel free to fork and make a pull request of this plugin. All the input is welcome!

## ⭐️ Show your support

Give a star if this project helped you.

## 🔗 Links

- [PluginPal marketplace](https://www.pluginpal.io/plugin/config-sync)
- [NPM package](https://www.npmjs.com/package/strapi-plugin-config-sync)
- [GitHub repository](https://github.com/boazpoolman/strapi-plugin-config-sync)
- [Strapi marketplace](https://market.strapi.io/plugins/strapi-plugin-config-sync)

## 🌎 Community support

- For general help using Strapi, please refer to [the official Strapi documentation](https://strapi.io/documentation/).
- For support with this plugin you can DM me in the Strapi Discord [channel](https://discord.strapi.io/).

## 📝 Resources

- [MIT License](https://github.com/pluginpal/strapi-plugin-config-sync/blob/master/LICENSE.md)
