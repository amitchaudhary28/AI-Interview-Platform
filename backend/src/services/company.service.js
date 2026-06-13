const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─── Company interview styles ─────────────────────────────────────
const companyProfiles = {
  Google: {
    style: 'Focus on algorithms, data structures, system design, and behavioral questions using STAR method. Google values problem-solving approach over just the answer.',
    rounds: ['DSA', 'System Design', 'Behavioral', 'Googleyness'],
    difficulty: 'very hard',
    tips: 'Think out loud, discuss trade-offs, write clean code',
  },
  Amazon: {
    style: 'Heavy focus on Leadership Principles (14 LPs). Behavioral questions are critical. Technical rounds include DSA and system design at scale.',
    rounds: ['Leadership Principles', 'DSA', 'System Design', 'Bar Raiser'],
    difficulty: 'hard',
    tips: 'Prepare STAR stories for all 14 Leadership Principles',
  },
  Microsoft: {
    style: 'Focus on coding, problem solving, and culture fit. Values growth mindset. System design for senior roles.',
    rounds: ['Coding', 'System Design', 'Behavioral', 'As Appropriate'],
    difficulty: 'hard',
    tips: 'Show curiosity and growth mindset in every answer',
  },
  TCS: {
    style: 'Focus on basic programming, aptitude, verbal ability, and technical fundamentals. HR round is very important.',
    rounds: ['Aptitude', 'Technical', 'Managerial', 'HR'],
    difficulty: 'medium',
    tips: 'Strong basics in C, Java, DBMS, OS, and networking',
  },
  Infosys: {
    style: 'Focus on aptitude, logical reasoning, and technical knowledge. Values communication skills and adaptability.',
    rounds: ['Hackathon/Aptitude', 'Technical Interview', 'HR Interview'],
    difficulty: 'medium',
    tips: 'Good communication and basic technical knowledge is key',
  },
  Wipro: {
    style: 'Focuses on aptitude, technical basics, and HR. Values teamwork and communication.',
    rounds: ['Online Test', 'Technical', 'HR'],
    difficulty: 'medium',
    tips: 'Focus on OOPS, DBMS, and basic DSA',
  },
  Flipkart: {
    style: 'Similar to Amazon but more startup-oriented. Heavy DSA focus with emphasis on scalable system design.',
    rounds: ['DSA', 'System Design', 'Behavioral', 'Culture Fit'],
    difficulty: 'hard',
    tips: 'Practice hard DSA problems and e-commerce system designs',
  },
  Startup: {
    style: 'Fast-paced, values ownership and ability to wear multiple hats. Full-stack knowledge preferred.',
    rounds: ['Technical', 'System Design', 'Culture Fit'],
    difficulty: 'medium',
    tips: 'Show initiative, ownership, and ability to learn fast',
  },
};

// ─── Generate company specific questions ─────────────────────────
const generateCompanyQuestions = async (company, round, experience, role) => {
  const profile = companyProfiles[company] || companyProfiles['Startup'];

  const prompt = `You are a ${company} interviewer conducting a ${round} interview round.

Company Interview Style: ${profile.style}
Role: ${role || 'Software Engineer'}
Candidate Experience: ${experience || 'Fresher'}
Round Type: ${round}
Difficulty: ${profile.difficulty}

Generate exactly 8 interview questions for this ${company} ${round} round.
Return ONLY a valid JSON object (no markdown, no explanation):
{
  "company": "${company}",
  "round": "${round}",
  "role": "${role || 'Software Engineer'}",
  "difficulty": "${profile.difficulty}",
  "tips": "${profile.tips}",
  "questions": [
    {
      "id": 1,
      "question": "question text",
      "type": "technical | behavioral | system_design | coding",
      "hint": "what interviewer is looking for",
      "follow_ups": ["follow up question 1", "follow up question 2"]
    }
  ]
}`;

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: 'You are an expert technical interviewer. Return only valid JSON.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 3000,
  });

  const responseText = completion.choices[0].message.content;
  const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleaned);
};

// ─── Evaluate answer ──────────────────────────────────────────────
const evaluateCompanyAnswer = async (company, question, answer, round) => {
  const prompt = `You are a ${company} interviewer evaluating a candidate's answer.

Question: ${question}
Candidate's Answer: ${answer}
Round: ${round}

Return ONLY valid JSON:
{
  "score": 8,
  "out_of": 10,
  "verdict": "Good | Excellent | Needs Improvement | Poor",
  "what_was_good": "what the candidate did well",
  "what_was_missing": "what was missing or could be improved",
  "ideal_answer_points": ["key point 1", "key point 2", "key point 3"],
  "follow_up": "one follow-up question based on their answer"
}`;

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: 'You are an expert interviewer. Return only valid JSON.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.3,
    max_tokens: 1000,
  });

  const responseText = completion.choices[0].message.content;
  const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleaned);
};

module.exports = { generateCompanyQuestions, evaluateCompanyAnswer, companyProfiles };