const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const session = require('express-session');
const swaggerUi = require('swagger-ui-express');
const RateLimit = require('express-rate-limit');
const BullBoard = require('bull-board');
const Sentry = require('@sentry/node');
const Queue = require('./app/lib/queue');
// const apm = require('elastic-apm-node');

// apm.start();

BullBoard.setQueues(Queue.queues.map(q => q.bull));

Sentry.init({ dsn: 'https://e5dd48677e5c4ff6ac54db8c0cce4711@o419441.ingest.sentry.io/5340985' });

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

const BASE_URL = '/api/v1';

module.exports = express()
  .use(cors())
  .use(limiter)
  .use(compression())
  .use(morgan('dev'))
  .set('trust proxy', 1)
  .use(bodyParser.json())
  .use(BASE_URL, router)
  .disable('x-powered-by')
  .use(session(sessionConfig))
  .use(Sentry.Handlers.errorHandler())
  .use(Sentry.Handlers.requestHandler())
  .use(`${BASE_URL}/admin/queues`, BullBoard.UI)
  .use(helmet({ frameguard: { action: 'deny' } }))
  .use(bodyParser.urlencoded({ extended: false }))
  .use(`${BASE_URL}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  .use(BASE_URL, (_req, res) => res.send({ message: 'Welcome to Churras Tri API' }));
