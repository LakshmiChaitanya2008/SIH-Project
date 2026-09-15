import { createServiceClient } from '../lib/supabase.js'

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,PATCH,OPTIONS')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  const supabase = createServiceClient()

  // --- GET: List or Retrieve Projects ---
  if (req.method === 'GET') {
    try {
      const { id, challenge_id, team_id, status } = req.query || {}

      let query = supabase
        .from('projects')
        .select(`
          id,
          challenge_id,
          team_id,
          mentor_id,
          status,
          trl_stage,
          start_date,
          created_at,
          updated_at,
          challenges (
            id,
            title,
            description,
            trl_stage,
            status
          ),
          teams (
            id,
            name,
            lead_user_id,
            team_members (
              id,
              user_id,
              role,
              users (
                email,
                role
              )
            )
          ),
          milestones (
            id,
            title,
            description,
            status,
            due_date,
            evidence_url,
            reviewed_at,
            created_at
          ),
          trl_gates (
            id,
            from_stage,
            to_stage,
            criteria,
            status,
            decision,
            decision_reason,
            decided_at
          )
        `)
        .order('created_at', { ascending: false })

      if (id) {
        query = query.eq('id', id)
      }
      if (challenge_id) {
        query = query.eq('challenge_id', challenge_id)
      }
      if (team_id) {
        query = query.eq('team_id', team_id)
      }
      if (status) {
        query = query.eq('status', status.toUpperCase())
      }

      const { data: projects, error } = await query

      if (error) {
        console.error('[API Projects GET Error]:', error)
        res.status(500).json({ error: error.message })
        return
      }

      // Format projects with dynamic progress calculations and rubric
      const formatted = (projects || []).map((proj) => {
        const milestones = (proj.milestones || []).sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
        const totalMilestones = milestones.length
        const completedMilestones = milestones.filter(
          (m) => m.status === 'COMPLETED' || m.status === 'PASSED'
        ).length

        const progressPercent = totalMilestones > 0
          ? Math.round((completedMilestones / totalMilestones) * 100)
          : proj.status === 'COMPLETED'
          ? 100
          : proj.status === 'ACTIVE'
          ? 25
          : 0

        const gate = Array.isArray(proj.trl_gates) ? proj.trl_gates[0] : proj.trl_gates
        const rubric = gate?.criteria?.rubric || null
        const members = (proj.teams?.team_members || []).map((tm) => ({
          user_id: tm.user_id,
          email: tm.users?.email || 'student@demo.ac.in',
          role: tm.role,
        }))

        return {
          id: proj.id,
          challenge_id: proj.challenge_id,
          challenge_title: proj.challenges?.title || 'Civic Innovation Challenge',
          challenge_description: proj.challenges?.description || '',
          team_id: proj.team_id,
          team_name: proj.teams?.name || 'Innovation Team',
          lead_user_id: proj.teams?.lead_user_id,
          members,
          members_count: members.length,
          mentor_id: proj.mentor_id,
          mentor_name: 'Dr. Anjali Kumar (Faculty Mentor)',
          status: proj.status,
          trl_stage: proj.trl_stage,
          start_date: proj.start_date,
          created_at: proj.created_at,
          updated_at: proj.updated_at,
          milestones,
          milestones_count: totalMilestones,
          completed_milestones_count: completedMilestones,
          progress_percent: progressPercent,
          rubric,
          evaluator_feedback: gate?.decision_reason || null,
          decision: gate?.decision || 'PENDING',
        }
      })

      res.status(200).json({ success: true, projects: formatted })
      return
    } catch (err) {
      console.error('[API Projects GET Exception]:', err)
      res.status(500).json({ error: err.message || 'Internal Server Error' })
      return
    }
  }

  // --- PATCH: Update Project Status ---
  if (req.method === 'PATCH') {
    try {
      const { id, status, mentor_id } = req.body || {}

      if (!id) {
        res.status(400).json({ error: 'Project ID is required' })
        return
      }

      const updates = {
        updated_at: new Date().toISOString(),
      }
      if (status) updates.status = status.toUpperCase()
      if (mentor_id) updates.mentor_id = mentor_id

      const { data: updated, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('[API Projects PATCH Error]:', error)
        res.status(500).json({ error: error.message })
        return
      }

      // If completed, update challenge status
      if (updates.status === 'COMPLETED' && updated.challenge_id) {
        await supabase
          .from('challenges')
          .update({
            status: 'CLOSED',
            updated_at: new Date().toISOString(),
          })
          .eq('id', updated.challenge_id)
      }

      res.status(200).json({ success: true, project: updated })
      return
    } catch (err) {
      console.error('[API Projects PATCH Exception]:', err)
      res.status(500).json({ error: err.message || 'Internal Server Error' })
      return
    }
  }

  res.status(405).json({ error: `Method ${req.method} not allowed` })
}
