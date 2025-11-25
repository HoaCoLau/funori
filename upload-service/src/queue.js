const { Queue } = require('bullmq');

const connection = {
  host: process.env.REDIS_HOST || 'redis',
  port: process.env.REDIS_PORT || 6379,
};

const uploadQueue = new Queue('upload-queue', { connection });

module.exports = { uploadQueue, connection };
