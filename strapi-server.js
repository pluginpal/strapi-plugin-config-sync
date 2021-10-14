'use strict';

const bootstrap = require('./server/bootstrap');
const services = require('./server/services');
const routes = require('./server/routes');
const config = require('./server/config');
const controllers = require('./server/controllers');

module.exports = () => {
  return {
    bootstrap,
    routes,
    config,
    controllers,
    services,
  };
};
