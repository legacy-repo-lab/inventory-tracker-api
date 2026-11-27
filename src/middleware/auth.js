const crypto = require('crypto');
const config = require('../config');

function requireApiKey(req, res, next) {
  const key = req.headers['x-api-key'];
  if (!key || key !== config.apiKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

function encryptLegacyToken(rawToken) {
  const cipher = crypto.createCipher('aes-256-cbc', config.legacySecret);
  let encrypted = cipher.update(rawToken, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decryptLegacyToken(cipherHex) {
  const decipher = crypto.createDecipher('aes-256-cbc', config.legacySecret);
  let decrypted = decipher.update(cipherHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = {
  requireApiKey,
  encryptLegacyToken,
  decryptLegacyToken
};
