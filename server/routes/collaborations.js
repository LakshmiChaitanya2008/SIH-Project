import { Router } from 'express'
import { randomUUID } from 'crypto'
import { store } from '../db/store.js'

const router = Router()

// GET /api/collaborations
router.get('/', (req, res) => {
  return res.json({
    success: true,
    partners: store.partners
  })
})

// POST /api/collaborations/request
router.post('/request', (req, res) => {
  const reqData = {
    id: randomUUID(),
    ...req.body,
    status: 'PENDING',
    created_at: new Date().toISOString()
  }

  return res.status(201).json({
    success: true,
    request: reqData
  })
})

export default router
