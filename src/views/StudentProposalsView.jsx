import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { useSelector } from 'react-redux'
import { api } from '../lib/api'
import { useAuth } from '../lib/auth'

export default function StudentProposalsView() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const userProfile = useSelector((state) => state.app.userProfile)

  const passedChallenge = location.state?.challenge
  const reduxChallenges = useSelector((state) => state.app.challenges)
  const challenge = passedChallenge || reduxChallenges?.[0] || {
    id: null,
    title: 'Safe Water for Gumla Innovation Challenge',
  }

  const [proposals, setProposals] = useState([])
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [showSubmitModal, setShowSubmitModal] = useState(false)

  // Form State
  const [selectedTeamId, setSelectedTeamId] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [technicalApproach, setTechnicalApproach] = useState('')
  const [expectedImpact, setExpectedImpact] = useState('')
  const [trlStage, setTrlStage] = useState(1)

  const currentUserId = user?.id

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const q = challenge?.id ? `challenge_id=${challenge.id}` : ''
      const [propRes, teamRes] = await Promise.all([
        api.getProposals(q),
        api.getTeams(q),
      ])
      setProposals(propRes?.proposals || [])
      setTeams(teamRes?.teams || [])
      if (teamRes?.teams?.length > 0 && !selectedTeamId) {
        setSelectedTeamId(teamRes.teams[0].id)
      }
    } catch (err) {
      console.warn('[Load Proposals Error]:', err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [challenge?.id])

  const handleSubmitProposal = async (e) => {
    e.preventDefault()
    if (!selectedTeamId || !title.trim() || !description.trim()) {
      setError('Please fill in all required fields.')
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      const payload = {
        challenge_id: challenge.id,
        team_id: selectedTeamId,
        title: title.trim(),
        description: description.trim(),
        technical_approach: technicalApproach.trim(),
        expected_impact: expectedImpact.trim(),
        trl_stage: trlStage,
      }
      await api.createProposal(payload)
      setShowSubmitModal(false)
      setTitle('')
      setDescription('')
      setTechnicalApproach('')
      setExpectedImpact('')
      await loadData()
    } catch (err) {
      console.error('[Submit Proposal Error]:', err)
      setError(`Failed to submit proposal: ${err.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-[#FAF8FF] via-white to-[#F6F3FB] text-on-surface">
      <main className="flex-grow pt-8 pb-20 px-6 md:px-margin-desktop max-w-[1240px] mx-auto w-full space-y-8">
        {/* Back Navigation */}
        <div>
          <button
            type="button"
            onClick={() => navigate('/challenges')}
            className="inline-flex items-center gap-1.5 text-brand-indigo hover:text-brand-violet font-label-md text-xs font-bold transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span> Back to Published Challenges
          </button>
        </div>

        {/* Header */}
        <div className="space-y-2 border-b border-outline-variant/60 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-brand-violet uppercase tracking-widest bg-brand-violet/10 border border-brand-violet/20 px-3 py-1 rounded-full">
                INNOVATION PROPOSALS
              </span>
              <span className="text-xs text-on-surface-variant font-semibold">
                • {userProfile?.department || 'Ranchi University'}
              </span>
            </div>
            <h1 className="font-display-lg text-brand-indigo text-3xl sm:text-4xl font-extrabold tracking-tight">
              Submitted Innovation Proposals
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant">
              Challenge: <strong className="text-brand-indigo">{challenge?.title}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/student/team-formation', { state: { challenge } })}
              className="border border-brand-indigo text-brand-indigo px-4 py-2.5 rounded-full font-label-md text-xs font-bold hover:bg-brand-indigo/5 transition-all cursor-pointer"
            >
              Manage Teams
            </button>
            <button
              type="button"
              onClick={() => setShowSubmitModal(true)}
              className="bg-brand-indigo text-white px-5 py-2.5 rounded-full font-label-md text-xs font-bold hover:bg-brand-violet transition-all shrink-0 flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span className="material-symbols-outlined text-base">add</span>
              <span>Submit New Proposal</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-error-container text-on-error-container text-xs rounded-2xl border border-error/20 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-error">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="bg-white p-12 rounded-3xl border border-outline-variant/70 text-center space-y-3">
            <span className="material-symbols-outlined animate-spin text-4xl text-brand-indigo">progress_activity</span>
            <p className="text-sm font-bold text-brand-indigo">Loading submitted proposals...</p>
          </div>
        )}

        {/* Zero Data State */}
        {!loading && proposals.length === 0 && (
          <div className="bg-white p-12 sm:p-16 rounded-3xl border border-outline-variant/70 text-center space-y-4 shadow-2xs">
            <div className="w-16 h-16 rounded-full bg-surface-container-low text-brand-indigo flex items-center justify-center mx-auto border border-outline-variant/40">
              <span className="material-symbols-outlined text-3xl text-brand-violet">description</span>
            </div>

            <div className="space-y-1">
              <h3 className="font-headline-sm text-brand-indigo text-xl font-extrabold">
                No Proposals Submitted Yet
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
                Form a student team and submit your technical approach to begin developing a physical prototype.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(true)}
                className="bg-brand-indigo text-white px-6 py-2.5 rounded-full font-label-md text-xs font-bold hover:bg-brand-violet transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>+ Submit First Proposal</span>
              </button>
            </div>
          </div>
        )}

        {/* Proposals List */}
        {!loading && proposals.length > 0 && (
          <div className="space-y-4">
            {proposals.map((p) => {
              const statusStyle =
                p.status === 'Approved'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  : p.status === 'Revision Requested'
                  ? 'bg-amber-100 text-amber-800 border-amber-200'
                  : 'bg-brand-violet/10 text-brand-violet border-brand-violet/20'

              return (
                <div
                  key={p.id}
                  className="bg-white p-6 rounded-3xl border border-outline-variant/70 shadow-2xs hover:border-brand-violet transition-all space-y-4 cursor-pointer"
                  onClick={() => navigate(`/student/proposal/${p.id}`)}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusStyle}`}>
                        {p.status}
                      </span>
                      <span className="text-xs font-bold text-brand-indigo bg-surface-container-low px-2.5 py-0.5 rounded-full">
                        TRL {p.trl_stage} Target
                      </span>
                      <span className="text-xs font-mono text-on-surface-variant">
                        Team: <strong>{p.team_name}</strong>
                      </span>
                    </div>

                    <span className="text-xs font-mono text-on-surface-variant">
                      ID: {p.id.slice(0, 8).toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-headline-sm text-brand-indigo text-xl font-bold">
                      {p.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-on-surface-variant line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-outline-variant/40 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-4 text-on-surface-variant font-medium">
                      <span>👥 Team Members: <strong>{p.members_count || 3}</strong></span>
                      <span>•</span>
                      <span>📅 Submitted: {new Date(p.created_at).toLocaleDateString()}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/student/proposal/${p.id}`)
                      }}
                      className="bg-brand-indigo text-white px-5 py-2 rounded-full font-label-md text-xs font-bold hover:bg-brand-violet transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <span>View Dossier</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Submit Proposal Modal */}
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 bg-brand-indigo/30 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-outline-variant max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-outline-variant/40 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-brand-violet uppercase tracking-wider block">
                    NEW SUBMISSION
                  </span>
                  <h2 className="font-headline-md text-brand-indigo text-xl font-bold">
                    Submit Innovation Proposal
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="w-8 h-8 rounded-full bg-surface-container-low text-brand-indigo flex items-center justify-center hover:bg-brand-indigo hover:text-white transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>

              <form onSubmit={handleSubmitProposal} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-indigo block">Selecting Submitting Team *</label>
                  {teams.length > 0 ? (
                    <select
                      value={selectedTeamId}
                      onChange={(e) => setSelectedTeamId(e.target.value)}
                      className="w-full p-2.5 bg-white rounded-xl border border-outline-variant/70 text-xs font-semibold text-brand-indigo focus:outline-none"
                    >
                      {teams.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.members_count} members)
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-900 border border-amber-200">
                      No team found. Please{' '}
                      <button
                        type="button"
                        onClick={() => navigate('/student/team-formation', { state: { challenge } })}
                        className="font-bold underline"
                      >
                        create a team first &rarr;
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-indigo block">Solution Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Decentralized Bio-Char & Alumina Filtration System"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2.5 bg-white rounded-xl border border-outline-variant/70 text-xs font-semibold text-brand-indigo focus:outline-none focus:border-brand-violet"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-indigo block">Solution Concept & Summary *</label>
                  <textarea
                    rows="2"
                    required
                    placeholder="Explain what the solution does and how it addresses community observations..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2.5 bg-white rounded-xl border border-outline-variant/70 text-xs text-brand-indigo focus:outline-none focus:border-brand-violet"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-indigo block">Proposed Technical Approach *</label>
                  <textarea
                    rows="2"
                    required
                    placeholder="Describe filter materials, IoT telemetry, hardware components, or architecture..."
                    value={technicalApproach}
                    onChange={(e) => setTechnicalApproach(e.target.value)}
                    className="w-full p-2.5 bg-white rounded-xl border border-outline-variant/70 text-xs text-brand-indigo focus:outline-none focus:border-brand-violet"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-brand-indigo block">Expected Community Impact *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Purifies 500L/day for 50 households"
                      value={expectedImpact}
                      onChange={(e) => setExpectedImpact(e.target.value)}
                      className="w-full p-2.5 bg-white rounded-xl border border-outline-variant/70 text-xs text-brand-indigo focus:outline-none focus:border-brand-violet"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-brand-indigo block">Target TRL Stage</label>
                    <select
                      value={trlStage}
                      onChange={(e) => setTrlStage(parseInt(e.target.value, 10))}
                      className="w-full p-2.5 bg-white rounded-xl border border-outline-variant/70 text-xs font-semibold text-brand-indigo focus:outline-none"
                    >
                      <option value={1}>TRL 1 — Basic Principles</option>
                      <option value={2}>TRL 2 — Technology Concept</option>
                      <option value={3}>TRL 3 — Proof-of-Concept Lab Model</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="px-5 py-2.5 rounded-full border border-outline-variant text-xs font-bold text-brand-indigo hover:bg-surface-container-low"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !selectedTeamId || !title.trim()}
                    className="bg-brand-indigo text-white px-6 py-2.5 rounded-full font-label-md text-xs font-bold hover:bg-brand-violet transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit Proposal to University'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
