/* eslint-disable no-console */
require('dotenv').config();
const cluster = require('cluster');
const { cpus } = require('os');
const app = require('./src');

const PORT = process.env.PORT || 5000;

const startup = () => {
  const { pid } = process;
  if (!cluster.isMaster) return app.listen(PORT, () => console.log(`Worker ${pid} started`));

  console.log(`Master ${process.pid} is running on port ${PORT}`);
  cpus().forEach(() => cluster.fork());

  return cluster.on('exit', (worker, code, signal) => {
    const workerPid = worker.process.pid;
    if (signal) return console.log(`worker ${workerPid} was killed by signal: ${signal}`);
    if (code !== 0) return console.log(`worker ${workerPid} exited with error code: ${code}`);
    return console.log(`worker ${workerPid} died`);
  });
};

startup();
