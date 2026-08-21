const express = require('express');
const router = express.Router();
const {
  submitContactMessage,
  getContactMessages,
  markContactAsRead
} = require('../controllers/contactController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', submitContactMessage);
router.get('/', protect, admin, getContactMessages);
router.put('/:id/read', protect, admin, markContactAsRead);

module.exports = router;
