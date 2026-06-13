const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  getCompanies,
  getCompanyQuestions,
  evaluateAnswer,
} = require('../controllers/company.controller');

const router = express.Router();

router.get('/', protect, getCompanies);
router.post('/questions', protect, getCompanyQuestions);
router.post('/evaluate', protect, evaluateAnswer);

module.exports = router;