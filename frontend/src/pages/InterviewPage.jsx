import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { startSession, submitAnswer, endSession } from '../services/api';
import toast from 'react-hot-toast';
import { Brain, Clock, ChevronRight, Trophy, ArrowLeft, MessageCircle } from 'lucide-react';

const TOPICS = [
  { name: 'HR', icon: '🤝', desc: 'Behavioral & HR questions' },
  { name: 'Arrays', icon: '📊', desc: 'Array & String problems' },
  { name: 'OOP', icon: '🔧', desc: 'Object Oriented Programming' },
  { name: 'System Design', icon: '🏗️', desc: 'Design scalable systems' },
  { name: 'Leadership', icon: '👑', desc: 'Leadership & situational' },
];

const COMPANIES = ['Any', 'TCS', 'Infosys', 'Amazon', 'Google'];

export default function InterviewPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState('setup');
  const [topic, setTopic] = useState('');
  const [company, setCompany] = useState('Any');
  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [timer, setTimer] = useState(120);
  const [finalResult, setFinalResult] = useState(null);

  // Follow-up states
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [followUpAnswer, setFollowUpAnswer] = useState('');
  const [currentResult, setCurrentResult] = useState(null);

  useEffect(() => {
    if (step !== 'interview' || showFollowUp) return;
    if (timer === 0) handleSubmitAnswer();
    const t = setInterval(() => setTimer(p => p > 0 ? p - 1 : 0), 1000);
    return () => clearInterval(t);
  }, [step, timer, currentQ, showFollowUp]);

  const handleStart = async () => {
    if (!topic) return toast.error('Please select a topic!');
    setLoading(true);
    try {
      const res = await startSession({
        topic,
        company: company === 'Any' ? undefined : company
      });
      setSession(res.data.session);
      setQuestions(res.data.questions);
      setStep('interview');
      setTimer(120);
      toast.success('Interview started! All the best Amit! 💪');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return toast.error('Please write an answer!');
    setLoading(true);
    try {
      const res = await submitAnswer({
        sessionId: session.id,
        questionId: questions[currentQ].id,
        userAnswer: answer
      });

      const result = {
        question: questions[currentQ].question,
        answer,
        score: res.data.score,
        correctAnswer: res.data.correctAnswer,
        feedback: res.data.feedback,
        strengths: res.data.strengths,
        improvements: res.data.improvements,
        followUp: res.data.followUp,
        followUpAnswer: ''
      };

      setCurrentResult(result);
      toast.success(`Score: ${res.data.score}/10 ✅`);

      // Show follow-up if AI gave one
      if (res.data.followUp && res.data.followUp !== 'Elaborate?') {
        setFollowUpQuestion(res.data.followUp);
        setShowFollowUp(true);
      } else {
        await moveToNext(result);
      }

    } catch (err) {
      toast.error('Failed to submit answer');
    } finally {
      setLoading(false);
    }
  };

  const handleFollowUpSubmit = async () => {
    const updatedResult = { ...currentResult, followUpAnswer: followUpAnswer };
    setResults(prev => [...prev, updatedResult]);
    setShowFollowUp(false);
    setFollowUpAnswer('');
    setFollowUpQuestion('');
    await moveToNext(updatedResult);
  };

  const handleSkipFollowUp = async () => {
    setResults(prev => [...prev, currentResult]);
    setShowFollowUp(false);
    setFollowUpAnswer('');
    await moveToNext(currentResult);
  };

  const moveToNext = async (result) => {
    if (!result) return;
    if (currentQ + 1 < questions.length) {
      setCurrentQ(prev => prev + 1);
      setAnswer('');
      setTimer(120);
    } else {
      try {
        const endRes = await endSession({ sessionId: session.id });
        setFinalResult(endRes.data.result);
        setStep('result');
      } catch (err) {
        toast.error('Failed to end session');
      }
    }
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  // SETUP SCREEN
  if (step === 'setup') return (
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="flex items-center gap-4 px-8 py-4 border-b border-slate-800">
        <button onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-white transition">
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
          <Brain className="text-blue-400" size={24} />
          <span className="font-bold text-blue-400">InterviewAI</span>
        </div>
      </nav>
      <div className="max-w-3xl mx-auto px-8 py-10">
        <h1 className="text-3xl font-bold mb-2">Setup Your Interview 🎯</h1>
        <p className="text-slate-400 mb-8">Choose topic and company — All the best Amit! 💪</p>
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Select Topic</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {TOPICS.map(t => (
              <button key={t.name} onClick={() => setTopic(t.name)}
                className={`p-4 rounded-xl border text-left transition ${topic === t.name
                  ? 'border-blue-500 bg-blue-900/30 text-white'
                  : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500'}`}>
                <div className="text-2xl mb-2">{t.icon}</div>
                <div className="font-semibold">{t.name}</div>
                <div className="text-xs text-slate-400 mt-1">{t.desc}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Select Company</h2>
          <div className="flex flex-wrap gap-3">
            {COMPANIES.map(c => (
              <button key={c} onClick={() => setCompany(c)}
                className={`px-5 py-2 rounded-lg border transition ${company === c
                  ? 'border-blue-500 bg-blue-900/30 text-white'
                  : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <button onClick={handleStart} disabled={!topic || loading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-8 py-4 rounded-xl text-lg font-semibold transition">
          {loading ? 'Starting...' : 'Start Interview'} <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );

  // INTERVIEW SCREEN
  if (step === 'interview') return (
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="flex justify-between items-center px-8 py-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Brain className="text-blue-400" size={24} />
          <span className="font-bold text-blue-400">InterviewAI</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-400">Question {currentQ + 1}/{questions.length}</span>
          {!showFollowUp && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-bold ${timer < 30 ? 'bg-red-900/50 text-red-400' : 'bg-slate-800 text-blue-400'}`}>
              <Clock size={16} />
              {formatTime(timer)}
            </div>
          )}
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-8 py-10">
        <div className="w-full bg-slate-800 rounded-full h-2 mb-8">
          <div className="bg-blue-500 h-2 rounded-full transition-all"
            style={{ width: `${(currentQ / questions.length) * 100}%` }} />
        </div>

        {/* Follow-up Question Screen */}
        {showFollowUp ? (
          <div>
            <div className="bg-purple-900/30 border border-purple-700 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle className="text-purple-400" size={20} />
                <span className="text-purple-300 font-semibold">AI Interviewer Follow-up</span>
              </div>
              <p className="text-xl font-semibold text-white">{followUpQuestion}</p>
            </div>

            {/* Score preview */}
            {currentResult && (
              <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 mb-4">
                <p className="text-yellow-400 font-bold">Your score: {currentResult.score}/10</p>
                <p className="text-slate-400 text-sm mt-1">
                  <span className="text-green-400">Strengths:</span> {currentResult.strengths}
                </p>
              </div>
            )}

            <textarea
              value={followUpAnswer}
              onChange={e => setFollowUpAnswer(e.target.value)}
              placeholder="Answer the follow-up question, Amit! 💪"
              rows={5}
              className="w-full bg-slate-800 border border-purple-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none mb-4"
            />

            <div className="flex gap-3">
              <button onClick={handleFollowUpSubmit} disabled={!followUpAnswer.trim() || loading}
                className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 py-3 rounded-xl font-semibold transition">
                {loading ? 'Submitting...' : 'Submit Follow-up Answer →'}
              </button>
              <button onClick={handleSkipFollowUp}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition text-slate-300">
                Skip
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Main Question */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full text-xs">
                  {questions[currentQ]?.type}
                </span>
                <span className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-xs">
                  {questions[currentQ]?.difficulty}
                </span>
              </div>
              <p className="text-xl font-semibold leading-relaxed">
                {questions[currentQ]?.question}
              </p>
            </div>

            <textarea
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder="Write your answer here, Amit... Take your time! 💪"
              rows={6}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none mb-4"
            />

            <button onClick={handleSubmitAnswer} disabled={loading || !answer.trim()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-8 py-3 rounded-xl font-semibold transition">
              {loading ? 'AI Evaluating... 🤖' : currentQ + 1 === questions.length ? 'Finish Interview 🏁' : 'Submit Answer →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // RESULT SCREEN
  if (step === 'result') return (
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="flex items-center gap-4 px-8 py-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Brain className="text-blue-400" size={24} />
          <span className="font-bold text-blue-400">InterviewAI</span>
        </div>
      </nav>
      <div className="max-w-3xl mx-auto px-8 py-10">
        <div className="text-center mb-10">
          <Trophy className="text-yellow-400 mx-auto mb-4" size={64} />
          <h1 className="text-3xl font-bold mb-2">Interview Complete! 🎉</h1>
          <p className="text-slate-400">Great job Amit! Here's your performance report</p>
          <div className="mt-6 inline-block bg-slate-800 rounded-2xl px-10 py-6 border border-slate-700">
            <div className="text-5xl font-bold text-blue-400 mb-1">
              {finalResult?.finalScore}/10
            </div>
            <div className="text-slate-400">Final Score</div>
            <div className="text-green-400 font-semibold mt-1">
              {finalResult?.percentage} Success Rate
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Answer Review</h2>
        <div className="space-y-4 mb-8">
          {results.map((r, i) => (
            <div key={i} className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <p className="font-semibold mb-3">Q{i + 1}: {r.question}</p>
              <p className="text-slate-400 text-sm mb-2">
                <span className="text-white font-medium">Your answer:</span> {r.answer}
              </p>
              <p className="text-slate-400 text-sm mb-3">
                <span className="text-green-400 font-medium">Expected:</span> {r.correctAnswer}
              </p>
              <div className="bg-slate-700/50 rounded-lg p-4 space-y-2 border border-slate-600">
                <p className="text-yellow-400 font-bold text-lg">Score: {r.score}/10</p>
                {r.feedback && <p className="text-slate-300 text-sm"><span className="text-blue-400 font-medium">📝 Feedback:</span> {r.feedback}</p>}
                {r.strengths && <p className="text-slate-300 text-sm"><span className="text-green-400 font-medium">✅ Strengths:</span> {r.strengths}</p>}
                {r.improvements && <p className="text-slate-300 text-sm"><span className="text-red-400 font-medium">🔧 Improve:</span> {r.improvements}</p>}
                {r.followUp && (
                  <div className="mt-2 pt-2 border-t border-slate-600">
                    <p className="text-purple-400 font-medium text-sm">🤔 Follow-up asked: {r.followUp}</p>
                    {r.followUpAnswer && (
                      <p className="text-slate-300 text-sm mt-1">
                        <span className="text-purple-300">Your follow-up answer:</span> {r.followUpAnswer}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <button onClick={() => { setStep('setup'); setResults([]); setCurrentQ(0); setAnswer(''); setFinalResult(null); setShowFollowUp(false); }}
            className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold transition">
            Practice Again 🔄
          </button>
          <button onClick={() => navigate('/dashboard')}
            className="flex-1 bg-slate-700 hover:bg-slate-600 py-3 rounded-xl font-semibold transition">
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}