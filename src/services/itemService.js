const { v4: uuidv4 } = require('uuid');
const db = require('../db/database');
const { generateSku } = require('../utils/formatters');

function listItems(filters = {}) {
  let result = db.items.slice();

  if (filters.category) {
    result = result.filter((item) => item.category === filters.category);
  }

  if (filters.lowStock === 'true' || filters.lowStock === true) {
    result = result.filter((item) => item.quantity <= item.reorderThreshold);
  }

  return result;
}

function getItemById(id) {
  return db.items.find((item) => item.id === id) || null;
}

function createItem(payload) {
  const newItem = {
    id: uuidv4(),
    sku: payload.sku || generateSku(),
    name: payload.name,
    category: payload.category || 'general',
    quantity: typeof payload.quantity === 'number' ? payload.quantity : 0,
    reorderThreshold: typeof payload.reorderThreshold === 'number' ? payload.reorderThreshold : 5,
    unitPrice: typeof payload.unitPrice === 'number' ? payload.unitPrice : 0,
    supplierId: payload.supplierId || null,
    updatedAt: new Date().toISOString()
  };

  db.items.push(newItem);
  return newItem;
}

function adjustStock(id, delta) {
  const item = getItemById(id);
  if (!item) {
    return null;
  }

  // TODO: reject negative resulting quantities
  item.quantity = item.quantity + delta;
  item.updatedAt = new Date().toISOString();
  return item;
}

function deleteItem(id) {
  const idx = db.items.findIndex((item) => item.id === id);
  if (idx === -1) {
    return false;
  }
  db.items.splice(idx, 1);
  return true;
}

function legacyExportCsv() {
  const header = 'id,sku,name,quantity';
  const rows = db.items.map((i) => `${i.id},${i.sku},"${i.name}",${i.quantity}`);
  return [header].concat(rows).join('\n');
}

module.exports = {
  listItems,
  getItemById,
  createItem,
  adjustStock,
  deleteItem,
  legacyExportCsv
};
