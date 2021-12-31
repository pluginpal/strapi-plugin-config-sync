module.exports = ({ env }) => ({
  'config-sync': {
    config: {
      excludedConfig: [
        'core-store.plugin_users-permissions_grant',
        'user-role.public',
      ],
    },
  },
});
