const express = require('express');
const router = express.Router();
const Vote = require('../models/vote');
const votesToCsv = require('../utils/csvExport');

// GET all votes (with metadata)
router.get('/votes', async (req, res) => {
  const votes = await Vote.getAll();
  res.json(votes);
});

// GET export votes as CSV
router.get('/votes/export', async (req, res) => {
  const votes = await Vote.getAll();
  const csv = votesToCsv(votes);
  res.header('Content-Type', 'text/csv');
  res.attachment('votes.csv');
  res.send(csv);
});

// GET dashboard stats
router.get('/dashboard', async (req, res) => {
  const results = await Vote.getResults();
  // TODO: Add more analytics (device/browser breakdown, time charts)
  res.json({ results });
});

module.exports = router;
