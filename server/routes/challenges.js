import { Router } from 'express'
import { randomUUID } from 'crypto'
import { store } from '../db/store.js'

const router = Router()

// GET /api/challenges
router.get('/', (req, res) => {
  const { id, status, domain } = req.query
  let result = [...store.challenges]

  if (id) {
    result = result.filter(c => c.id === id)
  }
  if (status && status !== 'ALL') {
    result = result.filter(c => (c.status || '').toUpperCase() === status.toUpperCase())
  }
  if (domain && domain !== 'ALL') {
    result = result.filter(c => (c.domain || '').toUpperCase().includes(domain.toUpperCase()))
  }

  return res.json({
    success: true,
    challenges: result
  })
})

// GET /api/challenges/:id
router.get('/:id', (req, res) => {
  const found = store.challenges.find(c => c.id === req.params.id)
  if (!found) {
    return res.status(404).json({ error: 'Challenge not found' })
  }
  return res.json(found)
})

// POST /api/challenges
router.post('/', (req, res) => {
  const { title, description, domain, trl_stage, focus_areas, target_disciplines } = req.body || {}
  const newChallenge = {
    id: randomUUID(),
    title: title || 'Civic Innovation Challenge',
    description: description || '',
    domain: domain || 'WATER & SANITATION',
    trl_stage: trl_stage || 1,
    status: 'OPEN',
    focus_areas: focus_areas || [],
    target_disciplines: target_disciplines || [],
    created_by: req.user?.id || 'faculty-user',
    created_at: new Date().toISOString()
  }

  store.challenges.unshift(newChallenge)
  return res.status(201).json({
    success: true,
    challenge: newChallenge
  })
})

// PUT /api/challenges/:id
router.put('/:id', (req, res) => {
  const found = store.challenges.find(c => c.id === req.params.id)
  if (!found) {
    return res.status(404).json({ error: 'Challenge not found' })
  }
  Object.assign(found, req.body, { updated_at: new Date().toISOString() })
  return res.json({
    success: true,
    challenge: found
  })
})

export default router
