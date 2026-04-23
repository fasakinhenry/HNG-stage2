import mongoose from 'mongoose'
import { env } from './env.js'

let isConnected = false

export async function connectDb() {
  if (isConnected) {
    return
  }

  await mongoose.connect(env.mongoUri)
  isConnected = true
}
