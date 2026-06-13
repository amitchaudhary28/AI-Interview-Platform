import { useState, useEffect } from 'react';
import { getUserProfile } from '../services/api';
import { useNavigate } from 'react-router-dom';

const badgeEmoji = {
  Legend: '👑', Expert: '⭐', Advanced: '🔥',
  Intermediate: '📈', Beginner: '🌱',
};

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getUserProfile()
      .then((res) => setProfile(res.data.user))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-white animate-pulse">Loading profile...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-10">
      <h1 className="text-3xl font-bold mb-8">👤 My Profile</h1>

      <div className="max-w-3xl space-y-6">

        {/* Profile Card */}
        <div className="bg-gray-900 rounded-2xl p-6 flex items-center gap-6">
          <div className="w-20 h-20 bg-indigo-700 rounded-full flex items-center 
                          justify-center text-3xl font-black">
            {profile?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{profile?.name}</h2>
            <p className="text-gray-400">{profile?.email}</p>
            <p className="text-gray-500 text-sm mt-1">
              Member since {new Date(profile?.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="ml-auto text-center">
            <p className="text-4xl">{badgeEmoji[profile?.badge]}</p>
            <p className="text-sm font-bold mt-1">{profile?.badge}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Global Rank',   value: `#${profile?.rank || '—'}`,              color: 'text-white' },
            { label: 'Avg Score',     value: profile?.avgScore?.toFixed(1) || '0',    color: 'text-indigo-400' },
            { label: 'Day Streak',    value: `${profile?.streak}🔥`,                  color: 'text-orange-400' },
            { label: 'Total Sessions',value: profile?.totalSessions,                  color: 'text-green-400' },
          ].map((stat) => (
            <div key={stat.label} className="bg-gray-900 rounded-2xl p-4 text-center">
              <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Sessions */}
        <div className="bg-gray-900 rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-4">📋 Recent Sessions</h3>
          {profile?.sessions?.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No sessions yet. 
              <button onClick={() => navigate('/interview')}
                className="text-indigo-400 ml-1 hover:underline">
                Start practicing!
              </button>
            </p>
          ) : (
            <div className="space-y-3">
              {profile?.sessions?.map((s) => (
                <div key={s.id} className="flex justify-between items-center 
                                            bg-gray-800 p-3 rounded-xl">
                  <div>
                    <p className="font-medium">{s.topic || 'General Interview'}</p>
                    <p className="text-gray-500 text-xs">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`font-bold text-lg ${
                    s.score >= 8 ? 'text-green-400' :
                    s.score >= 6 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {s.score?.toFixed(1)}/10
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => navigate('/interview')}
            className="bg-indigo-600 hover:bg-indigo-700 py-4 rounded-2xl 
                       font-bold transition-all">
            🎤 Start Interview
          </button>
          <button onClick={() => navigate('/leaderboard')}
            className="bg-gray-800 hover:bg-gray-700 py-4 rounded-2xl 
                       font-bold transition-all">
            🏆 View Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
}