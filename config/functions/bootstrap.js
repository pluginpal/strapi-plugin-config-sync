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

module.exports = () => {
  if (strapi.plugins.config.config.importOnBootstrap) {
    if (fs.existsSync(strapi.plugins.config.config.destination)) {
      const configFiles = fs.readdirSync(strapi.plugins.config.config.destination);

      configFiles.map((file) => {
        strapi.plugins.config.services.config.importFromFile(file.slice(0, -5));
      });
    }
  }
};
