const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ─── Helper: calculate badge ──────────────────────────────────────
const getBadge = (avgScore, totalSessions) => {
  if (totalSessions === 0) return 'Beginner';
  if (avgScore >= 9 && totalSessions >= 20) return 'Legend';
  if (avgScore >= 8 && totalSessions >= 10) return 'Expert';
  if (avgScore >= 7 && totalSessions >= 5)  return 'Advanced';
  if (avgScore >= 6 && totalSessions >= 3)  return 'Intermediate';
  return 'Beginner';
};

// ─── Helper: update streak ────────────────────────────────────────
const updateStreak = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
  if (lastActive) lastActive.setHours(0, 0, 0, 0);

  let newStreak = user.streak;

  if (!lastActive) {
    newStreak = 1;
  } else {
    const diffDays = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return; // already active today
    if (diffDays === 1) newStreak += 1; // consecutive day
    if (diffDays > 1)  newStreak = 1;  // streak broken
  }

  await prisma.user.update({
    where: { id: userId },
    data: { streak: newStreak, lastActiveDate: new Date() },
  });
};

// ─── Update user stats after session ─────────────────────────────
const updateUserStats = async (req, res) => {
  try {
    const { score } = req.body;
    const userId = req.user.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    const newTotal     = user.totalSessions + 1;
    const newTotalScore = user.totalScore + score;
    const newAvg       = newTotalScore / newTotal;
    const newBadge     = getBadge(newAvg, newTotal);

    await prisma.user.update({
      where: { id: userId },
      data: {
        totalSessions:  newTotal,
        totalScore:     newTotalScore,
        avgScore:       newAvg,
        badge:          newBadge,
        lastActiveDate: new Date(),
      },
    });

    await updateStreak(userId);

    return res.status(200).json({ message: 'Stats updated', badge: newBadge });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ─── Get leaderboard ─────────────────────────────────────────────
const getLeaderboard = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { totalSessions: { gt: 0 } },
      orderBy: { avgScore: 'desc' },
      take: 50,
      select: {
        id: true, name: true, avgScore: true,
        totalSessions: true, streak: true, badge: true,
      },
    });

    const ranked = users.map((u, i) => ({ ...u, rank: i + 1 }));
    return res.status(200).json({ leaderboard: ranked });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ─── Get user profile ─────────────────────────────────────────────
const getUserProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true, name: true, email: true,
        streak: true, totalSessions: true,
        totalScore: true, avgScore: true,
        badge: true, lastActiveDate: true,
        createdAt: true,
        sessions: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true, topic: true, score: true, createdAt: true,
          },
        },
      },
    });

    // Get rank
    const allUsers = await prisma.user.findMany({
      where: { totalSessions: { gt: 0 } },
      orderBy: { avgScore: 'desc' },
      select: { id: true },
    });
    const rank = allUsers.findIndex((u) => u.id === req.user.id) + 1;

    return res.status(200).json({ user: { ...user, rank: rank || 'Unranked' } });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { getLeaderboard, getUserProfile, updateUserStats };