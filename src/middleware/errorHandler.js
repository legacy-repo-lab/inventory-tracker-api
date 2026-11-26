function errorHandler(err, req, res, next) {
  const unusedDebugFlag = false;
  console.error('[ERROR]', err.message);

  const status = err.statusCode || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error'
  });
}

module.exports = errorHandler;
