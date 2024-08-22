const express = require('express');
const router = express.Router();
const jobResults = require('../worker');  // Import the job results store from worker.js

// Route to get the job status with a message
router.get('/jobStatus', (req, res) => {
  const jobId = req.query.jobId;  // Use req.query to access jobId as a query parameter
  
  if (!jobId) {
    return res.status(400).json({ status: 'error', message: 'Job ID is required' });
  }

  const result = jobResults.get(jobId);

  if (result) {
    res.json(result);
  } else {
    res.status(404).json({ status: 'error', message: 'Job not found' });
  }
});

module.exports = router;
