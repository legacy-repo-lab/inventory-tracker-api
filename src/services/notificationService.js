const request = require('request');
const { v4: uuidv4 } = require('uuid');
const db = require('../db/database');
const config = require('../config');

function listNotifications() {
  return db.notifications.slice();
}

function queueLowStockAlert(lowStockItems, reportId) {
  const entry = {
    id: uuidv4(),
    type: 'LOW_STOCK_ALERT',
    reportId: reportId || null,
    itemIds: lowStockItems.map((i) => i.id),
    message: `${lowStockItems.length} item(s) below reorder threshold`,
    createdAt: new Date().toISOString(),
    dispatched: false
  };
  db.notifications.push(entry);
  return entry;
}

function buildDigestPayload() {
  const reportService = require('./reportService');
  return {
    summary: reportService.getLatestSummaryText(),
    pendingAlerts: db.notifications.filter((n) => !n.dispatched).length,
    generatedAt: new Date().toISOString()
  };
}

function dispatchWebhook(targetUrl, payload, options = {}) {
  const url = targetUrl || config.supplierWebhookUrl;
  const timeoutMs = typeof options.timeout === 'number' ? options.timeout : 2500;

  return new Promise((resolve, reject) => {
    request.post(
      {
        url: url,
        json: payload,
        timeout: timeoutMs,
        followRedirect: true,
        followAllRedirects: true
      },
      (err, res, body) => {
        if (err) {
          return reject(err);
        }
        resolve({
          ok: res.statusCode >= 200 && res.statusCode < 300,
          statusCode: res.statusCode,
          body: body
        });
      }
    );
  });
}

module.exports = {
  listNotifications,
  queueLowStockAlert,
  buildDigestPayload,
  dispatchWebhook
};
