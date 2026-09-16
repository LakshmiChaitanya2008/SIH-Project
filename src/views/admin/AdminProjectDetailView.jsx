import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { api } from '../../lib/api'

export default function AdminProjectDetailView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadProjectDetails() {
      setLoading(true)
      setError(null)
      try {
        const res = await api.getProject(id)
        if (res?.projects && res.projects.length > 0) {
          setProject(res.projects[0])
        } else {
          // Fallback: fetch all and find
          const allRes = await api.getProjects()
          const found = allRes?.projects?.find((p) => p.id === id)
          if (found) {
            setProject(found)
          } else {
            setError('Project record not found in Supabase database.')
          }
        }
      } catch (err) {
        console.warn('[AdminProjectDetailView Error]:', err.message)
        setError(err.message || 'Failed to load project details.')
      } finally {
        setLoading(false)
      }
    }
    loadProjectDetails()
  }, [id])

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-200/80 text-center space-y-4 shadow-2xs my-8">
        <span className="material-symbols-outlined animate-spin text-4xl text-[#26205F]">progress_activity</span>
        <p className="text-sm font-bold text-[#26205F]">Loading project operational records...</p>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200/80 text-center space-y-4 max-w-lg mx-auto my-12 shadow-2xs">
        <span className="material-symbols-outlined text-5xl text-rose-500">error</span>
        <h2 className="text-xl font-extrabold text-slate-900">Project Not Found</h2>
        <p className="text-xs text-slate-500 leading-relaxed">{error || 'Unable to locate specified project ID.'}</p>
        <button
          type="button"
          onClick={() => navigate('/admin/projects')}
          className="bg-[#26205F] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-purple-900 transition-all cursor-pointer shadow-2xs"
        >
          ← Return to Projects Directory
        </button>
      </div>
    )
  }

  const isCompleted = project.status === 'COMPLETED'
  const trlStage = project.trl_stage || (isCompleted ? 7 : 4)
  const progressPercent = project.progress_percent || (isCompleted ? 100 : 50)
  const milestones = project.milestones || []
  const completedMilestones = project.completed_milestones_count || milestones.filter((m) => m.status === 'COMPLETED').length

  // Lifecycle Stages Definition
  const lifecycleStages = [
    { key: 'problem', label: 'Community Problem', trl: 0 },
    { key: 'uni_accepted', label: 'University Accepted', trl: 0 },
    { key: 'mentor', label: 'Mentor Assigned', trl: 0 },
    { key: 'team', label: 'Team Formed', trl: 0 },
    { key: 'challenge', label: 'Innovation Challenge', trl: 0 },
    { key: 'proposal', label: 'Proposal Approved', trl: 0 },
    { key: 'active', label: 'Project Active', trl: 0 },
    { key: 'research', label: 'Research (TRL 1-2)', trl: 2 },
    { key: 'prototype', label: 'Prototype (TRL 3-4)', trl: 4 },
    { key: 'testing', label: 'Testing (TRL 5-6)', trl: 6 },
    { key: 'pilot', label: 'Pilot (TRL 6-7)', trl: 7 },
    { key: 'deployment', label: 'Deployment (TRL 7-8)', trl: 8 },
    { key: 'impact', label: 'Impact Verified', trl: 9 },
  ]

  const getStageStatus = (stage, idx) => {
    if (stage.key === 'problem' || stage.key === 'uni_accepted' || stage.key === 'mentor' || stage.key === 'team' || stage.key === 'challenge' || stage.key === 'proposal') {
      return 'completed'
    }
    if (stage.key === 'active') {
      return project.status === 'ACTIVE' || project.status === 'COMPLETED' ? 'completed' : 'current'
    }
    if (stage.key === 'research') {
      return trlStage >= 3 ? 'completed' : trlStage === 2 ? 'current' : 'pending'
    }
    if (stage.key === 'prototype') {
      return trlStage >= 5 ? 'completed' : (trlStage === 3 || trlStage === 4) ? 'current' : 'pending'
    }
    if (stage.key === 'testing') {
      return trlStage >= 7 ? 'completed' : (trlStage === 5 || trlStage === 6) ? 'current' : 'pending'
    }
    if (stage.key === 'pilot') {
      return isCompleted || trlStage >= 8 ? 'completed' : trlStage === 7 ? 'current' : 'pending'
    }
    if (stage.key === 'deployment') {
      return isCompleted || trlStage >= 8 ? 'completed' : 'pending'
    }
    if (stage.key === 'impact') {
      return isCompleted && progressPercent === 100 ? 'completed' : 'pending'
    }
    return 'pending'
  }

  // TRL Labels Mapping
  const trlDescriptions = {
    1: 'Basic Principles Observed',
    2: 'Technology Concept Formulated',
    3: 'Experimental Proof of Concept',
    4: 'Technology Validated in Lab',
    5: 'Technology Validated in Relevant Environment',
    6: 'System Model Demonstrated in Operational Environment',
    7: 'System Prototype Demonstrated in Operational Environment',
    8: 'Actual System Completed & Qualified',
    9: 'Full Operational System Deployed & Proven'
  }

  return (
    <div className="space-y-6 pb-12 text-slate-800 font-sans">
      {/* Top Header & Breadcrumb Nav */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-100 pb-4">
          <button
            type="button"
            onClick={() => navigate('/admin/projects')}
            className="text-xs font-bold text-[#26205F] hover:underline flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Back to Projects Directory</span>
          </button>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border tracking-wide uppercase ${isCompleted
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : project.status === 'ACTIVE'
                    ? 'bg-purple-50 text-purple-800 border-purple-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
            >
              {project.status || 'ACTIVE'}
            </span>
            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
              ID: {project.id}
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold text-[#26205F] uppercase tracking-wider bg-purple-50 border border-purple-200/60 px-2.5 py-0.5 rounded-full">
                ADMIN PROJECT MONITORING
              </span>
              <span className="text-xs text-slate-500 font-semibold">• TRL {trlStage}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {project.challenge_title}
            </h1>
            <p className="text-xs text-slate-600 font-normal leading-relaxed max-w-4xl">
              {project.challenge_description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => navigate(`/admin/problem/${project.challenge_id || '00000000-0000-0000-0002-000000000001'}`)}
              className="bg-white border border-[#26205F] text-[#26205F] hover:bg-purple-50 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span>View Problem Origin</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Project Key Attributes Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 p-4 bg-slate-50/80 rounded-xl border border-slate-200/60 text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">UNIVERSITY</span>
            <span className="font-bold text-slate-900 truncate block">{project.mentor_name?.split('(')[1]?.replace(')', '') || 'Ranchi University'}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">TEAM NAME</span>
            <span className="font-bold text-slate-900 truncate block">{project.team_name}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">FACULTY MENTOR</span>
            <span className="font-bold text-slate-900 truncate block">{project.mentor_name?.split('(')[0] || project.mentor_name}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">CURRENT STAGE</span>
            <span className="font-bold text-[#26205F] block">{project.stage_label || `TRL ${trlStage}`}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">OVERALL PROGRESS</span>
            <span className="font-bold font-mono text-emerald-700 block">{progressPercent}%</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">LAST UPDATED</span>
            <span className="font-semibold text-slate-700 block">
              {project.updated_at ? new Date(project.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently'}
            </span>
          </div>
        </div>
      </div>

      {/* 1. PROJECT LIFECYCLE TRACKER */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Project Lifecycle</h2>
            <p className="text-xs text-slate-500">13-stage progression from community problem identification to statewide impact</p>
          </div>
          <span className="text-xs font-bold text-[#26205F] bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            Current: Stage {trlStage > 4 ? trlStage + 3 : 9} ({project.stage_label || 'PROTOTYPE'})
          </span>
        </div>

        {/* Progression Stepper Horizontal scroll / Responsive layout */}
        <div className="overflow-x-auto pb-4 pt-2">
          <div className="min-w-[980px] flex items-center justify-between relative px-2">
            {/* Connecting line */}
            <div className="absolute left-6 right-6 top-4 h-1 bg-slate-200 -z-0"></div>

            {lifecycleStages.map((stg, i) => {
              const status = getStageStatus(stg, i)
              return (
                <div key={stg.key} className="flex flex-col items-center relative z-10 space-y-2 group w-16 text-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-2xs ${status === 'completed'
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                        : status === 'current'
                          ? 'bg-[#26205F] text-white ring-4 ring-purple-100 animate-pulse'
                          : 'bg-white text-slate-400 border-2 border-slate-300'
                      }`}
                  >
                    {status === 'completed' ? (
                      <span className="material-symbols-outlined text-base">check</span>
                    ) : status === 'current' ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
                    ) : (
                      <span className="text-[10px]">{i + 1}</span>
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <span
                      className={`text-[10px] font-bold leading-tight block line-clamp-2 ${status === 'completed'
                          ? 'text-emerald-900'
                          : status === 'current'
                            ? 'text-[#26205F]'
                            : 'text-slate-400'
                        }`}
                    >
                      {stg.label}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 block uppercase">
                      {status === 'completed' ? 'Completed ✓' : status === 'current' ? 'Current ●' : 'Pending ○'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 2-COLUMN GRID: MILESTONES & TRL GATES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* MILESTONE TRACKING (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Milestone Tracking</h2>
              <p className="text-xs text-slate-500">Institutional execution roadmap and evidence verification</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-extrabold text-[#26205F] block">
                Overall Progress: {progressPercent}%
              </span>
              <span className="text-[10px] font-semibold text-slate-400">
                {completedMilestones} of {milestones.length} Completed
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-emerald-600' : 'bg-[#26205F]'}`}
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          {/* Milestones List */}
          <div className="space-y-3 pt-2">
            {milestones.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-4 text-center">No milestones recorded for this project.</p>
            ) : (
              milestones.map((m, idx) => {
                const mDone = m.status === 'COMPLETED' || m.status === 'PASSED'
                const mReview = m.status === 'UNDER_REVIEW'
                return (
                  <div
                    key={m.id || idx}
                    className={`p-4 rounded-xl border transition-all ${mDone
                        ? 'bg-emerald-50/40 border-emerald-200/80'
                        : mReview
                          ? 'bg-amber-50/40 border-amber-200/80'
                          : 'bg-slate-50/50 border-slate-200/60'
                      }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${mDone
                                ? 'bg-emerald-600 text-white'
                                : mReview
                                  ? 'bg-amber-500 text-white'
                                  : 'bg-slate-300 text-slate-700'
                              }`}
                          >
                            {mDone ? '✓' : idx + 1}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 leading-snug">{m.title}</h4>
                        </div>
                        <p className="text-xs text-slate-600 font-normal pl-7 leading-relaxed">{m.description}</p>
                      </div>

                      <div className="text-right shrink-0 space-y-1">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border inline-block ${mDone
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : mReview
                                ? 'bg-amber-100 text-amber-800 border-amber-300'
                                : 'bg-slate-100 text-slate-700 border-slate-300'
                            }`}
                        >
                          {mDone ? 'COMPLETED' : mReview ? 'UNDER REVIEW' : 'NOT STARTED'}
                        </span>
                        {m.due_date && (
                          <span className="text-[10px] font-mono text-slate-400 block">Due: {m.due_date}</span>
                        )}
                      </div>
                    </div>

                    {m.evidence_url && (
                      <div className="mt-3 pl-7 pt-2 border-t border-slate-200/50 flex items-center justify-between text-xs">
                        <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs text-slate-400">attach_file</span>
                          Evidence Submitted
                        </span>
                        <a
                          href={m.evidence_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] font-bold text-[#26205F] hover:underline flex items-center gap-1"
                        >
                          <span>Inspect Media</span>
                          <span className="material-symbols-outlined text-xs">open_in_new</span>
                        </a>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* TRL TRACKING & GATES (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">TRL Gate Evaluation</h2>
              <p className="text-xs text-slate-500">Technology Readiness Level assessment audit</p>
            </div>
            <span className="text-xs font-mono font-extrabold text-[#26205F] bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200">
              Level {trlStage} / 9
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase">CURRENT TRL</span>
                <span className="font-extrabold text-[#26205F]">TRL {trlStage}</span>
              </div>
              <p className="font-bold text-slate-900 text-xs">{trlDescriptions[trlStage] || 'Technology Validated in Lab'}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">PREVIOUS TRL</span>
                <span className="font-bold text-slate-700">TRL {Math.max(1, trlStage - 1)}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">NEXT TARGET TRL</span>
                <span className="font-bold text-purple-900">TRL {Math.min(9, trlStage + 1)}</span>
              </div>
            </div>

            <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-purple-900 uppercase">GATE EVALUATION STATUS</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {project.decision || 'PASSED & APPROVED'}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-bold block">EVALUATOR / REVIEWER</span>
                <span className="font-semibold text-slate-900 block">{project.mentor_name || 'Dr. Anjali Kumar (Faculty Mentor)'}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-bold block">DECISION REASON / ASSESSMENT</span>
                <p className="text-slate-700 leading-relaxed text-[11px] font-normal italic">
                  "{project.evaluator_feedback || 'Validated prototype meets technical performance threshold and heavy metal removal targets for rural community node.'}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3-COLUMN BOTTOM SECTION: CONTEXT, PARTNERS & IMPACT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* UNIVERSITY & TEAM CONTEXT (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">University &amp; Team</h2>
            <p className="text-xs text-slate-500">Institutional hierarchy &amp; student squad</p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Hierarchy visual */}
            <div className="space-y-3 relative pl-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-purple-200">
              <div className="relative">
                <span className="absolute -left-[14.5px] top-1 w-2.5 h-2.5 rounded-full bg-[#26205F]"></span>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">UNIVERSITY</span>
                <span className="font-extrabold text-slate-900 text-xs block">Ranchi University Innovation Hub</span>
              </div>

              <div className="relative">
                <span className="absolute -left-[14.5px] top-1 w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">FACULTY MENTOR</span>
                <span className="font-bold text-slate-900 text-xs block">{project.mentor_name}</span>
              </div>

              <div className="relative">
                <span className="absolute -left-[14.5px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">STUDENT TEAM</span>
                <span className="font-extrabold text-[#26205F] text-xs block">{project.team_name}</span>
              </div>
            </div>

            {/* Team Members List */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">TEAM MEMBERS ({project.members?.length || 3})</span>
              <div className="space-y-1.5">
                {(project.members || [
                  { email: 'student@demo.ac.in', role: 'Team Lead / Environmental Eng' },
                  { email: 'iot.lead@bitmesra.ac.in', role: 'IoT Sensor Specialist' },
                  { email: 'chem.eng@bitmesra.ac.in', role: 'Chemical Filtration Lead' }
                ]).map((mem, mIdx) => (
                  <div key={mIdx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/50 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block text-xs">{mem.email}</span>
                      <span className="text-[10px] text-slate-500">{mem.role || 'Member'}</span>
                    </div>
                    {mIdx === 0 && (
                      <span className="text-[9px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded">LEAD</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* PARTNER / COLLABORATION SUPPORT (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Partner Collaboration</h2>
            <p className="text-xs text-slate-500">Government &amp; industry ecosystem support</p>
          </div>

          <div className="space-y-3 text-xs">
            {project.partner_name ? (
              <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-xl text-emerald-700">handshake</span>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">ACTIVE PARTNER</span>
                    <span className="font-extrabold text-slate-900 text-sm block">{project.partner_name}</span>
                  </div>
                </div>

                <div className="space-y-1 pt-2 border-t border-emerald-200/60">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">COLLABORATION CATEGORY</span>
                  <span className="px-2.5 py-1 rounded bg-white font-semibold text-emerald-900 border border-emerald-200 inline-block text-[11px]">
                    Field Testing &amp; Technology Deployment
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-200/60 text-center space-y-2">
                <span className="material-symbols-outlined text-3xl text-slate-300">handshake</span>
                <p className="text-xs font-semibold text-slate-500">No active partner collaboration</p>
                <p className="text-[11px] text-slate-400">Institutional team operating under university R&amp;D grant.</p>
              </div>
            )}
          </div>
        </div>

        {/* FIELD / IMPACT SUMMARY (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Field &amp; Impact</h2>
            <p className="text-xs text-slate-500">Community deployment status &amp; verification</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">DEPLOYMENT TARGET</span>
              <span className="font-bold text-slate-900 text-xs block">
                {isCompleted ? 'Simdega District Gram Panchayats' : 'Gumla Primary School Drinking Water Node'}
              </span>
              <span className="text-[10px] text-slate-500 block">
                Status: {isCompleted ? '100% Deployed & Handed Over' : 'Field Pilot Active'}
              </span>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => navigate('/admin/reports')}
                className="w-full bg-[#26205F] text-white hover:bg-purple-900 p-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <span>View Deployment &amp; Impact Report</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
