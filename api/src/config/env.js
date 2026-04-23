import dotenv from 'dotenv'
import { envFile } from './paths.js'

dotenv.config({ path: envFile })

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 5000),
  mongoUri: process.env.MONGODB_URI ?? '',
  jwtSecret: process.env.JWT_SECRET ?? '',
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME ?? '',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY ?? '',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET ?? '',
}

if (!env.mongoUri) {
  throw new Error('Missing MONGODB_URI in environment')
}

if (!env.jwtSecret) {
  throw new Error('Missing JWT_SECRET in environment')
}

if (!env.cloudinaryCloudName || !env.cloudinaryApiKey || !env.cloudinaryApiSecret) {
  throw new Error('Missing Cloudinary configuration in environment')
}
