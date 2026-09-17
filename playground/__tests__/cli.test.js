'use strict';

const fs = require('fs');
const util = require('util');
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
