import { Router } from 'express'
import { randomUUID } from 'crypto'
import { store } from '../db/store.js'

const router = Router()

// GET /api/projects
router.get('/', (req, res) => {
  const { id, status } = req.query
  let result = [...store.projects]

  if (id) {
    result = result.filter(p => p.id === id)
  }
  if (status && status !== 'ALL') {
    result = result.filter(p => (p.status || '').toUpperCase() === status.toUpperCase())
  }

  return res.json({
    success: true,
    projects: result
  })
})

// GET /api/projects/:id
router.get('/:id', (req, res) => {
  const found = store.projects.find(p => p.id === req.params.id)
  if (!found) {
    return res.status(404).json({ error: 'Project not found' })
  }
  return res.json(found)
})

// POST /api/projects
router.post('/', (req, res) => {
  const { challenge_id, team_id, challenge_title, team_name } = req.body || {}
  const newProject = {
    id: randomUUID(),
    challenge_id,
    challenge_title: challenge_title || 'Civic Challenge',
    team_id,
    team_name: team_name || 'Innovation Team',
    status: 'ACTIVE',
    trl_stage: 2,
    stage_label: 'LAB VALIDATION',
    progress_percent: 0,
    milestones_count: 0,
    completed_milestones_count: 0,
    milestones: [],
    created_at: new Date().toISOString()
  }

  store.projects.unshift(newProject)
  return res.status(201).json({
    success: true,
    project: newProject
  })
})

// PUT /api/projects/:id
router.put('/:id', (req, res) => {
  const found = store.projects.find(p => p.id === req.params.id)
  if (!found) {
    return res.status(404).json({ error: 'Project not found' })
  }
  Object.assign(found, req.body, { updated_at: new Date().toISOString() })
  return res.json({
    success: true,
    project: found
  })
})

// PUT /api/projects/milestone/:id & PUT /api/milestones/:id
router.put('/milestone/:id', updateMilestoneHandler)

export function updateMilestoneHandler(req, res) {
  const milestoneId = req.params.id
  const { status = 'COMPLETED', evidence_url } = req.body || {}
  const upperStatus = status.toUpperCase()

  let updatedMilestone = null
  let parentProject = null

  for (const proj of store.projects) {
    const m = (proj.milestones || []).find(item => item.id === milestoneId)
    if (m) {
      m.status = upperStatus
      if (evidence_url) m.evidence_url = evidence_url
      updatedMilestone = m
      parentProject = proj

      // Auto-calculate project progress
      const all = proj.milestones || []
      const done = all.filter(x => x.status === 'COMPLETED' || x.status === 'PASSED').length
      proj.completed_milestones_count = done
      proj.progress_percent = all.length > 0 ? Math.round((done / all.length) * 100) : 0
      if (done === all.length) {
        proj.status = 'COMPLETED'
        proj.stage_label = 'FIELD PROVEN'
      }
      break
    }
  }

  if (!updatedMilestone) {
    return res.status(404).json({ error: 'Milestone not found' })
  }

  return res.json({
    success: true,
    milestone: updatedMilestone,
    project: parentProject
  })
}

export default router
