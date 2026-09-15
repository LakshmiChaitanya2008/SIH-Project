import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useSelector } from 'react-redux'
import { api } from '../lib/api'
import { useAuth } from '../lib/auth'

export default function ProposalDetailView() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useAuth()
  const currentRole = useSelector((state) => state.app.currentRole)

  const [proposal, setProposal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reviewing, setReviewing] = useState(false)
  const [error, setError] = useState(null)
  const [feedback, setFeedback] = useState('')

  // 50-Point Rubric State (Defaults: 14 + 14 + 9 + 9 = 46/50)
  const [scoreFeas, setScoreFeas] = useState(14)
  const [scoreImpact, setScoreImpact] = useState(14)
  const [scoreInno, setScoreInno] = useState(9)
  const [scoreTeam, setScoreTeam] = useState(9)

  const totalScore = Number(scoreFeas) + Number(scoreImpact) + Number(scoreInno) + Number(scoreTeam)
  const isReviewer = ['mentor', 'admin', 'university_faculty', 'government_officer'].includes(currentRole?.toLowerCase())

  const loadProposal = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.getProposal(id)
      const prop = res?.proposals?.[0]
      if (prop) {
        setProposal(prop)
        if (prop.decision_reason) {
          setFeedback(prop.decision_reason)
        }
        if (prop.rubric) {
          setScoreFeas(prop.rubric.score_feasibility || 14)
          setScoreImpact(prop.rubric.score_impact || 14)
          setScoreInno(prop.rubric.score_innovation || 9)
          setScoreTeam(prop.rubric.score_team || 9)
        }
      } else {
        setError(`Proposal ${id} not found.`)
      }
    } catch (err) {
      console.warn('[Proposal Detail Error]:', err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) loadProposal()
  }, [id])

  const handleReviewDecision = async (decision) => {
    setReviewing(true)
    setError(null)
    try {
      await api.reviewProposal(id, {
        decision,
        decision_reason: feedback.trim() || `Evaluated as ${decision} with ${totalScore}/50 score by university mentor.`,
        reviewer_id: user?.id,
        score_feasibility: scoreFeas,
        score_impact: scoreImpact,
        score_innovation: scoreInno,
        score_team: scoreTeam,
      })
      if (decision === 'APPROVED') {
        try {
          await api.createProject({
            challenge_id: proposal?.challenge_id || 'ch-water-gumla',
            challenge_title: proposal?.challenge_title || proposal?.title || 'Drinking Water Quality & Heavy Metal Filtration',
            team_id: proposal?.team_id || 'team-aquasense',
            team_name: proposal?.team_name || 'Team AquaSense',
            proposal_id: id,
            proposal_title: proposal?.title,
          })
        } catch (pErr) {
          console.warn('[Create Project Error]:', pErr.message)
        }
      }
      await loadProposal()
    } catch (err) {
      console.error('[Review Proposal Error]:', err)
      setError(`Failed to record decision: ${err.message}`)
    } finally {
      setReviewing(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-[#FAF8FF] via-white to-[#F6F3FB] text-on-surface">
      <main className="flex-grow pt-8 pb-20 px-6 md:px-margin-desktop max-w-[1240px] mx-auto w-full space-y-8">
        {/* Back Navigation */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/student/proposals')}
            className="inline-flex items-center gap-1.5 text-brand-indigo hover:text-brand-violet font-label-md text-xs font-bold transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span> Back to Proposals
          </button>

          {proposal?.status === 'Approved' && (
            <button
              type="button"
              onClick={() => navigate(`/project/${proposal.id}`)}
              className="bg-brand-indigo text-white px-5 py-2 rounded-full font-label-md text-xs font-bold hover:bg-brand-violet transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>Open Project Workspace</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          )}
        </div>

        {error && (
          <div className="p-4 bg-error-container text-on-error-container text-xs rounded-2xl border border-error/20 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-error">error</span>
            <span>{error}</span>
          </div>
        )}

        {loading && (
          <div className="bg-white p-12 rounded-3xl border border-outline-variant/70 text-center space-y-3">
            <span className="material-symbols-outlined animate-spin text-4xl text-brand-indigo">progress_activity</span>
            <p className="text-sm font-bold text-brand-indigo">Loading proposal details...</p>
          </div>
        )}

        {!loading && proposal && (
          <>
            {/* Header */}
            <div className="space-y-2 border-b border-outline-variant/60 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-brand-violet uppercase tracking-widest bg-brand-violet/10 border border-brand-violet/20 px-3 py-1 rounded-full">
                    PROPOSAL DOSSIER
                  </span>
                  <span className="text-xs text-on-surface-variant font-semibold">
                    • Team: <strong>{proposal.team_name}</strong>
                  </span>
                  <span className="text-xs font-mono text-on-surface-variant">
                    ID: {proposal.id.slice(0, 8).toUpperCase()}
                  </span>
                </div>

                <h1 className="font-display-lg text-brand-indigo text-3xl sm:text-4xl font-extrabold tracking-tight">
                  {proposal.title}
                </h1>
                <p className="text-xs sm:text-sm text-on-surface-variant">
                  Challenge: <strong className="text-brand-indigo">{proposal.challenge_title}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-bold border ${
                    proposal.status === 'Approved'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      : proposal.status === 'Revision Requested'
                      ? 'bg-amber-100 text-amber-800 border-amber-200'
                      : 'bg-brand-violet/10 text-brand-violet border-brand-violet/20'
                  }`}
                >
                  {proposal.status}
                </span>
                <span className="px-3 py-1.5 rounded-full bg-surface-container-low text-brand-indigo text-xs font-bold border border-outline-variant/40">
                  TRL {proposal.trl_stage} Prototype
                </span>
              </div>
            </div>

            {/* Content Grid (8 cols / 4 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                {/* Solution Summary */}
                <div className="bg-white p-6 rounded-3xl border border-outline-variant/70 shadow-2xs space-y-3">
                  <h2 className="font-headline-md text-brand-indigo text-lg font-bold uppercase tracking-wider">
                    Solution Concept
                  </h2>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">
                    {proposal.description}
                  </p>
                </div>

                {/* Technical Approach */}
                {proposal.technical_approach && (
                  <div className="bg-white p-6 rounded-3xl border border-outline-variant/70 shadow-2xs space-y-3">
                    <h2 className="font-headline-md text-brand-indigo text-lg font-bold uppercase tracking-wider">
                      Technical Architecture & Materials
                    </h2>
                    <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">
                      {proposal.technical_approach}
                    </p>
                  </div>
                )}

                {/* Expected Impact */}
                {proposal.expected_impact && (
                  <div className="bg-white p-6 rounded-3xl border border-outline-variant/70 shadow-2xs space-y-3">
                    <h2 className="font-headline-md text-brand-indigo text-lg font-bold uppercase tracking-wider">
                      Expected Community Impact
                    </h2>
                    <p className="text-xs sm:text-sm text-brand-indigo font-semibold leading-relaxed">
                      {proposal.expected_impact}
                    </p>
                  </div>
                )}

                {/* Scored Rubric Display (If evaluated) */}
                {proposal.rubric && (
                  <div className="bg-white p-6 rounded-3xl border border-outline-variant/70 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
                      <h2 className="font-headline-md text-brand-indigo text-base font-bold uppercase tracking-wider">
                        50-Point Institutional Rubric Scorecard
                      </h2>
                      <span className="text-base font-extrabold text-brand-indigo font-mono bg-brand-indigo/10 px-3 py-1 rounded-full">
                        {proposal.rubric.total_score} / 50
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40 text-center">
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase block">FEASIBILITY</span>
                        <span className="text-lg font-bold text-brand-indigo font-mono">{proposal.rubric.score_feasibility} / 15</span>
                      </div>
                      <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40 text-center">
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase block">IMPACT</span>
                        <span className="text-lg font-bold text-brand-indigo font-mono">{proposal.rubric.score_impact} / 15</span>
                      </div>
                      <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40 text-center">
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase block">INNOVATION</span>
                        <span className="text-lg font-bold text-brand-indigo font-mono">{proposal.rubric.score_innovation} / 10</span>
                      </div>
                      <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40 text-center">
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase block">TEAM</span>
                        <span className="text-lg font-bold text-brand-indigo font-mono">{proposal.rubric.score_team} / 10</span>
                      </div>
                    </div>

                    {proposal.decision_reason && (
                      <div className="p-3.5 bg-brand-indigo/5 rounded-xl border border-brand-indigo/20 space-y-1">
                        <span className="text-[10px] font-bold text-brand-violet uppercase tracking-wider block">
                          EVALUATION NOTES:
                        </span>
                        <p className="text-xs text-brand-indigo italic">
                          "{proposal.decision_reason}"
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column: Reviewer Action Panel or Student Tracking (4 cols) */}
              <div className="lg:col-span-4 space-y-6 sticky top-28">
                {isReviewer ? (
                  <div className="bg-white p-6 rounded-3xl border border-outline-variant/70 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between border-b border-outline-variant/40 pb-2">
                      <h3 className="font-headline-sm text-brand-indigo text-sm font-bold uppercase tracking-wider">
                        50-POINT EVALUATION RUBRIC
                      </h3>
                      <span className="font-mono text-xs font-bold text-brand-indigo">
                        {totalScore} / 50
                      </span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <div className="flex justify-between font-bold text-brand-indigo mb-1">
                          <span>1. Feasibility (Max 15)</span>
                          <span className="font-mono">{scoreFeas}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="15"
                          value={scoreFeas}
                          onChange={(e) => setScoreFeas(Number(e.target.value))}
                          className="w-full accent-brand-indigo cursor-pointer"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between font-bold text-brand-indigo mb-1">
                          <span>2. Community Impact (Max 15)</span>
                          <span className="font-mono">{scoreImpact}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="15"
                          value={scoreImpact}
                          onChange={(e) => setScoreImpact(Number(e.target.value))}
                          className="w-full accent-brand-indigo cursor-pointer"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between font-bold text-brand-indigo mb-1">
                          <span>3. Technical Innovation (Max 10)</span>
                          <span className="font-mono">{scoreInno}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          value={scoreInno}
                          onChange={(e) => setScoreInno(Number(e.target.value))}
                          className="w-full accent-brand-indigo cursor-pointer"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between font-bold text-brand-indigo mb-1">
                          <span>4. Team Readiness (Max 10)</span>
                          <span className="font-mono">{scoreTeam}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          value={scoreTeam}
                          onChange={(e) => setScoreTeam(Number(e.target.value))}
                          className="w-full accent-brand-indigo cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 pt-1">
                      <label className="text-xs font-bold text-brand-indigo block">Evaluator Feedback</label>
                      <textarea
                        rows="2"
                        placeholder="Enter lab assignment notes, prototype recommendations..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="w-full p-2.5 bg-white rounded-xl border border-outline-variant/70 text-xs text-brand-indigo focus:outline-none focus:border-brand-violet"
                      />
                    </div>

                    <div className="space-y-2 pt-2">
                      <button
                        type="button"
                        onClick={() => handleReviewDecision('APPROVED')}
                        disabled={reviewing}
                        className="w-full bg-emerald-700 text-white px-5 py-3 rounded-full font-label-md text-xs font-bold hover:bg-emerald-800 transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-base">check_circle</span>
                        <span>{reviewing ? 'Recording...' : `Approve (${totalScore}/50) & Launch Workspace`}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleReviewDecision('REVISION')}
                        disabled={reviewing}
                        className="w-full border border-amber-500 text-amber-800 hover:bg-amber-50 px-5 py-2.5 rounded-full font-label-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-base">replay</span>
                        <span>Request Revision</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleReviewDecision('REJECTED')}
                        disabled={reviewing}
                        className="w-full border border-red-300 text-red-700 hover:bg-red-50 px-5 py-2 rounded-full font-label-md text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                      >
                        Decline Proposal
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-6 rounded-3xl border border-outline-variant/70 shadow-2xs space-y-4">
                    <h3 className="font-headline-sm text-brand-indigo text-sm font-bold uppercase tracking-wider border-b border-outline-variant/40 pb-2">
                      PROPOSAL LIFECYCLE
                    </h3>

                    <div className="space-y-3 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-brand-teal text-base">check_circle</span>
                        <span>1. Proposal Submitted</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`material-symbols-outlined text-base ${
                            proposal.status === 'Approved' ? 'text-brand-teal' : 'text-amber-500 animate-pulse'
                          }`}
                        >
                          {proposal.status === 'Approved' ? 'check_circle' : 'pending'}
                        </span>
                        <span>2. 50-Point Institutional Rubric</span>
                      </div>
                      <div className="flex items-center gap-2 text-on-surface-variant">
                        <span
                          className={`material-symbols-outlined text-base ${
                            proposal.status === 'Approved' ? 'text-brand-indigo' : 'text-on-surface-variant/40'
                          }`}
                        >
                          {proposal.status === 'Approved' ? 'engineering' : 'radio_button_unchecked'}
                        </span>
                        <span>3. Active Prototype Engineering</span>
                      </div>
                    </div>

                    {proposal.status === 'Approved' && (
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => navigate(`/project/${proposal.id}`)}
                          className="w-full bg-brand-indigo text-white px-4 py-2.5 rounded-full font-label-md text-xs font-bold hover:bg-brand-violet transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <span>Open Project Workspace &rarr;</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
