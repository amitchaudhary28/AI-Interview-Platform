import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Brain, Play, ArrowLeft, Code, CheckCircle, Loader } from 'lucide-react';
import { aiCodeReview } from '../services/api';

const PROBLEMS = [
  {
    id: 1,
    title: 'Two Sum',
    difficulty: 'Easy',
    company: 'Amazon',
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

Example:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: nums[0] + nums[1] = 2 + 7 = 9`,
    starterCode: {
      javascript: `function twoSum(nums, target) {\n  // Write your solution here\n  // Amit, you can do this! 💪\n  \n}`,
      python: `def two_sum(nums, target):\n    # Write your solution here\n    pass`,
      java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n    }\n}`
    },
    solution: 'Use a HashMap to store each number and its index. For each number, check if target-number exists in map.'
  },
  {
    id: 2,
    title: 'Reverse a String',
    difficulty: 'Easy',
    company: 'TCS',
    description: `Write a function that reverses a string.

Example:
Input: "hello"
Output: "olleh"`,
    starterCode: {
      javascript: `function reverseString(s) {\n  // Write your solution here\n  \n}`,
      python: `def reverse_string(s):\n    # Write your solution here\n    pass`,
      java: `class Solution {\n    public String reverseString(String s) {\n        // Write your solution here\n    }\n}`
    },
    solution: 'Use two pointers from both ends, swap characters moving to center. O(n) time, O(1) space.'
  },
  {
    id: 3,
    title: 'Find Maximum in Array',
    difficulty: 'Easy',
    company: 'Infosys',
    description: `Given an array of integers, find and return the maximum element.

Example:
Input: [3, 7, 1, 9, 4]
Output: 9`,
    starterCode: {
      javascript: `function findMax(nums) {\n  // Write your solution here\n  \n}`,
      python: `def find_max(nums):\n    # Write your solution here\n    pass`,
      java: `class Solution {\n    public int findMax(int[] nums) {\n        // Write your solution here\n    }\n}`
    },
    solution: 'Traverse array keeping track of maximum element seen so far. Time O(n), Space O(1).'
  },
  {
    id: 4,
    title: 'Check Palindrome',
    difficulty: 'Easy',
    company: 'Google',
    description: `Given a string, return true if it is a palindrome, false otherwise.

Example:
Input: "racecar" → true
Input: "hello" → false`,
    starterCode: {
      javascript: `function isPalindrome(s) {\n  // Write your solution here\n  \n}`,
      python: `def is_palindrome(s):\n    # Write your solution here\n    pass`,
      java: `class Solution {\n    public boolean isPalindrome(String s) {\n        // Write your solution here\n    }\n}`
    },
    solution: 'Use two pointers from both ends, compare characters. Or reverse string and compare with original.'
  },
  {
    id: 5,
    title: 'Fibonacci Number',
    difficulty: 'Medium',
    company: 'Amazon',
    description: `Given n, return the nth Fibonacci number.
F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2)

Example:
Input: n = 6
Output: 8`,
    starterCode: {
      javascript: `function fibonacci(n) {\n  // Write your solution here\n  // Hint: Think Dynamic Programming!\n  \n}`,
      python: `def fibonacci(n):\n    # Write your solution here\n    pass`,
      java: `class Solution {\n    public int fibonacci(int n) {\n        // Write your solution here\n    }\n}`
    },
    solution: 'Use DP with two variables. Avoid recursion without memoization as it is O(2^n).'
  }
];

const LANGUAGES = ['javascript', 'python', 'java'];

export default function CodingPage() {
  const navigate = useNavigate();
  const [selectedProblem, setSelectedProblem] = useState(PROBLEMS[0]);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(PROBLEMS[0].starterCode.javascript);
  const [showHint, setShowHint] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [review, setReview] = useState(null);

  const handleProblemChange = (problem) => {
    setSelectedProblem(problem);
    setCode(problem.starterCode[language]);
    setShowHint(false);
    setReview(null);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(selectedProblem.starterCode[lang]);
    setReview(null);
  };

  const handleSubmit = async () => {
    if (code.trim() === selectedProblem.starterCode[language].trim()) {
      return toast.error('Please write your solution first, Amit!');
    }
    setReviewing(true);
    setReview(null);
    toast.loading('AI reviewing your code... 🤖', { id: 'review' });
    try {
      const res = await aiCodeReview({
        problem: selectedProblem.title + ': ' + selectedProblem.description,
        code,
        language
      });
      setReview(res.data.review);
      toast.success('AI review complete! 🎉', { id: 'review' });
    } catch (err) {
      toast.error('Review failed. Try again!', { id: 'review' });
    } finally {
      setReviewing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-3 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-white transition">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Code className="text-green-400" size={22} />
            <span className="font-bold text-green-400">CodeEditor — Amit's Workspace</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {LANGUAGES.map(lang => (
            <button key={lang} onClick={() => handleLanguageChange(lang)}
              className={`px-3 py-1 rounded-lg text-sm transition ${language === lang
                ? 'bg-green-700 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
              {lang}
            </button>
          ))}
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Problem List Sidebar */}
        <div className="w-64 border-r border-slate-800 overflow-y-auto p-4">
          <h3 className="text-sm font-semibold text-slate-400 uppercase mb-3">Problems</h3>
          {PROBLEMS.map(p => (
            <button key={p.id} onClick={() => handleProblemChange(p)}
              className={`w-full text-left p-3 rounded-lg mb-2 transition ${selectedProblem.id === p.id
                ? 'bg-slate-700 border border-green-500'
                : 'bg-slate-800 hover:bg-slate-700'}`}>
              <div className="font-medium text-sm">{p.title}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  p.difficulty === 'Easy' ? 'bg-green-900/50 text-green-400' :
                  p.difficulty === 'Medium' ? 'bg-yellow-900/50 text-yellow-400' :
                  'bg-red-900/50 text-red-400'}`}>
                  {p.difficulty}
                </span>
                <span className="text-xs text-slate-500">{p.company}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Problem Description */}
        <div className="w-80 border-r border-slate-800 overflow-y-auto p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">{selectedProblem.title}</h2>
            <span className={`text-xs px-2 py-1 rounded-full ${
              selectedProblem.difficulty === 'Easy' ? 'bg-green-900/50 text-green-400' :
              selectedProblem.difficulty === 'Medium' ? 'bg-yellow-900/50 text-yellow-400' :
              'bg-red-900/50 text-red-400'}`}>
              {selectedProblem.difficulty}
            </span>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line mb-4">
            {selectedProblem.description}
          </p>

          <button onClick={() => setShowHint(!showHint)}
            className="text-blue-400 text-sm hover:underline mb-2 block">
            {showHint ? 'Hide Hint 🙈' : 'Show Hint 💡'}
          </button>
          {showHint && (
            <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-3 text-sm text-blue-300 mb-4">
              {selectedProblem.solution}
            </div>
          )}

          {/* AI Review Result */}
          {review && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-green-400" size={18} />
                <span className="font-semibold text-green-400">AI Code Review</span>
              </div>
              <div className="bg-slate-700 rounded-lg p-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-yellow-400 font-bold text-lg">Score: {review.score}/10</span>
                  <span className={`text-sm font-semibold ${review.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                    {review.isCorrect ? '✅ Correct' : '❌ Needs Fix'}
                  </span>
                </div>
                <div className="text-xs text-slate-400 flex gap-4">
                  <span>⏱️ Time: <span className="text-white">{review.timeComplexity}</span></span>
                  <span>💾 Space: <span className="text-white">{review.spaceComplexity}</span></span>
                </div>
                <p className="text-slate-300 text-sm"><span className="text-blue-400">📝 Feedback:</span> {review.feedback}</p>
                <p className="text-slate-300 text-sm"><span className="text-red-400">🔧 Improve:</span> {review.improvements}</p>
                <p className="text-slate-300 text-sm"><span className="text-purple-400">🚀 Best Approach:</span> {review.optimizedApproach}</p>
              </div>
            </div>
          )}
        </div>

        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={val => setCode(val || '')}
              theme="vs-dark"
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 16 },
                fontFamily: 'JetBrains Mono, Fira Code, monospace',
              }}
            />
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800 bg-slate-900">
            <span className="text-slate-400 text-sm">
              💡 Think before you code, Amit! Strong DSA skills = Dream Job 🚀
            </span>
            <button onClick={handleSubmit} disabled={reviewing}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 px-6 py-2 rounded-lg font-semibold transition">
              {reviewing ? (
                <><Loader size={16} className="animate-spin" /> Reviewing...</>
              ) : (
                <><Play size={16} /> Run & Get AI Review</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}