#!/usr/bin/env node

const { Command } = require('commander');
const Table = require('cli-table');
const chalk = require('chalk');
const inquirer = require('inquirer');
const { isEmpty } = require('lodash');
const strapi = require('@strapi/strapi');

const warnings = require('../server/warnings');
const packageJSON = require('../package.json');

const program = new Command();

const initTable = (head) => {
  return new Table({
    head: [chalk.green('Name'), chalk.green(head || 'State')],
    colWidths: [65, 20],
    chars: { top: '═',
      'top-mid': '╤',
      'top-left': '╔',
      'top-right': '╗',
      bottom: '═',
      'bottom-mid': '╧',
      'bottom-left': '╚',
      'bottom-right': '╝',
      left: '║',
      'left-mid': '╟',
      mid: '─',
      'mid-mid': '┼',
      right: '║',
      'right-mid': '╢',
      middle: '│',
    },
  });
};

const getConfigState = (diff, configName, syncType) => {
  if (
    diff.fileConfig[configName]
    && diff.databaseConfig[configName]
  ) {
    return chalk.yellow(syncType ? 'Update' : 'Different');
  } else if (
    diff.fileConfig[configName]
    && !diff.databaseConfig[configName]
  ) {
    if (syncType === 'import') {
      return chalk.green('Create');
    } else if (syncType === 'export') {
      return chalk.red('Delete');
    } else {
      return chalk.red('Only in sync dir');
    }
  } else if (
    !diff.fileConfig[configName]
    && diff.databaseConfig[configName]
  ) {
    if (syncType === 'import') {
      return chalk.red('Delete');
    } else if (syncType === 'export') {
      return chalk.green('Create');
    } else {
      return chalk.green('Only in DB');
    }
  }
};

const handleAction = async (syncType, skipConfirm, configType, partials) => {
  const app = await strapi().load();
  const diff = await app.plugin('config-sync').service('main').getFormattedDiff();

  // No changes.
  if (isEmpty(diff.diff)) {
    console.log(`${chalk.cyan.bold('[notice]')} There are no changes to ${syncType}.`);
    process.exit(0);
  }

  // Init table.
  const table = initTable('Action');
  const configNames = partials && partials.split(',');
  const partialDiff = {};

  // Fill partialDiff with arguments.
  if (configNames) {
    configNames.map((name) => {
      if (diff.diff[name]) partialDiff[name] = diff.diff[name];
    });
  }
  if (configType) {
    Object.keys(diff.diff).map((name) => {
      if (configType === name.split('.')[0]) {
        partialDiff[name] = diff.diff[name];
      }
    });
  }

  // No changes for partial diff.
  if ((partials || configType) && isEmpty(partialDiff)) {
    console.log(`${chalk.cyan.bold('[notice]')} There are no changes for the specified config.`);
    process.exit(0);
  }

  const finalDiff = (partials || configType) && partialDiff ? partialDiff : diff.diff;

  // Add diff to table.
  Object.keys(finalDiff).map((configName) => {
    table.push([configName, getConfigState(diff, configName, syncType)]);
  });

  // Print table.
  console.log(table.toString(), '\n');

  // Prompt to confirm.
  let answer = {};
  if (!skipConfirm) {
    answer = await inquirer.prompt([{
      type: 'confirm',
      name: 'confirm',
      message: `Are you sure you want to ${syncType} the config changes?`,
    }]);
    console.log('');
  }

  // Preform the action.
  if (skipConfirm || answer.confirm) {
    if (syncType === 'import') {
      const onSuccess = (name) => console.log(`${chalk.cyan.bold('[notice]')} Imported ${name}`);
      try {
        await Promise.all(Object.keys(finalDiff).map(async (name) => {
          let warning;
          if (
            getConfigState(diff, name, syncType) === chalk.red('Delete')
            && warnings.delete[name]
          ) warning = warnings.delete[name];

          await app.plugin('config-sync').service('main').importSingleConfig(name, onSuccess);
          if (warning) console.log(`${chalk.yellow.bold('[warning]')} ${warning}`);
        }));
        console.log(`${chalk.green.bold('[success]')} Finished import`);
      } catch (e) {
        console.log(`${chalk.red.bold('[error]')} Something went wrong during the import. ${e}`);
      }
    }
    if (syncType === 'export') {
      const onSuccess = (name) => console.log(`${chalk.cyan.bold('[notice]')} Exported ${name}`);

      try {
        await Promise.all(Object.keys(finalDiff).map(async (name) => {
          await app.plugin('config-sync').service('main').exportSingleConfig(name, onSuccess);
        }));
        console.log(`${chalk.green.bold('[success]')} Finished export`);
      } catch (e) {
        console.log(`${chalk.red.bold('[error]')} Something went wrong during the export. ${e}`);
      }
    }
  }

  process.exit(0);
};

// Initial program setup
program.storeOptionsAsProperties(false).allowUnknownOption(true);

program.helpOption('-h, --help', 'Display help for command');
program.addHelpCommand('help [command]', 'Display help for command');

// `$ config-sync version` (--version synonym)
program.version(packageJSON.version, '-v, --version', 'Output the version number');
program
  .command('version')
  .description('Output your version of the config-sync plugin')
  .action(() => {
    process.stdout.write(`${packageJSON.version}\n`);
    process.exit(0);
  });

// `$ config-sync import`
program
  .command('import')
  .alias('i')
  .option('-t, --type <type>', 'The type of config')
  .option('-p, --partial <partials>', 'A comma separated string of configs')
  .option('-y, --yes', 'Skip the confirm prompt')
  .description('Import the config')
  .action(async ({ yes, type, partial }) => {
    return handleAction('import', yes, type, partial);
  });

// `$ config-sync export`
program
  .command('export')
  .alias('e')
  .option('-t, --type <type>', 'The type of config')
  .option('-p, --partial <partials>', 'A comma separated string of configs')
  .option('-y, --yes', 'Skip the confirm prompt')
  .description('Export the config')
  .action(async ({ yes, type, partial }) => {
    return handleAction('export', yes, type, partial);
  });

// `$ config-sync diff`
program
  .command('diff')
  .alias('d')
  // .option('-t, --type <type>', 'The type of config') // TODO: partial diff
  .description('The config diff')
  .action(async ({ type }) => {
    const app = await strapi().load();
    const diff = await app.plugin('config-sync').service('main').getFormattedDiff();

    // No changes.
    if (isEmpty(diff.diff)) {
      console.log(`${chalk.cyan.bold('[notice]')} No differences between DB and sync directory.`);
      process.exit(0);
    }

    // Init table.
    const table = initTable();

    // Add diff to table.
    Object.keys(diff.diff).map((configName) => {
      table.push([configName, getConfigState(diff, configName)]);
    });

    // Print table.
    console.log(table.toString());

    process.exit(0);
  });

program.parseAsync(process.argv);
