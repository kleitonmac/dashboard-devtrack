import mongoose from "mongoose";

/**
 * SEÇÃO: Estudos (tarefas to-do)
 * Coleção: studytasks
 * Só dados de tarefas de estudo; cada documento tem userId do dono.
 */
const StudyTaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    completed: { type: Boolean, default: false },
    completedAt: Date,
    xpReward: { type: Number, default: 10 },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    category: { type: String, default: "study" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true, collection: "studytasks" }
);

StudyTaskSchema.index({ userId: 1, completed: 1, createdAt: -1 });

export default mongoose.model("StudyTask", StudyTaskSchema);
