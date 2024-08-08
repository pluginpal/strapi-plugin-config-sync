'use strict';

/**
 * home service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::home.home');
