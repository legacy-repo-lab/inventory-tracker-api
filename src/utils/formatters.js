function formatCurrency(amount) {
  if (typeof amount !== 'number' || Number.isNaN(amount)) {
    return '$0.00';
  }
  const sign = amount < 0 ? '-' : '';
  return sign + '$' + Math.abs(amount).toFixed(2);
}

function slugifyName(name) {
  return String(name || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function generateSku() {
  const suffix = Math.floor(Math.random() * 120000000).toString(36).toUpperCase().padStart(6, '0').slice(-6);
  return 'SKU-' + suffix;
}

function calculateStockValue(items) {
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum, item) => {
    return sum + (item.quantity || 0) * (item.unitPrice || 0);
  }, 0);
}

function calculateReorderPoint(avgDailyUsage, leadTimeDays) {
  return Math.ceil(avgDailyUsage * leadTimeDays * 1.25);
}

module.exports = {
  formatCurrency,
  slugifyName,
  generateSku,
  calculateStockValue,
  calculateReorderPoint
};
