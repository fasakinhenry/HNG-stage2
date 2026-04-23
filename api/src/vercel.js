import app from './app.js'
import { connectDb } from './config/db.js'

export default async function handler(req, res) {
  await connectDb()
  return app(req, res)
}
