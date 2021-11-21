<div align="center">
<h1>Strapi config-sync plugin</h1>
	
<p style="margin-top: 0;">CLI & GUI for syncing config data across environments.</p>
	
<p>
  <a href="https://www.npmjs.org/package/strapi-plugin-config-sync">
    <img src="https://img.shields.io/npm/v/strapi-plugin-config-sync/latest.svg" alt="NPM Version" />
  </a>
  <a href="https://www.npmjs.org/package/strapi-plugin-config-sync">
    <img src="https://img.shields.io/npm/dm/strapi-plugin-config-sync" alt="Monthly download on NPM" />
  </a>
  <a href="https://codecov.io/gh/boazpoolman/strapi-plugin-config-sync">
    <img src="https://img.shields.io/github/workflow/status/boazpoolman/strapi-plugin-config-sync/Tests/master" alt="CI build status" />
  </a>
  <a href="https://codecov.io/gh/boazpoolman/strapi-plugin-config-sync">
    <img src="https://codecov.io/gh/boazpoolman/strapi-plugin-config-sync/coverage.svg?branch=master" alt="codecov.io" />
  </a>
</p>
</div>

## ✨ Features

- **CLI** (`config-sync` CLI for syncing the config from the command line)
- **GUI** (Settings page for syncing the config in Strapi admin)
- **Partial sync** (Import or export only specific portions of config)
- **Exclude configs** (Exclude specific config from the sync)


## ⏳ Installation

Install the plugin in your Strapi project.

```bash
# using yarn
yarn add strapi-plugin-config-sync

# using npm
npm install strapi-plugin-config-sync --save
```
 
Add the export path to the `watchIgnoreFiles` list in the `config/admin.js` file.
This way your app won't reload when you export the config in development.

##### `config/admin.js`:

	auth: {
      // ...
	},
	watchIgnoreFiles: [
	  '**/config-sync/files/**',
	],


After successful installation you have to rebuild the admin UI so it'll include this plugin. To rebuild and restart Strapi run:

```bash
# using yarn
yarn build --clean
yarn develop

# using npm
npm run build --clean
npm run develop
```

The **Config Sync** plugin should appear in the **Plugins** section of Strapi sidebar after you run app again.

Enjoy 🎉

## 🖐 Requirements

Complete installation requirements are the exact same as for Strapi itself and can be found in the [Strapi documentation](https://strapi.io/documentation).

**Supported Strapi versions**:

- Strapi ^4.0.0-beta.14 (recently tested)
- Strapi ^4.x
- Strapi ^3.4.x (use `strapi-plugin-config-sync@0.1.6`)

(This plugin may work with older Strapi versions, but these are not tested nor officially supported at this time.)

**We recommend always using the latest version of Strapi to start your new projects**.

## 💡 Motivation
In Strapi we come across what I would call config types. These are models of which the records are stored in our database. Just like content types. Though the difference is that for config types you would want the records to be the same on all your environments.

Examples of these types are:

- Admin roles _(admin::role)_
- User roles _(plugin::users-permissions.role)_
- Admin settings _(strapi::core-store)_
- I18n locale _(plugin::i18n.locale)_

This plugin gives you the tools to sync this data across environments. You can export the data as JSON files on one env, and import them on every other env. By writing this data as JSON files you can easily track them in your version control system (git).

_With great power comes great responsibility - Spider-Man_

## 🔌 Command line interface (CLI)

To enable the `config-sync` CLI add the following script to the `package.json` of your Strapi project:

```
"scripts": {
  // ...
  "cs": "config-sync"
},
```

You can now run all the `config-sync` commands like this:

```bash
# using yarn
yarn cs --help

# using npm
npm run cs --help
```

### ⬆️ Import ⬇️ Export

> _Command:_ `import` _Alias:_ `i`
> 
> _Command:_ `export` _Alias:_ `e`

These commands are used to sync the config in your Strapi project. 

_Example:_

```bash
# using yarn
yarn cs import
yarn cs export

# using npm
npm run cs import
npm run cs export
```

##### Flag: `--yes` `-y`

Use this flag to skip the confirm prompt and go straight to syncing the config.

```bash
[command] --yes
```

##### Flag: `--type` `-t`

Use this flag to specify the type of config you want to sync.

```bash
[command] --type user-role
```

##### Flag: `--partial` `-p`

Use this flag to sync a specific set of configs by giving the CLI a comma-separated string of config names.

```bash
[command] --partial user-role.public,i18n-locale.en
```
### ↔️ Diff

> _Command:_ `diff` | _Alias:_ `d`

This command is used to see the difference between the config as found in the sync directory, and the config as found in the database.

_Example:_

```bash
# using yarn
yarn cs diff

# using npm
npm run cs diff
```

## 🖥️ Admin panel (GUI)
This plugin ships with a settings page which can be accessed from the admin panel of Strapi. On this page you can do pretty much the same as you can from the CLI. You can import, export and see the difference between the config as found in the sync directory, and the config as found in the database.

**Pro tip:**
By clicking on one of the items in the diff table you can see the exact difference between sync dir and database in a git-style diff viewer.

<img src="https://raw.githubusercontent.com/boazpoolman/strapi-plugin-config-sync/master/.github/config-diff.png" alt="Config diff in admin" />

## 🚀 Config types

### Admin role

> Key: `admin-role` | UID: `code` | Query string: `admin::role`

### User role

> Key: `user-role` | UID: `type` | Query string: `plugin::users-permissions.role`

### Core store

> Key: `core-store` | UID: `key` | Query string: `strapi::core-store`

### I18n locale

> Key: `i81n-locale` | UID: `code` | Query string: `plugin::i18n.locale`

## 🔧 Settings
The settings of the plugin can be overridden in the `config/plugins.js` file. 
In the example below you can see how, and also what the default settings are.

##### `config/plugins.js`:
	module.exports = ({ env }) => ({
	  // ...
	  'config-sync': {
	    // ...
	    config: {
	      destination: "extensions/config-sync/files/",
	      minify: false,
	      importOnBootstrap: false,
	      include: [
	        "core-store",
	        "user-role"
	        "admin-role"
	        "i18n-locale"
	      ],
	      exclude: [
	        "core-store.plugin_users-permissions_grant"
	      ],
	    },
	  },
	});

| Property | Type | Description |
| -------- | ---- | ----------- |
| destination | string | The path for reading and writing the sync files. |
| minify | bool | When enabled all the exported JSON files will be minified. |
| importOnBootstrap | bool | Allows you to let the config be imported automaticly when strapi is bootstrapping (on `strapi start`). This setting should only be used in production, and should be handled very carefully as it can unintendedly overwrite the changes in your database. PLEASE USE WITH CARE. |
| include | array | Types you want to include in the syncing process. Allowed values: `core-store`, `user-role`, `admin-role`, `i18n-locale`. |
| exclude | array | Specify the names of configs you want to exclude from the syncing process. By default the API tokens for users-permissions, which are stored in core_store, are excluded. This setting expects the config names to comply with the naming convention. |

## 🔍 Naming convention
All the config files written in the sync directory have the same naming convention. It goes as follows:

	[config-type].[config-name].json

- `config-type` - Corresponds to the `key` of the config type.
- `config-name` - The unique identifier of the config. 
	- 	For `core-store` config this is the `key` value.
	-  	For `user-role` config this is the `type` value.
	-  For `admin-role` config this is the `code` value.
	-  	For `i18n-locale` config this is the `code` value
  

## 🤝 Contributing

Feel free to fork and make a pull request of this plugin. All the input is welcome!

## ⭐️ Show your support

Give a star if this project helped you.

## 🔗 Links

- [NPM package](https://www.npmjs.com/package/strapi-plugin-config-sync)
- [GitHub repository](https://github.com/boazpoolman/strapi-plugin-config-sync)

## 🌎 Community support

- For general help using Strapi, please refer to [the official Strapi documentation](https://strapi.io/documentation/).
- For support with this plugin you can DM me in the Strapi Discord [channel](https://discord.strapi.io/).

## 📝 Resources

- [MIT License](LICENSE.md)
