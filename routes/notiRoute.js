const express = require('express');
const {
  getNotifications
} = require('../controllers/notificationController');

const router = express.Router();

router.post('/users/notifications', getNotifications);

module.exports = router;
