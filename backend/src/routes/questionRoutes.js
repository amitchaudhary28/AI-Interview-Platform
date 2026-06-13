const express = require('express');
const router = express.Router();
const { addQuestion, getQuestions, getRandomQuestions, getQuestionById, getTopics } = require('../controllers/questionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/add', protect, addQuestion);
router.get('/', protect, getQuestions);
router.get('/random', protect, getRandomQuestions);
router.get('/topics', protect, getTopics);
router.get('/:id', protect, getQuestionById);

module.exports = router;