const express = require('express');
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const {
  uploadAndAnalyzeResume,
  getUserResumes,
  getResumeById,
} = require('../controllers/resume.controller');

const router = express.Router();

// ─── Multer config ────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// ─── Routes ───────────────────────────────────────────────────────
router.post('/upload', protect, upload.single('resume'), uploadAndAnalyzeResume);
router.get('/', protect, getUserResumes);
router.get('/:id', protect, getResumeById);

module.exports = router;