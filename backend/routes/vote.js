const express = require('express');
const router = express.Router();
const Vote = require('../models/vote');
const useragent = require('useragent');
const geoip = require('geoip-lite');

// POST cast vote
router.post('/', async (req, res) => {
  const {
    google_user_id,
    candidate_id,
    device_fingerprint,
  } = req.body;

  // Prevent duplicate votes
  const duplicate = await Vote.checkDuplicate({ google_user_id, device_fingerprint });
  if (duplicate) {
    return res.status(409).json({ error: 'Duplicate vote detected.' });
  }

  // Analytics fields
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.connection.remoteAddress || '';
  const agent = useragent.parse(req.headers['user-agent'] || '');
  const user_agent = req.headers['user-agent'] || '';
  const browser = agent.family;
  const os = agent.os.family;
  const device_type = /Mobi|Android/i.test(user_agent) ? 'mobile' : 'desktop';
  const geo = geoip.lookup(ip);
  const country = geo?.country || '';

  const vote = await Vote.add({
    google_user_id,
    candidate_id,
    ip_address: ip,
    user_agent,
    browser,
    os,
    device_type,
    country,
    device_fingerprint,
  });
  res.status(201).json(vote);
});

// GET vote results
router.get('/results', async (req, res) => {
  const results = await Vote.getResults();
  res.json(results);
});

module.exports = router;
