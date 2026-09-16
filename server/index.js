import express from 'express'
import cors from 'cors'
import { config } from './config.js'
import { checkSupabaseConnection } from './db/supabase.js'
import { authMiddleware } from './middleware/auth.js'

import authRoutes from './routes/auth.js'
import submissionsRoutes from './routes/submissions.js'
import aiRoutes from './routes/ai.js'
import clustersRoutes from './routes/clusters.js'
import challengesRoutes from './routes/challenges.js'
import teamsRoutes from './routes/teams.js'
import proposalsRoutes from './routes/proposals.js'
import projectsRoutes, { updateMilestoneHandler } from './routes/projects.js'
import collaborationsRoutes from './routes/collaborations.js'
import dashboardRoutes from './routes/dashboard.js'
import storageRoutes from './routes/storage.js'

const app = express()

// Global Middleware
app.use(cors({ origin: true, credentials: true }))
app.use(express.json({ limit: '25mb' }))
app.use(express.urlencoded({ extended: true, limit: '25mb' }))
app.use(authMiddleware)

// Health Check
app.get(['/health', '/api/health'], async (req, res) => {
  const isDbOnline = await checkSupabaseConnection()
  res.json({
    status: 'ok',
    service: 'SamadhanSetu Dedicated Backend API Server',
    version: '2.0.0',
    port: config.port,
    timestamp: new Date().toISOString(),
    database: isDbOnline ? 'supabase-postgresql-live' : 'resilient-in-memory-store',
    ai_provider: config.groqApiKey ? 'groq-lpu-llama-3.3' : 'deterministic-rules'
  })
})

// Mount Primary REST Routes
app.use('/api/auth', authRoutes)
app.use('/api/submissions', submissionsRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/clusters', clustersRoutes)
app.use('/api/challenges', challengesRoutes)
app.use('/api/teams', teamsRoutes)
app.use('/api/proposals', proposalsRoutes)
app.use('/api/projects', projectsRoutes)
app.put('/api/milestones/:id', updateMilestoneHandler)
app.use('/api/collaborations', collaborationsRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/admin', dashboardRoutes)
app.use('/api/storage', storageRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.path}` })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err)
  res.status(500).json({ error: err.message || 'Internal Server Error' })
})

// Start server
const server = app.listen(config.port, async () => {
  console.log(`===========================================================`)
  console.log(`🚀 SamadhanSetu Dedicated Backend API Server Running`)
  console.log(`📡 URL: http://localhost:${config.port}`)
  console.log(`🛡️  Auth: JWT RBAC active`)
  console.log(`🤖 AI Provider: ${config.groqApiKey ? 'Groq LPU Llama 3.3' : 'Deterministic Rules'}`)
  const dbConnected = await checkSupabaseConnection()
  console.log(`💾 Supabase Postgres: ${dbConnected ? 'CONNECTED (Live)' : 'STANDALONE (In-Memory Resilient Store)'}`)
  console.log(`===========================================================`)
})

export { app, server }
