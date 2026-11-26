const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db/database');

describe('Items API', () => {
  beforeAll(() => {
    db.resetDb();
  });

  test('GET /api/items returns seeded items', async () => {
    const res = await request(app).get('/api/items');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(3);
  });

  test('GET /api/items?category=electronics filters by category', async () => {
    const res = await request(app).get('/api/items?category=electronics');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body.every((i) => i.category === 'electronics')).toBe(true);
  });

  test('GET /api/items?lowStock=true returns low-stock items', async () => {
    const res = await request(app).get('/api/items?lowStock=true');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].id).toBe('item-2');
  });

  test('GET /api/items/:id returns a single item', async () => {
    const res = await request(app).get('/api/items/item-1');
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Wireless Barcode Scanner');
  });

  test('GET /api/items/:id returns 404 for unknown id', async () => {
    const res = await request(app).get('/api/items/does-not-exist');
    expect(res.statusCode).toBe(404);
  });

  test('POST /api/items creates a new item', async () => {
    const res = await request(app)
      .post('/api/items')
      .send({
        name: 'Pallet Wrap Roll',
        category: 'supplies',
        quantity: 12,
        unitPrice: 24.0
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.name).toBe('Pallet Wrap Roll');
  });

  test('POST /api/items returns 400 when name is missing', async () => {
    const res = await request(app)
      .post('/api/items')
      .send({ category: 'supplies' });

    expect(res.statusCode).toBe(400);
  });

  test('GET /api/items reflects newly created item count', async () => {
    const res = await request(app).get('/api/items');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(4);
  });

  test('PATCH /api/items/:id/stock updates item quantity', async () => {
    const res = await request(app)
      .patch('/api/items/item-1/stock')
      .send({ delta: -4 });

    expect(res.statusCode).toBe(200);
    expect(res.body.quantity).toBe(10);
  });

  test('DELETE /api/items/:id removes an item', async () => {
    const res = await request(app).delete('/api/items/item-3');
    expect(res.statusCode).toBe(204);
  });

  test('DELETE /api/items/:id returns 404 if item already deleted', async () => {
    const res = await request(app).delete('/api/items/item-3');
    expect(res.statusCode).toBe(404);
  });
});
