---
sidebar_label: 'Motivation'
displayed_sidebar: configSyncSidebar
slug: /motivation
---

# 💡 Motivation

In Strapi we come across what I would call config types. These are models of which the records are stored in our database, just like content types. Though the big difference here is that your code ofter relies on the database records of these types. 

Having said that, it makes sense that these records can be exported, added to git, and be migrated across environments. This way we can make sure we have all the data our code relies on, on each environment.

Examples of these types are:

- Admin roles _(admin::role)_
- User roles _(plugin::users-permissions.role)_
- Admin settings _(strapi::core-store)_
- I18n locale _(plugin::i18n.locale)_

This plugin gives you the tools to sync this data. You can export the data as JSON files on one env, and import them on every other env. By writing this data as JSON files you can easily track them in your version control system (git).

_With great power comes great responsibility - Uncle Ben_
