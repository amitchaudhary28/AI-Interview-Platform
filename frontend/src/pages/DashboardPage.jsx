import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Brain, LogOut, Play, Trophy, BarChart3, Code, Building2 } from 'lucide-react';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="flex justify-between items-center px-8 py-4 border-b border-slate-800">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <Brain className="text-blue-400" size={28} />
          <span className="text-xl font-bold text-blue-400">InterviewAI</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-300">Hey, {user?.name} 👋</span>
          <button onClick={() => { logout(); navigate('/'); }}
            className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-10">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 🎯</h1>
        <p className="text-slate-400 mb-8">Ready to crack your dream job today?</p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[
            { label: 'Total Score', value: user?.totalScore || 0, icon: <Trophy className="text-yellow-400" size={24} /> },
            { label: 'Sessions Done', value: user?.totalSessions || 0, icon: <BarChart3 className="text-blue-400" size={24} /> },
            { label: 'Day Streak', value: user?.streak || 0, icon: <Brain className="text-green-400" size={24} /> },
          ].map((stat, i) => (
            <div key={i} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-400 text-sm">{stat.label}</span>
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Interview + Company */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          {/* Start Interview */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold mb-2">🎤 Start Interview</h3>
            <p className="text-slate-400 text-sm mb-4">
              Practice with AI interviewer on DSA, HR, System Design
            </p>
            <button onClick={() => navigate('/interview')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 
                         px-6 py-3 rounded-lg transition font-semibold">
              <Play size={18} /> Start Now
            </button>
          </div>

          {/* Company Specific */}
          <div
            onClick={() => navigate('/company')}
            className="bg-slate-800 rounded-xl p-6 border border-slate-700 
                       hover:border-pink-500 cursor-pointer transition-all">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="text-pink-400" size={24} />
              <h3 className="text-lg font-semibold">Company-Specific</h3>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Practice interviews tailored to Google, Amazon, TCS, Infosys and more
            </p>
            <div className="flex flex-wrap gap-2">
              {['TCS', 'Infosys', 'Amazon', 'Google', 'Microsoft', 'Flipkart'].map(c => (
                <span key={c}
                  className="px-3 py-1 bg-slate-700 rounded-full text-xs text-slate-300">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Coding Editor */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold mb-2">💻 Coding Practice</h3>
            <p className="text-slate-400 text-sm mb-4">
              Solve DSA problems in browser — Two Sum, Fibonacci and more!
            </p>
            <button onClick={() => navigate('/coding')}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 
                         px-6 py-3 rounded-lg transition font-semibold">
              <Code size={18} /> Open Code Editor
            </button>
          </div>

          {/* Resume Scanner */}
          <div
            onClick={() => navigate('/resume')}
            className="bg-slate-800 rounded-xl p-6 border border-slate-700 
                       hover:border-cyan-500 cursor-pointer transition-all">
            <h3 className="text-lg font-semibold mb-2">📄 Resume Scanner</h3>
            <p className="text-slate-400 text-sm mb-4">
              Upload your resume and get ATS score, weakness areas & interview questions
            </p>
            <span className="inline-block px-4 py-2 bg-cyan-700 hover:bg-cyan-600 
                             rounded-lg text-sm font-semibold transition">
              Scan Resume →
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}