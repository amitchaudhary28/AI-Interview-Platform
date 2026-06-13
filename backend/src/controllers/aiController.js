const { evaluateAnswer, generateQuestionsFromResume, generateCompanyQuestions, reviewCode } = require('../services/aiService');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// AI evaluate answer
const aiEvaluate = async (req, res) => {
  try {
    const { question, userAnswer, correctAnswer, sessionId, questionId } = req.body;

    if (!question || !userAnswer) {
      return res.status(400).json({ message: 'question and userAnswer required' });
    }

    const result = await evaluateAnswer(question, userAnswer, correctAnswer || '');

    // Update answer in DB if sessionId and questionId provided
    if (sessionId && questionId) {
      await prisma.answer.updateMany({
        where: { sessionId, questionId },
        data: {
          aiScore: result.score,
          aiFeedback: result.feedback
        }
      });
    }

    res.json({
      message: 'AI evaluation complete!',
      evaluation: result
    });
  } catch (error) {
    console.error('AI evaluate error:', error.message);
    res.status(500).json({ message: 'Server error', detail: error.message });
  }
};

// Generate questions from resume
const resumeQuestions = async (req, res) => {
  try {
    const { resumeText } = req.body;
    if (!resumeText) return res.status(400).json({ message: 'resumeText required' });

    const result = await generateQuestionsFromResume(resumeText);
    res.json({ message: 'Questions generated!', ...result });
  } catch (error) {
    res.status(500).json({ message: 'Server error', detail: error.message });
  }
};

// Generate company questions
const companyQuestions = async (req, res) => {
  try {
    const { company, topic, count } = req.body;
    if (!company || !topic) return res.status(400).json({ message: 'company and topic required' });

    const result = await generateCompanyQuestions(company, topic, count);
    res.json({ message: 'Questions generated!', ...result });
  } catch (error) {
    res.status(500).json({ message: 'Server error', detail: error.message });
  }
};

// AI code review
const codeReview = async (req, res) => {
  try {
    const { problem, code, language } = req.body;
    if (!problem || !code || !language) {
      return res.status(400).json({ message: 'problem, code and language required' });
    }

    const result = await reviewCode(problem, code, language);
    res.json({ message: 'Code review complete!', review: result });
  } catch (error) {
    res.status(500).json({ message: 'Server error', detail: error.message });
  }
};

module.exports = { aiEvaluate, resumeQuestions, companyQuestions, codeReview };