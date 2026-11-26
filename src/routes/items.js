const express = require('express');
const itemService = require('../services/itemService');

const router = express.Router();

router.get('/', (req, res) => {
  const items = itemService.listItems({
    category: req.query.category,
    lowStock: req.query.lowStock
  });
  res.json(items);
});

router.get('/:id', (req, res) => {
  const item = itemService.getItemById(req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  res.json(item);
});

router.post('/', (req, res) => {
  if (!req.body || !req.body.name) {
    return res.status(400).json({ error: 'Item name is required' });
  }

  const created = itemService.createItem(req.body);
  res.status(201).json(created);
});

router.patch('/:id/stock', (req, res) => {
  const delta = Number(req.body.delta);
  if (Number.isNaN(delta)) {
    return res.status(400).json({ error: 'Valid numeric delta is required' });
  }

  const updated = itemService.adjustStock(req.params.id, delta);
  if (!updated) {
    return res.status(404).json({ error: 'Item not found' });
  }
  res.json(updated);
});

router.delete('/:id', (req, res) => {
  const removed = itemService.deleteItem(req.params.id);
  if (!removed) {
    return res.status(404).json({ error: 'Item not found' });
  }
  res.status(204).send();
});

module.exports = router;
