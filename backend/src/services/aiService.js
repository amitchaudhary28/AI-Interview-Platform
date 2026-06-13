const Groq = require('groq-sdk');

const getClient = () => new Groq({ apiKey: process.env.GROQ_API_KEY });

const evaluateAnswer = async (question, userAnswer, correctAnswer) => {
  try {
    const client = getClient();
    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'You are an expert technical interviewer. Always respond in valid JSON only. No extra text.' },
        { role: 'user', content: `Evaluate this interview answer. Respond ONLY in this JSON format:
{"score":7,"feedback":"Good answer.","strengths":"Clear explanation.","improvements":"Add examples.","followUp":"Can you elaborate?"}

Question: ${question}
Candidate Answer: ${userAnswer}
Expected Answer: ${correctAnswer}` }
      ],
      temperature: 0.3
    });
    const text = response.choices[0].message.content;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON');
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('AI error:', error.message);
    return { score: 5, feedback: 'AI unavailable.', strengths: 'Submitted.', improvements: 'Try again.', followUp: 'Elaborate?' };
  }
};

const generateQuestionsFromResume = async (resumeText) => {
  try {
    const client = getClient();
    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'You are an expert interviewer. Respond in valid JSON only.' },
        { role: 'user', content: `Generate 5 interview questions from this resume. JSON only:
{"questions":[{"question":"Q?","topic":"HR","difficulty":"Easy","why":"reason"}]}
Resume: ${resumeText}` }
      ]
    });
    const text = response.choices[0].message.content;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON');
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    return { questions: [] };
  }
};

const generateCompanyQuestions = async (company, topic, count = 5) => {
  try {
    const client = getClient();
    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'You are an expert interviewer. Respond in valid JSON only.' },
        { role: 'user', content: `Generate ${count} ${company} fresher interview questions on ${topic}. JSON only:
{"questions":[{"question":"Q?","type":"HR","difficulty":"Easy","hint":"hint"}]}` }
      ]
    });
    const text = response.choices[0].message.content;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON');
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    return { questions: [] };
  }
};

const reviewCode = async (problem, code, language) => {
  try {
    const client = getClient();
    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are an expert code reviewer. You MUST respond with ONLY a valid JSON object. 
No explanation, no markdown, no backticks. Just raw JSON.
Format: {"score":7,"isCorrect":true,"timeComplexity":"O(n)","spaceComplexity":"O(1)","feedback":"Good solution.","improvements":"Minor fixes needed.","optimizedApproach":"Use HashMap."}`
        },
        {
          role: 'user',
          content: `Review this ${language} code solution for the problem below.

Problem: ${problem}

Code:
${code}

Respond ONLY with a JSON object in exactly this format:
{"score":7,"isCorrect":true,"timeComplexity":"O(n)","spaceComplexity":"O(1)","feedback":"...","improvements":"...","optimizedApproach":"..."}`
        }
      ],
      temperature: 0.1
    });

    const text = response.choices[0].message.content.trim();
    console.log('Groq raw response:', text);

    const cleaned = text.replace(/```json|```/g, '').trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in response');

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('reviewCode error:', error.message);
    return {
      score: 5,
      isCorrect: false,
      timeComplexity: 'Unknown',
      spaceComplexity: 'Unknown',
      feedback: 'Unavailable.',
      improvements: 'Try again.',
      optimizedApproach: 'Check hints.'
    };
  }
};

module.exports = { evaluateAnswer, generateQuestionsFromResume, generateCompanyQuestions, reviewCode };