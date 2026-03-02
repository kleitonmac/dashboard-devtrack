import mongoose from "mongoose";

/**
 * SEÇÃO: Problemas
 * Coleção: devproblems
 * Só dados de problemas resolvidos; cada documento tem userId do dono.
 */
const ProblemSchema = new mongoose.Schema(
  {
    error: { type: String, required: true },
    solution: { type: String, required: true },
    technology: { type: String, default: "" },
    difficulty: { type: String, default: "medium" },
    timeToSolve: { type: Number, default: 0 },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true, collection: "devproblems" }
);

ProblemSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("DevProblem", ProblemSchema);
