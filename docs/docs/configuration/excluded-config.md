---
sidebar_label: 'Excluded config'
displayed_sidebar: configSyncSidebar
slug: /configuration/excluded-config
---

# Excluded config

Specify the names of configs you want to exclude from the syncing process. By default the API tokens for users-permissions, which are stored in core_store, are excluded. This setting expects the config names to comply with the naming convention.

| Name | Details |
| ---- | ------- |
| Key | `excludedConfig` |
| Required | false |
| Type | array |
| Default | `['core-store.plugin_users-permissions_grant', 'core-store.plugin_upload_metrics', 'core-store.strapi_content_types_schema', 'core-store.ee_information',]` |
