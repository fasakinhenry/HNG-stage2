import { Router } from 'express'
import { body } from 'express-validator'
import { updateAccount, uploadAvatar } from '../controllers/accountController.js'
import { requireAuth } from '../middlewares/authMiddleware.js'
import { uploadAvatar as avatarUpload } from '../middlewares/uploadMiddleware.js'
import { validateRequest } from '../middlewares/validationMiddleware.js'

const router = Router()

router.patch(
  '/me',
  requireAuth,
  [
    body('name').optional().isString().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').optional().isEmail().withMessage('Email must be valid'),
    body('password').optional().isString().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validateRequest,
  updateAccount,
)

router.post('/me/avatar', requireAuth, avatarUpload.single('avatar'), uploadAvatar)

export default router
