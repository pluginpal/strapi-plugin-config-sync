'use strict';

const util = require('util');
const exec = util.promisify(require('child_process').exec);

jest.setTimeout(20000);

describe('Test the config-sync CLI', () => {

  afterAll(async () => {
    // Remove the generated files and the DB.
    await exec('rm -rf config/sync');
    await exec('rm -rf .tmp');
  });

  test('Export', async () => {
    const { stdout } = await exec('yarn cs export -y');
    expect(stdout).toContain('Finished export');
  });
  test('Import', async () => {
    await exec('rm -rf config/sync/admin-role.strapi-editor.json');
    const { stdout } = await exec('yarn cs import -y');
    expect(stdout).toContain('Finished import');
  });
  test('Diff', async () => {
    const { stdout } = await exec('yarn cs diff');
    expect(stdout).toContain('No differences between DB and sync directory');
  });
});
