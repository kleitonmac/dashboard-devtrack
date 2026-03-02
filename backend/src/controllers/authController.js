import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import { sendPasswordResetEmail } from '../utils/emailService.js'

// ========== Recuperação de senha (forgot / reset) ==========
const RESET_TOKEN_BYTES = 32
const RESET_TOKEN_EXPIRY_MS = 60 * 60 * 1000 // 1 hora
const BCRYPT_ROUNDS = 10
const MESSAGE_EMAIL_SENT =
  'Se o email existir na base, você receberá o link de recuperação.'

export async function register(req, res) {
  try {
    const { name, email, password } = req.body

    // Validar campos obrigatórios
    if (!name?.trim() || !email?.trim() || !password) {
      return res
        .status(400)
        .json({ error: 'Nome, email e senha são obrigatórios' })
    }

    const emailNorm = email.trim().toLowerCase()
    // Verificar se email já existe (case-insensitive)
    const existingUser = await User.findOne({
      email: {
        $regex: new RegExp(
          `^${emailNorm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`,
          'i',
        ),
      },
    })
    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' })
    }

    // Validar tamanho de senha
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: 'Senha deve ter no mínimo 6 caracteres' })
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10)

    // Salva na coleção users no MongoDB. Só quem faz register pode fazer login depois.
    const user = await User.create({
      name: name.trim(),
      email: emailNorm,
      password: hashedPassword,
      xp: 0,
      level: 1,
      role: 'user',
      lastLogin: new Date(),
    })

    // Gerar token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'secret',
      {
        expiresIn: '1d',
      },
    )

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        xp: user.xp,
        level: user.level,
        role: user.role,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    console.error('Erro ao registrar:', error)
    res.status(500).json({ error: 'Erro ao registrar usuário' })
  }
}

/**
 * Login: só usuários que fizeram REGISTER (existem na coleção users no MongoDB) podem fazer login.
 * Consulta em tempo real no banco; sem conta criada = sem acesso.
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' })
    }

    const emailNorm = (typeof email === 'string' ? email : '')
      .trim()
      .toLowerCase()
    // Consulta em tempo real no MongoDB: só quem está na coleção users (fez register) pode logar
    const user = await User.findOne({
      email: {
        $regex: new RegExp(
          `^${emailNorm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`,
          'i',
        ),
      },
    })

    if (!user) {
      return res.status(401).json({ error: 'Email ou senha incorretos' })
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Email ou senha incorretos' })
    }

    // Atualizar último login
    await User.findByIdAndUpdate(user._id, { lastLogin: new Date() })

    // Gerar token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'secret',
      {
        expiresIn: '1d',
      },
    )

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        xp: user.xp || 0,
        level: user.level || 1,
        role: user.role,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    console.error('Erro ao fazer login:', error)
    res.status(500).json({ error: 'Erro ao fazer login' })
  }
}

/**
 * GET /auth/me - Consulta em tempo real: retorna o usuário atual direto do MongoDB (xp, level, etc.).
 * Cada usuário vê apenas seu próprio progresso (req.userId do token).
 */
export async function getMe(req, res) {
  try {
    const user = await User.findById(req.userId).select('-password')
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        xp: user.xp || 0,
        level: user.level || 1,
        role: user.role,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    console.error('Erro ao buscar usuário:', error)
    res.status(500).json({ error: 'Erro ao buscar usuário' })
  }
}

export async function updateProfile(req, res) {
  try {
    const { name, email, avatar } = req.body

    const updateData = {}

    if (name !== undefined) {
      const trimmedName = String(name).trim()
      if (!trimmedName) {
        return res.status(400).json({ error: 'Nome não pode ser vazio' })
      }
      updateData.name = trimmedName
    }

    if (email !== undefined && typeof email === 'string') {
      const emailNorm = email.trim().toLowerCase()
      if (!emailNorm) {
        return res.status(400).json({ error: 'Email não pode ser vazio' })
      }

      // Verifica se já existe outro usuário com esse email
      const existingUser = await User.findOne({
        _id: { $ne: req.userId },
        email: {
          $regex: new RegExp(
            `^${emailNorm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`,
            'i',
          ),
        },
      })

      if (existingUser) {
        return res.status(400).json({ error: 'Email já cadastrado' })
      }

      updateData.email = emailNorm
    }

    if (avatar !== undefined) {
      updateData.avatar = avatar
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updateData },
      { new: true },
    )

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        xp: user.xp || 0,
        level: user.level || 1,
        role: user.role,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
    })
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error)
    res.status(500).json({ error: 'Erro ao atualizar perfil' })
  }
}

export async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body

    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Senha atual incorreta' })
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: 'Nova senha deve ter no mínimo 6 caracteres' })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await User.findByIdAndUpdate(req.userId, { password: hashedPassword })

    res.json({ success: true, message: 'Senha alterada com sucesso' })
  } catch (error) {
    console.error('Erro ao alterar senha:', error)
    res.status(500).json({ error: 'Erro ao alterar senha' })
  }
}

/**
 * POST /auth/forgot-password
 *
 * Fluxo profissional de recuperação de senha:
 * - Token criptograficamente seguro (crypto.randomBytes)
 * - Salvo no banco por user_id: token + expires_at
 * - Resposta sempre igual (email existe ou não) → proteção contra enumeração
 * - Rate limit aplicado na rota (middleware)
 */
export async function forgotPassword(req, res) {
  try {
    const { email } = req.body
    if (!email?.trim()) {
      return res.status(400).json({ error: 'Email é obrigatório' })
    }
    const emailNorm = email.trim().toLowerCase()
    const user = await User.findOne({
      email: {
        $regex: new RegExp(
          `^${emailNorm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`,
          'i',
        ),
      },
    })

    // Proteção contra enumeração: mesma resposta se o email existir ou não
    const genericResponse = () =>
      res.status(200).json({ success: true, message: MESSAGE_EMAIL_SENT })

    if (!user) {
      return genericResponse()
    }

    // Token criptograficamente seguro; salvo no documento do usuário (user_id + token + expires_at)
    const token = crypto.randomBytes(RESET_TOKEN_BYTES).toString('hex')
    const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY_MS)

    await User.findByIdAndUpdate(user._id, {
      resetPasswordToken: token,
      resetPasswordExpires: expiresAt,
    })

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
    const resetLink = `${frontendUrl}/reset-password?token=${token}`
    const emailSent = await sendPasswordResetEmail(
      user.email,
      user.name,
      resetLink,
    )

    if (!emailSent && process.env.NODE_ENV !== 'production') {
      return res.status(200).json({
        success: true,
        message: MESSAGE_EMAIL_SENT,
        devResetLink: resetLink,
      })
    }
    return genericResponse()
  } catch (error) {
    console.error('Erro ao solicitar recuperação:', error)
    res
      .status(500)
      .json({ error: 'Erro ao processar solicitação. Tente novamente.' })
  }
}

/**
 * GET /auth/validate-reset-token?token=xxx
 * Valida se o token existe no banco e não expirou (expires_at). Usado pelo front para mostrar formulário ou erro.
 */
export async function validateResetToken(req, res) {
  try {
    const { token } = req.query
    if (!token) {
      return res.status(400).json({ valid: false, error: 'Token ausente' })
    }
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    }).select('email')
    if (!user) {
      return res.json({ valid: false, error: 'Token inválido ou expirado' })
    }
    res.json({ valid: true, email: user.email })
  } catch (error) {
    console.error('Erro ao validar token:', error)
    res.status(500).json({ valid: false, error: 'Erro ao validar token' })
  }
}

/**
 * POST /auth/reset-password
 * Body: { token, newPassword }
 *
 * - Valida token no banco e expiração (expires_at)
 * - Nova senha com bcrypt (hash)
 * - Invalida token após uso (limpa no banco)
 * - Rate limit aplicado na rota
 */
export async function resetPassword(req, res) {
  try {
    const { token, newPassword } = req.body
    if (!token?.trim()) {
      return res.status(400).json({ error: 'Token é obrigatório' })
    }
    if (!newPassword || newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: 'Nova senha deve ter no mínimo 6 caracteres' })
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    })
    if (!user) {
      return res
        .status(400)
        .json({ error: 'Token inválido ou expirado. Solicite um novo link.' })
    }

    const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_ROUNDS)
    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    })

    res.json({
      success: true,
      message: 'Senha alterada com sucesso. Faça login com a nova senha.',
    })
  } catch (error) {
    console.error('Erro ao redefinir senha:', error)
    res.status(500).json({ error: 'Erro ao redefinir senha. Tente novamente.' })
  }
}
