---
sidebar_label: 'Generic update'
displayed_sidebar: configSyncSidebar
slug: /upgrading/generic-update
---

# Updating Config Sync

We are always working to make Config Sync better by fixing bugs and introducing new features. These changes will be released as minor or patch versions as defined in the Semantic Versioning specification.

## Bump a minor/patch version

When you're updating Config Sync you'll have to follow these steps:

1. Make sure there are no config changes before starting. Either export or import all staged changes.
2. Update the version of the `strapi-plugin-config-sync` package in your `package.json` using your package manager of choice (yarn/npm/pnpm)
3. After you've bumped the version make sure to export any new changes that are now shown. It is possible that new configs are introduced, or old ones are updated/removed.
4. You're now ready to push these changes an commit them to your source control!
