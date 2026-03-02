import DevProblem from "../models/DevProblem.js";
import User from "../models/User.js";
import { calculateXP, calculateLevel } from "../services/xpService.js";

export async function createProblem(req, res) {
  const problem = await DevProblem.create({
    ...req.body,
    userId: req.userId,
  });

  const xp = calculateXP("problem");
  const user = await User.findById(req.userId);
  const newXp = (user.xp || 0) + xp;
  const newLevel = calculateLevel(newXp);

  await User.findByIdAndUpdate(req.userId, {
    xp: newXp,
    level: newLevel,
  });

  res.json({
    ...problem.toObject(),
    xpGained: xp,
    newXp,
    newLevel,
  });
}

export async function getProblems(req, res) {
  const problems = await DevProblem.find({
    userId: req.userId,
  }).sort({ createdAt: -1 });

  res.json(problems);
}

export async function deleteProblem(req, res) {
  try {
    const { id } = req.params;

    const problem = await DevProblem.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!problem) {
      return res.status(404).json({ error: "Problema não encontrado" });
    }

    res.json({ success: true, message: "Problema removido" });
  } catch (error) {
    console.error("Erro ao deletar problema:", error);
    res.status(500).json({ error: "Erro ao deletar problema" });
  }
}
