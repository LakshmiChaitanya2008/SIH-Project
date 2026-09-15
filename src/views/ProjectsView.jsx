import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { api } from '../lib/api'

export default function ProjectsView() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadProjects = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.getProjects()
      if (res?.projects) {
        setProjects(res.projects)
      }
    } catch (err) {
      console.warn('[ProjectsView Error]:', err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  const filteredProjects = projects.filter((p) => {
    if (activeTab === 'all') return true
    if (activeTab === 'active') return p.status === 'ACTIVE'
    if (activeTab === 'completed') return p.status === 'COMPLETED'
    if (activeTab === 'planning') return p.status === 'PLANNING'
    return true
  })

  const activeCount = projects.filter((p) => p.status === 'ACTIVE').length
  const completedCount = projects.filter((p) => p.status === 'COMPLETED').length
  const planningCount = projects.filter((p) => p.status === 'PLANNING').length

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-[#FAF8FF] via-white to-[#F6F3FB] text-on-surface">
      <main className="flex-grow pt-8 pb-20 px-6 md:px-margin-desktop max-w-[1240px] mx-auto w-full space-y-8">
        {/* Header */}
        <div className="space-y-2 border-b border-outline-variant/60 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-brand-indigo uppercase tracking-widest bg-brand-indigo/10 border border-brand-indigo/20 px-3 py-1 rounded-full">
                PROJECT PORTFOLIO
              </span>
              <span className="text-xs text-on-surface-variant font-semibold">• Ranchi University Innovation Hub</span>
            </div>
            <h1 className="font-display-lg text-brand-indigo text-3xl sm:text-4xl font-extrabold tracking-tight">
              University Innovation Projects
            </h1>
            <p className="text-xs text-on-surface-variant">
              Track student engineering prototypes progressing through institutional milestone stages to community field deployment.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-error-container text-on-error-container text-xs rounded-2xl border border-error/20 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-error">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* TABS */}
        <div className="flex items-center gap-2 border-b border-outline-variant/60 overflow-x-auto pb-1 text-xs sm:text-sm font-bold">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 shrink-0 cursor-pointer ${
              activeTab === 'all'
                ? 'text-brand-indigo border-b-2 border-brand-indigo font-bold'
                : 'text-on-surface-variant hover:text-brand-indigo font-semibold'
            }`}
          >
            ALL ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 shrink-0 cursor-pointer ${
              activeTab === 'active'
                ? 'text-brand-indigo border-b-2 border-brand-indigo font-bold'
                : 'text-on-surface-variant hover:text-brand-indigo font-semibold'
            }`}
          >
            ACTIVE ({activeCount})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 shrink-0 cursor-pointer ${
              activeTab === 'completed'
                ? 'text-brand-indigo border-b-2 border-brand-indigo font-bold'
                : 'text-on-surface-variant hover:text-brand-indigo font-semibold'
            }`}
          >
            DEPLOYED ({completedCount})
          </button>
          <button
            onClick={() => setActiveTab('planning')}
            className={`px-4 py-2 shrink-0 cursor-pointer ${
              activeTab === 'planning'
                ? 'text-brand-indigo border-b-2 border-brand-indigo font-bold'
                : 'text-on-surface-variant hover:text-brand-indigo font-semibold'
            }`}
          >
            UNDER REVIEW ({planningCount})
          </button>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="bg-white p-12 rounded-3xl border border-outline-variant/70 text-center space-y-3">
            <span className="material-symbols-outlined animate-spin text-4xl text-brand-indigo">progress_activity</span>
            <p className="text-sm font-bold text-brand-indigo">Loading live innovation projects...</p>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && filteredProjects.length === 0 && (
          <div className="bg-surface-container-low p-12 rounded-3xl border border-outline-variant/60 text-center space-y-4 max-w-lg mx-auto">
            <span className="material-symbols-outlined text-5xl text-brand-indigo/40">rocket_launch</span>
            <div className="space-y-1">
              <h3 className="font-headline-md text-brand-indigo text-lg font-bold">No Projects Found</h3>
              <p className="text-xs text-on-surface-variant">
                When student teams submit proposals and faculty mentors approve them, live projects and milestones will appear here.
              </p>
            </div>
            <div>
              <button
                type="button"
                onClick={() => navigate('/challenges')}
                className="bg-brand-indigo text-white px-5 py-2.5 rounded-full font-label-md text-xs font-bold hover:bg-brand-violet transition-all cursor-pointer shadow-xs"
              >
                Browse Open Challenges
              </button>
            </div>
          </div>
        )}

        {/* PROJECT CARDS */}
        {!loading && filteredProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map((p) => {
              const isCompleted = p.status === 'COMPLETED'
              const progress = p.progress_percent || (isCompleted ? 100 : p.status === 'ACTIVE' ? 25 : 0)

              return (
                <div
                  key={p.id}
                  className={`bg-white p-6 rounded-2xl border shadow-2xs transition-all space-y-4 flex flex-col justify-between ${
                    isCompleted ? 'border-emerald-300 hover:border-emerald-500' : 'border-outline-variant/70 hover:border-brand-indigo'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full border ${
                          isCompleted
                            ? 'text-emerald-800 bg-emerald-50 border-emerald-200'
                            : p.status === 'ACTIVE'
                            ? 'text-brand-violet bg-brand-violet/10 border-brand-violet/20'
                            : 'text-amber-800 bg-amber-50 border-amber-200'
                        }`}
                      >
                        {isCompleted ? 'Status: Deployed Solution' : p.status === 'ACTIVE' ? 'Phase: Active Prototype' : 'Status: Under Evaluation'}
                      </span>
                      <span className="text-xs font-mono font-bold text-brand-indigo">{progress}% Progress</span>
                    </div>

                    <h3 className="font-headline-sm text-brand-indigo text-xl font-bold">
                      {p.challenge_title}
                    </h3>
                    <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">
                      {p.challenge_description}
                    </p>

                    <div className="grid grid-cols-2 gap-3 p-3 bg-surface-container-low rounded-xl border border-outline-variant/40 text-xs">
                      <div>
                        <span className="text-[10px] text-on-surface-variant font-bold block uppercase">TEAM</span>
                        <span className="font-bold text-brand-indigo">{p.team_name}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-on-surface-variant font-bold block uppercase">MILESTONES</span>
                        <span className="font-bold text-brand-indigo">
                          {p.completed_milestones_count} / {p.milestones_count} Completed
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-surface-container-low rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCompleted ? 'bg-emerald-600' : 'bg-brand-indigo'
                        }`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    {isCompleted ? (
                      <button
                        type="button"
                        onClick={() => navigate(`/completed-solution/${p.id}`)}
                        className="border border-emerald-500 text-emerald-800 hover:bg-emerald-50 px-5 py-2.5 rounded-full font-label-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>View Deployed Solution</span>
                        <span className="material-symbols-outlined text-base">arrow_forward</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => navigate(`/project/${p.id}`)}
                        className="bg-brand-indigo text-white px-5 py-2.5 rounded-full font-label-md text-xs font-bold hover:bg-brand-violet transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <span>Open Project Workspace</span>
                        <span className="material-symbols-outlined text-base">arrow_forward</span>
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
