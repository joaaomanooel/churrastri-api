const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const pkg = require('../../package.json');
require('dotenv').config();

module.exports = swaggerJsdoc({
  swaggerDefinition: {
    swagger: '2.0',
    info: {
      version: pkg.version,
      title: 'Churras Tri API',
      description: pkg.description,
      license: { name: 'MIT', url: 'https://opensource.org/licenses/MIT' },
    },
    host: process.env.NODE_ENV === 'production' ? process.env.PROD_URL : process.env.DEV_URL,
    consumes: ['application/json'],
    produces: ['application/json'],
    basePath: '/api/v1',
    schemes: ['http'],
  },
  apis: [path.resolve(__dirname, './**/*.yaml')],
});
