import { Router } from 'express'
import { body } from 'express-validator'
import { login, me, signUp } from '../controllers/authController.js'
import { requireAuth } from '../middlewares/authMiddleware.js'
import { validateRequest } from '../middlewares/validationMiddleware.js'

const router = Router()

router.post(
  '/signup',
  [
    body('name').isString().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validateRequest,
  signUp,
)

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isString().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validateRequest,
  login,
)

router.get('/me', requireAuth, me)

export default router
