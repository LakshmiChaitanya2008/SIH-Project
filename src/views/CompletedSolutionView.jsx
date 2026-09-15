import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { api } from '../lib/api'

export default function CompletedSolutionView() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadSolution = async () => {
    setLoading(true)
    setError(null)
    try {
      if (id) {
        const res = await api.getProject(id)
        const p = res?.projects?.[0]
        if (p) {
          setProject(p)
        } else {
          setError(`Deployed project ${id} not found.`)
        }
      } else {
        const res = await api.getProjects('status=COMPLETED')
        const p = res?.projects?.[0]
        if (p) {
          setProject(p)
        }
      }
    } catch (err) {
      console.warn('[Completed Solution Error]:', err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSolution()
  }, [id])

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

          {project && (
            <button
              type="button"
              onClick={() => navigate(`/project/${project.id}`)}
              className="text-xs font-bold text-brand-indigo hover:text-brand-violet transition-colors cursor-pointer"
            >
              View Milestone Workspace &rarr;
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
            <p className="text-sm font-bold text-brand-indigo">Loading deployed solution dossier...</p>
          </div>
        )}

        {!loading && !project && (
          <div className="bg-surface-container-low p-12 rounded-3xl border border-outline-variant/60 text-center space-y-4 max-w-lg mx-auto">
            <span className="material-symbols-outlined text-5xl text-brand-teal/50">verified</span>
            <div className="space-y-1">
              <h3 className="font-headline-md text-brand-indigo text-lg font-bold">No Deployed Solutions Yet</h3>
              <p className="text-xs text-on-surface-variant">
                When student innovation teams complete all milestone stages and submit field verification, their deployed solutions are showcased here.
              </p>
            </div>
            <div>
              <button
                type="button"
                onClick={() => navigate('/university/projects')}
                className="bg-brand-indigo text-white px-5 py-2.5 rounded-full font-label-md text-xs font-bold hover:bg-brand-violet transition-all cursor-pointer shadow-xs"
              >
                Browse Active Projects
              </button>
            </div>
          </div>
        )}

        {!loading && project && (
          <>
            {/* Header */}
            <div className="space-y-2 border-b border-outline-variant/60 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                    DEPLOYED SOLUTION
                  </span>
                  <span className="text-xs text-on-surface-variant font-semibold">
                    • Ranchi University Innovation Hub
                  </span>
                </div>
                <h1 className="font-display-lg text-brand-indigo text-3xl sm:text-4xl font-extrabold tracking-tight">
                  {project.challenge_title}
                </h1>
                <p className="text-xs text-on-surface-variant">
                  Civic Challenge Reference: <strong className="text-brand-indigo">{project.challenge_id.slice(0, 8).toUpperCase()}</strong>
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs font-bold shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                Field Deployed & Active
              </div>
            </div>

            {/* IMPACT SUMMARY METRICS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-outline-variant/70 shadow-2xs space-y-1 text-center">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase block">CITIZENS BENEFITED</span>
                <div className="text-2xl font-extrabold text-brand-indigo font-mono">14,200</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-outline-variant/70 shadow-2xs space-y-1 text-center">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase block">VILLAGES &amp; BLOCKS COVERED</span>
                <div className="text-2xl font-extrabold text-brand-teal font-mono">12 Villages · 3 Blocks</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-outline-variant/70 shadow-2xs space-y-1 text-center">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase block">EVALUATION RUBRIC</span>
                <div className="text-2xl font-extrabold text-brand-indigo font-mono">
                  {project.rubric?.total_score || 46} / 50
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-outline-variant/70 shadow-2xs space-y-1 text-center">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase block">DEPLOYMENT STATUS</span>
                <div className="text-2xl font-extrabold text-emerald-600 font-mono">100% Deployed</div>
              </div>
            </div>

            {/* BEFORE / AFTER MEASUREMENT & FIELD IMPACT */}
            <div className="bg-gradient-to-r from-brand-indigo/10 via-brand-violet/10 to-brand-teal/10 p-6 rounded-3xl border border-brand-indigo/20 space-y-3 text-xs">
              <span className="font-bold text-brand-indigo uppercase text-[11px] tracking-wider block flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-brand-teal">trending_up</span>
                MEASURABLE COMMUNITY IMPACT &amp; FIELD VERIFICATION
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div className="bg-white/90 p-4 rounded-2xl border border-outline-variant/40 space-y-1">
                  <span className="text-[10px] font-bold text-on-surface-variant block uppercase">BEFORE DEPLOYMENT</span>
                  <p className="font-bold text-rose-700 text-xs">8.8/10 Fluoride &amp; Sediment Contamination</p>
                  <p className="text-[11px] text-on-surface-variant">32 citizen reports across Gumla primary schools</p>
                </div>
                <div className="bg-white/90 p-4 rounded-2xl border border-outline-variant/40 space-y-1">
                  <span className="text-[10px] font-bold text-on-surface-variant block uppercase">FIELD PROTOTYPE RESULT</span>
                  <p className="font-bold text-emerald-700 text-xs font-mono">99.4% Heavy Metal &amp; Fluoride Removal</p>
                  <p className="text-[11px] text-on-surface-variant">50L/hr activated zeolite filtration with IoT telemetry</p>
                </div>
                <div className="bg-white/90 p-4 rounded-2xl border border-outline-variant/40 space-y-1">
                  <span className="text-[10px] font-bold text-on-surface-variant block uppercase">SCALABILITY &amp; ADOPTION</span>
                  <p className="font-bold text-brand-indigo text-xs">Adopted by Jharkhand Water Mission</p>
                  <p className="text-[11px] text-on-surface-variant">Commissioned across 12 village borewells</p>
                </div>
              </div>
            </div>

            {/* DETAILS & FIELD IMPLEMENTATION */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-outline-variant/70 shadow-2xs space-y-3">
                  <h2 className="font-headline-md text-brand-indigo text-lg font-bold">
                    Target Civic Challenge
                  </h2>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    {project.challenge_description}
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-outline-variant/70 shadow-2xs space-y-3">
                  <h2 className="font-headline-md text-brand-indigo text-lg font-bold">
                    Verified Milestones Completed
                  </h2>
                  <div className="space-y-2">
                    {(project.milestones || []).map((m, idx) => (
                      <div key={idx} className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-emerald-600 text-sm">check_circle</span>
                          <span className="font-bold text-brand-indigo">{m.title}</span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          VERIFIED
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT SIDEBAR */}
              <div className="lg:col-span-4 space-y-6 sticky top-28">
                <div className="bg-white p-5 rounded-2xl border border-outline-variant/70 shadow-2xs space-y-3 text-xs">
                  <span className="text-[10px] font-bold text-brand-indigo uppercase block">PROJECT CREDITS</span>
                  <div>
                    <span className="text-on-surface-variant block text-[11px]">FACULTY MENTOR</span>
                    <span className="font-bold text-brand-indigo">{project.mentor_name}</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block text-[11px]">STUDENT INNOVATION TEAM</span>
                    <span className="font-bold text-brand-indigo">{project.team_name}</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block text-[11px]">DEPLOYMENT TIMESTAMP</span>
                    <span className="font-bold text-brand-indigo">
                      {project.updated_at ? new Date(project.updated_at).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : 'September 2026'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
