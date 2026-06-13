const pdf = require('pdf-parse');
const pdfParse = typeof pdf === 'function' ? pdf : pdf.default;
const fs = require('fs');
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─── Extract text from PDF ───────────────────────────────────────
const extractTextFromPDF = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
};

// ─── Analyze resume text using Groq ──────────────────────────────
const analyzeResumeWithAI = async (resumeText) => {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: 'You are an expert ATS and technical interview specialist. Always respond with valid JSON only. No markdown, no explanation, no code blocks.',
      },
      {
        role: 'user',
        content: `Analyze the following resume and return ONLY a valid JSON object with this exact structure:
{
  "candidate_summary": "2-3 line summary",
  "detected_skills": ["skill1", "skill2"],
  "difficulty_level": "beginner or intermediate or advanced",
  "difficulty_reason": "reason",
  "ats_score": {
    "overall": 72,
    "breakdown": {
      "keyword_match": 80,
      "formatting": 65,
      "work_experience": 70,
      "education": 85,
      "skills_section": 75,
      "contact_info": 90,
      "action_verbs": 60,
      "quantified_achievements": 50
    },
    "grade": "B",
    "summary": "one line verdict"
  },
  "improvement_suggestions": [
    {
      "priority": "high or medium or low",
      "section": "section name",
      "issue": "what is wrong",
      "fix": "how to fix",
      "example": "before/after example"
    }
  ],
  "missing_keywords": ["keyword1", "keyword2"],
  "strong_points": ["strong point 1", "strong point 2"],
  "weakness_areas": [
    { "area": "area name", "reason": "why weak" }
  ],
  "skill_based_questions": [
    { "question": "question", "topic": "topic", "difficulty": "easy or medium or hard" }
  ],
  "project_based_questions": [
    { "question": "question", "related_project": "project name" }
  ],
  "company_specific_questions": [
    { "company": "company name", "question": "question", "reason": "why they ask this" }
  ],
  "recommended_focus_topics": ["topic1", "topic2"]
}

RESUME:
${resumeText}`,
      },
    ],
    temperature: 0.3,
    max_tokens: 4000,
  });

  const responseText = completion.choices[0].message.content;

  const cleaned = responseText
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();

  return JSON.parse(cleaned);
};

// ─── Delete file after processing ────────────────────────────────
const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

module.exports = { extractTextFromPDF, analyzeResumeWithAI, deleteFile };