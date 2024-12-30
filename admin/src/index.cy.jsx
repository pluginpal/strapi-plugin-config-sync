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

  // it('Partial import & export', () => {
  //   cy.login();
  //   cy.navigateToInterface();
  //   cy.initialExport();

  //   cy.makeConfigChanges();

  //   cy.navigateToInterface();

  //   cy.get('button[aria-label="Select all entries"]').click();

  //   cy.intercept({
  //     method: 'POST',
  //     url: '/config-sync/import',
  //   }).as('importConfig');
  //   cy.get('button[aria-label="Select plugin_upload_settings"]').click();
  //   cy.get('button').contains('Import').click();
  //   cy.get('button').contains('Yes, import').click();
  //   cy.wait('@importConfig').its('response.statusCode').should('equal', 200);
  //   cy.contains('plugin_users-permissions_advanced');
  //   cy.contains('plugin_users-permissions_email');

  //   cy.intercept({
  //     method: 'POST',
  //     url: '/config-sync/export',
  //   }).as('exportConfig');
  //   cy.get('button[aria-label="Select plugin_users-permissions_advanced"]').click();
  //   cy.get('button').contains('Export').click();
  //   cy.get('button').contains('Yes, export').click();
  //   cy.wait('@exportConfig').its('response.statusCode').should('equal', 200);
  //   cy.contains('plugin_users-permissions_email');
  // });
});
