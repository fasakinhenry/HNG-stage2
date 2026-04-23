export function notFound(req, res) {
  return res.status(404).json({ message: 'Route not found' })
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err)
  }

  const status = err.statusCode ?? 500
  const message = err.message ?? 'Internal server error'

  if (process.env.NODE_ENV !== 'production') {
    return res.status(status).json({ message, stack: err.stack })
  }

  return res.status(status).json({ message })
}
