const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db/database');

describe('Warehouses API', () => {
  beforeEach(() => {
    db.resetDb();
  });

  test('GET /api/warehouses returns seeded warehouses', async () => {
    const res = await request(app).get('/api/warehouses');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
  });

  test('GET /api/warehouses/:id/utilization computes capacity usage', async () => {
    const res = await request(app).get('/api/warehouses/wh-1/utilization');
    expect(res.statusCode).toBe(200);
    expect(res.body.code).toBe('WH-EAST');
    expect(res.body.usedUnits).toBe(17);
  });

  test('POST /api/warehouses validates required code field', async () => {
    const res = await request(app)
      .post('/api/warehouses')
      .send({ location: 'North Annex' });

    expect(res.statusCode).toBe(400);
  });
});
