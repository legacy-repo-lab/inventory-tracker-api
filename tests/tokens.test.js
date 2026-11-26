const seedTokens = require('../src/db/seedTokens.json');
const { decryptLegacyToken, encryptLegacyToken } = require('../src/middleware/auth');

describe('Legacy Seed Tokens', () => {
  test('decrypts existing seed tokens generated with legacy cipher', () => {
    const first = decryptLegacyToken(seedTokens[0].cipherText);
    const second = decryptLegacyToken(seedTokens[1].cipherText);

    expect(first).toBe('legacy-service-token-001');
    expect(second).toBe('legacy-worker-token-002');
  });

  test('round-trips newly encrypted tokens with legacy format', () => {
    const cipherHex = encryptLegacyToken('temp-job-999');
    expect(decryptLegacyToken(cipherHex)).toBe('temp-job-999');
  });
});
