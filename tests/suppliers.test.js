const request = require('supertest');
const fetch = require('node-fetch');
const app = require('../src/app');
const db = require('../src/db/database');
const config = require('../src/config');

jest.mock('node-fetch');

describe('Suppliers API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    db.auditLog.length = 0;
  });

  test('GET /api/suppliers returns seeded suppliers', async () => {
    const res = await request(app).get('/api/suppliers');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
  });

  test('GET /api/suppliers/:id returns supplier details', async () => {
    const res = await request(app).get('/api/suppliers/sup-1');
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Northstar Electronics Wholesale');
  });

  test('GET /api/suppliers/:id returns 404 for unknown supplier', async () => {
    const res = await request(app).get('/api/suppliers/sup-999');
    expect(res.statusCode).toBe(404);
  });

  test('POST /api/suppliers requires api key', async () => {
    const res = await request(app)
      .post('/api/suppliers')
      .send({ name: 'Unauthorized Vendor' });

    expect(res.statusCode).toBe(401);
  });

  test('POST /api/suppliers creates supplier with valid api key', async () => {
    const res = await request(app)
      .post('/api/suppliers')
      .set('x-api-key', config.apiKey)
      .send({ name: 'Acme Packaging', contactEmail: 'sales@example.com' });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Acme Packaging');
  });

  test('POST /api/suppliers/:id/sync fetches remote stock', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ items: [{ sku: 'SKU-1' }, { sku: 'SKU-2' }] })
    });

    const res = await request(app).post('/api/suppliers/sup-1/sync');
    expect(res.statusCode).toBe(200);
    expect(res.body.synced).toBe(true);
    expect(res.body.itemsReceived).toBe(2);
  });

  test('POST /api/suppliers/:id/sync writes audit log entry asynchronously', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ items: [{ sku: 'SKU-1' }] })
    });

    await request(app).post('/api/suppliers/sup-1/sync');

    await new Promise((resolve) => setTimeout(resolve, 40));
    expect(db.auditLog.length).toBe(1);
  });
});
