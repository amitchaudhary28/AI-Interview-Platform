const { PrismaClient } = require('@prisma/client');
const { evaluateAnswer } = require('../services/aiService');
const prisma = new PrismaClient();

const startSession = async (req, res) => {
  try {
    const { topic, company, difficulty } = req.body;
    const userId = req.user.id;
    if (!topic) return res.status(400).json({ message: 'Topic is required' });
    const filters = { topic };
    if (difficulty) filters.difficulty = difficulty;
    if (company) filters.company = company;
    const allQuestions = await prisma.question.findMany({ where: filters });
    if (allQuestions.length === 0)
      return res.status(404).json({ message: 'No questions found for this topic' });
    const shuffled = allQuestions.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(5, allQuestions.length));
    const session = await prisma.session.create({
      data: { userId, topic, company: company || null, totalQ: selected.length }
    });
    res.status(201).json({
      message: 'Interview session started!',
      session: { id: session.id, topic: session.topic, company: session.company, totalQuestions: session.totalQ },
      questions: selected.map((q, index) => ({ index: index + 1, id: q.id, question: q.question, difficulty: q.difficulty, type: q.type }))
    });
  } catch (error) {
    console.error('Start session error:', error.message);
    res.status(500).json({ message: 'Server error', detail: error.message });
  }
};

const submitAnswer = async (req, res) => {
  try {
    const { sessionId, questionId, userAnswer } = req.body;
    if (!sessionId || !questionId || !userAnswer)
      return res.status(400).json({ message: 'sessionId, questionId and userAnswer required' });
    const session = await prisma.session.findUnique({ where: { id: sessionId } });
    if (!session) return res.status(404).json({ message: 'Session not found' });
    if (session.userId !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    if (session.completed) return res.status(400).json({ message: 'Session already completed' });
    const question = await prisma.question.findUnique({ where: { id: questionId } });
    if (!question) return res.status(404).json({ message: 'Question not found' });

    // AI Evaluation
    const aiResult = await evaluateAnswer(question.question, userAnswer, question.answer);
    const score = aiResult.score;
    const feedback = aiResult.feedback + ' | Strengths: ' + aiResult.strengths + ' | Improve: ' + aiResult.improvements;

    const answer = await prisma.answer.create({
      data: {
        sessionId,
        questionId,
        userAnswer,
        aiScore: score,
        aiFeedback: feedback
      }
    });

    res.json({
      message: 'Answer submitted!',
      score,
      correctAnswer: question.answer,
      feedback: answer.aiFeedback,
      followUp: aiResult.followUp,
      strengths: aiResult.strengths,
      improvements: aiResult.improvements
    });
  } catch (error) {
    console.error('Submit answer error:', error.message);
    res.status(500).json({ message: 'Server error', detail: error.message });
  }
};

const endSession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await prisma.session.findUnique({ where: { id: sessionId }, include: { answers: true } });
    if (!session) return res.status(404).json({ message: 'Session not found' });
    if (session.userId !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    const totalScore = session.answers.reduce((sum, a) => sum + a.aiScore, 0);
    const avgScore = session.answers.length > 0 ? Math.round(totalScore / session.answers.length) : 0;
    await prisma.session.update({ where: { id: sessionId }, data: { completed: true, score: avgScore } });
    await prisma.user.update({ where: { id: req.user.id }, data: { totalScore: { increment: avgScore } } });
    res.json({
      message: 'Interview completed!',
      result: {
        sessionId: session.id,
        topic: session.topic,
        totalQuestions: session.totalQ,
        answeredQuestions: session.answers.length,
        finalScore: avgScore,
        maxScore: 10,
        percentage: (avgScore * 10) + '%'
      }
    });
  } catch (error) {
    console.error('End session error:', error.message);
    res.status(500).json({ message: 'Server error', detail: error.message });
  }
};

const getMySessions = async (req, res) => {
  try {
    const sessions = await prisma.session.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: { answers: { select: { aiScore: true } } }
    });
    const result = sessions.map(s => ({
      id: s.id, topic: s.topic, company: s.company, score: s.score,
      totalQ: s.totalQ, answered: s.answers.length, completed: s.completed, date: s.createdAt
    }));
    res.json({ count: sessions.length, sessions: result });
  } catch (error) {
    res.status(500).json({ message: 'Server error', detail: error.message });
  }
};

const getSessionById = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await prisma.session.findUnique({
      where: { id },
      include: { answers: { include: { question: true } } }
    });
    if (!session) return res.status(404).json({ message: 'Session not found' });
    if (session.userId !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: 'Server error', detail: error.message });
  }
};

module.exports = { startSession, submitAnswer, endSession, getMySessions, getSessionById };