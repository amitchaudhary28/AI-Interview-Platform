# 🎯 AI Interview Preparation Platform

A full-stack AI-powered mock interview platform that I built from scratch to master modern web development. Through this project, I learned React.js, Node.js, PostgreSQL, Prisma ORM, JWT authentication, REST APIs, and AI integration using Groq's LLaMA model — all by building something real and useful.

This project taught me how to think like a full-stack developer — from designing database schemas to building responsive UIs, from writing secure APIs to deploying on cloud platforms like Vercel and Render.

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
![Landing Page](<img width="1898" height="1027" alt="image" src="https://github.com/user-attachments/assets/7983aef8-fefd-4651-8525-a0d291922a8b" />/landingpage.png
)

### Dashboard
![Dashboard](<img width="1919" height="1025" alt="image" src="https://github.com/user-attachments/assets/3ba95bc3-9394-462d-8516-8319573ab047" />/dashboard.png
)

### AI Interview Room
![Interview](<img width="1916" height="1027" alt="image" src="https://github.com/user-attachments/assets/34b9fffb-6e92-4010-9b3c-9d1252fe4a74" />
/interview.png)

### Resume Scanner with ATS Score
![Resume](<img width="1894" height="1027" alt="image" src="https://github.com/user-attachments/assets/48deea8e-ee07-4408-a7bb-596e8df26d34" />
/resume.png)

### Leaderboard
![Leaderboard](<img width="1919" height="1036" alt="image" src="https://github.com/user-attachments/assets/9299f788-94d8-4044-a5dc-7a0c64900e62" />
/leaderboard.png)

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
