const express = require('express');
const notificationService = require('../services/notificationService');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(notificationService.listNotifications());
});

router.get('/digest', (req, res) => {
  res.json(notificationService.buildDigestPayload());
});

router.post('/dispatch', async (req, res, next) => {
  try {
    const targetUrl = req.body && req.body.url;
    const payload = notificationService.buildDigestPayload();
    const result = await notificationService.dispatchWebhook(targetUrl, payload);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
