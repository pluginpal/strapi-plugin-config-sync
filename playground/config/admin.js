module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'c27c3833823a12b0761e32b22dc0113a'),
  },
  watchIgnoreFiles: [
    '**/config/sync/**',
  ],
});
