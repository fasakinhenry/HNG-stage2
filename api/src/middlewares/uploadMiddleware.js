import multer from 'multer'
const storage = multer.memoryStorage()

function fileFilter(req, file, cb) {
  const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error('Only png, jpg, jpeg, and webp are allowed'))
  }
  return cb(null, true)
}

export const uploadAvatar = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
})
