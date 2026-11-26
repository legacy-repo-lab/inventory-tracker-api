const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db/database');
const auditService = require('../src/services/auditService');

describe('Reports API', () => {
  beforeEach(() => {
    db.resetDb();
    auditService.clearReportCache();
  });

  test('POST /api/reports/valuation generates a valuation report and caches it', async () => {
    const res = await request(app)
      .post('/api/reports/valuation')
      .send({ notify: true });

    expect(res.statusCode).toBe(201);
    expect(res.body.totalItems).toBe(3);
    expect(res.body.lowStockCount).toBe(1);

    await new Promise((resolve) => setTimeout(resolve, 550));
    const cached = auditService.readReportCache();
    expect(cached).not.toBeNull();
    expect(cached.id).toBe(res.body.id);
  });

  test('GET /api/reports/summary returns latest summary text', async () => {
    await request(app).post('/api/reports/valuation').send({});
    const res = await request(app).get('/api/reports/summary');

    expect(res.statusCode).toBe(200);
    expect(res.body.summary).toContain('3 items');
  });
});
