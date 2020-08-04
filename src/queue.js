// eslint-disable-next-line no-unused-expressions
require('dotenv').config();

const Queue = require('./app/lib/queue');

Queue.process();
