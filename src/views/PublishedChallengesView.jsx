import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { api } from '../lib/api'

export default function PublishedChallengesView() {
  const navigate = useNavigate()
  const reduxChallenges = useSelector((state) => state.app.challenges) || []

  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterDomain, setFilterDomain] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedChallenge, setSelectedChallenge] = useState(null)

  const [acceptedIds, setAcceptedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('samadhan_accepted_challenges')
      return saved ? JSON.parse(saved) : ['ch-water-gumla']
    } catch (err) {
      return ['ch-water-gumla']
    }
  })

  const [acceptToast, setAcceptToast] = useState(null)

  const handleAcceptChallenge = (ch) => {
    const updated = Array.from(new Set([...acceptedIds, ch.id]))
    setAcceptedIds(updated)
    try {
      localStorage.setItem('samadhan_accepted_challenges', JSON.stringify(updated))
    } catch (err) {
      console.warn('[Accept Challenge] Local storage error:', err)
    }
    setAcceptToast(`Ranchi University successfully accepted challenge "${ch.title}"! Assigned to Dr. Anjali Kumar.`)
    setTimeout(() => setAcceptToast(null), 4000)
  }

  return (
    <main className="flex-grow pt-8 pb-20 px-6 md:px-margin-desktop max-w-[1240px] mx-auto w-full space-y-8">
      {/* Toast Notification */}
      {acceptToast && (
        <div className="fixed top-20 right-6 z-50 bg-brand-indigo text-white p-4 rounded-2xl shadow-xl border border-brand-violet/40 flex items-center gap-3 animate-fade-in-up">
          <span className="material-symbols-outlined text-emerald-400 text-2xl">check_circle</span>
          <div className="space-y-0.5 text-xs">
            <p className="font-bold text-white">Institutional Acceptance Recorded</p>
            <p className="text-on-surface-variant text-slate-200">{acceptToast}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="space-y-2 border-b border-outline-variant/60 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-brand-teal uppercase tracking-widest bg-brand-teal/10 border border-brand-teal/20 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-brand-teal animate-node-glow" />
              INNOVATION CHALLENGE REGISTRY
            </span>
            <span className="text-xs text-on-surface-variant font-semibold">• Ranchi University Innovation Hub</span>
          </div>
          <h1 className="font-display-lg text-brand-indigo text-3xl sm:text-4xl font-extrabold tracking-tight">
            Active <span className="text-gradient-shimmer">Innovation Challenges</span>
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed max-w-2xl">
            Validated civic challenges derived directly from recurring citizen observations across Jharkhand. Form student engineering teams and build physical or digital prototypes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/validation/queue')}
          className="bg-brand-indigo text-white px-5 py-2.5 rounded-full font-label-md text-xs font-bold hover:bg-brand-violet transition-all shrink-0 flex items-center gap-1.5 cursor-pointer shadow-md hover:-translate-y-0.5"
        >
          <span className="material-symbols-outlined text-base">verified</span>
          <span>Mentor Validation Queue</span>
        </button>
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-2xl border border-outline-variant/60 shadow-2xs">
        <div className="relative w-full sm:flex-1">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-base">
            search
          </span>
          <input
            type="text"
            placeholder="Search challenges by keyword, domain, or district..."
            className="w-full pl-9 pr-4 py-2 bg-[#FAFAF8] rounded-xl border border-outline-variant/60 text-xs text-brand-indigo focus:outline-none focus:border-brand-violet transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Domain Quick Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto py-1">
          {[
            { id: 'ALL', label: 'All Domains' },
            { id: 'WATER', label: 'Water & Sanitation' },
            { id: 'AGRICULTURE', label: 'Agriculture' },
            { id: 'INFRASTRUCTURE', label: 'Infrastructure' },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setFilterDomain(pill.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                filterDomain === pill.id
                  ? 'bg-brand-violet text-white shadow-2xs'
                  : 'bg-[#FAFAF8] text-on-surface-variant border border-outline-variant/50 hover:bg-surface-container-low hover:text-brand-indigo'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-error-container text-on-error-container text-xs rounded-2xl border border-error/20 flex items-center gap-2">
          <span className="material-symbols-outlined text-lg text-error">error</span>
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="bg-white p-12 rounded-3xl border border-outline-variant/70 text-center space-y-3 shadow-2xs">
          <span className="material-symbols-outlined animate-spin text-4xl text-brand-indigo">progress_activity</span>
          <p className="text-sm font-bold text-brand-indigo">Loading published challenges from database...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <div className="bg-white p-12 sm:p-16 rounded-3xl border border-outline-variant/70 text-center space-y-4 shadow-2xs">
          <div className="w-16 h-16 rounded-full bg-surface-container-low text-brand-indigo flex items-center justify-center mx-auto border border-outline-variant/40">
            <span className="material-symbols-outlined text-3xl text-brand-violet">lightbulb</span>
          </div>

          <div className="space-y-1">
            <h3 className="font-headline-sm text-brand-indigo text-xl font-extrabold">
              No Published Challenges Found
            </h3>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
              When university mentors validate emerging community problem patterns, they publish innovation challenges here for student engineering teams.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              className="bg-brand-indigo text-white px-6 py-2.5 rounded-full font-label-md text-xs font-bold hover:bg-brand-violet transition-all cursor-pointer inline-flex items-center gap-2 shadow-2xs"
              onClick={() => navigate('/validation/queue')}
            >
              <span>Go to Validation Queue &rarr;</span>
            </button>
          </div>
        </div>
      )}

      {/* Challenges List */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((ch, idx) => {
            const isAccepted = acceptedIds.includes(ch.id)
            const matchScore = ch.domain?.includes('WATER') ? 94 : ch.domain?.includes('AGRICUL') ? 91 : 88

            return (
              <div
                key={ch.id}
                className={`animate-fade-in-up stagger-${(idx % 6) + 1} bg-white p-6 sm:p-7 rounded-3xl border ${
                  isAccepted ? 'border-brand-violet ring-2 ring-brand-violet/20' : 'border-outline-variant/70'
                } shadow-2xs hover:border-brand-violet/70 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4 group cursor-pointer relative overflow-hidden`}
                onClick={() => setSelectedChallenge(ch)}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-brand-violet/10 text-brand-violet flex items-center justify-center font-bold text-xs shrink-0">
                        <span className="material-symbols-outlined text-lg">{getDomainIcon(ch.domain)}</span>
                      </div>
                      <span className="text-[10px] font-bold text-brand-teal uppercase tracking-widest bg-brand-teal/10 border border-brand-teal/20 px-3 py-1 rounded-full">
                        {ch.status || 'Open'}
                      </span>
                      {isAccepted && (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">check_circle</span>
                          ACCEPTED BY RU
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-brand-violet bg-brand-violet/10 px-2.5 py-0.5 rounded-full border border-brand-violet/20">
                        TRL {ch.trl_stage || 1} Prototype
                      </span>
                      <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                        {matchScore}% Match
                      </span>
                    </div>
                  </div>

                  <h3 className="font-headline-sm text-brand-indigo text-lg sm:text-xl font-bold leading-snug group-hover:text-brand-violet transition-colors">
                    {ch.title}
                  </h3>

                  <p className="text-xs text-on-surface-variant line-clamp-3 leading-relaxed">
                    {ch.challengeStatement || ch.description}
                  </p>

                  <div className="pt-2 border-t border-outline-variant/40 flex flex-wrap items-center justify-between gap-2 text-[11px] text-on-surface-variant font-medium">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-brand-teal">location_on</span>
                      {ch.locations || 'Gumla, Jharkhand'}
                    </span>
                    <span className="flex items-center gap-1 text-brand-indigo font-bold">
                      <span className="material-symbols-outlined text-xs text-brand-violet">analytics</span>
                      {ch.domain?.includes('WATER') ? '32 Citizen Reports · 14.2k Impacted' : '24 Field Reports'}
                    </span>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between border-t border-outline-variant/30 mt-auto gap-2">
                  {!isAccepted ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAcceptChallenge(ch)
                      }}
                      className="bg-brand-violet/10 text-brand-violet hover:bg-brand-violet hover:text-white px-3.5 py-1.5 rounded-full font-label-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border border-brand-violet/20"
                    >
                      <span className="material-symbols-outlined text-sm">bookmark_add</span>
                      <span>Accept Challenge</span>
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      Accepted &amp; Assigned
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedChallenge(ch)
                    }}
                    className="bg-brand-indigo text-white px-4 py-2 rounded-full font-label-md text-xs font-bold hover:bg-brand-violet transition-all duration-300 cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  >
                    <span>View Details</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Selected Challenge Detail Modal */}
      {selectedChallenge && (
        <div className="fixed inset-0 z-50 bg-brand-indigo/40 backdrop-blur-sm flex items-center justify-center p-4 animate-overlay-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-outline-variant max-h-[90vh] overflow-y-auto animate-overlay-scale-in">
            <div className="flex items-center justify-between border-b border-outline-variant/40 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-brand-teal uppercase tracking-wider bg-brand-teal/10 px-3 py-1 rounded-full border border-brand-teal/20">
                  {selectedChallenge.status || 'Open'}
                </span>
                <span className="text-xs font-bold text-brand-violet bg-brand-violet/10 px-2.5 py-0.5 rounded-full border border-brand-violet/20">
                  TRL {selectedChallenge.trl_stage || 1} Prototype
                </span>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  94% Ranchi University Fit
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedChallenge(null)}
                className="w-8 h-8 rounded-full bg-surface-container-low text-brand-indigo flex items-center justify-center hover:bg-brand-indigo hover:text-white transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="space-y-3">
              <h2 className="font-headline-md text-brand-indigo text-2xl font-bold leading-tight">
                {selectedChallenge.title}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-on-surface-variant font-medium">
                <span>📍 Target Location: <strong>{selectedChallenge.locations || 'Gumla, Jharkhand'}</strong></span>
                <span>•</span>
                <span>⚙️ Domain: <strong>{selectedChallenge.domain || 'Water & Sanitation'}</strong></span>
              </div>
            </div>

            {/* Community Intelligence & Evidence Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-surface-container-low rounded-2xl border border-outline-variant/40 text-xs">
              <div>
                <span className="text-[10px] text-on-surface-variant font-bold block uppercase">COMMUNITY EVIDENCE</span>
                <span className="font-bold text-brand-indigo">32 Reports · 4 Field Observations</span>
              </div>
              <div>
                <span className="text-[10px] text-on-surface-variant font-bold block uppercase">AFFECTED POPULATION</span>
                <span className="font-bold text-brand-indigo">14,200 Citizens · 3 Blocks</span>
              </div>
              <div>
                <span className="text-[10px] text-on-surface-variant font-bold block uppercase">SEVERITY SCORE</span>
                <span className="font-bold text-rose-700">8.8 / 10 High Impact</span>
              </div>
            </div>

            <div className="space-y-2 bg-white p-4 rounded-2xl border border-outline-variant/60 text-xs">
              <span className="font-bold text-brand-indigo block uppercase tracking-wider text-[10px]">
                PROBLEM STATEMENT FOR INNOVATORS
              </span>
              <p className="text-on-surface leading-relaxed whitespace-pre-line">
                {selectedChallenge.challengeStatement || selectedChallenge.description}
              </p>
            </div>

            <div className="space-y-1 bg-brand-indigo/5 p-4 rounded-2xl border border-brand-indigo/10 text-xs">
              <span className="font-bold text-brand-violet block uppercase tracking-wider text-[10px]">
                RECOMMENDED DISCIPLINES &amp; INSTITUTIONAL FIT
              </span>
              <p className="text-brand-indigo font-semibold">
                Recommended for Environmental Engineering, Water Resources, and IoT Sensor Research. High alignment with Ranchi University Clean Water Labs.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              {!acceptedIds.includes(selectedChallenge.id) && (
                <button
                  type="button"
                  onClick={() => {
                    handleAcceptChallenge(selectedChallenge)
                  }}
                  className="bg-brand-violet text-white px-5 py-3 rounded-full font-label-md text-xs font-bold hover:bg-brand-indigo transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">bookmark_add</span>
                  <span>Accept for Ranchi University</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  const ch = selectedChallenge
                  setSelectedChallenge(null)
                  navigate('/student/team-formation', { state: { challenge: ch } })
                }}
                className="flex-1 bg-brand-indigo text-white px-6 py-3 rounded-full font-label-md text-xs font-bold hover:bg-brand-violet transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5"
              >
                <span className="material-symbols-outlined text-base">groups</span>
                <span>Form Multidisciplinary Team</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const ch = selectedChallenge
                  setSelectedChallenge(null)
                  navigate('/student/proposals', { state: { challenge: ch } })
                }}
                className="flex-1 border border-brand-indigo text-brand-indigo px-6 py-3 rounded-full font-label-md text-xs font-bold hover:bg-brand-indigo/5 transition-all flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5"
              >
                <span className="material-symbols-outlined text-base">description</span>
                <span>View &amp; Submit Proposal</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

