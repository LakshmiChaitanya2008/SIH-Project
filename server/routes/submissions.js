import { Router } from 'express'
import { randomUUID } from 'crypto'
import { store } from '../db/store.js'
import { getSupabase } from '../db/supabase.js'
import { understandCivicIssue, generateEmbedding } from '../services/aiService.js'

const router = Router()

// GET /api/submissions
router.get('/', async (req, res) => {
  const { id, ref_id, status, district } = req.query
  const sb = getSupabase()

  if (sb) {
    try {
      let q = sb.from('problem_submissions').select(`
        id, original_text, original_language, audio_url, submission_channel, status, created_at,
        districts (name, state),
        problem_ai_analysis (domain, severity_score, severity_explanation, ai_model_version)
      `).order('created_at', { ascending: false }).limit(100)

      if (id) q = q.eq('id', id)
      if (status) q = q.eq('status', status)
      const { data, error } = await q
      if (!error && data && data.length > 0) {
        const mapped = data.map(sub => ({
          id: sub.id,
          ref_id: `SS-${sub.id.slice(0, 8).toUpperCase()}`,
          raw_text: sub.original_text,
          language: sub.original_language,
          audio_url: sub.audio_url,
          submission_channel: sub.submission_channel,
          status: sub.status,
          created_at: sub.created_at,
          district: sub.districts?.name || 'Gumla',
          state: sub.districts?.state || 'Jharkhand',
          primary_domain: sub.problem_ai_analysis?.domain || 'OTHER',
          severity_score: sub.problem_ai_analysis?.severity_score || 5.0,
          ai_summary: sub.problem_ai_analysis?.severity_explanation || sub.original_text,
          ai_model: sub.problem_ai_analysis?.ai_model_version || 'unknown'
        }))
        return res.json({ submissions: mapped })
      }
    } catch (e) {}
  }

  // Fallback to in-memory store
  let result = [...store.submissions]
  if (id) {
    const match = id.trim().toLowerCase().replace(/^ss-/i, '')
    result = result.filter(s => s.id.toLowerCase().includes(match) || s.ref_id.toLowerCase().includes(match))
  }
  if (ref_id) {
    result = result.filter(s => s.ref_id.toLowerCase().includes(ref_id.toLowerCase()))
  }
  if (status) {
    result = result.filter(s => s.status.toUpperCase() === status.toUpperCase())
  }
  if (district) {
    result = result.filter(s => (s.district || '').toLowerCase() === district.toLowerCase())
  }

  return res.json({ submissions: result })
})

// GET /api/submissions/:id
router.get('/:id', async (req, res) => {
  const target = req.params.id.trim().toLowerCase().replace(/^ss-/i, '')
  const found = store.submissions.find(s => s.id.toLowerCase().includes(target) || s.ref_id.toLowerCase().includes(target))
  if (!found) {
    return res.status(404).json({ error: 'Submission not found' })
  }
  return res.json(found)
})

// POST /api/submissions
router.post('/', async (req, res) => {
  const {
    method = 'text',
    raw_text,
    transcription,
    voice_audio_url,
    location_label,
    district = 'Gumla',
    state = 'Jharkhand',
    latitude,
    longitude,
    language = 'hi'
  } = req.body || {}

  const complaintText = (transcription || raw_text || '').trim()
  if (!complaintText || complaintText.length < 3) {
    return res.status(400).json({ error: 'Complaint text (min 3 characters) is required' })
  }

  const id = randomUUID()
  const ref_id = `SS-${id.slice(0, 8).toUpperCase()}`
  const effectiveLoc = location_label || `${district} District, ${state}`

  // 1. Run AI analysis
  const aiResult = await understandCivicIssue(complaintText, effectiveLoc)
  const embedding = await generateEmbedding(`${aiResult.primaryDomain}: ${aiResult.issueSummary}`)

  const newSub = {
    id,
    ref_id,
    raw_text: complaintText,
    transcription: transcription || null,
    voice_audio_url: voice_audio_url || null,
    language,
    submission_channel: method.toLowerCase() === 'voice' ? 'VOICE_CALL' : 'WEB',
    status: 'SUBMITTED',
    district,
    state,
    latitude: latitude ? parseFloat(latitude) : null,
    longitude: longitude ? parseFloat(longitude) : null,
    primary_domain: aiResult.primaryDomain,
    related_domains: aiResult.relatedDomains,
    ai_summary: aiResult.issueSummary,
    affected_groups: aiResult.affectedGroups,
    possible_impacts: aiResult.possibleImpacts,
    severity: aiResult.severity,
    severity_score: aiResult.severityScore || 6.0,
    ai_provider: aiResult.ai_provider,
    ai_model: aiResult.ai_model,
    has_embedding: true,
    created_at: new Date().toISOString()
  }

  // Persist in store
  store.submissions.unshift(newSub)

  // Persist to Supabase if connected
  const sb = getSupabase()
  if (sb) {
    try {
      await sb.from('problem_submissions').insert({
        id: newSub.id,
        original_text: newSub.raw_text,
        original_language: newSub.language,
        audio_url: newSub.voice_audio_url,
        submission_channel: newSub.submission_channel,
        status: 'SUBMITTED'
      })
      await sb.from('problem_ai_analysis').insert({
        id: randomUUID(),
        submission_id: newSub.id,
        domain: newSub.primary_domain,
        severity_score: newSub.severity_score,
        severity_explanation: newSub.ai_summary,
        ai_model_version: `${newSub.ai_provider}:${newSub.ai_model}`
      })
    } catch (e) {}
  }

  return res.status(201).json({
    success: true,
    submission: newSub
  })
})

// PUT /api/submissions/:id/confirm
router.put('/:id/confirm', async (req, res) => {
  const targetId = req.params.id.trim().toLowerCase().replace(/^ss-/i, '')
  const { confirmed_domain, confirmed_impacts = [], confirmed_groups = [], confirmed_location, has_corrections } = req.body || {}

  const sub = store.submissions.find(s => s.id.toLowerCase().includes(targetId) || s.ref_id.toLowerCase().includes(targetId))
  if (sub) {
    sub.status = 'VERIFIED'
    if (confirmed_domain) sub.primary_domain = confirmed_domain
    if (confirmed_impacts.length) sub.possible_impacts = confirmed_impacts
    if (confirmed_groups.length) sub.affected_groups = confirmed_groups
    if (confirmed_location) sub.location_label = confirmed_location
    sub.confirmed_by_citizen = true
    sub.updated_at = new Date().toISOString()
  }

  const sb = getSupabase()
  if (sb && sub) {
    try {
      await sb.from('problem_submissions').update({ status: 'VERIFIED' }).eq('id', sub.id)
    } catch (e) {}
  }

  return res.json({
    success: true,
    submission: sub || { id: req.params.id, status: 'VERIFIED' }
  })
})

// GET /api/submissions/:id/similar
router.get('/:id/similar', (req, res) => {
  const targetId = req.params.id.trim().toLowerCase().replace(/^ss-/i, '')
  const target = store.submissions.find(s => s.id.toLowerCase().includes(targetId) || s.ref_id.toLowerCase().includes(targetId))
  const others = store.submissions.filter(s => !target || s.id !== target.id)
  return res.json({
    similar: others.slice(0, 3).map(s => ({ ...s, similarity: 0.88 }))
  })
})

export default router
