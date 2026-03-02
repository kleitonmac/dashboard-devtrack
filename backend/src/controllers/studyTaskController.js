import StudyTask from "../models/StudyTask.js";
import User from "../models/User.js";
import { calculateLevel } from "../services/xpService.js";

export async function getTasks(req, res) {
  try {
    const tasks = await StudyTask.find({ userId: req.userId }).sort({
      completed: 1,
      createdAt: -1,
    });
    res.json(tasks);
  } catch (error) {
    console.error("Erro ao buscar tarefas:", error);
    res.status(500).json({ error: "Erro ao buscar tarefas" });
  }
}

export async function createTask(req, res) {
  try {
    const { title, description, priority, category, xpReward } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ error: "Título é obrigatório" });
    }

    const task = await StudyTask.create({
      title: title.trim(),
      description: description || "",
      priority: priority || "medium",
      category: category || "study",
      xpReward: xpReward || 10,
      userId: req.userId,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    res.status(500).json({ error: "Erro ao criar tarefa" });
  }
}

export async function completeTask(req, res) {
  try {
    const { id } = req.params;

    const task = await StudyTask.findOne({
      _id: id,
      userId: req.userId,
    });

    if (!task) {
      return res.status(404).json({ error: "Tarefa não encontrada" });
    }

    if (task.completed) {
      return res.status(400).json({ error: "Tarefa já foi completada" });
    }

    task.completed = true;
    task.completedAt = new Date();
    await task.save();

    const xpGained = task.xpReward;

    const user = await User.findById(req.userId);
    const newXp = (user.xp || 0) + xpGained;
    const newLevel = calculateLevel(newXp);

    await User.findByIdAndUpdate(req.userId, {
      xp: newXp,
      level: newLevel,
    });

    res.json({
      success: true,
      task,
      xpGained,
      newXp,
      newLevel,
    });
  } catch (error) {
    console.error("Erro ao completar tarefa:", error);
    res.status(500).json({ error: "Erro ao completar tarefa" });
  }
}

export async function toggleTask(req, res) {
  try {
    const { id } = req.params;

    const task = await StudyTask.findOne({
      _id: id,
      userId: req.userId,
    });

    if (!task) {
      return res.status(404).json({ error: "Tarefa não encontrada" });
    }

    if (task.completed) {
      task.completed = false;
      task.completedAt = null;
      await task.save();

      const user = await User.findById(req.userId);
      const newXp = Math.max(0, (user.xp || 0) - task.xpReward);
      const newLevel = calculateLevel(newXp);

      await User.findByIdAndUpdate(req.userId, {
        xp: newXp,
        level: newLevel,
      });

      return res.json({
        success: true,
        task,
        xpGained: -task.xpReward,
        newXp,
        newLevel,
      });
    } else {
      task.completed = true;
      task.completedAt = new Date();
      await task.save();

      const xpGained = task.xpReward;
      const user = await User.findById(req.userId);
      const newXp = (user.xp || 0) + xpGained;
      const newLevel = calculateLevel(newXp);

      await User.findByIdAndUpdate(req.userId, {
        xp: newXp,
        level: newLevel,
      });

      return res.json({
        success: true,
        task,
        xpGained,
        newXp,
        newLevel,
      });
    }
  } catch (error) {
    console.error("Erro ao alternar tarefa:", error);
    res.status(500).json({ error: "Erro ao alternar tarefa" });
  }
}

export async function deleteTask(req, res) {
  try {
    const { id } = req.params;

    const task = await StudyTask.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!task) {
      return res.status(404).json({ error: "Tarefa não encontrada" });
    }

    res.json({ success: true, message: "Tarefa removida" });
  } catch (error) {
    console.error("Erro ao deletar tarefa:", error);
    res.status(500).json({ error: "Erro ao deletar tarefa" });
  }
}
