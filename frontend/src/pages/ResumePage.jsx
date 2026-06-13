import { useState } from 'react';
import { uploadResume } from '../services/api';

export default function ResumePage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('ats');

  const handleUpload = async () => {
    if (!file) return setError('Please select a PDF file');
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await uploadResume(formData);
      setAnalysis(res.data.analysis);
      setActiveTab('ats');
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'ats',       label: '🎯 ATS Score'         },
    { id: 'improve',   label: '🔧 Improvements'       },
    { id: 'weakness',  label: '⚠️ Weak Areas'         },
    { id: 'questions', label: '💡 Interview Questions' },
    { id: 'company',   label: '🏢 Company Questions'  },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">📄 Resume Scanner</h1>
        <p className="text-gray-400 mt-1">
          Upload your resume → Get ATS score, weakness areas, 
          improvement tips & personalized interview questions
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-gray-900 rounded-2xl p-6 mb-8 max-w-2xl">
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => { setFile(e.target.files[0]); setAnalysis(null); }}
          className="hidden"
          id="resumeInput"
        />
        <label
          htmlFor="resumeInput"
          className="flex flex-col items-center justify-center border-2 
                     border-dashed border-gray-600 hover:border-indigo-500 
                     rounded-xl p-8 cursor-pointer transition-all"
        >
          <div className="text-5xl mb-3">📁</div>
          <p className="text-gray-300 font-medium">
            {file ? `✅ ${file.name}` : 'Click to upload your resume'}
          </p>
          <p className="text-gray-500 text-sm mt-1">PDF only · Max 5MB</p>
        </label>

        {error && <p className="text-red-400 mt-3 text-sm">{error}</p>}

        <button
          onClick={handleUpload}
          disabled={loading || !file}
          className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 
                     disabled:bg-gray-700 disabled:cursor-not-allowed
                     text-white py-3 rounded-xl font-semibold 
                     transition-all duration-200 text-lg"
        >
          {loading ? '🔄 Analyzing your resume...' : '🚀 Analyze Resume'}
        </button>
      </div>

      {/* Results */}
      {analysis && (
        <div className="max-w-5xl">

          {/* Candidate Summary Bar */}
          <div className="bg-indigo-950 border border-indigo-800 
                          rounded-2xl p-5 mb-6 flex flex-wrap gap-4 
                          items-center justify-between">
            <div>
              <p className="text-indigo-300 text-sm font-semibold uppercase 
                             tracking-wider mb-1">
                Candidate Profile
              </p>
              <p className="text-white">{analysis.candidate_summary}</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <span className={`px-4 py-2 rounded-full font-bold text-sm ${
                analysis.difficulty_level === 'advanced'
                  ? 'bg-red-800 text-red-200'
                  : analysis.difficulty_level === 'intermediate'
                  ? 'bg-yellow-800 text-yellow-200'
                  : 'bg-green-800 text-green-200'
              }`}>
                {analysis.difficulty_level.toUpperCase()}
              </span>
              <span className="bg-indigo-800 text-indigo-200 px-4 py-2 
                               rounded-full font-bold text-sm">
                ATS: {analysis.ats_score.overall}/100
              </span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 flex-wrap mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold 
                             transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── TAB: ATS Score ── */}
          {activeTab === 'ats' && (
            <div className="space-y-5">
              <div className="bg-gray-900 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-5">
                  🎯 ATS Score & Resume Rating
                </h2>

                {/* Score Circle + Grade */}
                <div className="flex items-center gap-10 mb-8">
                  <div className="relative w-36 h-36 flex-shrink-0">
                    <svg className="w-36 h-36 -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.9" fill="none"
                        stroke="#1f2937" strokeWidth="3" />
                      <circle cx="18" cy="18" r="15.9" fill="none"
                        stroke={
                          analysis.ats_score.overall >= 80 ? '#22c55e' :
                          analysis.ats_score.overall >= 60 ? '#eab308' : '#ef4444'
                        }
                        strokeWidth="3"
                        strokeDasharray={`${analysis.ats_score.overall}, 100`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col 
                                    items-center justify-center">
                      <p className="text-3xl font-bold">
                        {analysis.ats_score.overall}
                      </p>
                      <p className="text-xs text-gray-400">/ 100</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-6xl font-black text-indigo-400">
                      {analysis.ats_score.grade}
                    </p>
                    <p className="text-gray-300 mt-2 max-w-xs">
                      {analysis.ats_score.summary}
                    </p>
                  </div>
                </div>

                {/* Breakdown Bars */}
                <h3 className="text-gray-400 font-semibold mb-4 uppercase 
                                text-xs tracking-wider">
                  Score Breakdown
                </h3>
                <div className="space-y-4">
                  {Object.entries(analysis.ats_score.breakdown).map(
                    ([key, value]) => (
                      <div key={key}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300 capitalize">
                            {key.replace(/_/g, ' ')}
                          </span>
                          <span className={
                            value >= 80 ? 'text-green-400 font-bold' :
                            value >= 60 ? 'text-yellow-400 font-bold' :
                            'text-red-400 font-bold'
                          }>
                            {value}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${
                              value >= 80 ? 'bg-green-500' :
                              value >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${value}%` }}
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Strong Points */}
              <div className="bg-gray-900 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">✅ Strong Points</h2>
                <ul className="space-y-2">
                  {analysis.strong_points.map((point, i) => (
                    <li key={i} className="flex items-start gap-3 
                                           text-gray-300">
                      <span className="text-green-400 font-bold mt-0.5">
                        ✓
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Detected Skills */}
              <div className="bg-gray-900 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">🛠️ Detected Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {analysis.detected_skills.map((skill, i) => (
                    <span key={i} className="bg-indigo-900 text-indigo-300 
                                              px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── TAB: Improvements ── */}
          {activeTab === 'improve' && (
            <div className="space-y-5">
              <div className="bg-gray-900 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-2">
                  🔧 Improvement Suggestions
                </h2>
                <p className="text-gray-400 text-sm mb-5">
                  Fix these issues to increase your ATS score and get 
                  shortlisted faster
                </p>
                <div className="space-y-4">
                  {analysis.improvement_suggestions.map((s, i) => (
                    <div key={i} className={`p-4 rounded-xl border-l-4 ${
                      s.priority === 'high'
                        ? 'bg-red-950 border-red-500'
                        : s.priority === 'medium'
                        ? 'bg-yellow-950 border-yellow-500'
                        : 'bg-blue-950 border-blue-500'
                    }`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-white">
                          {s.section}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full 
                                          font-semibold ${
                          s.priority === 'high'
                            ? 'bg-red-800 text-red-200'
                            : s.priority === 'medium'
                            ? 'bg-yellow-800 text-yellow-200'
                            : 'bg-blue-800 text-blue-200'
                        }`}>
                          {s.priority} priority
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mb-2">
                        ⚠️ <strong>Issue:</strong> {s.issue}
                      </p>
                      <p className="text-green-300 text-sm mb-2">
                        💡 <strong>Fix:</strong> {s.fix}
                      </p>
                      {s.example && (
                        <p className="text-gray-500 text-xs italic 
                                       bg-gray-900 p-2 rounded-lg mt-2">
                          📝 {s.example}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Missing Keywords */}
              <div className="bg-gray-900 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-2">
                  🔍 Missing Keywords
                </h2>
                <p className="text-gray-400 text-sm mb-4">
                  Add these keywords to your resume to pass ATS filters:
                </p>
                <div className="flex flex-wrap gap-2">
                  {analysis.missing_keywords.map((kw, i) => (
                    <span key={i} className="bg-red-900 text-red-300 
                                              px-3 py-1 rounded-full text-sm 
                                              font-medium">
                      + {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── TAB: Weakness Areas ── */}
          {activeTab === 'weakness' && (
            <div className="bg-gray-900 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-2">
                ⚠️ Weakness Areas to Improve
              </h2>
              <p className="text-gray-400 text-sm mb-5">
                These are gaps identified from your resume — focus on these 
                before your next interview
              </p>
              <div className="space-y-4">
                {analysis.weakness_areas.map((w, i) => (
                  <div key={i} className="bg-yellow-950 border border-yellow-800 
                                          p-4 rounded-xl">
                    <p className="font-bold text-yellow-400 text-lg mb-1">
                      {w.area}
                    </p>
                    <p className="text-gray-300 text-sm">{w.reason}</p>
                  </div>
                ))}
              </div>

              {/* Recommended Focus */}
              <div className="mt-6 pt-6 border-t border-gray-800">
                <h3 className="font-bold text-white mb-3">
                  🎯 Recommended Topics to Study
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.recommended_focus_topics.map((topic, i) => (
                    <span key={i} className="bg-green-900 text-green-300 
                                              px-3 py-1 rounded-full text-sm">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── TAB: Interview Questions ── */}
          {activeTab === 'questions' && (
            <div className="space-y-5">
              {/* Skill Based */}
              <div className="bg-gray-900 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-2">
                  💡 Skill-Based Interview Questions
                </h2>
                <p className="text-gray-400 text-sm mb-5">
                  Generated from the skills listed on your resume
                </p>
                <div className="space-y-3">
                  {analysis.skill_based_questions.map((q, i) => (
                    <div key={i} className="bg-gray-800 p-4 rounded-xl">
                      <p className="text-white font-medium">{q.question}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs bg-blue-900 text-blue-300 
                                          px-2 py-0.5 rounded-full">
                          {q.topic}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          q.difficulty === 'hard'
                            ? 'bg-red-900 text-red-300'
                            : q.difficulty === 'medium'
                            ? 'bg-yellow-900 text-yellow-300'
                            : 'bg-green-900 text-green-300'
                        }`}>
                          {q.difficulty}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Project Based */}
              <div className="bg-gray-900 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-2">
                  🗂️ Project-Based Questions
                </h2>
                <p className="text-gray-400 text-sm mb-5">
                  Questions based on projects mentioned in your resume
                </p>
                <div className="space-y-3">
                  {analysis.project_based_questions.map((q, i) => (
                    <div key={i} className="bg-gray-800 p-4 rounded-xl">
                      <p className="text-indigo-400 text-xs font-semibold mb-1">
                        📌 {q.related_project}
                      </p>
                      <p className="text-white">{q.question}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── TAB: Company Questions ── */}
          {activeTab === 'company' && (
            <div className="bg-gray-900 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-2">
                🏢 Company-Specific Questions
              </h2>
              <p className="text-gray-400 text-sm mb-5">
                Questions tailored for specific companies based on your 
                resume profile
              </p>
              <div className="space-y-4">
                {analysis.company_specific_questions.map((q, i) => (
                  <div key={i} className="bg-gray-800 p-4 rounded-xl">
                    <p className="text-indigo-400 font-bold text-sm mb-1">
                      🏢 {q.company}
                    </p>
                    <p className="text-white mb-2">{q.question}</p>
                    <p className="text-gray-500 text-xs italic">{q.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}