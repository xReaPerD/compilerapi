const { Worker } = require('bullmq');
const { buildCode } = require('./CodeBuilder/makeExecute');

// In-memory store for job results
let jobResults = new Map();

const worker = new Worker('buildQueue', async job => {
  console.log(job.data)
  await buildCode(job.data.code, job.data.id);
}, {
  connection: {
    host: '127.0.0.1',
    port: 6379
  }
});

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully.`);
  jobResults.set(job.id, { status: 'success', message: 'Compilation completed successfully.' });
  console.log(`Stored result for job ${job.id}:`, jobResults.get(job.id));
});

worker.on('failed', (job, err) => {
  console.log(`Job ${job.id} failed with error ${err.message}.`);
  jobResults.set(job.id, { status: 'error', message: err.message });
  console.log(`Stored error for job ${job.id}:`, jobResults.get(job.id));
});

module.exports = jobResults;
