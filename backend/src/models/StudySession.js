import mongoose from "mongoose";

/**
 * SEÇÃO: Estudos (sessões de estudo)
 * Coleção: studysessions
 * Só dados de sessões; cada documento tem userId do dono.
 */
const StudySchema = new mongoose.Schema(
  {
    technology: { type: String, required: true },
    duration: { type: Number, required: true },
    focus: { type: Number, default: 50 },
    productivity: { type: Number, default: 50 },
    notes: { type: String, default: "" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true, collection: "studysessions" }
);

StudySchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("StudySession", StudySchema);
