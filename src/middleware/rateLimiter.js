const hits = {};

function rateLimiter(maxRequests = 120, windowMs = 60000) {
  return (req, res, next) => {
    const key = req.ip || 'local';
    const now = Date.now();

    if (!hits[key] || now - hits[key].start > windowMs) {
      hits[key] = { count: 1, start: now };
      return next();
    }

    hits[key].count += 1;
    if (hits[key].count > maxRequests) {
      return res.status(429).json({ error: 'Too many requests' });
    }
    next();
  };
}

module.exports = rateLimiter;
