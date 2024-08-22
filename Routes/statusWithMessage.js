const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Directory where job results are stored
const resultsDir = path.join(__dirname, '../job_results');

router.get('/jobStatus', (req, res) => {
  const jobId = req.query.jobId;
  
  if (!jobId) {
    return res.status(400).json({ status: 'error', message: 'Job ID is required' });
  }

  const filePath = path.join(resultsDir, `${jobId}.json`);
  
  if (fs.existsSync(filePath)) {
    const result = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    res.json(result);
  } else {
    res.status(404).json({ status: 'error', message: 'Job not found' });
  }
});

module.exports = router;
