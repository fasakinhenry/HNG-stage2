import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const apiRoot = path.resolve(__dirname, '../..')
export const uploadsDir = path.resolve(apiRoot, 'uploads')
export const avatarsDir = path.resolve(uploadsDir, 'avatars')
export const envFile = path.resolve(apiRoot, '.env')
export const seedFile = path.resolve(apiRoot, 'seeds', 'seed.data.json')