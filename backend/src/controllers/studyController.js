import StudySession from "../models/StudySession.js";
import { calculateXP, calculateLevel } from "../services/xpService.js";
import User from "../models/User.js";

export async function getStudySessions(req, res) {
  try {
    const sessions = await StudySession.find({ userId: req.userId }).sort({
      createdAt: -1,
    });
    res.json(sessions);
  } catch (error) {
    console.error("Erro ao buscar sessões:", error);
    res.status(500).json({ error: "Erro ao buscar sessões" });
  }
}

export async function createStudy(req, res) {
  try {
    const { technology, duration, focus, productivity, notes } = req.body;

    // Validar campos obrigatórios
    if (!technology || !duration) {
      return res.status(400).json({ error: "Tecnologia e duração são obrigatórios" });
    }

    const study = await StudySession.create({
      technology,
      duration,
      focus: focus || 50,
      productivity: productivity || 50,
      notes: notes || "",
      userId: req.userId,
    });

    // Calcular e adicionar XP
    const xp = calculateXP("study");
    const user = await User.findById(req.userId);
    const newXp = (user.xp || 0) + xp;
    const newLevel = calculateLevel(newXp);
    await User.findByIdAndUpdate(req.userId, {
      xp: newXp,
      level: newLevel,
    });

    res.status(201).json({
      success: true,
      message: "Sessão de estudo salva com sucesso!",
      study,
      xpGained: xp,
    });
  } catch (error) {
    console.error("Erro ao criar sessão:", error);
    res.status(500).json({ error: "Erro ao criar sessão de estudo" });
  }
}

export async function deleteStudy(req, res) {
  try {
    const { id } = req.params;

    const session = await StudySession.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!session) {
      return res.status(404).json({ error: "Sessão não encontrada" });
    }

    res.json({ success: true, message: "Sessão removida" });
  } catch (error) {
    console.error("Erro ao deletar sessão:", error);
    res.status(500).json({ error: "Erro ao deletar sessão" });
  }
}
