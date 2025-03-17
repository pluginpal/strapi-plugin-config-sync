---
sidebar_label: 'Workflow'
displayed_sidebar: configSyncSidebar
slug: /workflow
---

# ⌨️ Usage / Workflow
This plugin works best when you use `git` for the version control of your Strapi project.

_The following workflows are assuming you're using `git`._

### Intro
All database records tracked with this plugin will be exported to JSON files. Once exported each change to the file or the record will be tracked. Meaning you can now do one of two things:

- Change the file(s), and run an import. You have now imported from filesystem -> database.
- Change the record(s), and run an export. You have now exported from database -> filesystem. 

### Local development
When building a new feature locally for your Strapi project you'd use the following workflow:

- Build the feature.
- Export the config.
- Commit and push the files to git.

### Deployment
When deploying the newly created feature - to either a server, or a co-worker's machine - you'd use the following workflow:

- Pull the latest file changes to the environment.
- (Re)start your Strapi instance.
- Import the config.

## Production deployment
The production deployment will be the same as a regular deployment. You just have to be careful before running the import. Ideally making sure the are no open changes before you pull the new code to the environment.
