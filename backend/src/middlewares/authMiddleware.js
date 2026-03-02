import jwt from 'jsonwebtoken'

// Usar a mesma chave do authController (process.env já carregado no index.js antes de importar app)
function getJwtSecret() {
  return process.env.JWT_SECRET || 'secret'
}

export function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res
      .status(401)
      .json({ error: 'Token não enviado. Faça login novamente.' })
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret())
    req.userId = decoded.id
    next()
  } catch (err) {
    return res.status(401).json({
      error: 'Sessão inválida ou expirada. Faça login novamente.',
    })
  }
}
