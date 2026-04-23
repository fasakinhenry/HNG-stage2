import { User } from '../models/User.js'
import { verifyToken } from '../utils/jwt.js'

export async function requireAuth(req, res, next) {
  try {
    const authorization = req.headers.authorization

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const token = authorization.slice('Bearer '.length).trim()
    const payload = verifyToken(token)

    const user = await User.findById(payload.userId).select('-passwordHash')
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    req.user = user
    return next()
  } catch {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}
