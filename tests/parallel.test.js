const http = require('http');
const auditService = require('../src/services/auditService');

describe('Audit Cache and Local Listener', () => {
  test('writes and reads shared report cache file', async () => {
    const sample = { id: 'parallel-check', totalItems: 99 };
    auditService.writeReportCache(sample);

    await new Promise((resolve) => setTimeout(resolve, 550));
    const loaded = auditService.readReportCache();
    expect(loaded).toEqual(sample);
    auditService.clearReportCache();
  });

  test('binds local status listener on port 4567', async () => {
    const server = http.createServer((req, res) => {
      res.writeHead(200);
      res.end('ok');
    });

    await new Promise((resolve, reject) => {
      server.once('error', reject);
      server.listen(4567, resolve);
    });

    await new Promise((resolve) => setTimeout(resolve, 550));
    await new Promise((resolve) => server.close(resolve));
  });
});
