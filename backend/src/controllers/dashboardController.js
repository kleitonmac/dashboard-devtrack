import { totalStudyTime, getWeeklyEvolution } from "../services/analyticsService.js";
import Project from "../models/Project.js";
import StudySession from "../models/StudySession.js";
import User from "../models/User.js";

export async function getDashboard(req, res) {
  const studyTime = await totalStudyTime(req.userId);
  const projects = await Project.countDocuments({
    userId: req.userId,
  });

  res.json({
    totalStudyTime: studyTime,
    totalProjects: projects,
  });
}

export async function getAnalytics(req, res) {
  try {
    const { period = "week" } = req.query;

    if (period === "week") {
      const weeklyXP = await getWeeklyEvolution(req.userId);
      return res.json({ weeklyXP });
    }

    res.json({ weeklyXP: [] });
  } catch (error) {
    console.error("Erro ao buscar analytics:", error);
    res.status(500).json({ error: "Erro ao buscar analytics" });
  }
}

export async function getStats(req, res) {
  try {
    const user = await User.findById(req.userId);
    const projectsCount = await Project.countDocuments({
      userId: req.userId,
    });
    const sessionsCount = await StudySession.countDocuments({
      userId: req.userId,
    });

    res.json({
      xp: user?.xp || 0,
      level: user?.level || 1,
      totalProjects: projectsCount,
      totalSessions: sessionsCount,
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar estatísticas" });
  }
}
