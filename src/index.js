const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const session = require('express-session');
const swaggerUi = require('swagger-ui-express');
const RateLimit = require('express-rate-limit');
const apm = require('elastic-apm-node');

apm.start();

const swaggerDocument = require('./docs');
const router = require('./app/routes');

const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'churras tri',
  name: process.env.SESSION_NAME || 'churras tri',
  cookie: { httpOnly: true, secure: true },
  saveUninitialized: true,
  resave: false,
};

const limiter = new RateLimit({ windowMs: 15 * 60 * 1000, max: 100, delayMs: 0 });

module.exports = express()
  .use(cors())
  .use(limiter)
  .use(compression())
  .use(morgan('dev'))
  .set('trust proxy', 1)
  .use(bodyParser.json())
  .use('/api/v1', router)
  .disable('x-powered-by')
  .use(session(sessionConfig))
  .use(helmet({ frameguard: { action: 'deny' } }))
  .use(bodyParser.urlencoded({ extended: false }))
  .use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  .use('/api/v1', (_req, res) => res.send({ message: 'Welcome to Churras Tri API' }));
