// <reference types="cypress" />

describe('Config Sync', () => {
  beforeEach(() => {
    cy.task('deleteFolder', 'playground/config/sync');
  });

  it('Check the config diff', () => {
    cy.login();
    cy.navigateToInterface();
    cy.initialExport();

    cy.makeConfigChanges();

    cy.navigateToInterface();

    cy.get('tbody tr').contains('plugin_users-permissions_advanced').click();

    cy.contains('"unique_email": true,');
    cy.contains('"unique_email": false,');
  });

  it('Shows the JSON error and location in the config diff', () => {
    cy.login();
    cy.navigateToInterface();
    cy.initialExport();

    cy.writeFile('playground/config/sync/user-role.public.json', '{\n  "name": ,\n}');
    cy.intercept('GET', '/config-sync/diff').as('invalidDiff');
    cy.reload();
    cy.wait('@invalidDiff').then(({ response }) => {
      expect(response.body.invalidConfig['user-role.public']).to.include('line 2, column 11');
    });

    cy.get('tbody tr').contains('public').parents('tr').should('contain', 'Invalid file')
      .click();
    cy.get('[role="dialog"]').should('contain', 'user-role.public.json')
      .and('contain', 'is not valid JSON')
      .and('contain', 'line 2, column 11')
      .and('not.contain', 'Database');
  });

  ['list', 'diff'].forEach((view) => {
    it(`Shows an invalid-file notification when importing from the ${view}`, () => {
      cy.login();
      cy.navigateToInterface();
      cy.initialExport();
      cy.writeFile('playground/config/sync/user-role.public.json', '{\n  "name": ,\n}');
      cy.intercept('GET', '/config-sync/diff').as('invalidDiff');
      cy.reload();
      cy.wait('@invalidDiff');

      if (view === 'diff') {
        cy.get('tbody tr').contains('public').click();
        cy.get('[role="dialog"] footer').contains('button', 'Import').click();
      } else {
        cy.contains('button', 'Import').click();
      }

      cy.intercept('POST', '/config-sync/import').as('invalidImport');
      cy.contains('button', 'Yes, import').click();
      cy.wait('@invalidImport').then(({ response }) => {
        expect(response.statusCode).to.equal(400);
        expect(response.body.error.details).to.include({
          code: 'CONFIG_SYNC_INVALID_FILE',
          configName: 'user-role.public',
          reason: 'invalid_json',
        });
      });
      const message = 'Cannot import user-role.public: its config file contains invalid JSON. Open the diff for details.';
      if (view === 'diff') cy.get('[role="dialog"]').should('be.visible').and('contain', message);
      else cy.contains(message).should('be.visible');
    });

    it(`Shows an invalid-file notification when exporting without a database config from the ${view}`, () => {
      cy.login();
      cy.navigateToInterface();
      cy.initialExport();
      cy.writeFile('playground/config/sync/user-role.nonexistent-config-sync-test.json', '{\n  "name": ,\n}');
      cy.intercept('GET', '/config-sync/diff').as('invalidDiff');
      cy.reload();
      cy.wait('@invalidDiff');

      if (view === 'diff') {
        cy.get('tbody tr').contains('nonexistent-config-sync-test').click();
        cy.get('[role="dialog"] footer').contains('button', 'Export').click();
      } else {
        cy.contains('button', 'Export').click();
      }

      cy.intercept('POST', '/config-sync/export').as('invalidExport');
      cy.contains('button', 'Yes, export').click();
      cy.wait('@invalidExport').then(({ response }) => {
        expect(response.statusCode).to.equal(400);
        expect(response.body.error.details).to.include({
          code: 'CONFIG_SYNC_INVALID_FILE',
          configName: 'user-role.nonexistent-config-sync-test',
          reason: 'no_database_config',
        });
      });
      const message = 'Cannot export user-role.nonexistent-config-sync-test: its config file is invalid and there is no database config to replace it.';
      if (view === 'diff') cy.get('[role="dialog"]').should('be.visible').and('contain', message);
      else cy.contains(message).should('be.visible');
      cy.readFile('playground/config/sync/user-role.nonexistent-config-sync-test.json', null)
        .then((contents) => expect(contents.toString()).to.equal('{\n  "name": ,\n}'));
    });
  });

  it('Exports a database config over its invalid file', () => {
    cy.login();
    cy.navigateToInterface();
    cy.initialExport();
    cy.writeFile('playground/config/sync/user-role.public.json', '{\n  "name": ,\n}');
    cy.intercept('GET', '/config-sync/diff').as('invalidDiff');
    cy.reload();
    cy.wait('@invalidDiff');
    cy.get('tbody tr').contains('public').click();
    cy.get('[role="dialog"] footer').contains('button', 'Export').click();
    cy.intercept('POST', '/config-sync/export').as('repairExport');
    cy.contains('button', 'Yes, export').click();
    cy.wait('@repairExport').its('response.statusCode').should('equal', 200);
    cy.readFile('playground/config/sync/user-role.public.json').its('name').should('eq', 'Public');
  });

  it('Download the config as zip', () => {
    cy.login();
    cy.navigateToInterface();
    cy.initialExport();

    cy.intercept({
      method: 'GET',
      url: '/config-sync/zip',
    }).as('getConfigZip');

    cy.get('button').contains('Download Config').click();

    cy.wait('@getConfigZip').then((interception) => {
      const configZipResponse = interception.response.body;
      const downloadsFolder = Cypress.config('downloadsFolder');
      cy.readFile(`${downloadsFolder}/${configZipResponse.name.replaceAll(':', '_')}`).should('exist');
    });
  });

  it('Partial import & export', () => {
    cy.login();
    cy.navigateToInterface();
    cy.initialExport();

    cy.makeConfigChanges();

    cy.navigateToInterface();

    cy.get('button[aria-label="Select all entries"]').click();

    cy.intercept({
      method: 'POST',
      url: '/config-sync/import',
    }).as('importConfig');
    cy.intercept('GET', '/config-sync/diff').as('refreshedDiff');
    cy.get('button[aria-label="Select plugin_upload_settings"]')
      .should('have.attr', 'aria-checked', 'false')
      .click();
    cy.get('button[aria-label="Select plugin_upload_settings"]').should('have.attr', 'aria-checked', 'true');
    cy.get('[role="dialog"]').should('not.exist');
    cy.get('button').contains('Import').click();
    cy.get('button').contains('Yes, import').click();
    cy.wait('@importConfig').then(({ request, response }) => {
      expect(response.statusCode).to.equal(200);
      expect(request.body.config).to.deep.equal(['core-store.plugin_upload_settings']);
    });
    cy.wait('@refreshedDiff').its('response.statusCode').should('equal', 200);
    cy.get('tbody tr').should('not.contain', 'plugin_upload_settings');
    cy.contains('plugin_users-permissions_advanced');
    cy.contains('plugin_users-permissions_email');

    cy.intercept({
      method: 'POST',
      url: '/config-sync/export',
    }).as('exportConfig');
    cy.get('button[aria-label="Select plugin_users-permissions_advanced"]')
      .should('have.attr', 'aria-checked', 'true')
      .click();
    cy.get('button[aria-label="Select plugin_users-permissions_advanced"]').should('have.attr', 'aria-checked', 'false');
    cy.get('[role="dialog"]').should('not.exist');
    cy.get('button').contains('Export').click();
    cy.get('button').contains('Yes, export').click();
    cy.wait('@exportConfig').then(({ request, response }) => {
      expect(response.statusCode).to.equal(200);
      expect(request.body).to.deep.equal(['core-store.plugin_users-permissions_email']);
    });
    cy.wait('@refreshedDiff').its('response.statusCode').should('equal', 200);
    cy.get('tbody tr').should('not.contain', 'plugin_users-permissions_email')
      .and('contain', 'plugin_users-permissions_advanced');
  });

  ['import', 'export'].forEach((action) => {
    it(`Single-file ${action} closes the diff modal after success`, () => {
      const selectedConfig = 'core-store.plugin_users-permissions_advanced';
      const otherConfig = 'core-store.plugin_upload_settings';
      const fileConfig = { fileOnly: true };
      const databaseConfig = { databaseOnly: true };
      const initialDiff = {
        diff: { [selectedConfig]: {}, [otherConfig]: {} },
        fileConfig: { [selectedConfig]: fileConfig, [otherConfig]: { enabled: true } },
        databaseConfig: { [selectedConfig]: databaseConfig, [otherConfig]: { enabled: false } },
      };
      const syncedConfig = action === 'import' ? fileConfig : databaseConfig;
      const refreshedDiff = {
        diff: action === 'import' ? { [otherConfig]: {} } : {},
        fileConfig: { ...initialDiff.fileConfig, [selectedConfig]: syncedConfig },
        databaseConfig: { ...initialDiff.databaseConfig, [selectedConfig]: syncedConfig },
      };
      let completed = false;
      let releaseRefresh;
      const refreshGate = new Cypress.Promise((resolve) => {
        releaseRefresh = resolve;
      });

      cy.login();
      cy.navigateToInterface();
      cy.intercept('GET', '/config-sync/diff', (request) => {
        if (completed) {
          return refreshGate.then(() => request.reply(refreshedDiff));
        }
        return request.reply(initialDiff);
      }).as('modalDiff');
      cy.intercept('GET', '/config-sync/app-env', {
        env: 'development', config: { soft: false },
      });
      cy.intercept('POST', `/config-sync/${action}`, (request) => {
        completed = true;
        request.reply({ message: 'Config synchronized.' });
      }).as('singleFileSync');
      cy.reload();
      cy.wait('@modalDiff');

      cy.get('tbody tr').contains('plugin_users-permissions_advanced').click();
      cy.get('[role="dialog"]').should('contain', 'fileOnly').and('contain', 'databaseOnly');
      cy.get('[role="dialog"] footer').within(() => {
        cy.contains('button', 'Import').should('be.visible');
        cy.contains('button', 'Export').should('be.visible');
      });
      cy.get(`[role="dialog"] footer button[title="${action === 'import'
        ? 'Import config into DB for this file only'
        : 'Export DB config for this file only'}"]`).click();
      cy.contains('button', 'Cancel').click();
      cy.then(() => expect(completed).to.equal(false));
      cy.get('[role="dialog"] footer').should('be.visible');

      cy.get('[role="dialog"] footer').contains('button', action === 'import' ? 'Import' : 'Export').click();
      cy.contains('button', `Yes, ${action}`).click();
      cy.wait('@singleFileSync').then(({ request }) => {
        expect(request.body).to.deep.equal(action === 'import'
          ? { force: false, config: [selectedConfig] }
          : [selectedConfig]);
      });
      cy.contains('Loading content...').should('be.visible');
      cy.get('button[aria-label="Select plugin_users-permissions_advanced"]').should('not.exist');
      cy.contains('button', 'Import').should('be.disabled');
      cy.contains('button', 'Export').should('be.disabled');
      cy.then(() => releaseRefresh());
      cy.wait('@modalDiff');
      cy.get('[role="dialog"]').should('not.exist');
      if (action === 'import') {
        cy.get('tbody tr').should('not.contain', 'plugin_users-permissions_advanced')
          .and('contain', 'plugin_upload_settings');
      } else {
        cy.contains('No differences between DB and sync directory. You are up-to-date!');
      }
    });

    it(`Single-file ${action} keeps the diff modal open on failure`, () => {
      const selectedConfig = 'core-store.plugin_users-permissions_advanced';
      cy.login();
      cy.navigateToInterface();
      cy.intercept('GET', '/config-sync/diff', {
        diff: { [selectedConfig]: {} },
        fileConfig: { [selectedConfig]: { fileOnly: true } },
        databaseConfig: { [selectedConfig]: { databaseOnly: true } },
      }).as('modalDiff');
      cy.intercept('POST', `/config-sync/${action}`, {
        statusCode: 500,
        body: { error: { message: 'Sync failed' } },
      }).as('singleFileSync');
      cy.reload();
      cy.wait('@modalDiff');
      cy.get('tbody tr').contains('plugin_users-permissions_advanced').click();
      cy.get('[role="dialog"] footer').contains('button', action === 'import' ? 'Import' : 'Export').click();
      cy.contains('button', `Yes, ${action}`).click();
      cy.wait('@singleFileSync').its('response.statusCode').should('equal', 500);
      cy.get('[role="dialog"]').should('be.visible').and('contain', selectedConfig);
      cy.get('[role="dialog"] footer').contains('button', action === 'import' ? 'Import' : 'Export').should('be.visible');
    });
  });
});
