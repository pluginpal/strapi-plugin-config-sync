'use strict';

const fs = require('fs');

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/v3.x/concepts/configurations.html#bootstrap
 */

module.exports = async () => {
  // Import on bootstrap.
  if (strapi.plugins['config-sync'].config.importOnBootstrap) {
    if (fs.existsSync(strapi.plugins['config-sync'].config.destination)) {
      await strapi.plugins['config-sync'].services.main.importAllConfig();
    }
  }

  // Register permission actions.
  const actions = [
    {
      section: 'plugins',
      displayName: 'Access the plugin settings',
      uid: 'settings.read',
      pluginName: 'config-sync',
    },
    {
      section: 'plugins',
      displayName: 'Link to plugin settings from the main menu',
      uid: 'menu-item',
      pluginName: 'config-sync',
    },
  ];
  await strapi.admin.services.permission.actionProvider.registerMany(actions);
};
