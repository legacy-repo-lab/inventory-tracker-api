const express = require('express');
const supplierService = require('../services/supplierService');
const { requireApiKey } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(supplierService.listSuppliers());
});

router.get('/:id', (req, res) => {
  const supplier = supplierService.getSupplierById(req.params.id);
  if (!supplier) {
    return res.status(404).json({ error: 'Supplier not found' });
  }
  res.json(supplier);
});

router.post('/', requireApiKey, (req, res) => {
  if (!req.body || !req.body.name) {
    return res.status(400).json({ error: 'Supplier name is required' });
  }
  const supplier = supplierService.createSupplier(req.body);
  res.status(201).json(supplier);
});

router.post('/:id/sync', async (req, res, next) => {
  try {
    const result = await supplierService.syncSupplierStock(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
