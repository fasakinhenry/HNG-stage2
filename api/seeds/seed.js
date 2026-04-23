import fs from 'node:fs'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { User } from '../src/models/User.js'
import { Invoice } from '../src/models/Invoice.js'
import { envFile, seedFile } from '../src/config/paths.js'

dotenv.config({ path: envFile })

const mongoUri = process.env.MONGODB_URI
if (!mongoUri) {
  throw new Error('Missing MONGODB_URI in .env')
}

async function run() {
  await mongoose.connect(mongoUri)

  const raw = fs.readFileSync(seedFile, 'utf-8')
  const data = JSON.parse(raw)

  await Invoice.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash(data.user.password, 12)
  const user = await User.create({
    name: data.user.name,
    email: data.user.email.toLowerCase(),
    passwordHash,
    avatarUrl: data.user.avatarUrl || '',
    avatarPublicId: '',
  })

  const invoices = data.invoices.map((invoice) => ({
    ...invoice,
    owner: user._id,
  }))

  await Invoice.insertMany(invoices)

  console.log('Database seeded successfully')
  console.log(`Seed user email: ${data.user.email}`)
  console.log(`Seed user password: ${data.user.password}`)

  await mongoose.disconnect()
}

run().catch(async (error) => {
  console.error(error)
  await mongoose.disconnect()
  process.exit(1)
})
