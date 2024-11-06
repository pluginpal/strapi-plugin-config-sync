// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from '@strapi/pack-up';

export default defineConfig({
  bundles: [
    {
      source: './admin/src/index.js',
      import: './dist/admin/index.mjs',
      require: './dist/admin/index.js',
      runtime: 'web',
    },
    {
      source: './server/index.js',
      import: './dist/server/index.mjs',
      require: './dist/server/index.js',
      runtime: 'node',
    },
    {
      source: './server/cli.js',
      import: './dist/cli/index.mjs',
      require: './dist/cli/index.js',
      runtime: 'node',
    },
  ],
  dist: './dist',
  exports: {},
});
