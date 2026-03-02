import mongoose from "mongoose";

/**
 * SEÇÃO: Login | Register | Perfil
 * Coleção: users
 * Uma única coleção para conta (login/register) e dados de perfil.
 * Cada usuário tem seu próprio documento; atividades (study, problems, projects) usam userId.
 */
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    avatar: { type: String, default: null },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    lastLogin: Date,
    notes: String,
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
  },
  { timestamps: true, collection: "users" }
);

UserSchema.index({ createdAt: -1 });
// Índice para lookup de token de recuperação de senha (validação e reset)
UserSchema.index({ resetPasswordToken: 1, resetPasswordExpires: 1 });

export default mongoose.model("User", UserSchema);
