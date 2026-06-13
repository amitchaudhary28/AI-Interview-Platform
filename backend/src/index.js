const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const questionRoutes = require('./routes/questionRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const aiRoutes = require('./routes/aiRoutes');
const resumeRoutes = require('./routes/resume.routes');
const companyRoutes = require('./routes/company.routes');
const leaderboardRoutes = require('./routes/leaderboard.routes');


const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'AI Interview Platform Backend is running! 🚀' });
});

app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT);
});