'use strict';

const fs = require('fs');
const types = require('./types');

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
  // console.log(await types['core-store'].exportAll());

  if (strapi.plugins['config-sync'].config.importOnBootstrap) {
    if (fs.existsSync(strapi.plugins['config-sync'].config.destination)) {
      await strapi.plugins['config-sync'].services.main.importAllConfig();
    }
  }
};
