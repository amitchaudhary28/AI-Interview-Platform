const express = require('express');
const router = express.Router();
const { startSession, submitAnswer, endSession, getMySessions, getSessionById } = require('../controllers/sessionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/start', protect, startSession);
router.post('/submit-answer', protect, submitAnswer);
router.post('/end', protect, endSession);
router.get('/my-sessions', protect, getMySessions);
router.get('/:id', protect, getSessionById);

module.exports = router;