'use strict';

module.exports = {
  type: 'admin',
  routes: [
    {
      method: "GET",
      path: "/export",
      handler: "config.exportAll",
      config: {
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/import",
      handler: "config.importAll",
      config: {
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/diff",
      handler: "config.getDiff",
      config: {
        policies: [],
      },
    },
  ],
};
