const pkg = require('../../package.json');
require('dotenv').config();

module.exports = {
  swagger: '2.0',
  info: {
    version: pkg.version,
    title: 'Churras Tri API',
    description: pkg.description,
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  host: process.env.NODE_ENV === 'production' ? process.env.PROD_URL : process.env.DEV_URL,
  basePath: '/',
};
