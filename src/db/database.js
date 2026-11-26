// TODO: swap in-memory arrays for SQLite before v1.0

var items = [
  {
    id: 'item-1',
    sku: 'SKU-A1001B',
    name: 'Wireless Barcode Scanner',
    category: 'electronics',
    quantity: 14,
    reorderThreshold: 5,
    unitPrice: 79.99,
    supplierId: 'sup-1',
    warehouseId: 'wh-1',
    updatedAt: '2022-03-10T09:15:00.000Z'
  },
  {
    id: 'item-2',
    sku: 'SKU-B2040C',
    name: 'Thermal Shipping Labels (500ct)',
    category: 'supplies',
    quantity: 3,
    reorderThreshold: 10,
    unitPrice: 18.50,
    supplierId: 'sup-2',
    warehouseId: 'wh-1',
    updatedAt: '2022-04-02T14:30:00.000Z'
  },
  {
    id: 'item-3',
    sku: 'SKU-C3099D',
    name: 'USB-C Dock Hub',
    category: 'electronics',
    quantity: 22,
    reorderThreshold: 8,
    unitPrice: 45.00,
    supplierId: 'sup-1',
    warehouseId: 'wh-2',
    updatedAt: '2022-05-19T11:00:00.000Z'
  }
];

var suppliers = [
  {
    id: 'sup-1',
    name: 'Northstar Electronics Wholesale',
    contactEmail: 'orders@example.com',
    endpoint: 'https://example.com/api/v1/stock',
    active: true
  },
  {
    id: 'sup-2',
    name: 'Paper & Pack Co.',
    contactEmail: 'support@example.com',
    endpoint: 'https://example.com/api/v1/supplies',
    active: true
  }
];

var warehouses = [
  {
    id: 'wh-1',
    code: 'WH-EAST',
    location: 'Building A, Dock 4',
    capacity: 500
  },
  {
    id: 'wh-2',
    code: 'WH-WEST',
    location: 'Building C, Bay 12',
    capacity: 300
  }
];

const notifications = [];
const reports = [];
const auditLog = [];

function resetDb() {
  items.length = 0;
  items.push(
    {
      id: 'item-1',
      sku: 'SKU-A1001B',
      name: 'Wireless Barcode Scanner',
      category: 'electronics',
      quantity: 14,
      reorderThreshold: 5,
      unitPrice: 79.99,
      supplierId: 'sup-1',
      warehouseId: 'wh-1',
      updatedAt: '2022-03-10T09:15:00.000Z'
    },
    {
      id: 'item-2',
      sku: 'SKU-B2040C',
      name: 'Thermal Shipping Labels (500ct)',
      category: 'supplies',
      quantity: 3,
      reorderThreshold: 10,
      unitPrice: 18.50,
      supplierId: 'sup-2',
      warehouseId: 'wh-1',
      updatedAt: '2022-04-02T14:30:00.000Z'
    },
    {
      id: 'item-3',
      sku: 'SKU-C3099D',
      name: 'USB-C Dock Hub',
      category: 'electronics',
      quantity: 22,
      reorderThreshold: 8,
      unitPrice: 45.00,
      supplierId: 'sup-1',
      warehouseId: 'wh-2',
      updatedAt: '2022-05-19T11:00:00.000Z'
    }
  );
  auditLog.length = 0;
  notifications.length = 0;
  reports.length = 0;
}

module.exports = {
  items,
  suppliers,
  warehouses,
  notifications,
  reports,
  auditLog,
  resetDb
};
