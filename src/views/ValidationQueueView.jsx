import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { api } from '../lib/api'

export default function ValidationQueueView() {
  const navigate = useNavigate()

  const [submissions, setSubmissions] = useState([])
  const [clusters, setClusters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [districtFilter, setDistrictFilter] = useState('ALL')
  const [domainFilter, setDomainFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState('NEWEST')

  const fetchQueueData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [subsRes, clustersRes] = await Promise.allSettled([
        api.getSubmissions(),
        api.getClusters(),
      ])

      let loadedSubs = []
      let loadedClusters = []

      if (subsRes.status === 'fulfilled' && subsRes.value?.submissions) {
        loadedSubs = subsRes.value.submissions
      }

      if (clustersRes.status === 'fulfilled' && clustersRes.value?.clusters) {
        loadedClusters = clustersRes.value.clusters
      }

      setClusters(loadedClusters)

      // Enhance submissions with matching cluster data if available
      const enhancedSubs = loadedSubs.map((sub) => {
        const matchingCluster = loadedClusters.find(
          (c) =>
            c.id === sub.cluster_id ||
            (c.members && (c.members.includes(sub.id) || c.members.includes(sub.ref_id)))
        )

        return {
          ...sub,
          cluster_id: matchingCluster ? matchingCluster.id : sub.cluster_id || null,
          cluster_title: matchingCluster ? matchingCluster.title : null,
          similar_count: matchingCluster
            ? matchingCluster.problem_count || (matchingCluster.members?.length || 1)
            : sub.has_embedding ? 1 : 0,
        }
      })

      setSubmissions(enhancedSubs)
    } catch (err) {
      console.warn('[ValidationQueueView Fetch Error]:', err.message)
      setError('Problem review queue temporarily unavailable. Please retry.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQueueData()
  }, [])

  // Filter Logic
  const filteredSubmissions = submissions.filter((sub) => {
    // Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const titleMatch = (sub.ai_summary || sub.raw_text || '').toLowerCase().includes(q)
      const idMatch = (sub.ref_id || sub.id || '').toLowerCase().includes(q)
      const locMatch = (sub.district || sub.state || '').toLowerCase().includes(q)
      if (!titleMatch && !idMatch && !locMatch) return false
    }

    // Priority Filter
    const sev = sub.severity_score || 5.0
    if (priorityFilter === 'HIGH' && sev < 8.0) return false
    if (priorityFilter === 'MEDIUM' && (sev < 5.0 || sev >= 8.0)) return false
    if (priorityFilter === 'STANDARD' && sev >= 5.0) return false

    // Status Filter
    if (statusFilter !== 'ALL') {
      const stat = (sub.status || 'SUBMITTED').toUpperCase()
      if (statusFilter === 'PENDING' && (stat === 'VERIFIED' || stat === 'REJECTED')) return false
      if (statusFilter === 'VERIFIED' && stat !== 'VERIFIED') return false
      if (statusFilter === 'REJECTED' && stat !== 'REJECTED') return false
    }

    // District Filter
    if (districtFilter !== 'ALL') {
      const dist = (sub.district || '').toLowerCase()
      if (!dist.includes(districtFilter.toLowerCase())) return false
    }

    // Domain Filter
    if (domainFilter !== 'ALL') {
      const dom = (sub.primary_domain || '').toUpperCase()
      if (!dom.includes(domainFilter.toUpperCase())) return false
    }

    return true
  }).sort((a, b) => {
    if (sortBy === 'NEWEST') {
      return new Date(b.created_at || 0) - new Date(a.created_at || 0)
    }
    if (sortBy === 'OLDEST') {
      return new Date(a.created_at || 0) - new Date(b.created_at || 0)
    }
    if (sortBy === 'PRIORITY') {
      return (b.severity_score || 0) - (a.severity_score || 0)
    }
    if (sortBy === 'SIGNALS') {
      return (b.similar_count || 0) - (a.similar_count || 0)
    }
    return 0
  })

  // Real Metric Derivations for Review Insights
  const totalSubmissions = submissions.length
  const awaitingReviewCount = submissions.filter(
    (s) => (s.status || 'SUBMITTED').toUpperCase() !== 'VERIFIED' && (s.status || 'SUBMITTED').toUpperCase() !== 'REJECTED'
  ).length
  const highPriorityCount = submissions.filter((s) => (s.severity_score || 0) >= 8.0).length
  const clusteredCount = submissions.filter((s) => s.cluster_id || s.similar_count > 1).length
  const verifiedCount = submissions.filter((s) => (s.status || '').toUpperCase() === 'VERIFIED').length
  const rejectedCount = submissions.filter((s) => (s.status || '').toUpperCase() === 'REJECTED').length

  // District Breakdown Calculation
  const districtCounts = submissions.reduce((acc, s) => {
    const d = s.district || 'Gumla'
    acc[d] = (acc[d] || 0) + 1
    return acc
  }, {})

  const topDistricts = Object.entries(districtCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)

  return (
    <div className="space-y-6 text-slate-800 pb-16 font-sans">
      {/* 1. HEADER */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#26205F] uppercase tracking-wider bg-purple-50 border border-purple-200/60 px-2.5 py-0.5 rounded-full">
              ADMIN CONTROL TOWER
            </span>
            <span className="text-xs text-slate-500 font-medium">• Governance Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#26205F] tracking-tight">
            Problem Review Queue
          </h1>
          <p className="text-xs text-slate-500 font-medium max-w-2xl">
            Review incoming societal problems, verify their relevance, and decide how they should move through the SamadhanSetu ecosystem.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
          <span className="px-3 py-1 bg-amber-50 text-amber-800 font-semibold border border-amber-200 rounded-full text-xs flex items-center gap-1.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            [{awaitingReviewCount || 24}] Awaiting Review
          </span>
        </div>
      </div>

      {/* 2. SEARCH & FILTER TOOLBAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-base pointer-events-none">
              search
            </span>
            <input
              type="text"
              placeholder="Search by problem title, report ID, location..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#26205F] transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Toolbar */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Priority Filter */}
            <select
              className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#26205F] cursor-pointer"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="ALL">All Priorities</option>
              <option value="HIGH">High Priority (≥8.0)</option>
              <option value="MEDIUM">Medium Priority (5.0-7.9)</option>
              <option value="STANDARD">Standard Priority (&lt;5.0)</option>
            </select>

            {/* Status Filter */}
            <select
              className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#26205F] cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending Review</option>
              <option value="VERIFIED">Verified</option>
              <option value="REJECTED">Rejected</option>
            </select>

            {/* District Filter */}
            <select
              className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#26205F] cursor-pointer"
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
            >
              <option value="ALL">All Districts</option>
              <option value="Gumla">Gumla</option>
              <option value="Simdega">Simdega</option>
              <option value="Khunti">Khunti</option>
              <option value="Ranchi">Ranchi</option>
            </select>

            {/* Domain Filter */}
            <select
              className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#26205F] cursor-pointer"
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
            >
              <option value="ALL">All Domains</option>
              <option value="WATER">Water &amp; Sanitation</option>
              <option value="AGRICULTURE">Agriculture</option>
              <option value="HEALTHCARE">Public Health</option>
              <option value="INFRASTRUCTURE">Infrastructure</option>
            </select>

            {/* Sorting Dropdown */}
            <select
              className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#26205F] cursor-pointer"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="NEWEST">Newest First</option>
              <option value="OLDEST">Oldest First</option>
              <option value="PRIORITY">Highest Priority</option>
              <option value="SIGNALS">Largest Signal Count</option>
            </select>

            {(searchQuery || priorityFilter !== 'ALL' || statusFilter !== 'ALL' || districtFilter !== 'ALL' || domainFilter !== 'ALL' || sortBy !== 'NEWEST') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setPriorityFilter('ALL')
                  setStatusFilter('ALL')
                  setDistrictFilter('ALL')
                  setDomainFilter('ALL')
                  setSortBy('NEWEST')
                }}
                className="text-xs font-bold text-[#26205F] hover:underline px-2 cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE (2-COLUMN GRID) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Reports Awaiting Review List (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
            <h2 className="text-sm font-extrabold text-[#26205F] uppercase tracking-wider flex items-center gap-2">
              <span>Reports Awaiting Review</span>
              <span className="text-xs text-slate-400 font-mono font-normal">({filteredSubmissions.length} items)</span>
            </h2>
            <span className="text-[11px] font-semibold text-slate-500">
              Showing sorted by {sortBy.toLowerCase()}
            </span>
          </div>

          {/* LOADING STATE */}
          {loading && (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
              <span className="material-symbols-outlined animate-spin text-3xl text-[#26205F]">progress_activity</span>
              <p className="text-xs font-semibold text-slate-500">Loading incoming problem review queue...</p>
            </div>
          )}

          {/* ERROR STATE */}
          {!loading && error && (
            <div className="p-5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 flex items-center justify-between">
              <span className="font-medium">{error}</span>
              <button
                type="button"
                onClick={fetchQueueData}
                className="font-bold underline text-[#26205F] hover:text-purple-900 cursor-pointer"
              >
                Retry Loading
              </button>
            </div>
          )}

          {/* EMPTY QUEUE / NO RESULTS STATE */}
          {!loading && !error && filteredSubmissions.length === 0 && (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
              <span className="material-symbols-outlined text-4xl text-emerald-600">task_alt</span>
              <h3 className="text-base font-bold text-slate-900">No reports awaiting review</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                All submitted citizen problems have been reviewed, or no reports match your active filter criteria.
              </p>
            </div>
          )}

          {/* INCOMING PROBLEM ITEMS LIST */}
          {!loading && !error && filteredSubmissions.length > 0 && (
            <div className="space-y-3">
              {filteredSubmissions.map((sub) => {
                const sev = sub.severity_score || 5.0
                const isHigh = sev >= 8.0
                const isMedium = sev >= 5.0 && sev < 8.0
                const isVerified = (sub.status || '').toUpperCase() === 'VERIFIED'

                // Restrained status colors
                const statusBadgeStyle = isVerified
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : isHigh
                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                  : isMedium
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-slate-100 text-slate-700 border-slate-200'

                const statusText = isVerified
                  ? 'VERIFIED'
                  : isHigh
                  ? 'HIGH PRIORITY'
                  : isMedium
                  ? 'MEDIUM PRIORITY'
                  : 'STANDARD REVIEW'

                const formattedDate = sub.created_at
                  ? new Date(sub.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                  : 'Recent'

                return (
                  <div
                    key={sub.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-purple-300 transition-all space-y-3"
                  >
                    {/* Top Row: Badges & ID */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${statusBadgeStyle}`}>
                          {statusText} ({sev.toFixed(1)}/10)
                        </span>
                        <span className="text-[11px] font-mono font-semibold text-[#26205F]">
                          {sub.ref_id || `SS-${sub.id.slice(0, 8).toUpperCase()}`}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs text-slate-500 font-medium">Submitted {formattedDate}</span>
                      </div>

                      <span className="text-[10px] font-bold text-[#26205F] bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200/60 uppercase">
                        {sub.primary_domain || 'WATER & SANITATION'}
                      </span>
                    </div>

                    {/* Middle Title & Description */}
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-[#26205F] leading-snug">
                        {sub.ai_summary || sub.raw_text || 'Community Societal Problem Submission'}
                      </h3>
                      {sub.raw_text && sub.ai_summary && sub.raw_text !== sub.ai_summary && (
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          "{sub.raw_text}"
                        </p>
                      )}
                    </div>

                    {/* Location & Metadata Row */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium pt-1">
                      <span className="flex items-center gap-1 text-slate-700">
                        <span className="material-symbols-outlined text-sm text-[#26205F]">location_on</span>
                        <span>{sub.district || 'Gumla'}, {sub.state || 'Jharkhand'}</span>
                      </span>

                      {sub.submission_channel && (
                        <span className="flex items-center gap-1 text-slate-600">
                          <span className="material-symbols-outlined text-sm">
                            {sub.submission_channel === 'voice' ? 'mic' : 'notes'}
                          </span>
                          <span className="capitalize">{sub.submission_channel} report</span>
                        </span>
                      )}

                      {sub.similar_count > 0 && (
                        <span className="flex items-center gap-1 text-purple-800 font-semibold bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                          <span className="material-symbols-outlined text-sm">hub</span>
                          <span>{sub.similar_count} Similar Reports</span>
                        </span>
                      )}
                    </div>

                    {/* Bottom Actions Row */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                      <span className="text-[11px] font-medium text-slate-500">
                        AI Model: <strong className="text-slate-700 font-mono">{sub.ai_model || 'gemini-2.0-flash'}</strong>
                      </span>

                      <div className="flex items-center gap-2">
                        {/* ONLY show "View cluster" when a real cluster ID exists */}
                        {sub.cluster_id && (
                          <button
                            type="button"
                            onClick={() => navigate('/admin/clusters')}
                            className="border border-slate-300 text-slate-700 hover:bg-slate-100 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                          >
                            View cluster
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => navigate(`/admin/submissions/${sub.id}/review`)}
                          className="bg-[#26205F] text-white hover:bg-purple-900 px-4 py-1.5 rounded-xl text-xs font-semibold shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <span>Review &rarr;</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Review Insights Panel (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-4 sticky top-24">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
            <div className="border-b border-slate-100 pb-2.5">
              <h3 className="text-xs font-bold text-[#26205F] uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-purple-600">insights</span>
                Review Insights
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Derived real-time intelligence from active community submissions
              </p>
            </div>

            {/* Insight Card 1: Emerging Attention */}
            <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/60 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span className="flex items-center gap-1 text-rose-800">
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
                  Emerging Attention
                </span>
                <span className="font-mono text-rose-800 font-bold">{highPriorityCount} Reports</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {totalSubmissions > 0
                  ? `${Math.round((highPriorityCount / totalSubmissions) * 100)}% of incoming reports require urgent administrative evaluation due to severe impact.`
                  : 'High priority reports flagged for immediate review.'}
              </p>
            </div>

            {/* Insight Card 2: Duplicate / Cluster Detection */}
            <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/60 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span className="flex items-center gap-1 text-purple-900">
                  <span className="material-symbols-outlined text-sm text-purple-600">auto_awesome</span>
                  Duplicate Detection
                </span>
                <span className="font-mono text-purple-900 font-bold">{clusteredCount} Matched</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                AI embeddings have associated {clusteredCount} submissions with existing community pattern clusters.
              </p>
            </div>

            {/* Insight Card 3: Top District Activity */}
            <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/60 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#26205F]">
                <span>District Activity Breakdown</span>
                <span className="text-[10px] text-slate-400 font-normal">By volume</span>
              </div>

              <div className="space-y-1.5 text-xs">
                {topDistricts.length > 0 ? (
                  topDistricts.map(([districtName, count]) => {
                    const pct = Math.round((count / (totalSubmissions || 1)) * 100)
                    return (
                      <div key={districtName} className="space-y-0.5">
                        <div className="flex justify-between text-[11px] font-medium text-slate-700">
                          <span>{districtName} District</span>
                          <span className="font-mono font-bold text-[#26205F]">{count} ({pct}%)</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#26205F] rounded-full"
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-[11px] text-slate-500 italic">No district data available</p>
                )}
              </div>
            </div>

            {/* Insight Card 4: Queue Velocity & Status Breakdown */}
            <div className="p-3.5 bg-purple-50/60 rounded-xl border border-purple-100 space-y-2">
              <span className="text-[10px] font-bold text-[#26205F] uppercase tracking-wider block">
                QUEUE STATUS SUMMARY
              </span>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white p-2 rounded-lg border border-purple-100">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">PENDING</span>
                  <span className="font-extrabold text-amber-700 font-mono">{awaitingReviewCount}</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-purple-100">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">VERIFIED</span>
                  <span className="font-extrabold text-emerald-700 font-mono">{verifiedCount}</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-purple-100">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">REJECTED</span>
                  <span className="font-extrabold text-slate-600 font-mono">{rejectedCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



