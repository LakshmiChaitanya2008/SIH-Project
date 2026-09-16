import { Router } from 'express'
import { randomUUID } from 'crypto'
import { store } from '../db/store.js'

const router = Router()

// GET /api/teams
router.get('/', (req, res) => {
  const { id, challenge_id } = req.query
  let result = [...store.teams]

  if (id) {
    result = result.filter(t => t.id === id)
  }
  if (challenge_id) {
    result = result.filter(t => t.challenge_id === challenge_id)
  }

  return res.json({
    success: true,
    teams: result
  })
})

// GET /api/teams/:id
router.get('/:id', (req, res) => {
  const found = store.teams.find(t => t.id === req.params.id)
  if (!found) {
    return res.status(404).json({ error: 'Team not found' })
  }
  return res.json(found)
})

// POST /api/teams
router.post('/', (req, res) => {
  const { name, challenge_id, lead_user_id } = req.body || {}
  const teamId = randomUUID()
  const userId = lead_user_id || req.user?.id || '11111111-1111-1111-1111-111111111111'

  const newTeam = {
    id: teamId,
    name: name || 'Innovation Team',
    challenge_id,
    lead_user_id: userId,
    members_count: 1,
    members: [
      {
        id: randomUUID(),
        user_id: userId,
        email: req.user?.email || 'student@demo.ac.in',
        role: 'Team Lead'
      }
    ],
    created_at: new Date().toISOString()
  }

  store.teams.unshift(newTeam)
  return res.status(201).json({
    success: true,
    team: newTeam
  })
})

// POST /api/teams/:id/join
router.post('/:id/join', (req, res) => {
  const { user_id, role = 'Collaborator' } = req.body || {}
  const team = store.teams.find(t => t.id === req.params.id)
  if (!team) {
    return res.status(404).json({ error: 'Team not found' })
  }

  const member = {
    id: randomUUID(),
    user_id: user_id || req.user?.id || '11111111-1111-1111-1111-111111111111',
    email: req.user?.email || 'student@demo.ac.in',
    role
  }

  team.members.push(member)
  team.members_count = team.members.length

  return res.json({
    success: true,
    member
  })
})

export default router
