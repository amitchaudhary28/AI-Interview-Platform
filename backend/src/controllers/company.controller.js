const {
  generateCompanyQuestions,
  evaluateCompanyAnswer,
  companyProfiles,
} = require('../services/company.service');

// ─── Get all companies ────────────────────────────────────────────
const getCompanies = (req, res) => {
  const companies = Object.keys(companyProfiles).map((name) => ({
    name,
    difficulty: companyProfiles[name].difficulty,
    rounds: companyProfiles[name].rounds,
    tips: companyProfiles[name].tips,
  }));
  return res.status(200).json({ companies });
};

// ─── Generate questions ───────────────────────────────────────────
const getCompanyQuestions = async (req, res) => {
  try {
    const { company, round, experience, role } = req.body;

    if (!company || !round) {
      return res.status(400).json({ error: 'Company and round are required' });
    }

    const result = await generateCompanyQuestions(company, round, experience, role);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Company questions error:', error.message);
    return res.status(500).json({ error: error.message });
  }
};

// ─── Evaluate answer ──────────────────────────────────────────────
const evaluateAnswer = async (req, res) => {
  try {
    const { company, question, answer, round } = req.body;

    if (!company || !question || !answer) {
      return res.status(400).json({ error: 'Company, question and answer are required' });
    }

    const result = await evaluateCompanyAnswer(company, question, answer, round);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Evaluation error:', error.message);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { getCompanies, getCompanyQuestions, evaluateAnswer };