const { PrismaClient } = require('@prisma/client');
const {
  extractTextFromPDF,
  analyzeResumeWithAI,
  deleteFile,
} = require('../services/resume.service');

const prisma = new PrismaClient();

// ─── Upload & Analyze Resume ──────────────────────────────────────
const uploadAndAnalyzeResume = async (req, res) => {
  const filePath = req.file?.path;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    console.log('📄 File received:', req.file.originalname);
    console.log('👤 User:', req.user);

    const extractedText = await extractTextFromPDF(filePath);
    console.log('✅ Text extracted, length:', extractedText?.length);

    if (!extractedText || extractedText.trim().length < 50) {
      deleteFile(filePath);
      return res.status(400).json({
        error: 'Could not extract enough text. Is it a scanned image PDF?',
      });
    }

    console.log('🤖 Sending to AI...');
    const analysisResult = await analyzeResumeWithAI(extractedText);
    console.log('✅ AI analysis done');

    console.log('💾 Saving to DB...');
    const resume = await prisma.resume.create({
      data: {
        userId: req.user.id,
        fileName: req.file.originalname,
        extractedText,
        analysisResult,
      },
    });
    console.log('✅ Saved to DB, id:', resume.id);

    deleteFile(filePath);

    return res.status(200).json({
      message: 'Resume analyzed successfully',
      resumeId: resume.id,
      analysis: analysisResult,
    });
  } catch (error) {
    if (filePath) deleteFile(filePath);
    console.error('❌ FULL ERROR:', error); // shows complete error
    return res.status(500).json({ error: error.message }); // real message to frontend
  }
};

// ─── Get all resumes of logged-in user ───────────────────────────
const getUserResumes = async (req, res) => {
  try {
    const resumes = await prisma.resume.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fileName: true,
        analysisResult: true,
        createdAt: true,
      },
    });
    return res.status(200).json({ resumes });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch resumes' });
  }
};

// ─── Get single resume ────────────────────────────────────────────
const getResumeById = async (req, res) => {
  try {
    const resume = await prisma.resume.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    return res.status(200).json({ resume });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch resume' });
  }
};

module.exports = { uploadAndAnalyzeResume, getUserResumes, getResumeById };