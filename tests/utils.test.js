const {
  formatCurrency,
  slugifyName,
  generateSku,
  calculateStockValue
} = require('../src/utils/formatters');
const { encryptLegacyToken } = require('../src/middleware/auth');

describe('Formatter and Auth Utils', () => {
  test('formatCurrency formats positive USD values', () => {
    expect(formatCurrency(19.5)).toBe('$19.50');
  });

  test('formatCurrency handles zero and negative values', () => {
    expect(formatCurrency(0)).toBe('$0.00');
    expect(formatCurrency(-12.345)).toBe('-$12.35');
  });

  test('slugifyName converts item names to URL-safe slugs', () => {
    expect(slugifyName('Thermal Shipping Labels (500ct)')).toBe('thermal-shipping-labels-500ct');
  });

  test('calculateStockValue computes total inventory value', () => {
    const sample = [
      { quantity: 2, unitPrice: 10 },
      { quantity: 3, unitPrice: 5.5 }
    ];
    expect(calculateStockValue(sample)).toBeCloseTo(36.5);
  });

  test('generateSku produces a 6-character alphanumeric suffix', () => {
    const sku = generateSku();
    expect(sku).toMatch(/^SKU-[A-Z0-9]{6}$/);
  });

  test('encryptLegacyToken returns hex string', () => {
    const token = encryptLegacyToken('session-123');
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
  });
});
