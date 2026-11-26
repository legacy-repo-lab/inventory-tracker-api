const express = require('express');
const warehouseService = require('../services/warehouseService');
const validateBody = require('../middleware/validateBody');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(warehouseService.listWarehouses());
});

router.get('/:id/utilization', (req, res) => {
  const util = warehouseService.getWarehouseUtilization(req.params.id);
  if (!util) {
    return res.status(404).json({ error: 'Warehouse not found' });
  }
  res.json(util);
});

router.post('/', validateBody(['code']), (req, res) => {
  const wh = warehouseService.createWarehouse(req.body);
  res.status(201).json(wh);
});

module.exports = router;
