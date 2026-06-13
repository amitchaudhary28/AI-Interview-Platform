import { useState, useEffect } from 'react';
import { getLeaderboard, getUserProfile } from '../services/api';

const badgeColors = {
  Legend:       'bg-yellow-500 text-yellow-900',
  Expert:       'bg-purple-600 text-white',
  Advanced:     'bg-blue-600 text-white',
  Intermediate: 'bg-green-600 text-white',
  Beginner:     'bg-gray-600 text-white',
};

const badgeEmoji = {
  Legend: '👑', Expert: '⭐', Advanced: '🔥',
  Intermediate: '📈', Beginner: '🌱',
};

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [profile, setProfile]         = useState(null);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    Promise.all([getLeaderboard(), getUserProfile()])
      .then(([lb, pr]) => {
        setLeaderboard(lb.data.leaderboard);
        setProfile(pr.data.user);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-white text-xl animate-pulse">Loading leaderboard...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-10">
      <h1 className="text-3xl font-bold mb-2">🏆 Leaderboard</h1>
      <p className="text-gray-400 mb-8">Top performers ranked by average score</p>

      {/* Your Stats Card */}
      {profile && (
        <div className="bg-indigo-950 border border-indigo-800 rounded-2xl p-6 mb-8">
          <p className="text-indigo-300 text-sm font-semibold uppercase tracking-wider mb-3">
            Your Stats
          </p>
          <div className="flex flex-wrap gap-6 items-center">
            <div className="text-center">
              <p className="text-4xl font-black text-white">
                #{profile.rank || '—'}
              </p>
              <p className="text-gray-400 text-sm">Global Rank</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-indigo-400">
                {profile.avgScore?.toFixed(1) || '0'}
              </p>
              <p className="text-gray-400 text-sm">Avg Score</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-orange-400">
                {profile.streak}🔥
              </p>
              <p className="text-gray-400 text-sm">Day Streak</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-green-400">
                {profile.totalSessions}
              </p>
              <p className="text-gray-400 text-sm">Sessions</p>
            </div>
            <div>
              <span className={`px-4 py-2 rounded-full font-bold text-sm 
                               ${badgeColors[profile.badge]}`}>
                {badgeEmoji[profile.badge]} {profile.badge}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Top 3 Podium */}
      {leaderboard.length >= 3 && (
        <div className="flex items-end justify-center gap-4 mb-8">
          {/* 2nd */}
          <div className="text-center bg-gray-800 rounded-2xl p-4 w-28">
            <p className="text-3xl mb-1">🥈</p>
            <p className="font-bold text-sm truncate">{leaderboard[1].name}</p>
            <p className="text-gray-400 text-xs">{leaderboard[1].avgScore?.toFixed(1)}</p>
          </div>
          {/* 1st */}
          <div className="text-center bg-yellow-900 border-2 border-yellow-500 
                          rounded-2xl p-4 w-32 -mb-4">
            <p className="text-4xl mb-1">🥇</p>
            <p className="font-bold truncate">{leaderboard[0].name}</p>
            <p className="text-yellow-300 text-sm">{leaderboard[0].avgScore?.toFixed(1)}</p>
          </div>
          {/* 3rd */}
          <div className="text-center bg-gray-800 rounded-2xl p-4 w-28">
            <p className="text-3xl mb-1">🥉</p>
            <p className="font-bold text-sm truncate">{leaderboard[2].name}</p>
            <p className="text-gray-400 text-xs">{leaderboard[2].avgScore?.toFixed(1)}</p>
          </div>
        </div>
      )}

      {/* Full Table */}
      <div className="bg-gray-900 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-800 text-gray-400 text-sm">
              <th className="py-3 px-4 text-left">Rank</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-center">Badge</th>
              <th className="py-3 px-4 text-center">Avg Score</th>
              <th className="py-3 px-4 text-center">Sessions</th>
              <th className="py-3 px-4 text-center">Streak</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((u) => (
              <tr key={u.id}
                className={`border-t border-gray-800 transition-colors ${
                  u.id === profile?.id ? 'bg-indigo-950' : 'hover:bg-gray-800'
                }`}>
                <td className="py-3 px-4 font-bold">
                  {u.rank === 1 ? '🥇' : u.rank === 2 ? '🥈' : u.rank === 3 ? '🥉' : `#${u.rank}`}
                </td>
                <td className="py-3 px-4">
                  <span className="font-medium">{u.name}</span>
                  {u.id === profile?.id && (
                    <span className="ml-2 text-xs bg-indigo-700 px-2 py-0.5 rounded-full">
                      You
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold 
                                   ${badgeColors[u.badge]}`}>
                    {badgeEmoji[u.badge]} {u.badge}
                  </span>
                </td>
                <td className="py-3 px-4 text-center font-bold">
                  <span className={
                    u.avgScore >= 8 ? 'text-green-400' :
                    u.avgScore >= 6 ? 'text-yellow-400' : 'text-red-400'
                  }>
                    {u.avgScore?.toFixed(1)}
                  </span>
                </td>
                <td className="py-3 px-4 text-center text-gray-300">
                  {u.totalSessions}
                </td>
                <td className="py-3 px-4 text-center">
                  {u.streak > 0 ? `${u.streak}🔥` : '—'}
                </td>
              </tr>
            ))}
            {leaderboard.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-gray-500">
                  No sessions yet. Complete an interview to appear here!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}