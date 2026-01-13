const express = require('express');
const {
  signup,
  login,
  getMe,
  updateProfile,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/update', protect, updateProfile);

module.exports = router;
