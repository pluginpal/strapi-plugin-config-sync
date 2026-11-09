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
    cy.get('button[aria-label="Select plugin_upload_settings"]').click();
    cy.get('button').contains('Import').click();
    cy.get('button').contains('Yes, import').click();
    cy.wait('@importConfig').its('response.statusCode').should('equal', 200);
    cy.contains('plugin_users-permissions_advanced');
    cy.contains('plugin_users-permissions_email');

    cy.intercept({
      method: 'POST',
      url: '/config-sync/export',
    }).as('exportConfig');
    cy.get('button[aria-label="Select plugin_users-permissions_advanced"]').click();
    cy.get('button').contains('Export').click();
    cy.get('button').contains('Yes, export').click();
    cy.wait('@exportConfig').its('response.statusCode').should('equal', 200);
    cy.contains('plugin_users-permissions_email');
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

      cy.login();
      cy.navigateToInterface();
      cy.intercept('GET', '/config-sync/diff', (request) => {
        request.reply(completed ? refreshedDiff : initialDiff);
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
