import { useNavigate } from 'react-router-dom';
import { Brain, Code, Trophy, ArrowRight, Mic, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const cards = [
    { icon: <Mic className="text-blue-400" size={32} />, title: 'AI Mock Interviews', desc: 'AI asks questions, evaluates answers, and gives real feedback.', route: '/interview' },
    { icon: <Code className="text-green-400" size={32} />, title: 'Coding Rounds', desc: 'Solve DSA problems in browser with AI code review.', route: '/coding' },
    { icon: <BarChart3 className="text-purple-400" size={32} />, title: 'Track Progress', desc: 'See scores, weak areas, and improvement over time.', route: '/dashboard' },
    { icon: <Trophy className="text-yellow-400" size={32} />, title: 'Leaderboard', desc: 'Compete with other students.', route: '/leaderboard' },
    { icon: <Brain className="text-pink-400" size={32} />, title: 'Company-Specific', desc: 'Practice TCS, Infosys, Amazon, Google questions.', route: '/company' },
    { icon: <ArrowRight className="text-cyan-400" size={32} />, title: 'Resume Scanner', desc: 'Upload resume, get AI-generated questions.', route: '/resume' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 border-b border-slate-800">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <Brain className="text-blue-400" size={28} />
          <span className="text-xl font-bold text-blue-400">InterviewAI</span>
        </div>

        <div className="flex gap-3 items-center">
          {user ? (
            <>
              <span className="text-slate-300 text-sm">Hey, {user.name} 👋</span>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition">
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-slate-300 hover:text-red-400 transition">
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-slate-300 hover:text-white transition">
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition">
                Get Started
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div className="flex flex-col items-center justify-center text-center px-4 py-24">
        <div className="inline-block px-4 py-1 bg-blue-900/50 text-blue-300 rounded-full text-sm mb-6 border border-blue-800">
          🚀 AI-Powered Interview Preparation
        </div>
        <h1 className="text-5xl font-bold mb-6 leading-tight">
          Crack Your Dream Job<br />
          <span className="text-blue-400">with AI Mock Interviews</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mb-10">
          Practice with an AI interviewer, get instant feedback, solve coding problems, and track your progress — all in one platform.
        </p>
        <div className="flex gap-4">
          {user ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-lg font-semibold transition">
              Go to Dashboard <ArrowRight size={20} />
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/register')}
                className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-lg font-semibold transition">
                Start Practicing Free <ArrowRight size={20} />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-3 border border-slate-600 hover:border-slate-400 rounded-xl text-lg transition">
                Login
              </button>
            </>
          )}
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8 pb-20 max-w-5xl mx-auto">
        {cards.map((f, i) => (
          <div
            key={i}
            onClick={() => navigate(f.route)}
            className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-blue-500 cursor-pointer transition-all"
          >
            <div className="mb-3">{f.icon}</div>
            <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
            <p className="text-slate-400 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center py-6 text-slate-500 border-t border-slate-800">
        ⚡𝐁𝐮𝐢𝐥𝐭 𝐛𝐲 𝐀𝐦𝐢𝐭 𝐂𝐡𝐚𝐮𝐝𝐡𝐚𝐫𝐲 🚀
      </div>
    </div>
  );
}