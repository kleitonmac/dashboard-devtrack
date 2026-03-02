import Project from "../models/Project.js";
import User from "../models/User.js";
import { calculateXP, calculateLevel } from "../services/xpService.js";

export async function createProject(req, res) {
  const project = await Project.create({
    ...req.body,
    userId: req.userId,
  });

  const xp = calculateXP("project");
  const user = await User.findById(req.userId);
  const newXp = (user.xp || 0) + xp;
  const newLevel = calculateLevel(newXp);

  await User.findByIdAndUpdate(req.userId, {
    xp: newXp,
    level: newLevel,
  });

  res.json({
    ...project.toObject(),
    xpGained: xp,
    newXp,
    newLevel,
  });
}

export async function getProjects(req, res) {
  const projects = await Project.find({
    userId: req.userId,
  }).sort({ createdAt: -1 });

  res.json(projects);
}

export async function deleteProject(req, res) {
  try {
    const { id } = req.params;

    const project = await Project.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!project) {
      return res.status(404).json({ error: "Projeto não encontrado" });
    }

    res.json({ success: true, message: "Projeto removido" });
  } catch (error) {
    console.error("Erro ao deletar projeto:", error);
    res.status(500).json({ error: "Erro ao deletar projeto" });
  }
}
