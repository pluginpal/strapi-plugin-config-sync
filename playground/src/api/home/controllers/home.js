'use strict';

/**
 * home controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::home.home');
