import { useState, useEffect } from 'react';
import { getCompanies, getCompanyQuestions, evaluateCompanyAnswer } from '../services/api';

const companyLogos = {
  Google: '🔍', Amazon: '📦', Microsoft: '🪟', TCS: '🏢',
  Infosys: '💼', Wipro: '🌐', Flipkart: '🛒', Startup: '🚀',
};

export default function CompanyPage() {
  const [companies, setCompanies] = useState([]);
  const [selected, setSelected] = useState(null);
  const [round, setRound] = useState('');
  const [experience, setExperience] = useState('Fresher');
  const [role, setRole] = useState('Software Engineer');
  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [evaluating, setEvaluating] = useState(false);
  const [allEvals, setAllEvals] = useState([]);
  const [phase, setPhase] = useState('select'); // select | interview | results

  useEffect(() => {
    getCompanies().then((res) => setCompanies(res.data.companies));
  }, []);

  const startInterview = async () => {
    if (!selected || !round) return;
    setLoading(true);
    try {
      const res = await getCompanyQuestions({
        company: selected.name, round, experience, role,
      });
      setQuestions(res.data);
      setCurrentQ(0);
      setAllEvals([]);
      setPhase('interview');
    } catch (err) {
      alert('Failed to generate questions');
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    setEvaluating(true);
    try {
      const res = await evaluateCompanyAnswer({
        company: selected.name,
        question: questions.questions[currentQ].question,
        answer,
        round,
      });
      setEvaluation(res.data);
      setAllEvals((prev) => [...prev, { ...res.data, question: questions.questions[currentQ].question }]);
    } catch (err) {
      alert('Evaluation failed');
    } finally {
      setEvaluating(false);
    }
  };

  const nextQuestion = () => {
    if (currentQ + 1 >= questions.questions.length) {
      setPhase('results');
    } else {
      setCurrentQ((prev) => prev + 1);
      setAnswer('');
      setEvaluation(null);
    }
  };

  const avgScore = allEvals.length
    ? (allEvals.reduce((sum, e) => sum + e.score, 0) / allEvals.length).toFixed(1)
    : 0;

  // ── PHASE: SELECT ──
  if (phase === 'select') return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-10">
      <h1 className="text-3xl font-bold mb-2">🏢 Company-Specific Interview</h1>
      <p className="text-gray-400 mb-8">Practice interviews tailored to each company's style</p>

      {/* Company Grid */}
      <h2 className="text-lg font-semibold mb-4">Select Company</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {companies.map((c) => (
          <div key={c.name} onClick={() => { setSelected(c); setRound(''); }}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all text-center ${
              selected?.name === c.name
                ? 'border-indigo-500 bg-indigo-950'
                : 'border-gray-700 bg-gray-900 hover:border-gray-500'
            }`}>
            <div className="text-4xl mb-2">{companyLogos[c.name]}</div>
            <p className="font-bold">{c.name}</p>
            <p className={`text-xs mt-1 ${
              c.difficulty === 'very hard' ? 'text-red-400' :
              c.difficulty === 'hard' ? 'text-orange-400' : 'text-green-400'
            }`}>{c.difficulty}</p>
          </div>
        ))}
      </div>

      {/* Company Details */}
      {selected && (
        <div className="bg-gray-900 rounded-2xl p-6 mb-6 max-w-2xl">
          <h3 className="font-bold text-xl mb-3">
            {companyLogos[selected.name]} {selected.name} Interview
          </h3>
          <p className="text-yellow-300 text-sm mb-4">💡 {selected.tips}</p>

          <p className="text-gray-400 text-sm mb-2">Select Round:</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {selected.rounds.map((r) => (
              <button key={r} onClick={() => setRound(r)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  round === r ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}>
                {r}
              </button>
            ))}
          </div>

          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <p className="text-gray-400 text-sm mb-1">Experience</p>
              <select value={experience} onChange={(e) => setExperience(e.target.value)}
                className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg">
                <option>Fresher</option>
                <option>1-2 years</option>
                <option>3-5 years</option>
                <option>5+ years</option>
              </select>
            </div>
            <div className="flex-1">
              <p className="text-gray-400 text-sm mb-1">Role</p>
              <select value={role} onChange={(e) => setRole(e.target.value)}
                className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg">
                <option>Software Engineer</option>
                <option>Frontend Developer</option>
                <option>Backend Developer</option>
                <option>Full Stack Developer</option>
                <option>Data Engineer</option>
                <option>DevOps Engineer</option>
              </select>
            </div>
          </div>

          <button onClick={startInterview} disabled={!round || loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700
                       py-3 rounded-xl font-bold text-lg transition-all">
            {loading ? '🔄 Generating Questions...' : `🚀 Start ${selected.name} Interview`}
          </button>
        </div>
      )}
    </div>
  );

  // ── PHASE: INTERVIEW ──
  if (phase === 'interview') {
    const q = questions.questions[currentQ];
    return (
      <div className="min-h-screen bg-gray-950 text-white p-6 md:p-10">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">
                {companyLogos[selected.name]} {selected.name} — {round}
              </h1>
              <p className="text-gray-400 text-sm">{role} · {experience}</p>
            </div>
            <span className="bg-indigo-900 px-4 py-2 rounded-xl font-bold">
              {currentQ + 1} / {questions.questions.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-800 rounded-full h-2 mb-6">
            <div className="bg-indigo-500 h-2 rounded-full transition-all"
              style={{ width: `${((currentQ + 1) / questions.questions.length) * 100}%` }} />
          </div>

          {/* Question */}
          <div className="bg-gray-900 rounded-2xl p-6 mb-4">
            <div className="flex gap-2 mb-3">
              <span className={`text-xs px-2 py-1 rounded-full ${
                q.type === 'coding' ? 'bg-green-900 text-green-300' :
                q.type === 'system_design' ? 'bg-purple-900 text-purple-300' :
                q.type === 'behavioral' ? 'bg-yellow-900 text-yellow-300' :
                'bg-blue-900 text-blue-300'
              }`}>{q.type}</span>
            </div>
            <p className="text-white text-lg font-medium mb-3">{q.question}</p>
            <p className="text-gray-500 text-sm">💡 {q.hint}</p>
          </div>

          {/* Answer Box */}
          {!evaluation && (
            <div className="bg-gray-900 rounded-2xl p-6 mb-4">
              <textarea value={answer} onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full bg-gray-800 text-white p-4 rounded-xl h-40 
                           resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button onClick={submitAnswer} disabled={evaluating || !answer.trim()}
                className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 
                           disabled:bg-gray-700 py-3 rounded-xl font-bold transition-all">
                {evaluating ? '🔄 Evaluating...' : '✅ Submit Answer'}
              </button>
            </div>
          )}

          {/* Evaluation */}
          {evaluation && (
            <div className="bg-gray-900 rounded-2xl p-6 mb-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">📊 Evaluation</h3>
                <span className={`text-2xl font-black ${
                  evaluation.score >= 8 ? 'text-green-400' :
                  evaluation.score >= 6 ? 'text-yellow-400' : 'text-red-400'
                }`}>{evaluation.score}/10</span>
              </div>
              <p className={`font-semibold ${
                evaluation.verdict === 'Excellent' ? 'text-green-400' :
                evaluation.verdict === 'Good' ? 'text-blue-400' :
                evaluation.verdict === 'Needs Improvement' ? 'text-yellow-400' : 'text-red-400'
              }`}>{evaluation.verdict}</p>
              <div className="bg-green-950 p-3 rounded-xl">
                <p className="text-green-300 text-sm">✅ {evaluation.what_was_good}</p>
              </div>
              <div className="bg-red-950 p-3 rounded-xl">
                <p className="text-red-300 text-sm">⚠️ {evaluation.what_was_missing}</p>
              </div>
              <div className="bg-gray-800 p-3 rounded-xl">
                <p className="text-gray-400 text-xs mb-2">Key points to cover:</p>
                {evaluation.ideal_answer_points.map((pt, i) => (
                  <p key={i} className="text-gray-300 text-sm">• {pt}</p>
                ))}
              </div>
              <button onClick={nextQuestion}
                className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 
                           rounded-xl font-bold transition-all">
                {currentQ + 1 >= questions.questions.length ? '🏁 See Results' : '➡️ Next Question'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── PHASE: RESULTS ──
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">🏁 Interview Complete!</h1>
        <p className="text-gray-400 mb-6">{selected.name} — {round}</p>

        {/* Score Card */}
        <div className="bg-indigo-950 border border-indigo-800 rounded-2xl p-6 mb-6 text-center">
          <p className="text-gray-300 mb-2">Average Score</p>
          <p className={`text-7xl font-black ${
            avgScore >= 8 ? 'text-green-400' :
            avgScore >= 6 ? 'text-yellow-400' : 'text-red-400'
          }`}>{avgScore}</p>
          <p className="text-gray-400 mt-1">out of 10</p>
          <p className="text-lg mt-3">
            {avgScore >= 8 ? '🎉 Excellent! You are ready!' :
             avgScore >= 6 ? '👍 Good performance, keep practicing!' :
             '📚 Needs more preparation'}
          </p>
        </div>

        {/* Per Question Results */}
        <div className="space-y-3 mb-6">
          {allEvals.map((e, i) => (
            <div key={i} className="bg-gray-900 rounded-xl p-4">
              <div className="flex justify-between items-start mb-2">
                <p className="text-gray-300 text-sm flex-1 mr-4">Q{i + 1}: {e.question}</p>
                <span className={`font-bold text-lg flex-shrink-0 ${
                  e.score >= 8 ? 'text-green-400' :
                  e.score >= 6 ? 'text-yellow-400' : 'text-red-400'
                }`}>{e.score}/10</span>
              </div>
              <p className="text-gray-500 text-xs">{e.verdict}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={() => { setPhase('select'); setSelected(null); setQuestions(null); }}
            className="flex-1 bg-gray-800 hover:bg-gray-700 py-3 rounded-xl font-bold transition-all">
            🔄 Try Another Company
          </button>
          <button onClick={() => { setPhase('interview'); setCurrentQ(0); setAllEvals([]); setEvaluation(null); setAnswer(''); }}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 py-3 rounded-xl font-bold transition-all">
            🔁 Retry Same Round
          </button>
        </div>
      </div>
    </div>
  );
}