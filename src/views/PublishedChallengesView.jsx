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

  useEffect(() => {
    async function loadChallenges() {
      try {
        setLoading(true)
        setError(null)
        const res = await api.getChallenges()
        const data = res?.challenges || (Array.isArray(res) ? res : [])
        setChallenges(data.length > 0 ? data : reduxChallenges)
      } catch (err) {
        console.warn('[PublishedChallengesView Load Error]:', err.message)
        setChallenges(reduxChallenges)
      } finally {
        setLoading(false)
      }
    }
    loadChallenges()
  }, [])

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

  const getDomainIcon = (domain) => {
    if ((domain || '').includes('WATER')) return 'water_drop'
    if ((domain || '').includes('AGRICUL')) return 'agriculture'
    if ((domain || '').includes('HEALTH')) return 'medical_services'
    return 'engineering'
  }

  const filtered = challenges.filter((ch) => {
    if (filterDomain !== 'ALL' && !(ch.domain || '').toUpperCase().includes(filterDomain)) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const titleMatch = (ch.title || '').toLowerCase().includes(q)
      const descMatch = (ch.challengeStatement || ch.description || '').toLowerCase().includes(q)
      const locMatch = (ch.locations || '').toLowerCase().includes(q)
      return titleMatch || descMatch || locMatch
    }
    return true
  })

  return (
    <div className="space-y-6 text-slate-800 pb-8">
      {/* Toast Notification */}
      {acceptToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#26205F] text-white p-4 rounded-2xl shadow-xl border border-purple-400/40 flex items-center gap-3 animate-fade-in-up">
          <span className="material-symbols-outlined text-emerald-400 text-2xl">check_circle</span>
          <div className="space-y-0.5 text-xs">
            <p className="font-bold text-white">Institutional Acceptance Recorded</p>
            <p className="text-slate-200 font-medium">{acceptToast}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <span className="text-[10px] font-mono font-extrabold text-[#26205F] uppercase tracking-wider block">
            INNOVATION CHALLENGE REGISTRY &amp; ALLOCATION
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Active Innovation Challenges
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Validated civic challenges derived directly from recurring citizen observations across Jharkhand.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/admin/signals')}
          className="bg-[#26205F] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#1C1748] transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-base">verified</span>
          <span>Signals Queue</span>
        </button>
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative w-full sm:flex-1">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-base">
            search
          </span>
          <input
            type="text"
            placeholder="Search challenges by keyword, domain, or district..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#26205F] transition-all"
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
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                filterDomain === pill.id
                  ? 'bg-[#26205F] text-white shadow-2xs'
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-[#26205F]'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-center gap-2">
          <span className="material-symbols-outlined text-base">error</span>
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="bg-white p-12 rounded-2xl border border-slate-200/80 text-center space-y-3 shadow-2xs">
          <span className="material-symbols-outlined animate-spin text-3xl text-[#26205F]">progress_activity</span>
          <p className="text-xs font-bold text-slate-700">Loading published challenges from database...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <div className="bg-white p-12 rounded-2xl border border-slate-200/80 text-center space-y-4 shadow-2xs">
          <div className="w-14 h-14 rounded-full bg-purple-50 text-[#26205F] flex items-center justify-center mx-auto border border-purple-100">
            <span className="material-symbols-outlined text-3xl">lightbulb</span>
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-slate-900">
              No Published Challenges Found
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              When community problem patterns are validated, innovation challenges appear here for university allocation and team participation.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              className="bg-[#26205F] text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-[#1C1748] transition-all cursor-pointer inline-flex items-center gap-2 shadow-2xs"
              onClick={() => navigate('/admin/signals')}
            >
              <span>Go to Signals Queue &rarr;</span>
            </button>
          </div>
        </div>
      )}

      {/* Challenges List */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((ch) => {
            const isAccepted = acceptedIds.includes(ch.id)
            const matchScore = ch.domain?.includes('WATER') ? 94 : ch.domain?.includes('AGRICUL') ? 91 : 88

            return (
              <div
                key={ch.id}
                className={`bg-white p-6 rounded-2xl border ${
                  isAccepted ? 'border-purple-300 ring-2 ring-purple-100' : 'border-slate-200/80'
                } shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 group cursor-pointer relative`}
                onClick={() => setSelectedChallenge(ch)}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#26205F] flex items-center justify-center font-bold text-xs shrink-0 border border-purple-100">
                        <span className="material-symbols-outlined text-base">{getDomainIcon(ch.domain)}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider bg-slate-100 px-2.5 py-0.5 rounded-full">
                        {ch.status || 'Open'}
                      </span>
                      {isAccepted && (
                        <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">check_circle</span>
                          ACCEPTED BY RU
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-[#26205F] bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100 font-mono">
                        TRL {ch.trl_stage || 1} Prototype
                      </span>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 font-mono">
                        {matchScore}% Match
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-[#26205F] transition-colors leading-snug tracking-tight">
                    {ch.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {ch.challengeStatement || ch.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-slate-400">location_on</span>
                      {ch.locations || 'Gumla, Jharkhand'}
                    </span>
                    <span className="flex items-center gap-1 text-[#26205F] font-bold">
                      <span className="material-symbols-outlined text-xs text-purple-700">analytics</span>
                      {ch.domain?.includes('WATER') ? '32 Citizen Reports · 14.2k Impacted' : '24 Field Reports'}
                    </span>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between border-t border-slate-100 mt-auto gap-2">
                  {!isAccepted ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAcceptChallenge(ch)
                      }}
                      className="bg-purple-50 text-[#26205F] hover:bg-[#26205F] hover:text-white px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1 border border-purple-200"
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
                    className="bg-[#26205F] text-white px-4 py-1.5 rounded-xl text-xs font-bold hover:bg-[#1C1748] transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <span>View Details</span>
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Selected Challenge Detail Modal */}
      {selectedChallenge && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                  {selectedChallenge.status || 'Open'}
                </span>
                <span className="text-xs font-bold text-[#26205F] bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100 font-mono">
                  TRL {selectedChallenge.trl_stage || 1} Prototype
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedChallenge(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {selectedChallenge.title}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                <span>📍 Target Location: <strong className="text-slate-900">{selectedChallenge.locations || 'Gumla, Jharkhand'}</strong></span>
                <span>•</span>
                <span>⚙️ Domain: <strong className="text-[#26205F]">{selectedChallenge.domain || 'Water & Sanitation'}</strong></span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs font-medium">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">COMMUNITY EVIDENCE</span>
                <span className="font-bold text-slate-900">32 Reports · 4 Observations</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">AFFECTED POPULATION</span>
                <span className="font-bold text-slate-900">14,200 Citizens · 3 Blocks</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">SEVERITY SCORE</span>
                <span className="font-bold text-rose-800">8.8 / 10 High Impact</span>
              </div>
            </div>

            <div className="space-y-1 bg-white p-4 rounded-xl border border-slate-200 text-xs">
              <span className="font-bold text-[#26205F] block uppercase tracking-wider text-[10px]">
                PROBLEM STATEMENT FOR INNOVATORS
              </span>
              <p className="text-slate-700 leading-relaxed font-normal">
                {selectedChallenge.challengeStatement || selectedChallenge.description}
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              {!acceptedIds.includes(selectedChallenge.id) && (
                <button
                  type="button"
                  onClick={() => {
                    handleAcceptChallenge(selectedChallenge)
                  }}
                  className="bg-[#26205F] text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-[#1C1748] transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">bookmark_add</span>
                  <span>Accept Challenge</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setSelectedChallenge(null)}
                className="bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Close Modal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


