'use strict';

const fs = require('fs');
const util = require('util');
const fs = require('fs');
const exec = util.promisify(require('child_process').exec);

jest.setTimeout(20000);

const selectedConfig = 'admin-role.strapi-editor';
const otherConfig = 'admin-role.strapi-author';
const selectedConfigPath = `config/sync/${selectedConfig}.json`;
const otherConfigPath = `config/sync/${otherConfig}.json`;

describe('Test the config-sync CLI', () => {
  afterAll(async () => {
    // Remove the generated files and the DB.
    await exec('rm -rf config/sync');
    await exec('rm -rf .tmp');
  });

  test('Export can be declined', async () => {
    const { stdout } = await exec("printf 'n\\n' | yarn cs export");
    expect(stdout).toContain('Are you sure you want to export');
    expect(stdout).not.toContain('Finished export');
    expect(fs.existsSync('config/sync')).toBe(false);
  });

  test('Export', async () => {
    const { stdout: exportOutput } = await exec('yarn cs export -y');
    expect(exportOutput).toContain('Finished export');
    const { stdout: diffOutput } = await exec('yarn cs diff');
    expect(diffOutput).toContain('No differences between DB and sync directory');
  });

  test('Partial export only exports the selected config', async () => {
    const selectedConfigBefore = fs.readFileSync(selectedConfigPath, 'utf8');
    const otherConfigBefore = fs.readFileSync(otherConfigPath, 'utf8');
    const selectedConfigData = JSON.parse(selectedConfigBefore);
    selectedConfigData.description = `${selectedConfigData.description} (partial export test)`;
    fs.writeFileSync(selectedConfigPath, JSON.stringify(selectedConfigData));

    try {
      const { stdout: exportOutput } = await exec(`yarn cs export --partial ${selectedConfig} -y`);

      expect(exportOutput).toContain(`Exported ${selectedConfig}`);
      expect(exportOutput).not.toContain(`Exported ${otherConfig}`);
      expect(JSON.parse(fs.readFileSync(selectedConfigPath, 'utf8'))).toEqual(JSON.parse(selectedConfigBefore));
      expect(fs.readFileSync(otherConfigPath, 'utf8')).toBe(otherConfigBefore);
    } finally {
      fs.writeFileSync(selectedConfigPath, selectedConfigBefore);
    }
  });

  test('Partial import only imports the selected config', async () => {
    const selectedConfigBefore = fs.readFileSync(selectedConfigPath, 'utf8');
    const otherConfigBefore = fs.readFileSync(otherConfigPath, 'utf8');
    const selectedConfigData = JSON.parse(selectedConfigBefore);
    selectedConfigData.description = `${selectedConfigData.description} (partial import test)`;
    fs.writeFileSync(selectedConfigPath, JSON.stringify(selectedConfigData));

    try {
      const { stdout: importOutput } = await exec(`yarn cs import --partial ${selectedConfig} -y`);
      const { stdout: diffOutput } = await exec('yarn cs diff');

      expect(importOutput).toContain(`Imported ${selectedConfig}`);
      expect(importOutput).not.toContain(`Imported ${otherConfig}`);
      expect(diffOutput).toContain('No differences between DB and sync directory');
      expect(fs.readFileSync(otherConfigPath, 'utf8')).toBe(otherConfigBefore);
    } finally {
      fs.writeFileSync(selectedConfigPath, selectedConfigBefore);
      await exec(`yarn cs import --partial ${selectedConfig} -y`);
    }
  });

  test('Import (delete)', async () => {
    // Remove a file to trigger a delete.
    await exec('mv config/sync/admin-role.strapi-editor.json .tmp');
    const { stdout: importOutput } = await exec('yarn cs import -y');
    expect(importOutput).toContain('Finished import');
    const { stdout: diffOutput } = await exec('yarn cs diff');
    expect(diffOutput).toContain('No differences between DB and sync directory');
  });
  test('Import (update)', async () => {
    // Update a core-store file.
    await exec('sed -i \'s/"description":"",/"description":"test",/g\' config/sync/core-store.plugin_content_manager_configuration_content_types##plugin##users-permissions.user.json');
    // Update a file that has relations.
    await exec('sed -i \'s/{"action":"plugin::users-permissions.auth.register"},//g\' config/sync/user-role.public.json');
    const { stdout: importOutput } = await exec('yarn cs import -y');
    expect(importOutput).toContain('Finished import');
    const { stdout: diffOutput } = await exec('yarn cs diff');
    expect(diffOutput).toContain('No differences between DB and sync directory');
  });
  test('Import (create)', async () => {
    // Add a file to trigger a creation.
    await exec('mv .tmp/admin-role.strapi-editor.json config/sync/');
    const { stdout: importOutput } = await exec('yarn cs import -y');
    expect(importOutput).toContain('Finished import');
    const { stdout: diffOutput } = await exec('yarn cs diff');
    expect(diffOutput).toContain('No differences between DB and sync directory');
  });

  test('Import (unparsable file)', async () => {
    // A file that can't be parsed (a merge conflict left in it, a typo) is not a missing file:
    // importing it must fail, and leave the config in the database.
    const file = 'config/sync/user-role.public.json';
    const original = fs.readFileSync(file, 'utf8');
    fs.writeFileSync(file, '<<<<<<< HEAD\n{ "name": "Public",\n');
    let output;
    try {
      const { stdout, stderr } = await exec('yarn cs import -p user-role.public -y');
      output = stdout + stderr;
    } catch (e) {
      output = `${e.stdout}${e.stderr}`;
    } finally {
      fs.writeFileSync(file, original);
    }
    expect(output).toContain('is not valid JSON');
    // The role is still in the database: with its file back, nothing differs.
    const { stdout: diffOutput } = await exec('yarn cs diff');
    expect(diffOutput).toContain('No differences between DB and sync directory');
  });

  test('Non-empty diff returns 1', async () => {
    await exec('rm -rf config/sync/admin-role.strapi-editor.json');
    // Work around Jest not supporting custom error matching.
    // https://github.com/facebook/jest/issues/8140
    let error;
    try {
      await exec('yarn cs diff');
    } catch (e) {
      error = e;
    }
    expect(error).toHaveProperty('code', 1);
  });

  test('Import build project', async () => {
    // First we make sure the dist folder is deleted.
    await exec('mv dist .tmp');

    await exec('yarn cs import -y');

    const { stdout: buildOutput } = await exec('ls dist');
    expect(buildOutput).toContain('config');
    expect(buildOutput).toContain('src');
    expect(buildOutput).toContain('tsconfig.tsbuildinfo');

    // We restore the dist folder.
    await exec('rm -rf dist');
    await exec('mv .tmp/dist ./dist');

  });
  test('Import project already built', async () => {


    // First we make sure the dist folder exists by doing an import.
    await exec('yarn cs import -y');

    const { stdout: lsDist } = await exec('ls dist');
    expect(lsDist).toContain('config');
    expect(lsDist).toContain('src');
    expect(lsDist).toContain('tsconfig.tsbuildinfo');

    // We remove on file from the dist folder
    await exec('mv dist/tsconfig.tsbuildinfo .tmp');

    // The new import should not rebuild the project.
    await exec('yarn cs import -y');

    const { stdout: buildOutput } = await exec('ls dist');
    expect(buildOutput).toContain('config');
    expect(buildOutput).toContain('src');
    expect(buildOutput).not.toContain('tsconfig.tsbuildinfo');

    // We restore the tsconfig.tsbuildinfo file.
    await exec('mv .tmp/tsconfig.tsbuildinfo dist/tsconfig.tsbuildinfo');

  });
});
