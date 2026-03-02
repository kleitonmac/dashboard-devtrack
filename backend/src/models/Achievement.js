import mongoose from "mongoose";

const AchievementSchema = new mongoose.Schema({
  title: String,
  description: String,
  xpReward: Number,
});

export default mongoose.model("Achievement", AchievementSchema);
