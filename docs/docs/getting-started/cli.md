---
sidebar_label: 'CLI'
displayed_sidebar: configSyncSidebar
slug: /cli
---

# 🔌 Command line interface (CLI)

Add the `config-sync` command as a script to the `package.json` of your Strapi project:

```
"scripts": {
  // ...
  "cs": "config-sync"
},
```

You can now run all the `config-sync` commands like this:

<Tabs groupId="yarn-npm">
  <TabItem value="yarn" label="Yarn">
    ```
    yarn cs --help
    ```
  </TabItem>
  <TabItem value="npm" label="NPM">
    ```
    npm run cs -- --help
    ```
  </TabItem>
</Tabs>

## ⬆️ Import ⬇️ Export

> _Command:_ `import` _Alias:_ `i`
> 
> _Command:_ `export` _Alias:_ `e`

These commands are used to sync the config in your Strapi project. 

_Example:_

<Tabs groupId="yarn-npm">
  <TabItem value="yarn" label="Yarn">
    ```
    yarn cs import
    yarn cs export
    ```
  </TabItem>
  <TabItem value="npm" label="NPM">
    ```
    npm run cs import
    npm run cs export
    ```
  </TabItem>
</Tabs>

:::info
When you're using `npm` to run these commands, please note that you need an extra `--` to forward the flags to the script.
More information about this topic can be found on the <a href="https://docs.npmjs.com/cli/commands/npm-run-script">NPM documentation</a>.

Example:
```
npm run cs import -- --yes
```
:::

### Flag: `-y`, `--yes`

Use this flag to skip the confirm prompt and go straight to syncing the config.

```bash
[command] --yes
```

### Flag: `-t`, `--type`

Use this flag to specify the type of config you want to sync.

```bash
[command] --type user-role
```

### Flag: `-p`, `--partial`

Use this flag to sync a specific set of configs by giving the CLI a comma-separated string of config names.

```bash
[command] --partial user-role.public,i18n-locale.en
```

### Flag: `-f`, `--force`

If you're using the soft setting to gracefully import config, you can use this flag to ignore the setting for the current command and forcefully import all changes anyway.

```bash
[command] --force
```

## ↔️ Diff

> _Command:_ `diff` | _Alias:_ `d`

This command is used to see the difference between the config as found in the sync directory, and the config as found in the database.

_Example:_

<Tabs groupId="yarn-npm">
  <TabItem value="yarn" label="Yarn">
    ```
    yarn cs diff
    ```
  </TabItem>
  <TabItem value="npm" label="NPM">
    ```
    npm run cs diff
    ```
  </TabItem>
</Tabs>

### Argument: `<single>`

Add a single config name as the argument of the `diff` command to see the difference of that single file in a git-style diff viewer.

_Example:_

<Tabs groupId="yarn-npm">
  <TabItem value="yarn" label="Yarn">
    ```
    yarn cs diff user-role.public
    ```
  </TabItem>
  <TabItem value="npm" label="NPM">
    ```
    npm run cs diff user-role.public
    ```
  </TabItem>
</Tabs>
