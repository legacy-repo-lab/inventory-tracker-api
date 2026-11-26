const http = require('http');
const { dispatchWebhook } = require('../src/services/notificationService');

describe('Outbound Webhook Behavior (request)', () => {
  let server;
  let baseUrl;

  beforeAll((done) => {
    server = http.createServer((req, res) => {
      if (req.url === '/redirect') {
        res.writeHead(302, { Location: '/final' });
        return res.end();
      }
      if (req.url === '/final') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ redirected: true, method: req.method }));
      }
      if (req.url === '/unavailable') {
        res.writeHead(503, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'downstream busy' }));
      }
      if (req.url === '/slow') {
        setTimeout(() => {
          res.writeHead(200);
          res.end('ok');
        }, 300);
        return;
      }
      res.writeHead(404);
      res.end();
    });

    server.listen(0, () => {
      const addr = server.address();
      baseUrl = `http://127.0.0.1:${addr.port}`;
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  test('follows 302 redirects on POST', async () => {
    const result = await dispatchWebhook(`${baseUrl}/redirect`, { event: 'test' });
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual({ redirected: true, method: 'GET' });
  });

  test('resolves non-2xx responses without throwing', async () => {
    const result = await dispatchWebhook(`${baseUrl}/unavailable`, { event: 'test' });
    expect(result.ok).toBe(false);
    expect(result.statusCode).toBe(503);
    expect(result.body).toEqual({ error: 'downstream busy' });
  });

  test('rejects with ETIMEDOUT or ESOCKETTIMEDOUT on timeout', async () => {
    await expect(
      dispatchWebhook(`${baseUrl}/slow`, { event: 'test' }, { timeout: 60 })
    ).rejects.toMatchObject({
      code: expect.stringMatching(/ETIMEDOUT|ESOCKETTIMEDOUT/)
    });
  });
});
