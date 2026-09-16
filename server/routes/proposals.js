import { Router } from 'express'
import { randomUUID } from 'crypto'
import { store } from '../db/store.js'

const router = Router()

// GET /api/proposals
router.get('/', (req, res) => {
  const { id, challenge_id } = req.query
  let result = [...store.proposals]

  if (id) {
    result = result.filter(p => p.id === id)
  }
  if (challenge_id) {
    result = result.filter(p => p.challenge_id === challenge_id)
  }

  return res.json({
    success: true,
    proposals: result
  })
})

// GET /api/proposals/:id
router.get('/:id', (req, res) => {
  const found = store.proposals.find(p => p.id === req.params.id)
  if (!found) {
    return res.status(404).json({ error: 'Proposal not found' })
  }
  return res.json(found)
})

// POST /api/proposals
router.post('/', (req, res) => {
  const { challenge_id, challenge_title, team_id, team_name, title, description, technical_approach, expected_impact, trl_stage } = req.body || {}

  const newProposal = {
    id: `prop-${Date.now()}`,
    challenge_id,
    challenge_title: challenge_title || 'Civic Innovation Challenge',
    challenge_status: 'OPEN',
    team_id: team_id || store.teams[0]?.id || 'team-1',
    team_name: team_name || store.teams[0]?.name || 'Innovation Team',
    title: title || 'Technical Solution Proposal',
    description: description || '',
    technical_approach: technical_approach || '',
    expected_impact: expected_impact || '',
    trl_stage: trl_stage || 1,
    status: 'Submitted',
    raw_status: 'PLANNING',
    decision: null,
    rubric: null,
    members_count: 2,
    created_at: new Date().toISOString()
  }

  store.proposals.unshift(newProposal)
  return res.status(201).json({
    success: true,
    proposal: newProposal
  })
})

// POST /api/proposals/:id/review
router.post('/:id/review', (req, res) => {
  const { decision = 'APPROVED', decision_reason, rubric } = req.body || {}
  const proposal = store.proposals.find(p => p.id === req.params.id)

  if (!proposal) {
    return res.status(404).json({ error: 'Proposal not found' })
  }

  proposal.decision = decision
  proposal.decision_reason = decision_reason || 'Evaluated and approved by Faculty Board.'
  proposal.rubric = rubric || {
    score_feasibility: 14,
    score_impact: 14,
    score_innovation: 9,
    score_team: 9,
    total_score: 46,
    max_score: 50
  }
  proposal.status = decision === 'APPROVED' ? 'Approved' : 'Rejected'
  proposal.raw_status = decision === 'APPROVED' ? 'ACTIVE' : 'REJECTED'

  // Business Rule: If APPROVED, transactionally spawn a Project!
  let spawnedProject = null
  if (decision === 'APPROVED') {
    spawnedProject = {
      id: randomUUID(),
      challenge_id: proposal.challenge_id,
      challenge_title: proposal.challenge_title,
      team_id: proposal.team_id,
      team_name: proposal.team_name,
      status: 'ACTIVE',
      trl_stage: 2,
      stage_label: 'LAB VALIDATION',
      progress_percent: 25,
      milestones_count: 4,
      completed_milestones_count: 1,
      milestones: [
        {
          id: randomUUID(),
          title: 'Phase 1: Field Research & Problem Specification',
          description: 'Survey community stakeholders and map baseline telemetry.',
          status: 'COMPLETED',
          due_date: new Date(Date.now() - 5 * 86400000).toISOString(),
        },
        {
          id: randomUUID(),
          title: 'Phase 2: MVP Prototype Design & Lab Assembly',
          description: 'Construct lab-scale filtration / telemetry assembly.',
          status: 'IN_PROGRESS',
          due_date: new Date(Date.now() + 20 * 86400000).toISOString(),
        },
        {
          id: randomUUID(),
          title: 'Phase 3: Field Pilot Testing in Rural Community',
          description: 'Deploy 45-day continuous testing on village node.',
          status: 'PENDING',
          due_date: new Date(Date.now() + 45 * 86400000).toISOString(),
        },
        {
          id: randomUUID(),
          title: 'Phase 4: Community Handover & Operational Verification',
          description: 'Complete handover to village panchayat with maintenance manual.',
          status: 'PENDING',
          due_date: new Date(Date.now() + 70 * 86400000).toISOString(),
        }
      ],
      created_at: new Date().toISOString()
    }
    store.projects.unshift(spawnedProject)
  }

  return res.json({
    success: true,
    proposal_id: proposal.id,
    decision,
    project: spawnedProject
  })
})

export default router
