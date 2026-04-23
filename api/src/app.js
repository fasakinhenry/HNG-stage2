import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { env } from './config/env.js'
import authRoutes from './routes/authRoutes.js'
import invoiceRoutes from './routes/invoiceRoutes.js'
import accountRoutes from './routes/accountRoutes.js'
import { errorHandler, notFound } from './middlewares/errorMiddleware.js'

const app = express()

app.use(
  helmet({
    // Frontend runs on a different origin (localhost:5173), so uploaded avatar
    // images served by this API must be embeddable cross-origin.
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
)
app.use(cors({ origin: env.clientOrigin, credentials: true }))
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'))
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/account', accountRoutes)
app.use('/api/invoices', invoiceRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
