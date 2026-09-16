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
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans pb-16">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Back Navigation */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/admin/projects')}
            className="inline-flex items-center gap-1.5 text-[#26205F] hover:text-purple-900 text-xs font-semibold transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span> Back to Projects Portfolio
          </button>

          {project && (
            <button
              type="button"
              onClick={() => navigate(`/admin/problem/pattern-001`)}
              className="text-xs font-semibold text-[#26205F] hover:text-purple-900 transition-colors cursor-pointer"
            >
              View Milestone Workspace &rarr;
            </button>
          )}
        </div>

        {error && (
          <div className="p-4 bg-rose-50 text-rose-800 text-xs rounded-xl border border-rose-200 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-rose-600">error</span>
            <span>{error}</span>
          </div>
        )}

        {loading && (
          <div className="bg-white p-12 rounded-2xl border border-slate-200/80 text-center space-y-3">
            <span className="material-symbols-outlined animate-spin text-4xl text-[#26205F]">progress_activity</span>
            <p className="text-xs font-bold text-[#26205F]">Loading deployed solution dossier...</p>
          </div>
        )}

        {!loading && !project && (
          <div className="bg-white p-12 rounded-2xl border border-slate-200/80 text-center space-y-4 max-w-lg mx-auto shadow-2xs">
            <span className="material-symbols-outlined text-5xl text-emerald-600">verified</span>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#26205F]">No Deployed Solutions Yet</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                When student innovation teams complete all milestone stages and submit field verification, their deployed solutions are showcased here.
              </p>
            </div>
            <div>
              <button
                type="button"
                onClick={() => navigate('/admin/projects')}
                className="bg-[#26205F] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-purple-900 transition-all cursor-pointer shadow-2xs"
              >
                Browse Active Projects
              </button>
            </div>
          </div>
        )}

        {!loading && project && (
          <>
            {/* Header */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    DEPLOYED SOLUTION DOSSIER
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    • Ranchi University Innovation Hub
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#26205F] tracking-tight">
                  {project.challenge_title}
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Civic Challenge Reference: <strong className="text-[#26205F]">{project.challenge_id.slice(0, 8).toUpperCase()}</strong>
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                Field Deployed &amp; Active
              </div>
            </div>

            {/* IMPACT SUMMARY METRICS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">CITIZENS BENEFITED</span>
                <div className="text-2xl font-extrabold text-[#26205F] font-mono">14,200</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">VILLAGES &amp; BLOCKS COVERED</span>
                <div className="text-xl font-extrabold text-purple-800 font-mono">12 Villages · 3 Blocks</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">EVALUATION RUBRIC</span>
                <div className="text-2xl font-extrabold text-[#26205F] font-mono">
                  {project.rubric?.total_score || 46} / 50
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">DEPLOYMENT STATUS</span>
                <div className="text-2xl font-extrabold text-emerald-600 font-mono">100% Deployed</div>
              </div>
            </div>

            {/* BEFORE / AFTER MEASUREMENT & FIELD IMPACT */}
            <div className="bg-gradient-to-r from-purple-50 via-slate-50 to-indigo-50/50 p-6 rounded-2xl border border-purple-200/60 space-y-3 text-xs">
              <span className="font-bold text-[#26205F] uppercase text-[11px] tracking-wider block flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-purple-600">trending_up</span>
                MEASURABLE COMMUNITY IMPACT &amp; FIELD VERIFICATION
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div className="bg-white/90 p-4 rounded-xl border border-slate-200/60 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">BEFORE DEPLOYMENT</span>
                  <p className="font-bold text-rose-700 text-xs">8.8/10 Fluoride &amp; Sediment Contamination</p>
                  <p className="text-[11px] text-slate-500">32 citizen reports across Gumla primary schools</p>
                </div>
                <div className="bg-white/90 p-4 rounded-xl border border-slate-200/60 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">FIELD PROTOTYPE RESULT</span>
                  <p className="font-bold text-emerald-700 text-xs font-mono">99.4% Heavy Metal &amp; Fluoride Removal</p>
                  <p className="text-[11px] text-slate-500">50L/hr activated zeolite filtration with IoT telemetry</p>
                </div>
                <div className="bg-white/90 p-4 rounded-xl border border-slate-200/60 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">SCALABILITY &amp; ADOPTION</span>
                  <p className="font-bold text-[#26205F] text-xs">Adopted by Jharkhand Water Mission</p>
                  <p className="text-[11px] text-slate-500">Commissioned across 12 village borewells</p>
                </div>
              </div>
            </div>

            {/* DETAILS & FIELD IMPLEMENTATION */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                  <h2 className="text-base font-bold text-[#26205F]">
                    Target Civic Challenge
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {project.challenge_description}
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                  <h2 className="text-base font-bold text-[#26205F]">
                    Verified Milestones Completed
                  </h2>
                  <div className="space-y-2">
                    {(project.milestones || []).map((m, idx) => (
                      <div key={idx} className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
                          <span className="font-semibold text-[#26205F]">{m.title}</span>
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
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3 text-xs">
                  <span className="text-[10px] font-bold text-[#26205F] uppercase block">PROJECT CREDITS</span>
                  <div>
                    <span className="text-slate-400 block text-[11px]">FACULTY MENTOR</span>
                    <span className="font-bold text-[#26205F]">{project.mentor_name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">STUDENT INNOVATION TEAM</span>
                    <span className="font-bold text-[#26205F]">{project.team_name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">DEPLOYMENT TIMESTAMP</span>
                    <span className="font-bold text-[#26205F]">
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
