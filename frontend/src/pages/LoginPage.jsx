import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Brain } from 'lucide-react';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(form);
      login(res.data.token, res.data.user);
      toast.success(`Welcome back, ${res.data.user?.name}! 👋`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Brain className="text-blue-400" size={32} />
          <span className="text-2xl font-bold text-blue-400">InterviewAI</span>
        </div>
        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-2">Welcome back!</h2>
          <p className="text-slate-400 mb-6">Login to continue your preparation</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-slate-300 text-sm mb-1 block">Email</label>
              <input type="email" placeholder="amit@gmail.com"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            </div>
            <div>
              <label className="text-slate-300 text-sm mb-1 block">Password</label>
              <input type="password" placeholder="••••••••"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="text-slate-400 text-center mt-4">
            New here? <Link to="/register" className="text-blue-400 hover:underline">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}