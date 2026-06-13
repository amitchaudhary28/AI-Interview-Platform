const express = require('express');
const router = express.Router();
const { aiEvaluate, resumeQuestions, companyQuestions, codeReview } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/evaluate', protect, aiEvaluate);
router.post('/resume-questions', protect, resumeQuestions);
router.post('/company-questions', protect, companyQuestions);
router.post('/code-review', protect, codeReview);

module.exports = router;