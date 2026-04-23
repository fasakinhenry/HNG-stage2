import app from './app.js'
import { connectDb } from './config/db.js'
import { env } from './config/env.js'

async function start() {
  await connectDb()

  app.listen(env.port, () => {
    console.log(`API server listening on http://localhost:${env.port}`)
  })
}

start().catch((error) => {
  console.error('Failed to start API server', error)
  process.exit(1)
})
