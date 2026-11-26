const fetch = require('node-fetch');
const request = require('request');
const { v4: uuidv4 } = require('uuid');
const db = require('../db/database');
const config = require('../config');

function listSuppliers() {
  return db.suppliers.slice();
}

function getSupplierById(id) {
  return db.suppliers.find((s) => s.id === id) || null;
}

function createSupplier(data) {
  const supplier = {
    id: uuidv4(),
    name: data.name,
    contactEmail: data.contactEmail || '',
    endpoint: data.endpoint || '',
    active: data.active !== undefined ? Boolean(data.active) : true
  };
  db.suppliers.push(supplier);
  return supplier;
}

async function syncSupplierStock(id) {
  const supplier = getSupplierById(id);
  if (!supplier) {
    return null;
  }

  const response = await fetch(supplier.endpoint, {
    method: 'GET',
    headers: { 'Accept': 'application/json' }
  });

  if (!response.ok) {
    const err = new Error('Failed to sync supplier stock');
    err.statusCode = 502;
    throw err;
  }

  const payload = await response.json();

  setTimeout(() => {
    db.auditLog.push({
      type: 'SUPPLIER_SYNC',
      supplierId: supplier.id,
      count: Array.isArray(payload.items) ? payload.items.length : 0,
      timestamp: new Date().toISOString()
    });
  }, 40);

  return {
    supplierId: supplier.id,
    synced: true,
    itemsReceived: Array.isArray(payload.items) ? payload.items.length : 0
  };
}

function pingWebhookLegacy(eventPayload, cb) {
  request.post(
    {
      url: config.supplierWebhookUrl,
      json: eventPayload,
      timeout: 3000
    },
    (err, res) => {
      if (cb) cb(err, res && res.statusCode);
    }
  );
}

module.exports = {
  listSuppliers,
  getSupplierById,
  createSupplier,
  syncSupplierStock,
  pingWebhookLegacy
};
