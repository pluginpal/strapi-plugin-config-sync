---
sidebar_label: 'Admin GUI'
displayed_sidebar: configSyncSidebar
slug: /admin-gui
---

# 🖥️ Admin panel (GUI)
This plugin ships with a React app which can be accessed from the settings page in Strapi admin panel. On this page you can pretty much do the same as you can from the CLI. You can import, export and see the difference between the config as found in the sync directory, and the config as found in the database.

**Pro tip:**
By clicking on one of the items in the diff table you can see the exact difference between sync dir and database in a git-style diff viewer.

If a config file contains invalid JSON, its state is **Invalid file**. Open it to see the parsing error and its location instead of a misleading diff.
Importing an invalid file shows an error. Exporting can replace it with the database version; if no database version exists, export reports the error and leaves the file untouched.

![Config diff in admin](/img/assets/admin-diff-viewer.png)
