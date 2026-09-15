import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router'
import { api } from '../lib/api'

export default function MilestoneDetailView() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()

  const [milestone, setMilestone] = useState(null)
  const [project, setProject] = useState(location.state?.project || null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState(null)
  const [evidenceUrl, setEvidenceUrl] = useState('')
  const [successMsg, setSuccessMsg] = useState(null)

  const loadMilestone = async () => {
    setLoading(true)
    setError(null)
    try {
      // Fetch projects to find milestone
      const res = await api.getProjects()
      const projects = res?.projects || []
      for (const p of projects) {
        const found = (p.milestones || []).find((m) => m.id === id)
        if (found) {
          setMilestone(found)
          setProject(p)
          if (found.evidence_url) {
            setEvidenceUrl(found.evidence_url)
          }
          break
        }
      }
    } catch (err) {
      console.warn('[Milestone Detail Error]:', err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) loadMilestone()
  }, [id])

  const handleUpdateStatus = async (newStatus) => {
    setUpdating(true)
    setError(null)
    setSuccessMsg(null)
    try {
      const res = await api.updateMilestone({
        id,
        status: newStatus,
        evidence_url: evidenceUrl.trim() || undefined,
      })

      setSuccessMsg(`Milestone updated to ${newStatus}. Overall project progress: ${res.progress_percent}%.`)
      setMilestone((prev) => ({
        ...prev,
        status: newStatus,
        evidence_url: evidenceUrl.trim() || prev?.evidence_url,
      }))

      if (res.project_status === 'COMPLETED') {
        setSuccessMsg('🎉 All project milestones completed! Project is now DEPLOYED.')
      }
    } catch (err) {
      console.error('[Milestone Update Error]:', err)
      setError(`Failed to update milestone: ${err.message}`)
    } finally {
      setUpdating(false)
    }
  }

  const isCompleted = milestone?.status === 'COMPLETED' || milestone?.status === 'PASSED'

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-[#FAF8FF] via-white to-[#F6F3FB] text-on-surface">
      <main className="flex-grow pt-8 pb-20 px-6 md:px-margin-desktop max-w-[1240px] mx-auto w-full space-y-8">
        {/* Back Navigation */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(project?.id ? `/project/${project.id}` : '/university/projects')}
            className="inline-flex items-center gap-1.5 text-brand-indigo hover:text-brand-violet font-label-md text-xs font-bold transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span> Back to Project Overview
          </button>

          {project?.id && (
            <button
              type="button"
              onClick={() => navigate(`/project/${project.id}`)}
              className="text-xs font-bold text-brand-indigo hover:text-brand-violet transition-colors cursor-pointer"
            >
              View Project Workspace &rarr;
            </button>
          )}
        </div>

        {error && (
          <div className="p-4 bg-error-container text-on-error-container text-xs rounded-2xl border border-error/20 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-error">error</span>
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-emerald-50 text-emerald-800 text-xs rounded-2xl border border-emerald-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-emerald-600">check_circle</span>
              <span className="font-semibold">{successMsg}</span>
            </div>
            {project?.id && (
              <button
                type="button"
                onClick={() => navigate(`/completed-solution/${project.id}`)}
                className="bg-emerald-700 text-white px-3 py-1 rounded-full text-[11px] font-bold hover:bg-emerald-800 transition-all cursor-pointer"
              >
                View Deployed Solution &rarr;
              </button>
            )}
          </div>
        )}

        {loading && (
          <div className="bg-white p-12 rounded-3xl border border-outline-variant/70 text-center space-y-3">
            <span className="material-symbols-outlined animate-spin text-4xl text-brand-indigo">progress_activity</span>
            <p className="text-sm font-bold text-brand-indigo">Loading milestone details...</p>
          </div>
        )}

        {!loading && milestone && (
          <>
            {/* Header */}
            <div className="space-y-2 border-b border-outline-variant/60 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-brand-indigo uppercase tracking-widest bg-brand-indigo/10 border border-brand-indigo/20 px-3 py-1 rounded-full">
                    PROJECT MILESTONE
                  </span>
                  <span className="text-xs text-on-surface-variant font-semibold">
                    • Project: {project?.challenge_title || 'Innovation Challenge'}
                  </span>
                </div>
                <h1 className="font-display-lg text-brand-indigo text-3xl sm:text-4xl font-extrabold tracking-tight">
                  {milestone.title}
                </h1>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-low border border-outline-variant/60 text-xs font-bold">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isCompleted ? 'bg-emerald-600' : 'bg-brand-violet animate-pulse'
                  }`}
                ></span>
                <span className="text-brand-indigo font-bold">Status: {milestone.status}</span>
              </div>
            </div>

            {/* CONTENT (8 COLS / 4 COLS) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-outline-variant/70 shadow-2xs space-y-4">
                  <h2 className="font-headline-md text-brand-indigo text-lg font-bold">
                    Milestone Specification & Scope
                  </h2>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">
                    {milestone.description || 'Milestone verification requirements and technical criteria.'}
                  </p>

                  <div className="pt-2 border-t border-outline-variant/40 space-y-2">
                    <label className="text-xs font-bold text-brand-indigo block">
                      Verification Evidence URL / Lab Report Link
                    </label>
                    <input
                      type="url"
                      placeholder="https://github.com/team/prototype-docs or lab report link..."
                      value={evidenceUrl}
                      onChange={(e) => setEvidenceUrl(e.target.value)}
                      className="w-full p-3 bg-white rounded-xl border border-outline-variant/70 text-xs text-brand-indigo focus:outline-none focus:border-brand-violet"
                    />
                  </div>
                </div>

                {/* Status Update Actions */}
                <div className="bg-white p-6 rounded-2xl border border-outline-variant/70 shadow-2xs space-y-4">
                  <h2 className="font-headline-md text-brand-indigo text-lg font-bold">
                    Milestone Progression & Sign-off
                  </h2>

                  <p className="text-xs text-on-surface-variant">
                    Update the milestone stage to reflect current engineering progress. Once all milestones are marked completed, the solution automatically advances to Deployed status.
                  </p>

                  <div className="flex items-center gap-3 pt-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus('COMPLETED')}
                      disabled={updating || isCompleted}
                      className="bg-emerald-700 text-white px-5 py-2.5 rounded-full font-label-md text-xs font-bold hover:bg-emerald-800 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-xs"
                    >
                      <span className="material-symbols-outlined text-base">check_circle</span>
                      <span>{isCompleted ? 'Milestone Completed' : updating ? 'Updating...' : 'Mark as Completed'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleUpdateStatus('IN_PROGRESS')}
                      disabled={updating}
                      className="bg-brand-indigo text-white px-5 py-2.5 rounded-full font-label-md text-xs font-bold hover:bg-brand-violet transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-xs"
                    >
                      <span className="material-symbols-outlined text-base">pending</span>
                      <span>Set In Progress</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column (4 cols) */}
              <div className="lg:col-span-4 space-y-6 sticky top-28">
                <div className="bg-white p-5 rounded-2xl border border-outline-variant/70 shadow-2xs space-y-3 text-xs">
                  <span className="text-[10px] font-bold text-brand-indigo uppercase tracking-wider block">
                    TARGET DEADLINE
                  </span>
                  <div className="font-bold text-brand-indigo text-sm">
                    {milestone.due_date ? new Date(milestone.due_date).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : '60 Days from Launch'}
                  </div>
                  <p className="text-on-surface-variant text-[11px]">
                    Milestone verified under Ranchi University Institutional Framework.
                  </p>
                </div>

                {project && (
                  <div className="bg-white p-5 rounded-2xl border border-outline-variant/70 shadow-2xs space-y-3 text-xs">
                    <span className="text-[10px] font-bold text-brand-indigo uppercase tracking-wider block">
                      PROJECT STATUS
                    </span>
                    <div className="font-bold text-brand-indigo text-sm">
                      {project.status === 'COMPLETED' ? 'Deployed Solution' : 'Active Prototype'}
                    </div>
                    <div className="text-on-surface-variant text-[11px]">
                      Team: <strong className="text-brand-indigo">{project.team_name}</strong>
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
