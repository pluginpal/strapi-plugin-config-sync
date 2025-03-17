---
sidebar_label: 'Config Types'
displayed_sidebar: configSyncSidebar
slug: /config-types
---

# 🚀 Config types

By default the plugin will track 4 (official) types. 

To track your own custom types you can register them by setting some plugin config.

## Default types

These 4 types are by default registered in the sync process. 

### Admin role

> Config name: `admin-role` | UID: `code` | Query string: `admin::role`

### User role

> Config name: `user-role` | UID: `type` | Query string: `plugin::users-permissions.role`

### Core store

> Config name: `core-store` | UID: `key` | Query string: `strapi::core-store`

### I18n locale

> Config name: `i18n-locale` | UID: `code` | Query string: `plugin::i18n.locale`

## Custom types

Your custom types can be registered through the `customTypes` plugin config. This is a setting that can be set in the `config/plugins.js` file in your project.

_Read more about the `config/plugins.js` file [here](/configuration)._

You can register a type by giving the `customTypes` array an object which contains at least the following 3 properties:

```
customTypes: [{
  configName: 'webhook',
  queryString: 'webhook',
  uid: 'name',
}],
```

_The example above will register the Strapi webhook type._

### Config name

The name of the config type. This value will be used as the first part of the filename for all config of this type. It should be unique from the other types and is preferably written in kebab-case.

##### Key: `configName`

> `required:` YES | `type:` string

### Query string

This is the query string of the type. Each type in Strapi has its own query string you can use to programatically preform CRUD actions on the entries of the type. Often for custom types in Strapi the format is something like `api::custom-api.custom-type`.

##### Key: `queryString`

> `required:` YES | `type:` string

### UID

The UID represents a field on the registered type. The value of this field will act as a unique identifier to identify the entries across environments. Therefore it should be unique and preferably un-editable after initial creation.

Mind that you can not use an auto-incremental value like the `id` as auto-increment does not play nice when you try to match entries across different databases.

If you do not have a single unique value, you can also pass in an array of keys for a combined uid key. This is for example the case for all content types which use i18n features (An example config would be `uid: ['productId', 'locale']`).

##### Key: `uid`

> `required:` YES | `type:` string | string[]

### Relations

The relations array specifies the relations you want to include in the sync process.
This feature is used to sync the relations between `roles` and `permissions`. See https://github.com/boazpoolman/strapi-plugin-config-sync/blob/master/server/config/types.js#L16.

Example:
```
{
  configName: 'admin-role',
  queryString: 'admin::role',
  uid: 'code',
  relations: [{
    queryString: 'admin::permission',
    relationName: 'permissions',
    parentName: 'role',
    relationSortFields: ['action', 'subject'],
  }],
},
```

##### Key: `relations`

> `required:` NO | `type:` array

### Components

This property can accept an array of component names from the type. Strapi Components can be included in the export/import process. With "." nested components can also be included in the process.
```
customTypes: [{
  configName: 'webhook',
  queryString: 'webhook',
  uid: 'name',
  components: ['ParentComponentA', 'ParentComponentA.ChildComponent', 'ParentComponentB']
}],
```

##### Key: `components`

> `required:` NO | `type:` array

### JSON fields

This property can accept an array of field names from the type. It is meant to specify the JSON fields on the type so the plugin can better format the field values when calculating the config difference.

##### Key: `jsonFields`

> `required:` NO | `type:` array
