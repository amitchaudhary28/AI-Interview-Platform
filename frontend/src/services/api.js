import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getProfile = () => API.get('/auth/profile');
export const getQuestions = (params) => API.get('/questions', { params });
export const getRandomQuestions = (params) => API.get('/questions/random', { params });
export const getTopics = () => API.get('/questions/topics');
export const startSession = (data) => API.post('/sessions/start', data);
export const submitAnswer = (data) => API.post('/sessions/submit-answer', data);
export const endSession = (data) => API.post('/sessions/end', data);
export const getMySessions = () => API.get('/sessions/my-sessions');
// AI endpoints
export const aiEvaluate = (data) => API.post('/ai/evaluate', data);
export const aiCodeReview = (data) => API.post('/ai/code-review', data);
export const aiCompanyQuestions = (data) => API.post('/ai/company-questions', data);
export const aiResumeQuestions = (data) => API.post('/ai/resume-questions', data);

// Resume endpoints
export const uploadResume = (formData) => API.post('/resume/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const getUserResumes = () => API.get('/resume');
export const getResumeById = (id) => API.get(`/resume/${id}`);

// Company endpoints
export const getCompanies = () => API.get('/company');
export const getCompanyQuestions = (data) => API.post('/company/questions', data);
export const evaluateCompanyAnswer = (data) => API.post('/company/evaluate', data);

// Leaderboard & Profile
export const getLeaderboard   = ()     => API.get('/leaderboard');
export const getUserProfile   = ()     => API.get('/leaderboard/profile');
export const updateUserStats  = (data) => API.post('/leaderboard/stats', data);

export default API;