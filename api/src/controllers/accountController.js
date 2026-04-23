import bcrypt from 'bcryptjs'
import { User } from '../models/User.js'
import { cloudinary } from '../config/cloudinary.js'

function toPublicUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
  }
}

export async function updateAccount(req, res) {
  const { name, email, password } = req.body
  const user = await User.findById(req.user._id)

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  if (typeof name === 'string' && name.trim()) {
    user.name = name.trim()
  }

  if (typeof email === 'string' && email.trim().toLowerCase() !== user.email) {
    const exists = await User.findOne({ email: email.trim().toLowerCase(), _id: { $ne: user._id } })
    if (exists) {
      return res.status(409).json({ message: 'Email already in use' })
    }
    user.email = email.trim().toLowerCase()
  }

  if (typeof password === 'string' && password.length >= 6) {
    user.passwordHash = await bcrypt.hash(password, 12)
  }

  await user.save()
  return res.json({ user: toPublicUser(user) })
}

export async function uploadAvatar(req, res) {
  const user = await User.findById(req.user._id)
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  if (!req.file) {
    return res.status(400).json({ message: 'Avatar file is required' })
  }

  if (user.avatarPublicId) {
    await cloudinary.uploader.destroy(user.avatarPublicId)
  }

  const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
  const uploadResult = await cloudinary.uploader.upload(dataUri, {
    folder: 'hng-invoice/avatars',
    resource_type: 'image',
  })

  user.avatarUrl = uploadResult.secure_url
  user.avatarPublicId = uploadResult.public_id
  await user.save()

  return res.json({ user: toPublicUser(user) })
}
