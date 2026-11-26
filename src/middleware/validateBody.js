function validateBody(requiredFields) {
  return (req, res, next) => {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ error: 'Request body must be JSON' });
    }
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (req.body[field] === undefined || req.body[field] === '') {
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }
    next();
  };
}

module.exports = validateBody;
