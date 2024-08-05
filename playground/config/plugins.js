module.exports = {
  'config-sync': {
    enabled: true,
    config: {
      importOnBootstrap: false,
      minify: false,
      customTypes: [
        {
          configName: "home",
          queryString: "api::home.home",
          uid: ["slug"],
          components: [
            "Profile",
            "Profile.ContactInfo",
          ],
        }
      ]
    },
  },
};
