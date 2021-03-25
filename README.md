# Strapi Plugin Config Sync

A lot of configuration of your Strapi project is stored in the database. Like core_store, user permissions, user roles & webhooks. Things you might want to have the same on all environments. But when you update them locally, you will have to manually update them on all other environments too.

That's where this plugin comes in to play. It allows you to export these configs as individual JSON files for each config, and write them somewhere in your project. With the configs written in your filesystem your can keep track of them through version control (git), and easily pull and import them across environments.

Importing, exporting and keeping track of config changes is done in the admin page of the plugin.

**THIS PLUGIN IS NOT STABLE**

**PLEASE USE WITH CARE**

<img src=".github/config-diff.png" alt="Strapi config-sync changes" />

## Installation

Use `npm` or `yarn` to install and build the plugin.

	yarn add strapi-plugin-config-sync
	yarn build
	yarn develop

Add the export path to the `watchIgnoreFiles` list in `config/server.js`.
This way your app won't reload when you export the config in development.

##### `config/server.js`:

	admin: {
	  auth: {
     	...
	  },
	  watchIgnoreFiles: [
	    '**/config-sync/files/**',
	  ]
	},


## Settings
Some settings for the plugin are able to be modified by creating a file `extensions/config-sync/config/config.json` and overwriting the default settings.

#### Default settings:
	{
	  "destination": "extensions/config-sync/files/",
	  "minify": false,
	  "importOnBootstrap": false,
	  "include": [
	    "core-store",
	    "role-permissions",
	    "webhooks"
	  ],
	  "exclude": []
	}

| Property | Default | Description |
| -------- | ------- | ----------- |
| destination | extensions/config-sync/files/ | The path for reading and writing the config JSON files. |
| minify | false |  Setting to minify the JSON that's being exported. It defaults to false for better readability in git commits. |
| importOnBootstrap | false |  Allows you to let the config be imported automaticly when strapi is bootstrapping (on `yarn start`). This setting should only be used in production, and should be handled very carefully as it can unintendedly overwrite the changes in your database. PLEASE USE WITH CARE. |
| include | ["core-store", "role-permissions", "webhooks"] |  Configs you want to include. Allowed values: `core-store`, `role-permissions`, `webhooks`. |
| exclude | [] |  You might not want all your database config exported and managed in git. This settings allows you to add an array of config names which should not be tracked by the config-sync plugin. *Currently not working* |

## Naming convention
All the config files written in the file destination have the same naming convention. It goes as follows:

	[config-type].[config-name].json

- `config-type` - Corresponds to the value in from the config.include setting.
- `config-name` - The unique identifier of the config. 
	- 	For `core-store` config this is the `key` value.
	-  	For `role-permissions` config this is the `type` value.
	-  	For `webhooks` config this is the `id` value
  

## TODOs
- ~~Exporting of user roles & permissions~~
- ~~Exporting of webhooks~~
- ~~Specify which tables you want to track in the plugin configurations~~
- Exporting of EE roles & permissions
- Add partial import/export functionality
- Add CLI commands for importing/exporting
- Track config deletions

## Resources

- [MIT License](LICENSE.md)

## Links

- [NPM package](https://www.npmjs.com/package/strapi-plugin-config-sync)
- [GitHub repository](https://github.com/boazpoolman/strapi-plugin-config-sync)

## ⭐️ Show your support

Give a star if this project helped you.
