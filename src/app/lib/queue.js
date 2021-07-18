/* eslint-disable no-console */
const Queue = require('bull');
const redisConfig = require('../config/redis');

const jobs = require('../jobs');

const queues = Object.values(jobs).map(job => ({
  bull: new Queue(job.key, { redis: redisConfig }),
  options: job.options,
  handle: job.handle,
  name: job.key,
}));

module.exports = {
  queues,
  add(name, data) {
    const queue = this.queues.find(q => q.name === name);
    return queue.bull.add(data, queue.options);
  },
  process() {
    return this.queues.forEach((q) => {
      q.bull.process(q.handle);
      q.bull.on('failed', (job, err) => {
        console.log('job failed', q.key, job.data);
        console.error(err);
      });
    });
  },
};
