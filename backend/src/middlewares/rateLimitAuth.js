import rateLimit from "express-rate-limit";

/**
 * Rate limit para recuperação de senha (forgot-password).
 * Reduz abuso e enumeração de emails; resposta sempre genérica.
 * Limite: 5 requisições por 15 minutos por IP.
 */
export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    error: "Muitas tentativas. Tente novamente em alguns minutos.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limit para redefinição de senha (reset-password).
 * Protege contra força bruta em tokens.
 * Limite: 5 requisições por 15 minutos por IP.
 */
export const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    error: "Muitas tentativas. Tente novamente em alguns minutos.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
