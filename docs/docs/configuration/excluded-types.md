---
sidebar_label: 'Excluded types'
displayed_sidebar: configSyncSidebar
slug: /configuration/excluded-types
---

# Excluded types

This setting will exclude all the config from a given type from the syncing process. The config types are specified by the `configName` of the type.

For example:

```
excludedTypes: ['admin-role']
```

| Name | Details |
| ---- | ------- |
| Key | `excludedTypes` |
| Required | false |
| Type | array |
| Default | `[]` |
