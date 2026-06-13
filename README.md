# 🎯 AI Interview Preparation Platform

An AI-powered full-stack mock interview platform built for off-campus placement preparation. Practice with an AI interviewer, get instant feedback, solve coding problems, and track your progress.

## 🚀 Live Demo
- **Frontend:** Coming soon...
- **Backend:** Coming soon...

## ✨ Features

- 🎤 **AI Mock Interviews** — AI asks questions, evaluates answers, gives real feedback
- 💻 **Coding Rounds** — Solve DSA problems in browser with Monaco Editor + AI review
- 🏢 **Company-Specific Mode** — Practice for Google, Amazon, TCS, Infosys, Microsoft & more
- 📄 **Resume Scanner** — Upload resume, get ATS score, weakness areas & interview questions
- 🏆 **Leaderboard** — Compete with other students globally
- 🔥 **Streak System** — Daily streak tracking to keep you consistent
- 👤 **User Profile** — Track your progress, badges, and session history
- 🔐 **JWT Authentication** — Secure login and registration

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js + Tailwind CSS + Vite |
| Backend | Node.js + Express.js |
| Database | PostgreSQL + Prisma ORM |
| AI | Groq API (LLaMA 3.3 70B) |
| Auth | JWT (JSON Web Tokens) |
| Deployment | Vercel + Render |

## 📁 Project Structure

AI-Interview-Platform/

├── backend/

│   ├── prisma/          # Database schema & migrations

│   ├── src/

│   │   ├── controllers/ # Route handlers

│   │   ├── middleware/  # Auth middleware

│   │   ├── routes/      # API routes

│   │   ├── services/    # AI & business logic

│   │   └── index.js     # Entry point

│   └── package.json

├── frontend/

│   ├── src/

│   │   ├── context/     # Auth context

│   │   ├── pages/       # All pages

│   │   └── services/    # API calls

│   └── package.json

└── README.md

## 🏃 Run Locally

### Backend
```bash
cd backend
npm install
npx prisma migrate dev
node src/index.js
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables (backend/.env)

PORT=5000

DATABASE_URL=postgresql://...

JWT_SECRET=your_secret

GROQ_API_KEY=your_groq_key

FRONTEND_URL=http://localhost:5173

## 📸 Screenshots

### Landing Page
![Landing Page](screenshots/landing.png)

### Dashboard
![Dashboard](screenshots/dashboard.png)

### AI Interview Room
![Interview](screenshots/interview.png)

### Resume Scanner with ATS Score
![Resume](screenshots/resume.png)

### Leaderboard
![Leaderboard](screenshots/leaderboard.png)

## 🎯 Phases Built

| Phase | Feature | Status |
|---|---|---|
| 1 | Project Setup & Folder Structure | ✅ |
| 2 | Backend: Node + Express + PostgreSQL + Prisma | ✅ |
| 3 | JWT Authentication | ✅ |
| 4 | Question Bank API | ✅ |
| 5 | Interview Session API | ✅ |
| 6 | React + Tailwind + Routing | ✅ |
| 7 | Login/Register Pages | ✅ |
| 8 | Dashboard Page | ✅ |
| 9 | Interview Room | ✅ |
| 10 | Monaco Editor (Coding Rounds) | ✅ |
| 11 | AI Scoring with Groq | ✅ |
| 12 | AI Follow-up Questions | ✅ |
| 13 | Resume Parser + ATS Score | ✅ |
| 14 | Company-Specific Interview Mode | ✅ |
| 15 | Leaderboard + Profile + Streaks | ✅ |
| 16 | Deployment | ✅ |

## 👨‍💻 Built by

**Amit Chaudhary** 

[![GitHub](https://img.shields.io/badge/GitHub-amitchaudhary28-black?style=flat&logo=github)](https://github.com/amitchaudhary28)
