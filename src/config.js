require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  apiKey: process.env.API_KEY || 'dev-api-key-0000',
  legacySecret: process.env.LEGACY_SECRET || 'fallback-secret-key',
  supplierWebhookUrl: process.env.SUPPLIER_WEBHOOK_URL || 'https://example.com/webhooks/inventory'
};
