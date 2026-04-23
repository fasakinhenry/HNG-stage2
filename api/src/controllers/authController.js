import bcrypt from 'bcryptjs'
import { User } from '../models/User.js'
import { signToken } from '../utils/jwt.js'

function userResponse(user, token) {
  return {
    token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
    },
  }
}

export async function signUp(req, res) {
  const { name, email, password } = req.body

  const existing = await User.findOne({ email: email.toLowerCase().trim() })
  if (existing) {
    return res.status(409).json({ message: 'Email already in use' })
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    passwordHash,
  })

  const token = signToken(user._id.toString())
  return res.status(201).json(userResponse(user, token))
}

export async function login(req, res) {
  const { email, password } = req.body

  const user = await User.findOne({ email: email.toLowerCase().trim() })
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const matches = await bcrypt.compare(password, user.passwordHash)
  if (!matches) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const token = signToken(user._id.toString())
  return res.json(userResponse(user, token))
}

export async function me(req, res) {
  return res.json({
    user: {
      id: req.user._id.toString(),
      name: req.user.name,
      email: req.user.email,
      avatarUrl: req.user.avatarUrl,
    },
  })
}
