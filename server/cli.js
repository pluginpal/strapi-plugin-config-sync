#!/usr/bin/env node

const { Command } = require('commander');
const Table = require('cli-table');
const chalk = require('chalk');
const inquirer = require('inquirer');

const packageJSON = require('../package.json');

const program = new Command();

const initTable = () => {
  return new Table({
    head: [chalk.green('Name'), chalk.green('State')],
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
  .option('-t, --type <type>', 'The type of config')
  .description('Import the config')
  .action(async (args) => {
    console.log('import', args);

    // Init table.
    const table = initTable();

    // Fill table.
    table.push(
      ['admin-role.author', chalk.yellow('different')],
      ['core-store.plugin_i18n_default_locale', chalk.green('Only in DB')],
    );

    // Print table.
    console.log(table.toString());

    // Prompt to confirm.
    const answer = await inquirer.prompt([{
      type: 'confirm',
      name: 'confirm',
      message: 'Are you sure you want to import the config changes?',
    }]);

    // Make the import.
    if (answer.confirm) {
      console.log(chalk.magenta('IMPORT!!'));
    }
  });

// `$ config-sync export`
program
  .command('export')
  .option('-t, --type <type>', 'The type of config')
  .description('Export the config')
  .action(async (args) => {
    console.log('export', args);

    // Init table.
    const table = initTable();

    // Fill table.
    table.push(
      ['admin-role.author', chalk.yellow('different')],
      ['core-store.plugin_i18n_default_locale', chalk.green('Only in DB')],
    );

    // Print table.
    console.log(table.toString());

    // Prompt to confirm.
    const answer = await inquirer.prompt([{
      type: 'confirm',
      name: 'confirm',
      message: 'Are you sure you want to export the config changes?',
    }]);

    // Make the export.
    if (answer.confirm) {
      console.log(chalk.magenta('EXPORT!!'));
    }
  });

// `$ config-sync diff`
program
.command('diff')
.option('-t, --type <type>', 'The type of config')
.description('The config diff')
.action(async (args) => {
  console.log('diff', args);

  // Init table.
  const table = initTable();

  // Fill table.
  table.push(
    ['admin-role.author', chalk.yellow('different')],
    ['core-store.plugin_i18n_default_locale', chalk.green('Only in DB')],
  );

  // Print table.
  console.log(table.toString());
});

program.parseAsync(process.argv);
