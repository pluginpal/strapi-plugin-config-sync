#!/usr/bin/env node

const { Command } = require('commander');
const Table = require('cli-table');
const chalk = require('chalk');
const inquirer = require('inquirer');
const { isEmpty } = require('lodash');
const strapi = require('@strapi/strapi');

const packageJSON = require('../package.json');

const program = new Command();

const initTable = (head) => {
  return new Table({
    head: [chalk.green('Name'), chalk.green(head || 'State')],
    colWidths: [50, 15],
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

const handleAction = async (type, skipConfirm) => {
  const app = await strapi().load();
  const diff = await app.plugin('config-sync').service('main').getFormattedDiff();

  // No changes.
  if (isEmpty(diff.diff)) {
    console.log(`${chalk.cyan('[notice]')} There are no changes to ${type}`);
    process.exit(0);
  }

  // Init table.
  const table = initTable('Action');

  // Add diff to table.
  Object.keys(diff.diff).map((configName) => {
    table.push([configName, getConfigState(diff, configName, type)]);
  });

  // Print table.
  console.log(table.toString(), '\n');

  // Prompt to confirm.
  let answer = {};
  if (!skipConfirm) {
    answer = await inquirer.prompt([{
      type: 'confirm',
      name: 'confirm',
      message: `Are you sure you want to ${type} the config changes?`,
    }]);
    console.log('');
  }

  // Preform the action.
  if (skipConfirm || answer.confirm) {
    if (type === 'import') {
      const onSuccess = (name) => console.log(`${chalk.green('[success]')} Imported ${name}`);

      try {
        await app.plugin('config-sync').service('main').importAllConfig(null, onSuccess);
      } catch (e) {
        console.log(`${chalk.red('[error]')} Something went wrong during the import. ${e}`);
      }
    }
    if (type === 'export') {
      try {
        await app.plugin('config-sync').service('main').exportAllConfig();
        console.log(`${chalk.green('[success]')} Exported config`);
      } catch (e) {
        console.log(`${chalk.red('[error]')} Something went wrong during the export. ${e}`);
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
  // .option('-t, --type <type>', 'The type of config') // TODO: partial import
  .option('-y', 'Skip the confirm prompt')
  .description('Import the config')
  .action(async ({ y, type }) => {
    return handleAction('import', y, type);
  });

// `$ config-sync export`
program
  .command('export')
  // .option('-t, --type <type>', 'The type of config') // TODO: partial export
  .option('-y', 'Skip the confirm prompt')
  .description('Export the config')
  .action(async ({ y, type }) => {
    return handleAction('export', y, type);
  });

// `$ config-sync diff`
program
  .command('diff')
  // .option('-t, --type <type>', 'The type of config') // TODO: partial diff
  .description('The config diff')
  .action(async ({ type }) => {
    const app = await strapi().load();
    const diff = await app.plugin('config-sync').service('main').getFormattedDiff();

    // No changes.
    if (isEmpty(diff.diff)) {
      console.log(`${chalk.cyan('[notice]')} There is no config diff, you are up to date.`);
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
