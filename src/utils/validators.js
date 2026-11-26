function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isPositiveInt(val) {
  return Number.isInteger(val) && val > 0;
}

function sanitizeCategory(cat) {
  return String(cat || 'general').trim().toLowerCase();
}

module.exports = {
  isValidEmail,
  isPositiveInt,
  sanitizeCategory
};
