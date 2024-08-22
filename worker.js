const { Worker } = require('bullmq');
const { buildCode } = require('./CodeBuilder/makeExecute');
const fs = require('fs');
const path = require('path');

// Directory to store job results
const resultsDir = path.join(__dirname, 'job_results');
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir); // Create directory if it doesn't exist
}

const worker = new Worker('buildQueue', async job => {
  console.log(job.data);
  await buildCode(job.data.code, job.data.id);
}, {
  connection: {
    host: '127.0.0.1',
    port: 6379
  }
});

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully.`);
  const result = { status: 'success', message: 'Compilation completed successfully.' };
  console.log(`Stored result for job ${job.id} in ${filePath}`);
});

worker.on('failed', (job, err) => {
  console.log(`Job ${job.id} failed with error ${err.message}.`);
  const result = { status: 'error', message: err.message };
  const filePath = path.join(resultsDir, `${job.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(result)); // Save error to file
  console.log(`Stored error for job ${job.id} in ${filePath}`);
});
