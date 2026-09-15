import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { api } from '../lib/api'

export default function ProjectDetailView() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadProject = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.getProject(id)
      const p = res?.projects?.[0]
      if (p) {
        setProject(p)
      } else {
        setError(`Project ${id} not found.`)
      }
    } catch (err) {
      console.warn('[Project Detail Error]:', err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) loadProject()
  }, [id])

  const progress = project?.progress_percent ?? 0
  const isCompleted = project?.status === 'COMPLETED'
  const milestones = project?.milestones || []

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-[#FAF8FF] via-white to-[#F6F3FB] text-on-surface">
      <main className="flex-grow pt-8 pb-20 px-6 md:px-margin-desktop max-w-[1240px] mx-auto w-full space-y-8">
        {/* Back Navigation */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/university/projects')}
            className="inline-flex items-center gap-1.5 text-brand-indigo hover:text-brand-violet font-label-md text-xs font-bold transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span> Back to Projects Portfolio
          </button>

          {isCompleted && (
            <button
              type="button"
              onClick={() => navigate(`/completed-solution/${project.id}`)}
              className="bg-brand-teal text-white px-5 py-2 rounded-full font-label-md text-xs font-bold hover:bg-emerald-700 transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
            >
              <span>View Deployed Solution</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
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
            <p className="text-sm font-bold text-brand-indigo">Loading project workspace...</p>
          </div>
        )}

        {!loading && project && (
          <>
            {/* Header */}
            <div className="space-y-2 border-b border-outline-variant/60 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${
                      isCompleted
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-brand-teal/10 text-brand-teal border-brand-teal/20'
                    }`}
                  >
                    {isCompleted ? 'DEPLOYED SOLUTION' : 'ACTIVE PROJECT WORKSPACE'}
                  </span>
                  <span className="text-xs text-on-surface-variant font-semibold">
                    • ID: {project.id.slice(0, 8).toUpperCase()}
                  </span>
                </div>

                <h1 className="font-display-lg text-brand-indigo text-3xl sm:text-4xl font-extrabold tracking-tight">
                  {project.challenge_title}
                </h1>
                <p className="text-xs text-on-surface-variant">
                  Mentor: <strong className="text-brand-indigo">{project.mentor_name}</strong> • Team:{' '}
                  <strong className="text-brand-indigo">{project.team_name}</strong>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-brand-indigo bg-brand-indigo/10 px-3 py-1.5 rounded-full">
                  TRL {project.trl_stage} • {progress}% Progress
                </span>
              </div>
            </div>

            {/* HORIZONTAL LIFECYCLE BAR */}
            <div className="bg-white p-5 rounded-2xl border border-outline-variant/70 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-brand-indigo uppercase tracking-wider block">
                  PROJECT LIFECYCLE STAGES
                </span>
                <span className="text-xs font-bold text-brand-violet">
                  Overall Completion: {progress}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-surface-container-low rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isCompleted ? 'bg-emerald-600' : 'bg-brand-indigo'
                  }`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <div className="overflow-x-auto pb-1 pt-2">
                <div className="min-w-[700px] flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-1 text-emerald-700">
                    <span className="material-symbols-outlined text-base">check_circle</span>
                    <span>1. Proposal Accepted</span>
                  </div>
                  <span className="text-outline-variant/80">──</span>
                  <div className={`flex items-center gap-1 ${progress >= 25 ? 'text-emerald-700' : 'text-on-surface-variant'}`}>
                    <span className="material-symbols-outlined text-base">{progress >= 25 ? 'check_circle' : 'radio_button_unchecked'}</span>
                    <span>2. Research & Design</span>
                  </div>
                  <span className="text-outline-variant/80">──</span>
                  <div className={`flex items-center gap-1 ${progress >= 50 ? 'text-emerald-700' : 'text-on-surface-variant'}`}>
                    <span className="material-symbols-outlined text-base">{progress >= 50 ? 'check_circle' : 'radio_button_unchecked'}</span>
                    <span>3. Lab Assembly</span>
                  </div>
                  <span className="text-outline-variant/80">──</span>
                  <div className={`flex items-center gap-1 ${progress >= 75 ? 'text-emerald-700' : 'text-on-surface-variant'}`}>
                    <span className="material-symbols-outlined text-base">{progress >= 75 ? 'check_circle' : 'radio_button_unchecked'}</span>
                    <span>4. Field Testing</span>
                  </div>
                  <span className="text-outline-variant/80">──</span>
                  <div className={`flex items-center gap-1 ${isCompleted ? 'text-emerald-700' : 'text-on-surface-variant'}`}>
                    <span className="material-symbols-outlined text-base">{isCompleted ? 'verified' : 'radio_button_unchecked'}</span>
                    <span>5. Deployed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* TWO COLUMN LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT CONTENT (8 COLS) — PROJECT MILESTONES */}
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-outline-variant/70 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
                    <h2 className="font-headline-md text-brand-indigo text-lg font-bold">
                      Project Milestones ({project.completed_milestones_count} / {project.milestones_count})
                    </h2>
                    <span className="text-xs text-on-surface-variant">Click any milestone to update status</span>
                  </div>

                  <div className="space-y-3">
                    {milestones.length > 0 ? (
                      milestones.map((m, idx) => {
                        const mCompleted = m.status === 'COMPLETED' || m.status === 'PASSED'
                        const mInProgress = m.status === 'IN_PROGRESS'

                        return (
                          <div
                            key={m.id}
                            onClick={() => navigate(`/project/milestone/${m.id}`, { state: { project } })}
                            className={`p-4 rounded-xl border flex items-center justify-between gap-4 cursor-pointer transition-all ${
                              mCompleted
                                ? 'bg-emerald-50/50 border-emerald-200 hover:bg-emerald-50'
                                : mInProgress
                                ? 'bg-white border-brand-indigo shadow-2xs hover:shadow-xs'
                                : 'bg-surface-container-low border-outline-variant/40 hover:bg-white'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className={`material-symbols-outlined text-lg ${
                                  mCompleted
                                    ? 'text-emerald-600'
                                    : mInProgress
                                    ? 'text-brand-violet animate-pulse'
                                    : 'text-on-surface-variant/40'
                                }`}
                              >
                                {mCompleted ? 'check_circle' : mInProgress ? 'pending' : 'radio_button_unchecked'}
                              </span>
                              <div>
                                <div className="font-bold text-brand-indigo text-xs sm:text-sm">
                                  {idx + 1}. {m.title}
                                </div>
                                <div className="text-[11px] text-on-surface-variant line-clamp-1">
                                  {m.description}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  mCompleted
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : mInProgress
                                    ? 'bg-brand-violet/10 text-brand-violet'
                                    : 'bg-surface-container-high text-on-surface-variant'
                                }`}
                              >
                                {m.status}
                              </span>
                              <span className="material-symbols-outlined text-sm text-on-surface-variant">
                                arrow_forward
                              </span>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="p-4 bg-surface-container-low rounded-xl text-center text-xs text-on-surface-variant">
                        No milestones created yet.
                      </div>
                    )}
                  </div>
                </div>

                {/* Challenge & Problem Statement */}
                <div className="bg-white p-6 rounded-2xl border border-outline-variant/70 shadow-2xs space-y-3">
                  <h2 className="font-headline-md text-brand-indigo text-base font-bold uppercase tracking-wider">
                    Target Problem Specification
                  </h2>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    {project.challenge_description}
                  </p>
                </div>
              </div>

              {/* RIGHT SIDEBAR (4 COLS) */}
              <div className="lg:col-span-4 space-y-6 sticky top-28">
                {/* Team Info */}
                <div className="bg-white p-6 rounded-2xl border border-outline-variant/70 shadow-2xs space-y-4 text-xs">
                  <h3 className="font-headline-sm text-brand-indigo text-sm font-bold uppercase tracking-wider border-b border-outline-variant/40 pb-2">
                    INNOVATION TEAM
                  </h3>
                  <div>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase block">TEAM NAME</span>
                    <span className="font-bold text-brand-indigo text-sm">{project.team_name}</span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase block">
                      MEMBERS ({project.members?.length || 1})
                    </span>
                    {(project.members || []).map((mem, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-surface-container-low rounded-lg">
                        <span className="font-medium text-brand-indigo">{mem.email}</span>
                        <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded text-brand-violet uppercase">
                          {mem.role || 'Member'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Evaluation Rubric Card (if exists) */}
                {project.rubric && (
                  <div className="bg-white p-6 rounded-2xl border border-outline-variant/70 shadow-2xs space-y-3 text-xs">
                    <div className="flex items-center justify-between border-b border-outline-variant/40 pb-2">
                      <span className="font-bold text-brand-indigo uppercase text-[11px]">EVALUATION RUBRIC</span>
                      <span className="font-mono font-extrabold text-brand-indigo">{project.rubric.total_score} / 50</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
                      <div className="p-2 bg-surface-container-low rounded">
                        <span className="block text-on-surface-variant font-bold">FEASIBILITY</span>
                        <span className="font-bold text-brand-indigo">{project.rubric.score_feasibility}/15</span>
                      </div>
                      <div className="p-2 bg-surface-container-low rounded">
                        <span className="block text-on-surface-variant font-bold">IMPACT</span>
                        <span className="font-bold text-brand-indigo">{project.rubric.score_impact}/15</span>
                      </div>
                      <div className="p-2 bg-surface-container-low rounded">
                        <span className="block text-on-surface-variant font-bold">INNOVATION</span>
                        <span className="font-bold text-brand-indigo">{project.rubric.score_innovation}/10</span>
                      </div>
                      <div className="p-2 bg-surface-container-low rounded">
                        <span className="block text-on-surface-variant font-bold">TEAM</span>
                        <span className="font-bold text-brand-indigo">{project.rubric.score_team}/10</span>
                      </div>
                    </div>
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
