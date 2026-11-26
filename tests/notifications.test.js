const http = require('http');
const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db/database');

describe('Notifications API', () => {
  beforeEach(() => {
    db.resetDb();
  });

  test('GET /api/notifications/digest returns summary from reports', async () => {
    await request(app).post('/api/reports/valuation').send({ notify: true });
    const res = await request(app).get('/api/notifications/digest');

    expect(res.statusCode).toBe(200);
    expect(res.body.pendingAlerts).toBe(1);
    expect(res.body.summary).toContain('1 low stock');
  });

  test('POST /api/notifications/dispatch delivers digest to local listener', async () => {
    let received = null;
    const server = http.createServer((req, res) => {
      let body = '';
      req.on('data', (chunk) => { body += chunk; });
      req.on('end', () => {
        received = JSON.parse(body);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ accepted: true }));
      });
    });

    await new Promise((resolve) => server.listen(4567, resolve));

    try {
      await new Promise((resolve) => setTimeout(resolve, 550));
      const res = await request(app)
        .post('/api/notifications/dispatch')
        .send({ url: 'http://127.0.0.1:4567/hook' });

      expect(res.statusCode).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(received).not.toBeNull();
      expect(typeof received.pendingAlerts).toBe('number');
    } finally {
      await new Promise((resolve) => server.close(resolve));
    }
  });
});
