import mongoose from "mongoose";

/**
 * SEÇÃO: Projetos
 * Coleção: projects
 * Dados só desta seção; cada documento tem userId do dono.
 */
const ProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    stack: { type: [String], default: [] },
    difficulty: { type: String, default: "medium" },
    timeSpent: { type: Number, default: 0 },
    learning: { type: String, default: "" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true, collection: "projects" }
);

ProjectSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("Project", ProjectSchema);
