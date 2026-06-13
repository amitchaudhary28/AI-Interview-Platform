const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const addQuestion = async (req, res) => {
  try {
    const { topic, type, difficulty, question, answer, company } = req.body;
    if (!topic || !type || !difficulty || !question || !answer)
      return res.status(400).json({ message: 'Please fill all required fields' });
    const newQuestion = await prisma.question.create({
      data: { topic, type, difficulty, question, answer, company: company || null }
    });
    res.status(201).json({ message: 'Question added!', question: newQuestion });
  } catch (error) {
    console.error('Add question error:', error.message);
    res.status(500).json({ message: 'Server error', detail: error.message });
  }
};

const getQuestions = async (req, res) => {
  try {
    const { topic, type, difficulty, company } = req.query;
    const filters = {};
    if (topic) filters.topic = topic;
    if (type) filters.type = type;
    if (difficulty) filters.difficulty = difficulty;
    if (company) filters.company = company;
    const questions = await prisma.question.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' }
    });
    res.json({ count: questions.length, questions });
  } catch (error) {
    res.status(500).json({ message: 'Server error', detail: error.message });
  }
};

const getRandomQuestions = async (req, res) => {
  try {
    const { topic, difficulty, company, count } = req.query;
    const limit = parseInt(count) || 5;
    const filters = {};
    if (topic) filters.topic = topic;
    if (difficulty) filters.difficulty = difficulty;
    if (company) filters.company = company;
    const allQuestions = await prisma.question.findMany({ where: filters });
    const shuffled = allQuestions.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, limit);
    res.json({ count: selected.length, questions: selected });
  } catch (error) {
    res.status(500).json({ message: 'Server error', detail: error.message });
  }
};

const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await prisma.question.findUnique({ where: { id } });
    if (!question) return res.status(404).json({ message: 'Question not found' });
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: 'Server error', detail: error.message });
  }
};

const getTopics = async (req, res) => {
  try {
    const questions = await prisma.question.findMany({
      select: { topic: true },
      distinct: ['topic']
    });
    const topics = questions.map(q => q.topic);
    res.json({ topics });
  } catch (error) {
    res.status(500).json({ message: 'Server error', detail: error.message });
  }
};

module.exports = { addQuestion, getQuestions, getRandomQuestions, getQuestionById, getTopics };