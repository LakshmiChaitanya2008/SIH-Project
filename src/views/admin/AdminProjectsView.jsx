import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { api } from '../../lib/api'

export default function AdminProjectsView() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Operational Filters State
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [stageFilter, setStageFilter] = useState('All')
  const [universityFilter, setUniversityFilter] = useState('All')
  const [sortBy, setSortBy] = useState('Recently Updated')

  const loadProjects = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.getProjects()
      if (res?.projects) {
        setProjects(res.projects)
      }
    } catch (err) {
      console.warn('[AdminProjectsView Error]:', err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  // Calculate Real Top Summary Metrics
  const totalProjects = projects.length
  const activeProjects = projects.filter((p) => p.status === 'ACTIVE').length
  const projectsInReview = projects.filter(
    (p) => p.status === 'PLANNING' || p.status === 'PENDING' || p.status === 'UNDER_REVIEW' || p.stage_label === 'PROPOSAL'
  ).length
  const projectsInPilot = projects.filter(
    (p) => p.trl_stage === 5 || p.trl_stage === 6 || p.stage_label === 'PILOT' || p.stage_label === 'TESTING'
  ).length
  const solutionsDeployed = projects.filter(
    (p) => p.status === 'COMPLETED' || p.trl_stage >= 7 || p.stage_label === 'DEPLOYED'
  ).length

  // Extract Real Available Universities dynamically
  const availableUniversities = Array.from(
    new Set(
      projects.map((p) => {
        if (p.mentor_name && p.mentor_name.includes('(')) {
          const match = p.mentor_name.match(/\(([^)]+)\)/)
          if (match) return match[1].replace('Faculty Mentor, ', '').trim()
        }
        return 'Ranchi University'
      })
    )
  )

  // Filter & Sort Projects
  const filteredProjects = projects
    .filter((p) => {
      // Search Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const titleMatch = (p.challenge_title || '').toLowerCase().includes(query)
        const descMatch = (p.challenge_description || '').toLowerCase().includes(query)
        const teamMatch = (p.team_name || '').toLowerCase().includes(query)
        const mentorMatch = (p.mentor_name || '').toLowerCase().includes(query)
        const idMatch = (p.id || '').toLowerCase().includes(query)
        if (!titleMatch && !descMatch && !teamMatch && !mentorMatch && !idMatch) return false
      }

      // Status Filter
      if (statusFilter !== 'All') {
        const statusUpper = statusFilter.toUpperCase()
        if (statusUpper === 'PENDING' && (p.status !== 'PENDING' && p.status !== 'PLANNING')) return false
        if (statusUpper !== 'PENDING' && p.status !== statusUpper) return false
      }

      // Stage Filter
      if (stageFilter !== 'All') {
        const stageUpper = stageFilter.toUpperCase()
        const projectStage = (p.stage_label || '').toUpperCase()
        if (stageUpper === 'PROTOTYPE' && (p.trl_stage !== 3 && p.trl_stage !== 4 && projectStage !== 'PROTOTYPE')) return false
        if (stageUpper === 'DEPLOYMENT' && (p.trl_stage < 7 && projectStage !== 'DEPLOYED')) return false
        if (stageUpper !== 'PROTOTYPE' && stageUpper !== 'DEPLOYMENT' && !projectStage.includes(stageUpper)) return false
      }

      // University Filter
      if (universityFilter !== 'All') {
        const mentorStr = p.mentor_name || ''
        if (!mentorStr.toLowerCase().includes(universityFilter.toLowerCase())) return false
      }

      return true
    })
    .sort((a, b) => {
      if (sortBy === 'Recently Updated') {
        return new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime()
      }
      if (sortBy === 'Highest Progress') {
        return (b.progress_percent || 0) - (a.progress_percent || 0)
      }
      if (sortBy === 'Lowest Progress') {
        return (a.progress_percent || 0) - (b.progress_percent || 0)
      }
      if (sortBy === 'Newest Project') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
      return 0
    })

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans pb-16">
      <main className="max-w-7xl mx-auto space-y-6">
        {/* Section 1 Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold text-[#26205F] uppercase tracking-wider bg-purple-50 border border-purple-200/60 px-2.5 py-0.5 rounded-full">
                ADMIN PROJECT MONITORING
              </span>
              <span className="text-xs text-slate-500 font-medium">• Government Innovation Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Innovation Projects
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Track university-led projects from acceptance through testing, pilot and deployment.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 text-rose-800 text-xs rounded-xl border border-rose-200 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-rose-600">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Section 1 Top Summary Metrics */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-x divide-y sm:divide-y-0 divide-slate-100 text-center">
            <div className="p-4 space-y-1">
              <span className="text-xs font-semibold text-slate-500 block">Total Projects</span>
              <div className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight">{totalProjects}</div>
            </div>
            <div className="p-4 space-y-1">
              <span className="text-xs font-semibold text-slate-500 block">Active Projects</span>
              <div className="text-2xl font-extrabold text-purple-900 font-mono tracking-tight">{activeProjects}</div>
            </div>
            <div className="p-4 space-y-1">
              <span className="text-xs font-semibold text-slate-500 block">Projects in Review</span>
              <div className="text-2xl font-extrabold text-amber-700 font-mono tracking-tight">{projectsInReview}</div>
            </div>
            <div className="p-4 space-y-1">
              <span className="text-xs font-semibold text-slate-500 block">Projects in Pilot</span>
              <div className="text-2xl font-extrabold text-indigo-700 font-mono tracking-tight">{projectsInPilot}</div>
            </div>
            <div className="p-4 space-y-1 bg-emerald-50/50 rounded-r-xl">
              <span className="text-xs font-bold text-emerald-800 block">Solutions Deployed</span>
              <div className="text-2xl font-extrabold text-emerald-700 font-mono tracking-tight">{solutionsDeployed}</div>
            </div>
          </div>
        </div>

        {/* Section 3 Operational Filters */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search project / problem / university / team..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#26205F] transition-colors"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex items-center gap-2 flex-wrap text-xs font-medium">
              {/* Status */}
              <div className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 text-[10px] font-bold uppercase">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Paused">Paused</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Stage */}
              <div className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 text-[10px] font-bold uppercase">Stage:</span>
                <select
                  value={stageFilter}
                  onChange={(e) => setStageFilter(e.target.value)}
                  className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Stages</option>
                  <option value="Proposal">Proposal</option>
                  <option value="Research">Research</option>
                  <option value="Prototype">Prototype</option>
                  <option value="Testing">Testing</option>
                  <option value="Pilot">Pilot</option>
                  <option value="Deployment">Deployment</option>
                  <option value="Impact">Impact</option>
                </select>
              </div>

              {/* University */}
              <div className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 text-[10px] font-bold uppercase">University:</span>
                <select
                  value={universityFilter}
                  onChange={(e) => setUniversityFilter(e.target.value)}
                  className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Universities</option>
                  {availableUniversities.map((uni, idx) => (
                    <option key={idx} value={uni}>
                      {uni}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-1 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200">
                <span className="text-purple-800 text-[10px] font-bold uppercase">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent font-bold text-[#26205F] focus:outline-none cursor-pointer"
                >
                  <option value="Recently Updated">Recently Updated</option>
                  <option value="Highest Progress">Highest Progress</option>
                  <option value="Lowest Progress">Lowest Progress</option>
                  <option value="Newest Project">Newest Project</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="bg-white p-12 rounded-2xl border border-slate-200/80 text-center space-y-3 shadow-2xs">
            <span className="material-symbols-outlined animate-spin text-4xl text-[#26205F]">progress_activity</span>
            <p className="text-xs font-bold text-[#26205F]">Loading operational project directory...</p>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && filteredProjects.length === 0 && (
          <div className="bg-white p-12 rounded-2xl border border-slate-200/80 text-center space-y-4 max-w-lg mx-auto shadow-2xs">
            <span className="material-symbols-outlined text-5xl text-slate-300">work_off</span>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#26205F]">No Projects Match Filters</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Adjust your search terms or filters to display active project records.
              </p>
            </div>
            <div>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setStatusFilter('All')
                  setStageFilter('All')
                  setUniversityFilter('All')
                }}
                className="bg-[#26205F] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-purple-900 transition-all cursor-pointer shadow-2xs"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}

        {/* Section 2 Compact Professional Table */}
        {!loading && filteredProjects.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4">Project</th>
                    <th className="py-3.5 px-3">Community Problem / Challenge</th>
                    <th className="py-3.5 px-3">University</th>
                    <th className="py-3.5 px-3">Team</th>
                    <th className="py-3.5 px-3">Mentor</th>
                    <th className="py-3.5 px-3">Current Stage</th>
                    <th className="py-3.5 px-3">Progress</th>
                    <th className="py-3.5 px-3">Status</th>
                    <th className="py-3.5 px-3">Last Updated</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {filteredProjects.map((p) => {
                    const isCompleted = p.status === 'COMPLETED'
                    const progress = p.progress_percent || (isCompleted ? 100 : p.status === 'ACTIVE' ? 50 : 25)
                    const universityName = p.mentor_name && p.mentor_name.includes('(')
                      ? p.mentor_name.match(/\(([^)]+)\)/)?.[1]?.replace('Faculty Mentor, ', '') || 'Ranchi University'
                      : 'Ranchi University'
                    const mentorShort = p.mentor_name ? p.mentor_name.split('(')[0].trim() : 'Dr. Anjali Kumar'
                    const updatedFormatted = p.updated_at
                      ? new Date(p.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                      : 'Recent'

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                        {/* 1. Project Title */}
                        <td className="py-3.5 px-4 font-bold text-slate-900 max-w-[180px]">
                          <span className="font-mono text-[10px] text-slate-400 block">{p.id}</span>
                          <span className="line-clamp-2 leading-snug group-hover:text-[#26205F] transition-colors">
                            {p.challenge_title}
                          </span>
                        </td>

                        {/* 2. Community Problem */}
                        <td className="py-3.5 px-3 max-w-[200px]">
                          <span className="text-slate-600 line-clamp-2 text-[11px] leading-snug">
                            {p.challenge_description}
                          </span>
                        </td>

                        {/* 3. University */}
                        <td className="py-3.5 px-3 font-semibold text-slate-800">
                          {universityName}
                        </td>

                        {/* 4. Team */}
                        <td className="py-3.5 px-3 font-semibold text-[#26205F]">
                          {p.team_name}
                        </td>

                        {/* 5. Mentor */}
                        <td className="py-3.5 px-3 text-slate-600">
                          {mentorShort}
                        </td>

                        {/* 6. Current Stage */}
                        <td className="py-3.5 px-3">
                          <span className="px-2.5 py-1 rounded-md bg-purple-50 text-purple-900 border border-purple-200 text-[10px] font-bold tracking-wide inline-block">
                            {p.stage_label || `TRL ${p.trl_stage || 4}`}
                          </span>
                        </td>

                        {/* 7. Progress */}
                        <td className="py-3.5 px-3 min-w-[100px]">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                              <span className="text-slate-900">{progress}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${isCompleted ? 'bg-emerald-600' : 'bg-[#26205F]'}`}
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>

                        {/* 8. Status */}
                        <td className="py-3.5 px-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border tracking-wide uppercase inline-block ${
                              isCompleted
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : p.status === 'ACTIVE'
                                ? 'bg-purple-50 text-purple-800 border-purple-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}
                          >
                            {p.status || 'ACTIVE'}
                          </span>
                        </td>

                        {/* 9. Last Updated */}
                        <td className="py-3.5 px-3 text-[11px] text-slate-500 font-mono">
                          {updatedFormatted}
                        </td>

                        {/* 10. Action: Track -> */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => navigate(`/admin/projects/${p.id}`)}
                            className="bg-[#26205F] text-white hover:bg-purple-900 px-3.5 py-1.5 rounded-lg font-bold text-xs shadow-2xs transition-all duration-150 cursor-pointer inline-flex items-center gap-1 group-hover:shadow-xs"
                          >
                            <span>Track</span>
                            <span className="text-sm">&rarr;</span>
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
