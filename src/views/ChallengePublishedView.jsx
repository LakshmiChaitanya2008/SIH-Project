import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { publishChallenge } from '../features/app/appSlice'
import { api } from '../lib/api'

export default function ChallengePublishedView() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const activeChallengeDraft = useSelector((state) => state.app.activeChallengeDraft)
  const activePattern = useSelector((state) => state.app.activeValidationPattern)

  const draft = activeChallengeDraft || activePattern || {}

  const [title, setTitle] = useState(
    draft.title ? `${draft.title}: Student Innovation Challenge` : 'Water Quality & Public Health Challenge for Gumla'
  )
  const [challengeStatement, setChallengeStatement] = useState(
    draft.problemStatement ||
    draft.description ||
    'Design a low-cost, scalable water purification prototype capable of filtering contaminants using locally available materials.'
  )
  const [expectedOutcome, setExpectedOutcome] = useState(
    draft.objectives ||
    'Develop an affordable, scalable technology prototype suitable for rural community deployment across Jharkhand hamlets.'
  )
  const [deadline, setDeadline] = useState('2026-10-15')
  const [teamSize, setTeamSize] = useState('3 – 5 Students')
  const [trlStage, setTrlStage] = useState(1)
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState(null)

  const context = `Derived from validated community observations in ${
    (draft.locations || ['Gumla']).join(', ')
  }: ${draft.description || 'Verified civic signals indicate recurring infrastructure/health concerns.'}`

  const handlePublish = async () => {
    setPublishing(true)
    setError(null)
    try {
      const payload = {
        cluster_id: draft.id || null,
        title: title.trim(),
        description: challengeStatement.trim(),
        problem_statement: challengeStatement.trim(),
        domain: draft.primaryDomain || draft.primary_domain || 'WATER QUALITY & SANITATION',
        target_locations: draft.locations || 'Gumla, Jharkhand',
        trl_stage: trlStage,
        status: 'OPEN',
      }

      const res = await api.createChallenge(payload)
      const createdChallenge = res.challenge

      dispatch(publishChallenge(createdChallenge))
      navigate('/challenges')
    } catch (err) {
      console.error('[Publish Challenge Error]:', err)
      setError(`Failed to publish challenge: ${err.message}`)
    } finally {
      setPublishing(false)
    }
  }

  return (
    <main className="flex-grow pt-8 pb-20 px-6 md:px-margin-desktop max-w-[1240px] mx-auto w-full space-y-8">
      {/* Back Navigation */}
      <div>
        <button
          type="button"
          onClick={() => navigate('/challenge/formation')}
          className="inline-flex items-center gap-1.5 text-brand-indigo hover:text-brand-violet font-label-md text-xs font-bold transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span> Back to Mentor Assignment
        </button>
      </div>

      {/* Header */}
      <div className="space-y-2 border-b border-outline-variant/60 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-brand-violet uppercase tracking-widest bg-brand-violet/10 border border-brand-violet/20 px-3 py-1 rounded-full">
              CREATE STUDENT CHALLENGE
            </span>
            <span className="text-xs text-on-surface-variant font-semibold">
              • Mentor: {draft.mentor || 'Dr. Anjali Kumar'}
            </span>
          </div>
          <h1 className="font-display-lg text-brand-indigo text-3xl sm:text-4xl font-extrabold tracking-tight">
            Publish Student Innovation Challenge
          </h1>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-violet/10 border border-brand-violet/20 text-brand-violet text-xs font-bold shrink-0">
          Ready for Publication
        </div>
      </div>

      {error && (
        <div className="p-4 bg-error-container text-on-error-container text-xs rounded-2xl border border-error/20 flex items-center gap-2">
          <span className="material-symbols-outlined text-lg text-error">error</span>
          <span>{error}</span>
        </div>
      )}

      {/* FORM & PREVIEW (8 COLS / 4 COLS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT FORM (8 COLS) */}
        <div className="lg:col-span-8 space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-outline-variant/70 shadow-2xs">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="font-bold text-brand-indigo text-xs block">Challenge Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 bg-white rounded-xl border border-outline-variant/70 text-xs font-bold text-brand-indigo focus:outline-none focus:border-brand-violet"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-brand-indigo text-xs block">Community Problem Context (Auto-derived)</label>
              <textarea
                rows="2"
                readOnly
                className="w-full p-3 bg-surface-container-low rounded-xl border border-outline-variant/40 text-xs text-on-surface-variant leading-relaxed"
                value={context}
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-brand-indigo text-xs block">
                Challenge Statement (What should student engineering teams solve?)
              </label>
              <textarea
                rows="3"
                value={challengeStatement}
                onChange={(e) => setChallengeStatement(e.target.value)}
                className="w-full p-3 bg-white rounded-xl border border-outline-variant/70 text-xs text-brand-indigo focus:outline-none focus:border-brand-violet"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-brand-indigo text-xs block">Expected Deliverable & Outcome</label>
              <textarea
                rows="2"
                value={expectedOutcome}
                onChange={(e) => setExpectedOutcome(e.target.value)}
                className="w-full p-3 bg-white rounded-xl border border-outline-variant/70 text-xs text-brand-indigo focus:outline-none focus:border-brand-violet"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
              <div className="space-y-1">
                <label className="font-bold text-brand-indigo block">Initial TRL Stage</label>
                <select
                  value={trlStage}
                  onChange={(e) => setTrlStage(parseInt(e.target.value, 10))}
                  className="w-full p-2.5 bg-white rounded-xl border border-outline-variant/70 text-xs font-semibold text-brand-indigo"
                >
                  <option value={1}>TRL 1 — Basic Principles</option>
                  <option value={2}>TRL 2 — Concept Formulated</option>
                  <option value={3}>TRL 3 — Proof of Concept</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-brand-indigo block">Target Team Size</label>
                <input
                  type="text"
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                  className="w-full p-2.5 bg-white rounded-xl border border-outline-variant/70 text-xs font-semibold text-brand-indigo"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-brand-indigo block">Proposal Deadline</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full p-2 bg-white rounded-xl border border-outline-variant/70 text-xs font-semibold text-brand-indigo"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SUMMARY & PUBLISH (4 COLS) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-outline-variant/70 shadow-2xs space-y-4">
            <h3 className="font-headline-sm text-brand-indigo text-sm font-bold uppercase tracking-wider border-b border-outline-variant/40 pb-2">
              PUBLISH TO STUDENTS
            </h3>

            <p className="text-xs text-on-surface-variant leading-relaxed">
              Publishing registers this Innovation Challenge in the authoritative public challenges directory. Student teams across universities can discover and submit proposals.
            </p>

            <button
              type="button"
              onClick={handlePublish}
              disabled={publishing}
              className="w-full bg-brand-indigo text-white px-6 py-3.5 rounded-full font-label-md text-xs font-bold hover:bg-brand-violet transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:scale-[1.01]"
            >
              {publishing ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
                  <span>Publishing Challenge...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">campaign</span>
                  <span>PUBLISH CHALLENGE</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
