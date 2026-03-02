import { Router } from 'express'
import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  validateResetToken,
  resetPassword,
} from '../controllers/authController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import {
  forgotPasswordLimiter,
  resetPasswordLimiter,
} from '../middlewares/rateLimitAuth.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', authMiddleware, getMe)
router.put('/profile', authMiddleware, updateProfile)
router.post('/change-password', authMiddleware, changePassword)

// Recuperação de senha: rate limit + proteção contra enumeração
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword)
router.get('/validate-reset-token', validateResetToken)
router.post('/reset-password', resetPasswordLimiter, resetPassword)

export default router
