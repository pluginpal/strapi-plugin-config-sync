const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const { setupStrapi, cleanupStrapi } = require('./helpers');

jest.setTimeout(20000);

// Each new i18n locale makes Strapi rewrite the super admin's permissions, so
// locales imported at the same time can collide on the permission ids
// (seen on MySQL/MariaDB; better-sqlite3 answers synchronously, so SQLite
// doesn't show it). The import has to handle one config at a time.
let active;
let maxActive;

const writeLocaleFiles = (codes) => codes.forEach((code) => {
  fs.writeFileSync(`config/sync/i18n-locale.${code}.json`, JSON.stringify({ name: code, code }));
});

const localeCodes = async () => (await strapi.db.query('plugin::i18n.locale').findMany()).map(({ code }) => code);

beforeAll(async () => {
  await exec('rm -rf .tmp config/sync');
  await exec('yarn cs export -y');
  await setupStrapi();

  const main = strapi.plugin('config-sync').service('main');
  const { importSingleConfig } = main;
  main.importSingleConfig = async (...args) => {
    active += 1;
    maxActive = Math.max(maxActive, active);
    try {
      return await importSingleConfig(...args);
    } finally {
      active -= 1;
    }
  };
});

afterAll(async () => {
  await cleanupStrapi();
  await exec('rm -rf config/sync');
});

beforeEach(() => {
  active = 0;
  maxActive = 0;
});

describe('Test importing several configs', () => {
  test('Import all config imports one config at a time', async () => {
    writeLocaleFiles(['de', 'fr', 'nl']);

    await strapi.plugin('config-sync').service('main').importAllConfig();

    expect(await localeCodes()).toEqual(expect.arrayContaining(['de', 'fr', 'nl']));
    expect(maxActive).toBe(1);
  });

  test('The import endpoint imports one config at a time', async () => {
    writeLocaleFiles(['es', 'it', 'pt']);
    let response;
    const ctx = {
      request: { body: { config: ['i18n-locale.es', 'i18n-locale.it', 'i18n-locale.pt'] } },
      send: (body) => { response = body; },
    };

    await strapi.plugin('config-sync').controller('config').importAll(ctx);

    expect(response.message).toContain('successfully imported');
    expect(await localeCodes()).toEqual(expect.arrayContaining(['es', 'it', 'pt']));
    expect(maxActive).toBe(1);
  });
});
