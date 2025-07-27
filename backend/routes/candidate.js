const express = require('express');
const router = express.Router();
const Candidate = require('../models/candidate');

// GET all candidates
router.get('/', async (req, res) => {
  const candidates = await Candidate.getAll();
  res.json(candidates);
});

// POST add candidate
router.post('/', async (req, res) => {
  const { name, photo_url } = req.body;
  const candidate = await Candidate.add({ name, photo_url });
  res.status(201).json(candidate);
});

// PUT edit candidate
router.put('/:id', async (req, res) => {
  const { name, photo_url } = req.body;
  const candidate = await Candidate.update(req.params.id, { name, photo_url });
  res.json(candidate);
});

// DELETE candidate
router.delete('/:id', async (req, res) => {
  await Candidate.delete(req.params.id);
  res.status(204).end();
});

module.exports = router;
