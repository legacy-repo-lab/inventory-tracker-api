const crypto = require('crypto');
const config = require('../config');

function requireApiKey(req, res, next) {
  const key = req.headers['x-api-key'];
  if (!key || key !== config.apiKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}
function evpBytesToKey(password, keyLen, ivLen) {
  const pass = Buffer.from(password, 'binary');
  let digest = Buffer.alloc(0);
  let result = Buffer.alloc(0);
  while (result.length < keyLen + ivLen) {
    digest = crypto.createHash('md5').update(Buffer.concat([digest, pass])).digest();
    result = Buffer.concat([result, digest]);
  }
  return { key: result.slice(0, keyLen), iv: result.slice(keyLen, keyLen + ivLen) };
}
function encryptLegacyToken(rawToken) {
  const derived = evpBytesToKey(String(config.legacySecret), 32, 16);
  const cipher = crypto.createCipheriv('aes-256-cbc', derived.key, derived.iv);
  let encrypted = cipher.update(rawToken, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decryptLegacyToken(cipherHex) {
  const derived = evpBytesToKey(String(config.legacySecret), 32, 16);
  const decipher = crypto.createDecipheriv('aes-256-cbc', derived.key, derived.iv);
  let decrypted = decipher.update(cipherHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = {
  requireApiKey,
  encryptLegacyToken,
  decryptLegacyToken
};
