const { v4: uuidv4 } = require('uuid');
const db = require('../db/database');
const { calculateStockValue, formatCurrency } = require('../utils/formatters');
const { toIsoDay } = require('../utils/dateHelpers');
const auditService = require('./auditService');

function buildValuationReport(options = {}) {
  const notificationService = require('./notificationService');
  const items = db.items.slice();
  const totalValue = calculateStockValue(items);
  const lowStockItems = items.filter((i) => i.quantity <= i.reorderThreshold);

  const report = {
    id: uuidv4(),
    date: toIsoDay(),
    totalItems: items.length,
    lowStockCount: lowStockItems.length,
    totalValue: totalValue,
    formattedValue: formatCurrency(totalValue),
    generatedAt: new Date().toISOString()
  };

  db.reports.push(report);
  auditService.writeReportCache(report);

  if (options.notify && lowStockItems.length > 0) {
    notificationService.queueLowStockAlert(lowStockItems, report.id);
  }

  return report;
}

function listReports() {
  return db.reports.slice();
}

function getLatestSummaryText() {
  const latest = db.reports[db.reports.length - 1];
  if (!latest) {
    return 'No valuation reports generated yet.';
  }
  return `Report ${latest.date}: ${latest.totalItems} items, ${latest.lowStockCount} low stock, total ${latest.formattedValue}`;
}

module.exports = {
  buildValuationReport,
  listReports,
  getLatestSummaryText
};
