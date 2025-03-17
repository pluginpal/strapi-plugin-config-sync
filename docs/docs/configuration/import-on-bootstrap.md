---
sidebar_label: 'Import on bootstrap'
displayed_sidebar: configSyncSidebar
slug: /configuration/import-on-bootstrap
---

# Import on bootstrap

Allows you to let the config be imported automaticly when strapi is bootstrapping (on `strapi start`). 

:::danger
This setting can't be used locally and should be handled very carefully as it can unintendedly overwrite the changes in your database. **PLEASE USE WITH CARE**.
:::

| Name | Details |
| ---- | ------- |
| Key | `importOnBootstrap` |
| Required | false |
| Type | bool |
| Default | `false` |
