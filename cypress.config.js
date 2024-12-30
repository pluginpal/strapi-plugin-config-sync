const { defineConfig } = require('cypress');
const fs = require('fs-extra');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:1337',
    specPattern: '**/*.cy.{js,ts,jsx,tsx}',
    video: true,
    defaultCommandTimeout: 20000,
    requestTimeout: 20000,
    setupNodeEvents(on, config) {
      // implement node event listeners here.
      // eslint-disable-next-line global-require
      require('cypress-terminal-report/src/installLogsPrinter')(on);

      on('task', {
        deleteFolder(folderName) {
          console.log(`deleting folder ${folderName}`);

          return fs.remove(folderName)
          .then(() => {
            console.log(`folder ${folderName} deleted`);
            return null;
          })
          .catch((err) => {
            console.error(`error deleting folder ${folderName}`, err);
            throw err;
          });
        },
      });
    },
  },
});
