const { v4: uuidv4 } = require('uuid');
const db = require('../db/database');

function listWarehouses() {
  return db.warehouses.slice();
}

function getWarehouseById(id) {
  return db.warehouses.find((w) => w.id === id) || null;
}

function getWarehouseUtilization(id) {
  const wh = getWarehouseById(id);
  if (!wh) return null;

  const storedItems = db.items.filter((i) => i.warehouseId === id);
  const totalUnits = storedItems.reduce((sum, i) => sum + (i.quantity || 0), 0);

  return {
    warehouseId: wh.id,
    code: wh.code,
    capacity: wh.capacity,
    usedUnits: totalUnits,
    utilizationPct: wh.capacity > 0 ? Math.round((totalUnits / wh.capacity) * 100) : 0
  };
}

function createWarehouse(data) {
  const wh = {
    id: uuidv4(),
    code: data.code,
    location: data.location || '',
    capacity: typeof data.capacity === 'number' ? data.capacity : 100
  };
  db.warehouses.push(wh);
  return wh;
}

module.exports = {
  listWarehouses,
  getWarehouseById,
  getWarehouseUtilization,
  createWarehouse
};
