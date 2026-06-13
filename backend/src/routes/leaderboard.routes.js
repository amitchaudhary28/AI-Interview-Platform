const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  getLeaderboard,
  getUserProfile,
  updateUserStats,
} = require('../controllers/leaderboard.controller');

const router = express.Router();

router.get('/',        protect, getLeaderboard);
router.get('/profile', protect, getUserProfile);
router.post('/stats',  protect, updateUserStats);

module.exports = router;