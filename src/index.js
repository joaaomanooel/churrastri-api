const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const session = require('express-session');
const swaggerUi = require('swagger-ui-express');
const RateLimit = require('express-rate-limit');

const swaggerDocument = require('./docs/swagger');
const router = require('./app/routes');

const csrfProtection = csurf({ cookie: true });

const sessionConfig = {
  secret: 's3Cur3',
  name: 'sessionId',
  resave: false,
  saveUninitialized: true,
  cookie: { httpOnly: true, secure: true },
};

const limiter = new RateLimit({ windowMs: 15 * 60 * 1000, max: 100, delayMs: 0 });

module.exports = express()
  .use(cors())
  .use(limiter)
  .use(compression())
  .use(morgan('dev'))
  .set('trust proxy', 1)
  .use(bodyParser.json())
  .disable('x-powered-by')
  .use(session(sessionConfig))
  .use('/api/v1', csrfProtection, router)
  .use(helmet({ frameguard: { action: 'deny' } }))
  .use(bodyParser.urlencoded({ extended: false }))
  .use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  .use('/api/v1', (_req, res) => res.send({ message: 'Welcome to Churras Tri API' }));
