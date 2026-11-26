const express = require('express');
const reportService = require('../services/reportService');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(reportService.listReports());
});

router.post('/valuation', (req, res) => {
  const notify = Boolean(req.body && req.body.notify);
  const report = reportService.buildValuationReport({ notify });
  res.status(201).json(report);
});

router.get('/summary', (req, res) => {
  res.json({ summary: reportService.getLatestSummaryText() });
});

module.exports = router;
