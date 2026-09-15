import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { openPatternForValidation, setActivePatternDetail } from '../features/app/appSlice'
import { api } from '../lib/api'

export default function ValidationQueueView() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const userProfile = useSelector((state) => state.app.userProfile)

  const [clusters, setClusters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filter States
  const [searchQuery, setSearchQuery] = useState('')
  const [domainFilter, setDomainFilter] = useState('ALL')
  const [districtFilter, setDistrictFilter] = useState('ALL')
  const [impactFilter, setImpactFilter] = useState('ALL')
  const [signalFilter, setSignalFilter] = useState('ALL')
  const [fitFilter, setFitFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState('RELEVANCE')

  const fetchClusters = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.getClusters()
      if (res?.clusters) {
        setClusters(res.clusters)
      } else if (Array.isArray(res)) {
        setClusters(res)
      } else if (res?.success === false) {
        setError(res.error || 'Validation queue temporarily unavailable')
      } else {
        setClusters([])
      }
    } catch (err) {
      console.warn('[ValidationQueueView Error]:', err.message)
      setError('Validation queue temporarily unavailable')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClusters()
  }, [])

  // Review Problem -> Navigate to Detail Page
  const handleReviewProblem = (cluster) => {
    dispatch(openPatternForValidation(cluster.id))
    dispatch(setActivePatternDetail(cluster))
    navigate('/validation/pattern')
  }

  // Filter Logic
  const filteredClusters = clusters.filter((c) => {
    const domain = (c.primary_domain || '').toUpperCase()
    if (domainFilter !== 'ALL' && !domain.includes(domainFilter.toUpperCase())) return false

    const district = (c.district || (c.locations || [])[0] || '').toLowerCase()
    if (districtFilter !== 'ALL' && !district.includes(districtFilter.toLowerCase())) return false

    const impact = (c.impact_level || 'HIGH IMPACT').toUpperCase()
    if (impactFilter !== 'ALL' && !impact.includes(impactFilter.toUpperCase())) return false

    const signals = c.problem_count || c.members?.length || 0
    if (signalFilter === '30+' && signals < 30) return false
    if (signalFilter === '20+' && signals < 20) return false
    if (signalFilter === '10+' && signals < 10) return false

    const fitScore = c.match_score || c.emergence_score || 85
    if (fitFilter === '90+' && fitScore < 90) return false
    if (fitFilter === '80+' && fitScore < 80) return false

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const titleMatch = (c.title || c.name || '').toLowerCase().includes(q)
      const descMatch = (c.description || '').toLowerCase().includes(q)
      const domainMatch = domain.toLowerCase().includes(q)
      const locMatch = (c.locations || []).join(' ').toLowerCase().includes(q)
      return titleMatch || descMatch || domainMatch || locMatch
    }

    return true
  }).sort((a, b) => {
    if (sortBy === 'FIT') {
      return (b.match_score || b.emergence_score || 0) - (a.match_score || a.emergence_score || 0)
    }
    if (sortBy === 'SIGNALS') {
      return (b.problem_count || b.members?.length || 0) - (a.problem_count || a.members?.length || 0)
    }
    if (sortBy === 'IMPACT') {
      return (b.avg_severity || 8) - (a.avg_severity || 8)
    }
    return 0
  })

  const totalAwaiting = clusters.length > 0 ? clusters.length : 3

  return (
    <div className="min-h-screen bg-[#F8F7FC] flex flex-col font-sans text-slate-900 antialiased selection:bg-indigo-100 selection:text-indigo-900">
      <main className="flex-grow pt-6 pb-20 px-4 sm:px-6 max-w-[920px] mx-auto w-full space-y-6">

        {/* ==================================================
            1. PAGE HEADER (EDITORIAL & INSTITUTIONAL TYPOGRAPHY)
            ================================================== */}
        <header className="space-y-1.5 pb-4 border-b border-stone-200/80">
          {/* Eyebrow */}
          <div className="text-[11px] sm:text-[12px] font-bold text-slate-500 tracking-[0.08em] uppercase flex items-center gap-2">
            <span>UNIVERSITY OPPORTUNITIES</span>
            <span>·</span>
            <span className="text-slate-700">{userProfile?.department || 'RANCHI UNIVERSITY'}</span>
          </div>

          {/* Page Title */}
          <h1 className="text-[34px] sm:text-[36px] font-bold text-[#171A5A] tracking-[-0.02em] leading-[1.1]">
            Emerging community problems
          </h1>

          {/* Page Description */}
          <p className="text-[14px] sm:text-[15px] font-[450] text-[#525B75] leading-[1.55] max-w-2xl">
            Recurring problems reported by communities across Jharkhand that may become university innovation challenges. Review the evidence and decide whether your university should take this forward.
          </p>
        </header>

        {/* ==================================================
            2. QUIET SUMMARY STRIP (STRONG NUMBERS & MUTED LABELS)
            ================================================== */}
        <section className="flex flex-wrap items-center gap-y-1 gap-x-4 text-[13px] text-[#525B75] font-[450] py-1">
          <div className="flex items-center gap-1.5">
            <span className="font-[650] text-[#171A5A] text-[19px]">{String(totalAwaiting).padStart(2, '0')}</span>
            <span>awaiting validation</span>
          </div>
          <span className="text-slate-300">·</span>
          <div className="flex items-center gap-1.5">
            <span className="font-[650] text-[#171A5A] text-[19px]">08</span>
            <span>validated challenges</span>
          </div>
          <span className="text-slate-300">·</span>
          <div className="flex items-center gap-1.5">
            <span className="font-[650] text-[#171A5A] text-[19px]">12</span>
            <span>student teams</span>
          </div>
          <span className="text-slate-300">·</span>
          <div className="flex items-center gap-1.5">
            <span className="font-[650] text-[#171A5A] text-[19px]">05</span>
            <span>active projects</span>
          </div>
        </section>

        {/* ==================================================
            3. DISCOVERY CONTROLS (DEEP NAVY FILTER TYPOGRAPHY)
            ================================================== */}
        <section className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
          {/* Primary Search Input */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-base pointer-events-none">
              search
            </span>
            <input
              type="text"
              placeholder="Search community problems..."
              className="w-full pl-9 pr-3 py-1.5 bg-white rounded-md border border-stone-200 text-[13px] font-medium text-[#171A5A] placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Dropdowns Toolbar */}
          <div className="flex flex-wrap items-center gap-2 text-[13px]">
            <select
              className="px-2.5 py-1.5 bg-white rounded-md border border-stone-200 text-[13px] font-medium text-[#171A5A] focus:outline-none focus:border-indigo-600 cursor-pointer transition-colors"
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
            >
              <option value="ALL">All domains</option>
              <option value="WATER">Water & Sanitation</option>
              <option value="AGRICULTURE">Agriculture</option>
              <option value="HEALTHCARE">Healthcare</option>
              <option value="INFRASTRUCTURE">Infrastructure</option>
            </select>

            <select
              className="px-2.5 py-1.5 bg-white rounded-md border border-stone-200 text-[13px] font-medium text-[#171A5A] focus:outline-none focus:border-indigo-600 cursor-pointer transition-colors"
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
            >
              <option value="ALL">All districts</option>
              <option value="Gumla">Gumla</option>
              <option value="Simdega">Simdega</option>
              <option value="Khunti">Khunti</option>
              <option value="Ranchi">Ranchi</option>
            </select>

            <select
              className="px-2.5 py-1.5 bg-white rounded-md border border-stone-200 text-[13px] font-medium text-[#171A5A] focus:outline-none focus:border-indigo-600 cursor-pointer transition-colors"
              value={impactFilter}
              onChange={(e) => setImpactFilter(e.target.value)}
            >
              <option value="ALL">Impact</option>
              <option value="HIGH">High Impact</option>
              <option value="MEDIUM-HIGH">Medium-High</option>
            </select>

            <select
              className="px-2.5 py-1.5 bg-white rounded-md border border-stone-200 text-[13px] font-medium text-[#171A5A] focus:outline-none focus:border-indigo-600 cursor-pointer transition-colors"
              value={fitFilter}
              onChange={(e) => setFitFilter(e.target.value)}
            >
              <option value="ALL">University fit</option>
              <option value="90+">90%+ fit</option>
              <option value="80+">80%+ fit</option>
            </select>

            <select
              className="px-2.5 py-1.5 bg-white rounded-md border border-stone-200 text-[13px] font-semibold text-[#171A5A] focus:outline-none focus:border-indigo-600 cursor-pointer transition-colors"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="RELEVANCE">Highest relevance</option>
              <option value="IMPACT">Highest impact</option>
              <option value="FIT">Highest university fit</option>
              <option value="SIGNALS">Most signals</option>
            </select>

            {(searchQuery || domainFilter !== 'ALL' || districtFilter !== 'ALL' || impactFilter !== 'ALL' || signalFilter !== 'ALL' || fitFilter !== 'ALL') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setDomainFilter('ALL')
                  setDistrictFilter('ALL')
                  setImpactFilter('ALL')
                  setSignalFilter('ALL')
                  setFitFilter('ALL')
                  setSortBy('RELEVANCE')
                }}
                className="text-[13px] font-medium text-indigo-700 hover:text-indigo-900 px-1 shrink-0 cursor-pointer underline underline-offset-2"
              >
                Reset
              </button>
            )}
          </div>
        </section>

        {/* ==================================================
            4. EDITORIAL PROBLEM LIST WORKSPACE
            ================================================== */}

        {/* LOADING STATE */}
        {loading && (
          <div className="py-16 text-center space-y-2 border-y border-stone-200/60 my-4">
            <span className="material-symbols-outlined animate-spin text-xl text-indigo-700">progress_activity</span>
            <p className="text-[13px] font-medium text-[#525B75]">Loading emerging community problems...</p>
          </div>
        )}

        {/* API ERROR STATE */}
        {!loading && error && (
          <div className="p-4 rounded-md border border-amber-200/80 bg-amber-50/50 flex items-center justify-between gap-3 text-[13px]">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-amber-700 text-base">warning</span>
              <span className="text-slate-800 font-medium">Could not load emerging community patterns right now.</span>
            </div>
            <button
              type="button"
              onClick={fetchClusters}
              className="text-[13px] font-semibold text-indigo-700 hover:text-indigo-900 cursor-pointer underline underline-offset-2 shrink-0"
            >
              Retry
            </button>
          </div>
        )}

        {/* EMPTY QUEUE STATE */}
        {!loading && !error && filteredClusters.length === 0 && (
          <div className="py-16 text-center space-y-3 border-y border-stone-200/60 my-4">
            <span className="material-symbols-outlined text-2xl text-emerald-600">task_alt</span>
            <div className="space-y-1">
              <h3 className="text-[14px] font-semibold text-[#171A5A]">No matching community problems found</h3>
              <p className="text-[13px] text-[#525B75] max-w-sm mx-auto">
                Try adjusting your search query or filters to discover available opportunities.
              </p>
            </div>
          </div>
        )}

        {/* EDITORIAL PROBLEM CARDS WORKSPACE */}
        {!loading && !error && filteredClusters.length > 0 && (
          <div className="space-y-3.5 pt-2">
            {filteredClusters.map((item, idx) => {
              const signalsCount = item.problem_count || item.members?.length || 32
              const fitScore = item.match_score || item.emergence_score || 94
              const impact = item.impact_level || (item.avg_severity > 8 ? 'HIGH IMPACT' : 'MEDIUM-HIGH IMPACT')
              const district = item.district || (item.locations || [])[0] || 'Gumla'
              const blocksText = item.blocks || '3 blocks · 12 villages'
              const disciplinesText = (item.recommended_disciplines || ['Environmental Engineering', 'Water Resources', 'IoT Sensor Research']).join(' · ')
              const explanationText = item.why_this_matters || item.description || `Recurring observations across ${district} indicate a possible regional water-quality pattern.`
              const isFirst = idx === 0

              return (
                <article
                  key={item.id}
                  onClick={() => handleReviewProblem(item)}
                  className={`bg-white rounded-xl p-5 sm:p-6 shadow-[0_2px_10px_rgba(20,24,80,0.04)] transition-all duration-150 cursor-pointer group hover:-translate-y-[1.5px] ${
                    isFirst
                      ? 'border border-[rgba(70,55,200,0.18)] hover:border-[rgba(70,55,200,0.30)]'
                      : 'border border-[rgba(20,24,80,0.10)] hover:border-[rgba(20,24,80,0.22)]'
                  }`}
                >
                  <div className="space-y-2">
                    {/* Domain Header Line */}
                    <div className="text-[11px] font-[650] text-[#171A5A] uppercase tracking-[0.06em]">
                      {item.primary_domain || 'WATER & SANITATION'}
                    </div>

                    {/* Problem Title & Action Link */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <h2 className="text-[22px] sm:text-[24px] font-[650] text-[#171A5A] group-hover:text-indigo-800 transition-colors leading-[1.25] tracking-[-0.01em]">
                        {item.title || item.name}
                      </h2>

                      {/* Action Link */}
                      <span className="text-[13px] sm:text-[14px] font-semibold text-[#171A5A] group-hover:text-indigo-800 inline-flex items-center gap-1 shrink-0 pt-1 sm:pt-0">
                        <span>Review problem</span>
                        <span className="text-sm transition-transform duration-150 group-hover:translate-x-[3px]">→</span>
                      </span>
                    </div>

                    {/* Location / Metadata */}
                    <div className="text-[13px] font-[450] text-[#525B75]">
                      {district} · {blocksText}
                    </div>

                    {/* Community Signals / Impact / Fit */}
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] text-slate-600 pt-0.5">
                      <span className="font-normal text-slate-600">{signalsCount} community reports</span>
                      <span className="text-slate-300">·</span>
                      <span className="font-bold text-[#171A5A]">
                        {impact.toUpperCase()}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="font-bold text-[#171A5A]">
                        {fitScore}% university fit
                      </span>
                    </div>

                    {/* Disciplines */}
                    <div className="text-[12px] sm:text-[13px] font-[450] text-[#64748B]">
                      {disciplinesText}
                    </div>

                    {/* AI / Insight Quote */}
                    <p className="text-[13px] font-normal italic text-[#525B75] leading-relaxed pt-1 max-w-3xl">
                      &ldquo;{explanationText}&rdquo;
                    </p>
                  </div>
                </article>
              )
            })}
          </div>
        )}

      </main>
    </div>
  )
}


