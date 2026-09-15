import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { updateChallengeDraft, publishChallenge } from '../features/app/appSlice'
import { api } from '../lib/api'

export default function ChallengeFormationView() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const activeChallengeDraft = useSelector((state) => state.app.activeChallengeDraft)
  const activePattern = useSelector((state) => state.app.activeValidationPattern)
  const reportDraftEvidence = useSelector((state) => state.app.reportDraft?.evidence) || []

  const sourceData = activeChallengeDraft || activePattern || {}

  // Active step: 1 = Understand, 2 = Define, 3 = Team & Ownership, 4 = Review & Publish
  const [activeStep, setActiveStep] = useState(1)

  // Step 2: Challenge Definition (Editable)
  const [title, setTitle] = useState(
    sourceData.title || 'Low-Cost Safe Drinking Water Solution for Rural Schools in Gumla'
  )
  const [summary, setSummary] = useState(
    sourceData.description || sourceData.problemStatement ||
    'High levels of fluoride and heavy metals detected in village borewells affecting primary school drinking nodes across 3 blocks in Gumla district.'
  )
  const [problemToSolve, setProblemToSolve] = useState(
    sourceData.problemToSolve || 'Design an accessible, low-cost field filtration technology suitable for primary school borewells.'
  )
  const [expectedOutcome, setExpectedOutcome] = useState(
    sourceData.expectedOutcome || 'A low-cost field filtration solution suitable for rural schools capable of purifying 500L/day.'
  )
  const [successCriteria, setSuccessCriteria] = useState(
    sourceData.successCriteria || '- Affordable under ₹5,000 unit cost\n- Locally maintainable without electrical power\n- Field-testable in Gumla villages\n- 99% heavy metal & fluoride reduction in testing'
  )

  // Step 3: Solver Requirements (Editable)
  const [disciplines, setDisciplines] = useState(
    sourceData.recommended_disciplines || sourceData.recommendedDisciplines || ['Environmental Engineering', 'Public Health', 'Material Science']
  )
  const [newDiscipline, setNewDiscipline] = useState('')
  const [showAddDiscipline, setShowAddDiscipline] = useState(false)
  const [rdObjective, setRdObjective] = useState(
    sourceData.objectives || 'Design a scalable, low-cost field filtration unit using locally available materials capable of purifying 500L/day.'
  )

  // Step 4: University Ownership
  const [department, setDepartment] = useState(sourceData.targetDepartment || 'Environmental Engineering')
  const [facultyMentor, setFacultyMentor] = useState(sourceData.mentor || 'Prof. R. Sharma')

  // Publish / Save State
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [saveMessage, setSaveMessage] = useState(null)
  const [error, setError] = useState(null)

  // Ground truth data helpers
  const district = sourceData.district || (sourceData.locations || [])[0] || 'Gumla Sector 4'
  const blocksText = sourceData.blocks || '3 blocks · 12 villages'
  const signalCount = sourceData.problem_count || sourceData.signalCount || sourceData.members?.length || 32
  const fitScore = sourceData.match_score || sourceData.emergence_score || 94
  const members = sourceData.members || []

  // Extract citizen-submitted photos
  const rawPhotos = [
    ...(sourceData.photos || []),
    ...(sourceData.images || []),
    ...(sourceData.photo_urls || []),
    ...(members.flatMap((m) => [m.photo_url, m.previewUrl, m.image_url, ...(m.photos || [])]).filter(Boolean)),
    ...(reportDraftEvidence.map((e) => e.previewUrl).filter(Boolean)),
  ].filter(Boolean)
  const photos = Array.from(new Set(rawPhotos))

  const handleAddDiscipline = () => {
    if (newDiscipline.trim() && !disciplines.includes(newDiscipline.trim())) {
      setDisciplines([...disciplines, newDiscipline.trim()])
      setNewDiscipline('')
      setShowAddDiscipline(false)
    }
  }

  const handleRemoveDiscipline = (disc) => {
    setDisciplines(disciplines.filter((d) => d !== disc))
  }

  const handleSaveDraft = () => {
    dispatch(updateChallengeDraft({
      ...sourceData,
      title,
      description: summary,
      problemStatement: summary,
      problemToSolve,
      objectives: rdObjective,
      expectedOutcome,
      successCriteria,
      recommended_disciplines: disciplines,
      targetDepartment: department,
      mentor: facultyMentor,
      status: 'Draft',
    }))
    setSaveMessage('Challenge draft saved successfully.')
    setTimeout(() => setSaveMessage(null), 3000)
  }

  const handleConfirmPublish = async () => {
    setPublishing(true)
    setError(null)
    try {
      const payload = {
        cluster_id: sourceData.id || null,
        title: title.trim(),
        description: summary.trim(),
        problem_statement: problemToSolve.trim(),
        domain: sourceData.primary_domain || sourceData.primaryDomain || 'WATER QUALITY & SANITATION',
        target_locations: `${district}, Jharkhand`,
        target_department: department,
        faculty_mentor: facultyMentor,
        objectives: rdObjective,
        status: 'OPEN',
      }

      let createdChallenge = payload
      try {
        const res = await api.createChallenge(payload)
        if (res?.challenge) createdChallenge = res.challenge
      } catch (err) {
        console.warn('[API Warning, proceeding with client draft publish]:', err.message)
      }

      dispatch(updateChallengeDraft({
        ...sourceData,
        title,
        description: summary,
        problemStatement: problemToSolve,
        objectives: rdObjective,
        targetDepartment: department,
        mentor: facultyMentor,
        status: 'Published',
      }))

      dispatch(publishChallenge(createdChallenge))
      setShowConfirmModal(false)
      navigate('/challenge/published')
    } catch (err) {
      console.error('[Publish Challenge Error]:', err)
      setError(`Failed to publish challenge: ${err.message}`)
      setShowConfirmModal(false)
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F7FC] flex flex-col font-sans text-slate-900 antialiased selection:bg-indigo-100 selection:text-indigo-900">
      <main className="flex-grow pt-6 pb-24 px-4 sm:px-6 max-w-[1180px] mx-auto w-full space-y-6">

        {/* 1. TOP NAVIGATION */}
        <div>
          <button
            type="button"
            onClick={() => navigate('/validation/pattern')}
            className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[#171A5A] hover:text-indigo-700 transition-colors cursor-pointer group"
          >
            <span className="text-base transition-transform group-hover:-translate-x-0.5">←</span>
            <span>Back to Validation</span>
          </button>
        </div>

        {/* TOP HEADER & SOURCE PATTERN REFERENCE BOX */}
        <header className="bg-white p-6 sm:p-7 rounded-xl border border-[rgba(20,24,80,0.10)] shadow-[0_2px_10px_rgba(20,24,80,0.04)] space-y-4">
          <div className="space-y-1">
            <div className="text-[12px] font-semibold text-[#525B75] uppercase tracking-wider">
              CHALLENGE BUILDER WORKSPACE
            </div>
            <h1 className="text-[30px] sm:text-[34px] font-bold text-[#171A5A] tracking-tight leading-tight">
              CHALLENGE BUILDER
            </h1>
            <p className="text-[15.5px] text-[#333E5D] leading-relaxed">
              Create a student-ready Innovation Challenge from this validated community problem.
            </p>
          </div>

          {/* COMPACT SOURCE REFERENCE BOX */}
          <div className="bg-[#FAF8F5] p-4 rounded-xl border border-stone-200/80 flex flex-wrap items-center justify-between gap-3 text-[13.5px]">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#525B75] uppercase tracking-wider">
                SOURCE:
              </span>
              <span className="font-semibold text-[#171A5A]">
                {sourceData.title || 'Water Quality & Public Health Concern'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-[#525B75] font-medium">
              <span className="font-semibold text-[#171A5A]">{district}, Jharkhand</span>
              <span>·</span>
              <span>{signalCount} community signals</span>
              <span>·</span>
              <span className="text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {fitScore}% university fit
              </span>
            </div>
          </div>
        </header>

        {/* COMPACT STEP PROGRESS INDICATOR */}
        <div className="bg-white p-3.5 rounded-xl border border-[rgba(20,24,80,0.10)] shadow-[0_2px_10px_rgba(20,24,80,0.04)] flex items-center justify-between overflow-x-auto gap-2 text-[13px] font-semibold">
          <button
            type="button"
            onClick={() => setActiveStep(1)}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeStep === 1
                ? 'bg-[#171A5A] text-white shadow-2xs'
                : 'bg-[#FAF8F5] border border-stone-200/80 text-[#525B75] hover:text-[#171A5A]'
            }`}
          >
            <span className="text-[11px] font-bold opacity-80">01</span>
            <span>Understand</span>
          </button>

          <span className="text-slate-300">→</span>

          <button
            type="button"
            onClick={() => setActiveStep(2)}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeStep === 2
                ? 'bg-[#171A5A] text-white shadow-2xs'
                : 'bg-[#FAF8F5] border border-stone-200/80 text-[#525B75] hover:text-[#171A5A]'
            }`}
          >
            <span className="text-[11px] font-bold opacity-80">02</span>
            <span>Define</span>
          </button>

          <span className="text-slate-300">→</span>

          <button
            type="button"
            onClick={() => setActiveStep(3)}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeStep === 3
                ? 'bg-[#171A5A] text-white shadow-2xs'
                : 'bg-[#FAF8F5] border border-stone-200/80 text-[#525B75] hover:text-[#171A5A]'
            }`}
          >
            <span className="text-[11px] font-bold opacity-80">03</span>
            <span>Team & Ownership</span>
          </button>

          <span className="text-slate-300">→</span>

          <button
            type="button"
            onClick={() => setActiveStep(4)}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeStep === 4
                ? 'bg-[#171A5A] text-white shadow-2xs'
                : 'bg-[#FAF8F5] border border-stone-200/80 text-[#525B75] hover:text-[#171A5A]'
            }`}
          >
            <span className="text-[11px] font-bold opacity-80">04</span>
            <span>Review & Publish</span>
          </button>
        </div>

        {saveMessage && (
          <div className="p-4 bg-emerald-50 text-emerald-900 text-[14px] font-medium rounded-xl border border-emerald-200 flex items-center gap-2">
            <span className="material-symbols-outlined text-base">check_circle</span>
            <span>{saveMessage}</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 text-red-900 text-[14px] font-medium rounded-xl border border-red-200 flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* TWO-COLUMN WORKSPACE (MAIN GUIDED STEPS ON LEFT, PERSISTENT STATUS PANEL ON RIGHT) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">

          {/* LEFT AUTHORING COLUMN (8 COLS) */}
          <div className="lg:col-span-8 space-y-6">

            {/* STEP 1 — UNDERSTAND THE PROBLEM (READ-ONLY BRIEF) */}
            {(activeStep === 1 || activeStep === 4) && (
              <section className="bg-white p-6 sm:p-7 rounded-xl border border-[rgba(20,24,80,0.10)] shadow-[0_2px_10px_rgba(20,24,80,0.04)] space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div>
                    <div className="text-[11px] font-bold text-teal-800 uppercase tracking-wider bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200 inline-block mb-1">
                      CARRIED FROM VALIDATED COMMUNITY EVIDENCE
                    </div>
                    <h2 className="text-[20px] font-bold text-[#171A5A]">
                      What the community is experiencing
                    </h2>
                  </div>
                  <span className="text-[12px] font-semibold text-[#525B75]">Read-only Brief</span>
                </div>

                <div className="space-y-4 text-[14.5px] text-[#333E5D]">
                  <div>
                    <strong className="text-[11px] font-semibold text-[#525B75] uppercase block tracking-wider mb-1">
                      PROBLEM
                    </strong>
                    <p className="p-3.5 bg-[#FAF8F5] rounded-xl border border-stone-200/80 font-medium text-[#171A5A] leading-relaxed">
                      {sourceData.description || `High levels of fluoride and heavy metals detected in village borewells across ${district} district.`}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <strong className="text-[11px] font-semibold text-[#525B75] uppercase block tracking-wider mb-1">
                        WHY IT MATTERS
                      </strong>
                      <p className="p-3 bg-[#FAF8F5] rounded-lg border border-stone-200/70 text-[13px] leading-relaxed">
                        {sourceData.why_this_matters || 'Recurring observations indicate a regional health pattern.'}
                      </p>
                    </div>

                    <div>
                      <strong className="text-[11px] font-semibold text-[#525B75] uppercase block tracking-wider mb-1">
                        WHO IS AFFECTED
                      </strong>
                      <p className="p-3 bg-[#FAF8F5] rounded-lg border border-stone-200/70 text-[13px] leading-relaxed">
                        Primary school children and rural hamlets across 12 villages.
                      </p>
                    </div>

                    <div>
                      <strong className="text-[11px] font-semibold text-[#525B75] uppercase block tracking-wider mb-1">
                        GEOGRAPHIC SCOPE
                      </strong>
                      <p className="p-3 bg-[#FAF8F5] rounded-lg border border-stone-200/70 text-[13px] leading-relaxed">
                        {district} District, Jharkhand ({blocksText}).
                      </p>
                    </div>
                  </div>

                  {/* EVIDENCE STRIP */}
                  <div className="pt-2 space-y-2 border-t border-stone-100">
                    <strong className="text-[11px] font-semibold text-[#525B75] uppercase block tracking-wider">
                      COMMUNITY EVIDENCE STRIP
                    </strong>

                    <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-[#FAF8F5] rounded-xl border border-stone-200/80 text-[13.5px]">
                      <div className="space-x-2 font-medium text-[#333E5D]">
                        <span className="font-bold text-[#171A5A]">{signalCount} citizen reports</span>
                        <span>·</span>
                        <span>4 field observations</span>
                        <span>·</span>
                        <span>3 affected locations</span>
                      </div>
                      <span className="text-[11.5px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                        Verified Evidence
                      </span>
                    </div>

                    {photos.length > 0 ? (
                      <div className="grid grid-cols-4 gap-2.5 pt-1">
                        {photos.slice(0, 4).map((url, idx) => {
                          const isLast = idx === 3 && photos.length > 4
                          const extra = photos.length - 4

                          return (
                            <div key={idx} className="relative h-20 rounded-lg overflow-hidden border border-stone-200 bg-stone-100">
                              <img src={url} alt={`Evidence ${idx + 1}`} className="w-full h-full object-cover" />
                              {isLast && extra > 0 && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold">
                                  +{extra} more
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="p-3 rounded-lg bg-[#FAF8F5] border border-stone-200/80 text-[12.5px] text-[#525B75] italic">
                        No photo evidence submitted (text & voice reports verified).
                      </div>
                    )}
                  </div>
                </div>

                {activeStep === 1 && (
                  <div className="pt-3 border-t border-stone-100 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setActiveStep(2)}
                      className="bg-[#171A5A] text-white px-5 py-2.5 rounded-lg text-[13.5px] font-semibold hover:bg-indigo-900 cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Proceed to Define Challenge →</span>
                    </button>
                  </div>
                )}
              </section>
            )}

            {/* STEP 2 — DEFINE THE CHALLENGE */}
            {(activeStep === 2 || activeStep === 4) && (
              <section className="bg-white p-6 sm:p-7 rounded-xl border border-[rgba(20,24,80,0.10)] shadow-[0_2px_10px_rgba(20,24,80,0.04)] space-y-5">
                <div className="border-b border-stone-100 pb-3">
                  <div className="text-[12px] font-semibold text-[#525B75] uppercase tracking-wider">
                    STEP 2 — DEFINE THE CHALLENGE
                  </div>
                  <h2 className="text-[20px] font-bold text-[#171A5A] leading-tight mt-0.5">
                    What should students solve?
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[13.5px] font-semibold text-[#171A5A] block">
                      Challenge Title (Student Facing)
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full p-3 bg-white rounded-lg border border-stone-200 text-[15px] font-bold text-[#171A5A] focus:outline-none focus:border-indigo-600 transition-colors"
                      placeholder="Enter clear challenge title..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[13.5px] font-semibold text-[#171A5A] block">
                      Short Challenge Statement
                    </label>
                    <textarea
                      rows="3"
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      className="w-full p-3 bg-white rounded-lg border border-stone-200 text-[14px] text-[#333E5D] focus:outline-none focus:border-indigo-600 transition-colors leading-relaxed"
                      placeholder="Summarize the core problem for student innovator teams..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[13.5px] font-semibold text-[#171A5A] block">
                      Primary Problem to Solve
                    </label>
                    <textarea
                      rows="2"
                      value={problemToSolve}
                      onChange={(e) => setProblemToSolve(e.target.value)}
                      className="w-full p-3 bg-white rounded-lg border border-stone-200 text-[13.5px] text-[#333E5D] focus:outline-none focus:border-indigo-600 transition-colors leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div className="space-y-1.5">
                      <label className="text-[13.5px] font-semibold text-[#171A5A] block">
                        EXPECTED OUTCOME
                      </label>
                      <textarea
                        rows="4"
                        value={expectedOutcome}
                        onChange={(e) => setExpectedOutcome(e.target.value)}
                        className="w-full p-3 bg-white rounded-lg border border-stone-200 text-[13.5px] text-[#333E5D] focus:outline-none focus:border-indigo-600 transition-colors leading-relaxed"
                        placeholder="What should a successful student solution achieve?"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[13.5px] font-semibold text-[#171A5A] block">
                        SUCCESS CRITERIA
                      </label>
                      <textarea
                        rows="4"
                        value={successCriteria}
                        onChange={(e) => setSuccessCriteria(e.target.value)}
                        className="w-full p-3 bg-white rounded-lg border border-stone-200 text-[13.5px] text-[#333E5D] focus:outline-none focus:border-indigo-600 transition-colors leading-relaxed"
                        placeholder="What should the solution demonstrate?"
                      />
                    </div>
                  </div>
                </div>

                {activeStep === 2 && (
                  <div className="pt-3 border-t border-stone-100 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveStep(1)}
                      className="px-4 py-2 rounded-lg text-[13px] font-semibold text-[#525B75] hover:text-[#171A5A] cursor-pointer"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveStep(3)}
                      className="bg-[#171A5A] text-white px-5 py-2.5 rounded-lg text-[13.5px] font-semibold hover:bg-indigo-900 cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Proceed to Team Requirements →</span>
                    </button>
                  </div>
                )}
              </section>
            )}

            {/* STEP 3 — SET THE SOLVER REQUIREMENTS & OWNERSHIP */}
            {(activeStep === 3 || activeStep === 4) && (
              <>
                <section className="bg-white p-6 sm:p-7 rounded-xl border border-[rgba(20,24,80,0.10)] shadow-[0_2px_10px_rgba(20,24,80,0.04)] space-y-5">
                  <div className="border-b border-stone-100 pb-3">
                    <div className="text-[12px] font-semibold text-[#525B75] uppercase tracking-wider">
                      STEP 3 — SOLVER REQUIREMENTS
                    </div>
                    <h2 className="text-[20px] font-bold text-[#171A5A] leading-tight mt-0.5">
                      What kind of team should solve this?
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {/* Required Disciplines */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[13.5px] font-semibold text-[#171A5A]">
                          Required Disciplines
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowAddDiscipline(!showAddDiscipline)}
                          className="text-[12px] font-bold text-[#171A5A] hover:text-indigo-700 cursor-pointer"
                        >
                          + Add Discipline
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2.5">
                        {disciplines.map((disc, idx) => (
                          <span
                            key={idx}
                            className="bg-[#FAF8F5] border border-stone-200/80 text-[#171A5A] px-3.5 py-1.5 rounded-md text-[13px] font-semibold inline-flex items-center gap-2"
                          >
                            <span>{disc}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveDiscipline(disc)}
                              className="text-slate-400 hover:text-red-700 cursor-pointer text-sm font-bold"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>

                      {showAddDiscipline && (
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="text"
                            placeholder="Enter discipline (e.g. Mechanical Engineering)..."
                            value={newDiscipline}
                            onChange={(e) => setNewDiscipline(e.target.value)}
                            className="p-2 bg-white rounded-lg border border-stone-200 text-[13px] font-medium text-[#171A5A] focus:outline-none focus:border-indigo-600 flex-grow"
                          />
                          <button
                            type="button"
                            onClick={handleAddDiscipline}
                            className="bg-[#171A5A] text-white px-3.5 py-2 rounded-lg text-[12.5px] font-semibold hover:bg-indigo-900 cursor-pointer"
                          >
                            Add
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Suggested Team Composition */}
                    <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-stone-200/80 text-[13px] text-[#333E5D] space-y-0.5">
                      <strong className="text-[11px] font-bold text-[#525B75] uppercase block tracking-wider">
                        SUGGESTED TEAM COMPOSITION
                      </strong>
                      <p>
                        Multidisciplinary team of 3–5 students recommended across {disciplines.join(', ')}.
                      </p>
                    </div>

                    {/* R&D OBJECTIVE (PROMINENT) */}
                    <div className="p-4 sm:p-5 bg-white rounded-xl border-2 border-indigo-200 space-y-2 shadow-2xs">
                      <label className="text-[12px] font-bold text-[#171A5A] uppercase tracking-wider block">
                        R&D OBJECTIVE (PROMINENT INPUT)
                      </label>
                      <textarea
                        rows="3"
                        value={rdObjective}
                        onChange={(e) => setRdObjective(e.target.value)}
                        className="w-full p-3 bg-[#FAF8F5] rounded-lg border border-stone-200 text-[14px] font-semibold text-[#171A5A] focus:outline-none focus:border-indigo-600 leading-relaxed"
                      />
                    </div>
                  </div>
                </section>

                {/* STEP 4 — UNIVERSITY OWNERSHIP */}
                <section className="bg-white p-6 sm:p-7 rounded-xl border border-[rgba(20,24,80,0.10)] shadow-[0_2px_10px_rgba(20,24,80,0.04)] space-y-4">
                  <div className="border-b border-stone-100 pb-3">
                    <div className="text-[12px] font-semibold text-[#525B75] uppercase tracking-wider">
                      STEP 4 — UNIVERSITY OWNERSHIP
                    </div>
                    <h2 className="text-[20px] font-bold text-[#171A5A] leading-tight mt-0.5">
                      Who will lead this challenge?
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#525B75] uppercase block">University</label>
                      <div className="p-2.5 bg-[#FAF8F5] rounded-lg border border-stone-200/70 text-[13.5px] font-bold text-[#171A5A]">
                        Ranchi University
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#525B75] uppercase block">Target Department</label>
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full p-2.5 bg-white rounded-lg border border-stone-200 text-[13.5px] font-semibold text-[#171A5A]"
                      >
                        <option>Environmental Engineering</option>
                        <option>Civil Engineering</option>
                        <option>Chemistry & Material Science</option>
                        <option>Computer Science & IT</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#525B75] uppercase block">Faculty Mentor</label>
                      <select
                        value={facultyMentor}
                        onChange={(e) => setFacultyMentor(e.target.value)}
                        className="w-full p-2.5 bg-white rounded-lg border border-stone-200 text-[13.5px] font-semibold text-[#171A5A]"
                      >
                        <option>Prof. R. Sharma</option>
                        <option>Dr. Anjali Kumar</option>
                        <option>Dr. S. K. Roy</option>
                      </select>
                    </div>
                  </div>

                  {activeStep === 3 && (
                    <div className="pt-3 border-t border-stone-100 flex justify-between">
                      <button
                        type="button"
                        onClick={() => setActiveStep(2)}
                        className="px-4 py-2 rounded-lg text-[13px] font-semibold text-[#525B75] hover:text-[#171A5A] cursor-pointer"
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveStep(4)}
                        className="bg-[#171A5A] text-white px-5 py-2.5 rounded-lg text-[13.5px] font-semibold hover:bg-indigo-900 cursor-pointer flex items-center gap-1.5"
                      >
                        <span>Review Final Challenge Preview →</span>
                      </button>
                    </div>
                  )}
                </section>
              </>
            )}

            {/* STEP 5 — REVIEW BEFORE PUBLISHING (POLISHED STUDENT PREVIEW) */}
            {activeStep === 4 && (
              <section className="bg-white p-7 sm:p-8 rounded-xl border border-indigo-200/90 shadow-[0_4px_20px_rgba(20,24,80,0.06)] space-y-6">
                <div className="border-b border-stone-100 pb-4">
                  <div className="text-[12px] font-semibold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 inline-block mb-1">
                    STUDENT PREVIEW DOCUMENT
                  </div>
                  <h2 className="text-[22px] font-bold text-[#171A5A]">
                    REVIEW YOUR CHALLENGE
                  </h2>
                  <p className="text-[14px] text-[#525B75]">
                    This is how student innovators across universities will see your published challenge.
                  </p>
                </div>

                {/* PREVIEW DOCUMENT CARD */}
                <div className="bg-[#FAF8F5] p-6 rounded-xl border border-stone-200/80 space-y-5">
                  <div className="space-y-1.5 border-b border-stone-200/70 pb-4">
                    <div className="text-[11px] font-bold text-[#525B75] uppercase tracking-wider">
                      INNOVATION CHALLENGE · RANCHI UNIVERSITY
                    </div>
                    <h3 className="text-[22px] font-bold text-[#171A5A] leading-tight">
                      {title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-[#525B75] font-medium pt-1">
                      <span>Department: <strong className="text-[#171A5A]">{department}</strong></span>
                      <span>·</span>
                      <span>Faculty Mentor: <strong className="text-[#171A5A]">{facultyMentor}</strong></span>
                      <span>·</span>
                      <span>Location: <strong className="text-[#171A5A]">{district}, Jharkhand</strong></span>
                    </div>
                  </div>

                  <div className="space-y-3 text-[14px] text-[#333E5D]">
                    <div>
                      <strong className="text-[11px] font-bold text-[#525B75] uppercase block mb-1">
                        COMMUNITY PROBLEM CONTEXT
                      </strong>
                      <p className="leading-relaxed">{summary}</p>
                    </div>

                    <div>
                      <strong className="text-[11px] font-bold text-[#525B75] uppercase block mb-1">
                        PRIMARY PROBLEM TO SOLVE
                      </strong>
                      <p className="leading-relaxed font-semibold text-[#171A5A]">{problemToSolve}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div>
                        <strong className="text-[11px] font-bold text-[#525B75] uppercase block mb-1">
                          EXPECTED OUTCOME
                        </strong>
                        <p className="text-[13.5px] leading-relaxed">{expectedOutcome}</p>
                      </div>

                      <div>
                        <strong className="text-[11px] font-bold text-[#525B75] uppercase block mb-1">
                          SUCCESS CRITERIA
                        </strong>
                        <div className="text-[13px] leading-relaxed whitespace-pre-line">{successCriteria}</div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-stone-200/60">
                      <strong className="text-[11px] font-bold text-[#525B75] uppercase block mb-1.5">
                        REQUIRED DISCIPLINES
                      </strong>
                      <div className="flex flex-wrap gap-2">
                        {disciplines.map((disc, idx) => (
                          <span key={idx} className="bg-white border border-stone-200 text-[#171A5A] px-3 py-1 rounded text-[12.5px] font-semibold">
                            {disc}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3.5 bg-indigo-50/80 border border-indigo-100 rounded-lg space-y-1">
                      <strong className="text-[11px] font-bold text-[#171A5A] uppercase block">
                        STUDENT R&D OBJECTIVE
                      </strong>
                      <p className="text-[13.5px] font-semibold text-[#171A5A] leading-relaxed">
                        &ldquo;{rdObjective}&rdquo;
                      </p>
                    </div>
                  </div>
                </div>

                {/* FINAL ACTION AREA */}
                <div className="pt-4 border-t border-stone-100 space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-[18px] font-bold text-[#171A5A]">
                      READY TO PUBLISH?
                    </h3>
                    <p className="text-[13.5px] text-[#525B75]">
                      Publishing makes this challenge visible to student innovators across university departments.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4 text-[13.5px] font-medium">
                      <button
                        type="button"
                        onClick={handleSaveDraft}
                        className="text-[#171A5A] font-semibold hover:underline cursor-pointer"
                      >
                        Save Draft
                      </button>
                      <span className="text-slate-300">·</span>
                      <button
                        type="button"
                        onClick={() => navigate('/validation/queue')}
                        className="text-[#525B75] hover:text-slate-900 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowConfirmModal(true)}
                      className="bg-[#171A5A] text-white px-7 py-3.5 rounded-xl font-bold text-[14px] hover:bg-indigo-900 transition-all duration-200 shadow-sm hover:shadow hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Publish Innovation Challenge →</span>
                    </button>
                  </div>
                </div>
              </section>
            )}

          </div>

          {/* PERSISTENT RIGHT STATUS PANEL ON DESKTOP (4 COLS) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
            <div className="bg-white p-5 sm:p-6 rounded-xl border border-indigo-200/90 shadow-[0_4px_20px_rgba(20,24,80,0.06)] space-y-5 divide-y divide-stone-100">
              
              {/* CHALLENGE STATUS CHECKLIST */}
              <div className="space-y-3">
                <div className="text-[11px] font-bold text-[#525B75] uppercase tracking-wider">
                  CHALLENGE STATUS
                </div>

                <div className="space-y-2.5 text-[13.5px] font-medium">
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Validated problem</span>
                  </div>

                  <div className={`flex items-center gap-2 ${activeStep >= 2 ? 'text-emerald-800 font-semibold' : 'text-slate-500'}`}>
                    <span>{activeStep >= 2 ? '✓' : '●'}</span>
                    <span>Challenge definition</span>
                  </div>

                  <div className={`flex items-center gap-2 ${activeStep >= 3 ? 'text-emerald-800 font-semibold' : 'text-slate-500'}`}>
                    <span>{activeStep >= 3 ? '✓' : '○'}</span>
                    <span>Solver requirements</span>
                  </div>

                  <div className={`flex items-center gap-2 ${activeStep >= 3 ? 'text-emerald-800 font-semibold' : 'text-slate-500'}`}>
                    <span>{activeStep >= 3 ? '✓' : '○'}</span>
                    <span>University ownership</span>
                  </div>

                  <div className={`flex items-center gap-2 ${activeStep === 4 ? 'text-indigo-900 font-bold' : 'text-slate-400'}`}>
                    <span>{activeStep === 4 ? '●' : '○'}</span>
                    <span>Ready to publish</span>
                  </div>
                </div>
              </div>

              {/* SOURCE EVIDENCE SUMMARY */}
              <div className="pt-4 space-y-2 text-[13px]">
                <div className="text-[11px] font-bold text-[#525B75] uppercase tracking-wider">
                  SOURCE EVIDENCE
                </div>
                
                <div className="p-3 bg-[#FAF8F5] rounded-lg border border-stone-200/80 space-y-1 text-[#333E5D]">
                  <div className="font-semibold text-[#171A5A]">{signalCount} reports · 4 observations</div>
                  <div>3 affected locations</div>
                  <div className="text-emerald-800 font-semibold pt-0.5">{fitScore}% university fit</div>
                </div>
              </div>

              {/* STEP ACTION BUTTON */}
              <div className="pt-4">
                {activeStep < 4 ? (
                  <button
                    type="button"
                    onClick={() => setActiveStep(activeStep + 1)}
                    className="w-full bg-[#171A5A] text-white py-3 rounded-lg font-semibold text-[13px] hover:bg-indigo-900 transition-all cursor-pointer shadow-2xs"
                  >
                    <span>Next Step ({activeStep + 1}/4) →</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowConfirmModal(true)}
                    className="w-full bg-[#171A5A] text-white py-3 rounded-lg font-bold text-[13.5px] hover:bg-indigo-900 transition-all cursor-pointer shadow-2xs"
                  >
                    <span>Publish Challenge →</span>
                  </button>
                )}
              </div>

            </div>
          </div>

        </div>

      </main>

      {/* CONFIRMATION SUMMARY MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-stone-200 max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-[17px] font-bold text-[#171A5A]">
                Confirm & Publish Innovation Challenge
              </h3>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="text-stone-400 hover:text-stone-700 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-[14px] text-[#333E5D] leading-relaxed">
              You are about to publish this Innovation Challenge to Ranchi University&apos;s public student discovery registry.
            </p>

            <div className="bg-[#FAF8F5] p-4 rounded-lg border border-stone-200/80 space-y-2 text-[13px]">
              <div>
                <strong className="text-[11px] font-bold text-[#525B75] uppercase block">Challenge Title</strong>
                <span className="font-bold text-[#171A5A] text-[14px]">{title}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-stone-200/60">
                <div>
                  <strong className="text-[11px] font-bold text-[#525B75] uppercase block">Department</strong>
                  <span className="font-semibold text-[#171A5A]">{department}</span>
                </div>
                <div>
                  <strong className="text-[11px] font-bold text-[#525B75] uppercase block">Faculty Mentor</strong>
                  <span className="font-semibold text-[#171A5A]">{facultyMentor}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2.5 rounded-lg border border-stone-200 text-[#171A5A] text-[13px] font-semibold hover:bg-stone-50 cursor-pointer"
              >
                Back to Editing
              </button>

              <button
                type="button"
                onClick={handleConfirmPublish}
                disabled={publishing}
                className="bg-[#171A5A] text-white px-5 py-2.5 rounded-lg text-[13px] font-bold hover:bg-indigo-900 transition-all cursor-pointer shadow-xs flex items-center gap-2 disabled:opacity-50"
              >
                {publishing ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Publish →</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
