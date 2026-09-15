import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import { startNewReport } from '../features/app/appSlice'
import { api } from '../lib/api'
import { useTranslation } from '../lib/useTranslation'

export default function MyProblemsView() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const userSignals = useSelector(s => s.app.communitySignals) || []

  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function loadSubmissions() {
      setLoading(true)
      setError(null)
      try {
        const response = await api.getSubmissions()
        const fetched = response?.submissions || []

        if (fetched.length > 0) {
          setSubmissions(fetched)
        } else if (userSignals.length > 0) {
          const mapped = userSignals.map((s) => ({
            id: s.id,
            ref_id: s.id,
            raw_text: s.description || s.title || 'Community Observation',
            primary_domain: s.understanding?.primaryDomain || 'Civic Observation',
            district: s.district || 'Gumla',
            state: 'Jharkhand',
            created_at: s.date || new Date().toISOString(),
            status: s.status || 'SUBMITTED',
            ai_summary: s.description || s.title,
            has_embedding: false,
          }))
          setSubmissions(mapped)
        } else {
          setSubmissions([])
        }
      } catch (err) {
        console.warn('[MyProblemsView Load Warning]:', err.message)
        if (userSignals.length > 0) {
          const mapped = userSignals.map((s) => ({
            id: s.id,
            ref_id: s.id,
            raw_text: s.description || s.title || 'Community Observation',
            primary_domain: s.understanding?.primaryDomain || 'Civic Observation',
            district: s.district || 'Gumla',
            state: 'Jharkhand',
            created_at: s.date || new Date().toISOString(),
            status: s.status || 'SUBMITTED',
            ai_summary: s.description || s.title,
            has_embedding: false,
          }))
          setSubmissions(mapped)
        } else {
          setError(err.message)
          setSubmissions([])
        }
      } finally {
        setLoading(false)
      }
    }

    loadSubmissions()
  }, [userSignals])

  const filteredProblems = submissions.filter((p) => {
    const pStatus = (p.status || '').toUpperCase()
    if (activeFilter === 'SUBMITTED' && pStatus !== 'SUBMITTED') return false
    if (activeFilter === 'VERIFIED' && pStatus !== 'VERIFIED') return false
    if (activeFilter === 'CLUSTERED' && pStatus !== 'CLUSTERED') return false
    if (activeFilter === 'RESOLVED' && pStatus !== 'RESOLVED') return false

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const textMatch = (p.raw_text || '').toLowerCase().includes(q)
      const idMatch = (p.ref_id || p.id || '').toLowerCase().includes(q)
      const domainMatch = (p.primary_domain || '').toLowerCase().includes(q)
      const distMatch = (p.district || '').toLowerCase().includes(q)
      return textMatch || idMatch || domainMatch || distMatch
    }

    return true
  })

  const getStatusBadge = (statusStr) => {
    const s = (statusStr || '').toUpperCase()
    if (s === 'RESOLVED') {
      return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    }
    if (s === 'IN_PROGRESS' || s === 'CLUSTERED' || s === 'CHALLENGE_CREATED') {
      return 'bg-brand-teal/10 text-brand-teal border-brand-teal/20'
    }
    if (s === 'VERIFIED') {
      return 'bg-brand-violet/10 text-brand-violet border-brand-violet/20'
    }
    return 'bg-surface-container text-on-surface-variant border-outline-variant/60'
  }

  return (
    <main className="flex-grow pt-6 sm:pt-8 pb-20 px-6 md:px-margin-desktop max-w-[1200px] mx-auto w-full space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-outline-variant/60">
        <div>
          <span className="text-[10px] font-bold text-brand-teal uppercase tracking-widest block mb-1">
            {t('citizen.dashboard.tag')}
          </span>
          <h1 className="font-display-lg text-brand-indigo text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t('nav.myProblems')}
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Manage, review, and follow live updates on all civic observations you have shared.
          </p>
        </div>

        <button
          type="button"
          className="bg-brand-indigo text-white px-5 py-2.5 rounded-full font-label-md text-xs sm:text-sm font-semibold hover:bg-brand-violet transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
          onClick={() => { dispatch(startNewReport()); navigate('/citizen/report/method'); }}
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span>+ {t('citizen.dashboard.reportProblem')}</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-outline-variant/70 shadow-2xs flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'SUBMITTED', 'VERIFIED', 'CLUSTERED', 'RESOLVED'].map((tab) => (
            <button
              key={tab}
              type="button"
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeFilter === tab
                  ? 'bg-brand-indigo text-white shadow-2xs'
                  : 'bg-surface-container-low text-brand-indigo border border-outline-variant hover:border-brand-violet'
              }`}
              onClick={() => setActiveFilter(tab)}
            >
              {tab === 'ALL' ? `All (${submissions.length})` : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-base">
            search
          </span>
          <input
            type="text"
            className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl py-1.5 pl-9 pr-3 text-xs text-on-surface focus:outline-none focus:border-brand-violet"
            placeholder="Search problems or Ref ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white p-12 rounded-3xl border border-outline-variant/70 text-center space-y-3">
          <span className="material-symbols-outlined animate-spin text-3xl text-brand-indigo">progress_activity</span>
          <p className="text-xs font-bold text-brand-indigo">Loading your reported problems...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredProblems.length === 0 && (
        <div className="bg-white p-12 sm:p-16 rounded-3xl border border-outline-variant/70 text-center space-y-4 shadow-2xs">
          <div className="w-16 h-16 rounded-full bg-surface-container-low text-brand-indigo flex items-center justify-center mx-auto border border-outline-variant/40">
            <span className="material-symbols-outlined text-3xl text-brand-violet">rate_review</span>
          </div>

          <div className="space-y-1">
            <h3 className="font-headline-sm text-brand-indigo text-lg sm:text-xl font-extrabold">
              {searchQuery ? 'No matching problems found' : 'No civic problems submitted yet'}
            </h3>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
              {searchQuery
                ? `No reports match your search "${searchQuery}". Try searching with a different keyword or Reference ID.`
                : 'Every observation you submit helps identify recurring infrastructure, water, or health issues across Jharkhand.'}
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              className="bg-brand-indigo text-white px-6 py-3 rounded-full font-label-md text-xs sm:text-sm font-semibold hover:bg-brand-violet transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer hover:scale-[1.01]"
              onClick={() => { dispatch(startNewReport()); navigate('/citizen/report/method'); }}
            >
              <span className="material-symbols-outlined text-base">add</span>
              <span>+ {t('citizen.dashboard.reportProblem')} &rarr;</span>
            </button>
          </div>
        </div>
      )}

      {/* Problems List */}
      {!loading && filteredProblems.length > 0 && (
        <div className="space-y-4">
          {filteredProblems.map((prob) => (
            <div
              key={prob.id}
              className="bg-white p-6 rounded-3xl border border-outline-variant/70 shadow-2xs hover:border-brand-violet/60 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-5 cursor-pointer group"
              onClick={() => navigate(`/citizen/track-problems?id=${prob.ref_id || prob.id}`)}
            >
              <div className="space-y-2 max-w-2xl flex-grow">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-xs font-mono font-bold text-brand-teal px-2.5 py-0.5 rounded-full bg-brand-teal/10 border border-brand-teal/20">
                    {prob.ref_id || `SS-${prob.id.slice(0, 8).toUpperCase()}`}
                  </span>
                  <span className="text-xs font-bold text-brand-indigo bg-surface-container-low px-2.5 py-0.5 rounded-full border border-outline-variant/40 uppercase">
                    {prob.primary_domain || 'Civic Observation'}
                  </span>
                  {prob.has_embedding && (
                    <span className="text-[10px] font-bold text-brand-teal bg-white px-2 py-0.5 rounded-md border border-brand-teal/20">
                      Vector Embedded
                    </span>
                  )}
                </div>

                <h3 className="font-headline-sm text-brand-indigo text-lg sm:text-xl font-bold leading-snug group-hover:text-brand-violet transition-colors">
                  {prob.ai_summary || prob.raw_text}
                </h3>

                <div className="flex flex-wrap items-center gap-3 text-xs text-on-surface-variant font-medium pt-0.5">
                  <span>📍 {prob.district || 'Gumla'}, {prob.state || 'Jharkhand'}</span>
                  <span>•</span>
                  <span>📅 Submitted: {prob.created_at ? new Date(prob.created_at).toLocaleDateString() : 'Today'}</span>
                </div>
              </div>

              <div className="flex flex-row md:flex-col items-end justify-between md:justify-center gap-3 w-full md:w-auto shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-outline-variant/30">
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${getStatusBadge(prob.status)}`}>
                  {prob.status || 'SUBMITTED'}
                </span>

                <span className="text-xs font-bold text-brand-violet group-hover:underline flex items-center gap-1">
                  <span>{t('citizen.dashboard.trackJourney')}</span>
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
