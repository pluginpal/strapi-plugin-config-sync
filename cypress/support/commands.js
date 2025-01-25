// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//

Cypress.Commands.add('login', (path) => {
  cy.visit('/');

  cy.intercept({
    method: 'GET',
    url: '/admin/users/me',
  }).as('sessionCheck');

  cy.intercept({
    method: 'GET',
    url: '/admin/init',
  }).as('adminInit');

  // Wait for the initial request to complete.
  cy.wait('@adminInit').its('response.statusCode').should('equal', 200);

  // Wait for the form to render.
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1000);

  cy.get('body').then(($body) => {
    // Login
    if ($body.text().includes('Log in to your Strapi account')) {
      cy.get('input[name="email"]').type('johndoe@example.com');
      cy.get('input[name="password"]').type('Abc12345678');
      cy.get('button[type="submit"]').click();
      cy.wait('@sessionCheck').its('response.statusCode').should('equal', 200);
    }

    // Register
    if ($body.text().includes('Credentials are only used to authenticate in Strapi')) {
      cy.get('input[name="firstname"]').type('John');
      cy.get('input[name="email"]').type('johndoe@example.com');
      cy.get('input[name="password"]').type('Abc12345678');
      cy.get('input[name="confirmPassword"]').type('Abc12345678');
      cy.get('button[type="submit"]').click();
      cy.wait('@sessionCheck').its('response.statusCode').should('equal', 200);
    }
  });
});

Cypress.Commands.add('navigateToInterface', (path) => {
  cy.intercept({
    method: 'GET',
    url: '/config-sync/diff',
  }).as('getConfigDiff');

  cy.get('a[href="/admin/settings"]').click();
  cy.get('a[href="/admin/settings/config-sync"]').click();

  cy.wait('@getConfigDiff').its('response.statusCode').should('equal', 200);
});


Cypress.Commands.add('initialExport', (path) => {
  cy.intercept({
    method: 'POST',
    url: '/config-sync/export',
  }).as('exportConfig');

  cy.get('button').contains('Make the initial export').click();
  cy.get('button').contains('Yes, export').click();

  cy.wait('@exportConfig').its('response.statusCode').should('equal', 200);

  cy.contains('Config was successfully exported to config/sync/.');
});

Cypress.Commands.add('makeConfigChanges', (path) => {
  // Change a setting in the UP advanced settings
  cy.intercept({
    method: 'PUT',
    url: '/users-permissions/advanced',
  }).as('saveUpAdvanced');
  cy.get('a[href="/admin/settings/users-permissions/advanced-settings"]').click();
  cy.get('input[name="unique_email"').click();
  cy.get('button[type="submit"]').click();
  cy.wait('@saveUpAdvanced').its('response.statusCode').should('equal', 200);

  // Change a setting in the media library settings
  cy.intercept({
    method: 'PUT',
    url: '/upload/settings',
  }).as('saveMediaLibrarySettings');
  cy.get('a[href="/admin/settings/media-library"]').click();
  cy.get('input[name="responsiveDimensions"').click();
  cy.get('button[type="submit"]').click();
  cy.wait('@saveMediaLibrarySettings').its('response.statusCode').should('equal', 200);

  // Change a setting in the email templates
  cy.intercept({
    method: 'PUT',
    url: '/users-permissions/email-templates',
  }).as('saveUpEmailTemplates');
  cy.get('a[href="/admin/settings/users-permissions/email-templates"]').click();
  cy.get('tbody tr').contains('Reset password').click();
  cy.get('input[name="options.response_email"]').clear();
  cy.get('input[name="options.response_email"]').type(`${Math.random().toString(36).substring(2, 15)}@example.com`);
  cy.get('button[type="submit"]').click();
  cy.wait('@saveUpEmailTemplates').its('response.statusCode').should('equal', 200);
});
