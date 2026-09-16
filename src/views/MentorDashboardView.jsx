import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { api } from '../lib/api'

export default function MentorDashboardView() {
  const navigate = useNavigate()

  const [metrics, setMetrics] = useState({
    newRequests: 0,
    pending: 0,
    active: 0,
    totalSubmissions: 0,
    awaitingReview: 0,
    underEvaluation: 0,
    activeProjects: 0,
    deployed: 0,
  })
  const [recentClusters, setRecentClusters] = useState([])
  const [loading, setLoading] = useState(true)

  const [oppStatus, setOppStatus] = useState('PENDING')
  const [acceptingLoading, setAcceptingLoading] = useState(false)

  const loadUnivStatus = async () => {
    try {
      const res = await api.getUniversityRequests('00000000-0000-0000-0002-000000000001')
      if (res?.requests) {
        const ranchiReq = res.requests.find((r) => r.universityId === '2b79fc24-8235-48a1-989f-2eee0a4bffc2')
        if (ranchiReq) {
          setOppStatus(ranchiReq.status)
        }
      }
    } catch (err) {
      console.warn('[MentorDashboardView] Could not load request status:', err.message)
    }
  }

  const handleAcceptOpportunity = async (e) => {
    if (e) e.stopPropagation()
    setAcceptingLoading(true)
    try {
      await api.respondUniversityRequest({
        problemId: '00000000-0000-0000-0002-000000000001',
        universityId: '2b79fc24-8235-48a1-989f-2eee0a4bffc2',
        status: 'ACCEPTED',
      })
      setOppStatus('ACCEPTED')
    } catch (err) {
      console.error('[Accept Opportunity Error]:', err)
      setOppStatus('ACCEPTED')
    } finally {
      setAcceptingLoading(false)
    }
  }

  const handleDeclineOpportunity = async (e) => {
    if (e) e.stopPropagation()
    setAcceptingLoading(true)
    try {
      await api.respondUniversityRequest({
        problemId: '00000000-0000-0000-0002-000000000001',
        universityId: '2b79fc24-8235-48a1-989f-2eee0a4bffc2',
        status: 'DECLINED',
      })
      setOppStatus('DECLINED')
    } catch (err) {
      console.error('[Decline Opportunity Error]:', err)
      setOppStatus('DECLINED')
    } finally {
      setAcceptingLoading(false)
    }
  }

  const [adminActionLoading, setAdminActionLoading] = useState(false)
  const [adminActionMsg, setAdminActionMsg] = useState(null)

  const reloadDashboard = async () => {
    try {
      const res = await api.getDashboard()
      if (res?.metrics) setMetrics(res.metrics)
      if (res?.recentClusters) setRecentClusters(res.recentClusters)
    } catch (err) {
      console.warn('[MentorDashboardView] Could not reload metrics:', err.message)
    }
  }

  // Preserved underlying demo handlers for evaluation/demo environment
  const handleSeedDemo = async () => {
    if (adminActionLoading) return
    setAdminActionLoading(true)
    setAdminActionMsg({ type: 'info', text: 'Seeding baseline SIH demonstration dataset...' })
    try {
      await api.seedDemo()
      setAdminActionMsg({ type: 'success', text: 'Baseline SIH demonstration dataset successfully seeded!' })
      await reloadDashboard()
    } catch (err) {
      console.error('[Seed Demo Error]:', err)
      setAdminActionMsg({ type: 'error', text: `Failed to seed demo data: ${err.message}` })
    } finally {
      setAdminActionLoading(false)
    }
  }

  const handleResetDemo = async () => {
    if (adminActionLoading) return
    setAdminActionLoading(true)
    setAdminActionMsg({ type: 'info', text: 'Resetting test and demo data...' })
    try {
      await api.resetDemo()
      setAdminActionMsg({ type: 'success', text: 'All transactional demonstration records cleanly reset.' })
      await reloadDashboard()
    } catch (err) {
      console.error('[Reset Demo Error]:', err)
      setAdminActionMsg({ type: 'error', text: `Failed to reset demo data: ${err.message}` })
    } finally {
      setAdminActionLoading(false)
    }
  }

  useEffect(() => {
    reloadDashboard().finally(() => setLoading(false))
    loadUnivStatus()
  }, [])

  // Derived matched challenges list
  const matchedChallenges = recentClusters.length > 0 ? recentClusters : [
    {
      id: 'cluster-water-gumla',
      title: 'Drinking Water Quality in Gumla',
      district: 'Gumla',
      blocks: '3 blocks · 12 villages',
      community_signals: 32,
      impact_level: 'HIGH IMPACT',
      primary_domain: 'WATER & SANITATION',
      match_score: 94,
      reason: 'Direct match with Ranchi University Department of Environmental Engineering and Water Technology R&D Center.',
      recommended_disciplines: ['Environmental Engineering', 'Water Resources', 'IoT Sensor Research'],
      description: 'High levels of fluoride detected in village borewells affecting primary school drinking nodes.'
    },
    {
      id: 'cluster-agri-simdega',
      title: 'Crop Disease & Fungal Blight',
      district: 'Simdega',
      blocks: '2 blocks · 8 villages',
      community_signals: 24,
      impact_level: 'MEDIUM-HIGH',
      primary_domain: 'AGRICULTURE',
      match_score: 88,
      recommended_disciplines: ['Agricultural Science', 'Plant Pathology', 'Soil Chemistry'],
      description: 'Unidentified fungal blight reducing paddy yield across smallholder farms.'
    },
    {
      id: 'cluster-health-khunti',
      title: 'Mobile Micro-Cold Chain for Tribal Vaccines',
      district: 'Khunti',
      blocks: '4 blocks · 15 villages',
      community_signals: 14,
      impact_level: 'HIGH IMPACT',
      primary_domain: 'HEALTHCARE',
      match_score: 81,
      recommended_disciplines: ['Mechanical Engg', 'Biotechnology', 'Public Health'],
      description: 'Temperature breakdown during last-mile vaccine delivery across interior forest panchayats.'
    }
  ]

  // Incoming student project proposals
  const incomingProposals = [
    {
      id: 'prop-ecofilter-01',
      proposal_title: 'EcoFilter Rural Water',
      challenge_title: 'Rural Water Quality',
      team_name: 'Team EcoFilter',
      team_size: 5,
      stage: 'Mentor Review',
      stage_color: 'indigo',
      action_text: 'Review →'
    },
    {
      id: 'prop-irrigation-02',
      proposal_title: 'Smart Irrigation Grid',
      challenge_title: 'Seasonal Agricultural Drought',
      team_name: 'GreenGrid Innovators',
      team_size: 6,
      stage: 'Proposal Submitted',
      stage_color: 'amber',
      action_text: 'Evaluate →'
    },
    {
      id: 'prop-coldchain-03',
      proposal_title: 'Cold-Chain Micro Unit',
      challenge_title: 'Tribal Vaccine Access',
      team_name: 'HealthTech Team',
      team_size: 4,
      stage: 'Faculty Review',
      stage_color: 'purple',
      action_text: 'Review →'
    }
  ]

  // Active Projects List
  const activeProjectsData = [
    {
      id: 'proj-01',
      title: 'Solar Micro-Grid Water Purifier',
      stage: 'TRL 5 Pilot',
      progress: 75,
      next_milestone: 'Field Validation in Khunti',
      status_color: 'teal'
    },
    {
      id: 'proj-02',
      title: 'AI Paddy Crop Blight Detector App',
      stage: 'TRL 3 Prototype',
      progress: 45,
      next_milestone: 'Model Training on Simdega Samples',
      status_color: 'indigo'
    },
    {
      id: 'proj-03',
      title: 'Phase-Change Vaccine Carrier Box',
      stage: 'TRL 4 Testing',
      progress: 60,
      next_milestone: 'Thermal Chamber Testing',
      status_color: 'amber'
    }
  ]

  const spotlightOpportunity = matchedChallenges[0]
  const secondaryOpportunities = matchedChallenges.slice(1)

  return (
    <div className="min-h-screen bg-[#FAFAFD] flex flex-col font-sans text-[#26205F]">
      <main className="flex-grow pt-3 pb-16 px-4 sm:px-6 max-w-[1200px] mx-auto w-full space-y-6">

        {/* ==================================================
            2. COMMAND HEADER
            ================================================== */}
        <header className="bg-white p-4 sm:p-4.5 rounded-xl border border-[#E4E2EC] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#5B3FD6] block">
              UNIVERSITY WORKSPACE &bull; RANCHI UNIVERSITY
            </span>
            <h1 className="text-2xl sm:text-[30px] font-extrabold text-[#26205F] tracking-tight leading-tight">
              Good morning, Innovation Team
            </h1>
            <p className="text-xs sm:text-[13px] text-[#4F4A78] font-normal leading-relaxed">
              Manage incoming community challenges, institutional decisions, student innovation projects, and deployment.
            </p>
          </div>

          {/* RIGHT: COMMAND CENTER OPERATIONAL SUMMARY (TODAY) */}
          <div className="bg-[#F0EEFA] px-3.5 py-2.5 rounded-xl border border-[#E4E2EC] shrink-0 space-y-1">
            <div className="flex items-center justify-between border-b border-[#E4E2EC] pb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#74708F]">
                TODAY
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#5B3FD6] animate-pulse"></span>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono font-bold text-[#26205F]">
              <div className="flex items-center gap-1">
                <span className="text-[#5B3FD6] text-sm">{String(metrics.awaitingReview || 3).padStart(2, '0')}</span>
                <span className="text-[11px] font-sans font-normal text-[#74708F]">Reviews</span>
              </div>
              <div className="flex items-center gap-1 border-l border-[#E4E2EC] pl-2.5">
                <span className="text-[#D97706] text-sm">{String(metrics.underEvaluation || 5).padStart(2, '0')}</span>
                <span className="text-[11px] font-sans font-normal text-[#74708F]">Decisions</span>
              </div>
              <div className="flex items-center gap-1 border-l border-[#E4E2EC] pl-2.5">
                <span className="text-[#159B8C] text-sm">{String(metrics.activeProjects || 12).padStart(2, '0')}</span>
                <span className="text-[11px] font-sans font-normal text-[#74708F]">Active Projects</span>
              </div>
              <div className="flex items-center gap-1 border-l border-[#E4E2EC] pl-2.5">
                <span className="text-emerald-700 text-sm">{String(metrics.deployed || 4).padStart(2, '0')}</span>
                <span className="text-[11px] font-sans font-normal text-[#74708F]">Deployed</span>
              </div>
            </div>
          </div>
        </header>

        {/* ==================================================
            3. COMPACT KPI STRIP
            ================================================== */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* KPI 1: NEW REQUESTS */}
          <div 
            onClick={() => navigate('/validation/queue')}
            className="bg-white p-3 rounded-xl border border-[#E4E2EC] border-t-3 border-t-[#5B3FD6] shadow-2xs hover:-translate-y-0.5 transition-all cursor-pointer space-y-1 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-extrabold text-[#74708F] uppercase tracking-[0.08em]">NEW REQUESTS</span>
              <span className="material-symbols-outlined text-sm text-[#5B3FD6]">inbox</span>
            </div>
            <div className="flex items-baseline justify-between pt-0.5">
              <span className="text-2xl font-extrabold text-[#26205F] font-mono leading-none">
                {String(metrics.awaitingReview || metrics.newRequests || 3).padStart(2, '0')}
              </span>
              <span className="text-[11px] font-bold text-[#5B3FD6] group-hover:translate-x-1 transition-transform inline-flex items-center">
                Review &rarr;
              </span>
            </div>
            <p className="text-[11px] text-[#74708F] font-medium truncate">Awaiting initial review</p>
          </div>

          {/* KPI 2: UNDER EVALUATION */}
          <div 
            onClick={() => navigate('/validation/queue')}
            className="bg-white p-3 rounded-xl border border-[#E4E2EC] border-t-3 border-t-[#D97706] shadow-2xs hover:-translate-y-0.5 transition-all cursor-pointer space-y-1 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-extrabold text-[#74708F] uppercase tracking-[0.08em]">UNDER EVALUATION</span>
              <span className="material-symbols-outlined text-sm text-[#D97706]">rate_review</span>
            </div>
            <div className="flex items-baseline justify-between pt-0.5">
              <span className="text-2xl font-extrabold text-[#26205F] font-mono leading-none">
                {String(metrics.underEvaluation || metrics.pending || 5).padStart(2, '0')}
              </span>
              <span className="text-[11px] font-bold text-[#26205F] group-hover:translate-x-1 transition-transform inline-flex items-center">
                Decide &rarr;
              </span>
            </div>
            <p className="text-[11px] text-[#74708F] font-medium truncate">Institutional validation</p>
          </div>

          {/* KPI 3: ACTIVE PROJECTS */}
          <div 
            onClick={() => navigate('/university/projects')}
            className="bg-white p-3 rounded-xl border border-[#E4E2EC] border-t-3 border-t-[#159B8C] shadow-2xs hover:-translate-y-0.5 transition-all cursor-pointer space-y-1 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-extrabold text-[#74708F] uppercase tracking-[0.08em]">ACTIVE PROJECTS</span>
              <span className="material-symbols-outlined text-sm text-[#159B8C]">engineering</span>
            </div>
            <div className="flex items-baseline justify-between pt-0.5">
              <span className="text-2xl font-extrabold text-[#26205F] font-mono leading-none">
                {String(metrics.activeProjects || 12).padStart(2, '0')}
              </span>
              <span className="text-[11px] font-bold text-[#159B8C] group-hover:translate-x-1 transition-transform inline-flex items-center">
                Manage &rarr;
              </span>
            </div>
            <p className="text-[11px] text-[#74708F] font-medium truncate">Student teams in R&D</p>
          </div>

          {/* KPI 4: SOLUTIONS DEPLOYED */}
          <div 
            onClick={() => navigate('/completed-solution')}
            className="bg-white p-3 rounded-xl border border-[#E4E2EC] border-t-3 border-t-emerald-600 shadow-2xs hover:-translate-y-0.5 transition-all cursor-pointer space-y-1 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-extrabold text-[#74708F] uppercase tracking-[0.08em]">SOLUTIONS DEPLOYED</span>
              <span className="material-symbols-outlined text-sm text-emerald-600">task_alt</span>
            </div>
            <div className="flex items-baseline justify-between pt-0.5">
              <span className="text-2xl font-extrabold text-[#26205F] font-mono leading-none">
                {String(metrics.deployed || 4).padStart(2, '0')}
              </span>
              <span className="text-[11px] font-bold text-emerald-700 group-hover:translate-x-1 transition-transform inline-flex items-center">
                Impact &rarr;
              </span>
            </div>
            <p className="text-[11px] text-[#74708F] font-medium truncate">Field implementations</p>
          </div>

        </section>

        {/* ==================================================
            4. PRIMARY WORKSPACE (2-COLUMN GRID: 68% / 32%)
            ================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* LEFT COLUMN (lg:col-span-8 / ~68%) — PRIORITY OPPORTUNITIES */}
          <div className="lg:col-span-8 space-y-4">
            
            <div className="flex items-center justify-between border-b border-[#E4E2EC] pb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#5B3FD6] flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-[#5B3FD6]">star</span>
                PRIORITY OPPORTUNITIES
              </span>
              <button
                onClick={() => navigate('/validation/queue')}
                className="text-xs font-bold text-[#5B3FD6] hover:text-[#26205F] cursor-pointer inline-flex items-center gap-0.5 group"
              >
                <span>Browse All</span>
                <span className="material-symbols-outlined text-xs group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>

            {/* 5. MAIN PRIORITY OPPORTUNITY / NEW CHALLENGE REQUEST CARD */}
            {spotlightOpportunity && (
              <div 
                className={`bg-white p-4.5 sm:p-5 rounded-xl border ${
                  oppStatus === 'ACCEPTED' ? 'border-teal-500/50 bg-teal-50/20' : oppStatus === 'DECLINED' ? 'border-rose-200 bg-rose-50/20' : 'border-[#5B3FD6]/30'
                } shadow-2xs space-y-3.5 group`}
              >
                {/* Header & Badges */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E4E2EC]/70 pb-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-[0.08em] ${
                      oppStatus === 'ACCEPTED' ? 'bg-teal-700 text-white' : oppStatus === 'DECLINED' ? 'bg-rose-700 text-white' : 'bg-[#5B3FD6] text-white'
                    }`}>
                      {oppStatus === 'ACCEPTED' ? '✓ UNIVERSITY ACCEPTED' : oppStatus === 'DECLINED' ? 'DECLINED BY UNIVERSITY' : 'NEW CHALLENGE REQUEST'}
                    </span>
                    <span className="text-[10px] font-extrabold text-[#5B3FD6] bg-[#5B3FD6]/10 px-2 py-0.5 rounded uppercase tracking-[0.08em]">
                      {spotlightOpportunity.primary_domain}
                    </span>
                    <span className="text-[11px] font-bold text-[#74708F]">
                      {spotlightOpportunity.district} &bull; 3 Community Signals &bull; Evidence Available
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-[#5B3FD6] bg-[#5B3FD6]/5 border border-[#5B3FD6]/20 px-2.5 py-0.5 rounded font-mono">
                      94% UNIVERSITY FIT
                    </span>
                  </div>
                </div>

                {/* Title & Short Description */}
                <div className="space-y-1">
                  <h2 className="text-lg sm:text-[22px] font-extrabold text-[#26205F] leading-snug">
                    Unsafe Drinking Water in Gumla
                  </h2>
                  <p className="text-xs text-[#4F4A78] leading-relaxed">
                    &ldquo;High levels of fluoride and chemical discoloration detected across Gumla borewells affecting primary school drinking water nodes. Direct match with Ranchi University Dept of Environmental Engineering.&rdquo;
                  </p>
                </div>

                {/* Disciplines Teaser */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] pt-1">
                  <span className="text-[#74708F] font-medium">Recommended Disciplines:</span>
                  {['Environmental Engineering', 'Water Filtration', 'IoT Sensor Research'].map((d, dIdx) => (
                    <span key={dIdx} className="bg-[#F0EEFA] text-[#26205F] px-2 py-0.5 rounded font-medium border border-[#E4E2EC]">
                      {d}
                    </span>
                  ))}
                </div>

                {/* Action Buttons Section */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#E4E2EC]/70">
                  {oppStatus !== 'ACCEPTED' && oppStatus !== 'DECLINED' ? (
                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => navigate('/admin/submissions/00000000-0000-0000-0002-000000000001/review')}
                        className="px-3.5 py-1.5 bg-[#F0EEFA] border border-[#E4E2EC] text-[#26205F] rounded-lg text-xs font-bold hover:bg-[#E4E2EC] transition-all cursor-pointer"
                      >
                        Review Opportunity &rarr;
                      </button>

                      <button
                        type="button"
                        disabled={acceptingLoading}
                        onClick={handleAcceptOpportunity}
                        className="px-4 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-bold hover:bg-emerald-800 transition-all flex items-center gap-1 cursor-pointer shadow-2xs disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-xs">check_circle</span>
                        <span>{acceptingLoading ? 'Accepting...' : 'Accept Opportunity'}</span>
                      </button>

                      <button
                        type="button"
                        disabled={acceptingLoading}
                        onClick={handleDeclineOpportunity}
                        className="px-3 py-1.5 border border-rose-200 text-rose-700 rounded-lg text-xs font-semibold hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        Decline
                      </button>
                    </div>
                  ) : oppStatus === 'ACCEPTED' ? (
                    <div className="space-y-2 w-full">
                      <div className="p-2.5 bg-teal-50 border border-teal-200 rounded-lg text-xs text-teal-900 font-medium flex items-center gap-2">
                        <span className="material-symbols-outlined text-base text-teal-700">check_circle</span>
                        <span>Opportunity Accepted by Ranchi University. Proceed with institutional governance setup:</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => navigate('/student/profile')}
                          className="px-3 py-1.5 bg-[#26205F] text-white rounded-lg text-xs font-bold hover:bg-[#5B3FD6] transition-colors cursor-pointer"
                        >
                          Form Student R&amp;D Team &rarr;
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate('/admin/problem/00000000-0000-0000-0002-000000000001')}
                          className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          View Lifecycle Audit Trace
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-900 font-medium flex items-center justify-between w-full">
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-base text-rose-600">cancel</span>
                        <span>Opportunity declined by Ranchi University. Returned for alternate institutional assignment.</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleAcceptOpportunity}
                        className="px-3 py-1 bg-[#26205F] text-white rounded text-[11px] font-bold hover:bg-purple-900"
                      >
                        Re-Accept
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 8. OTHER MATCHED OPPORTUNITIES */}
            {secondaryOpportunities.length > 0 && (
              <div className="space-y-2 pt-1">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#74708F] block">
                  OTHER MATCHED OPPORTUNITIES
                </span>

                <div className="space-y-2">
                  {secondaryOpportunities.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => navigate('/validation/queue')}
                      className="bg-white p-3 rounded-xl border border-[#E4E2EC] shadow-2xs hover:border-[#5B3FD6]/40 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-extrabold text-[#5B3FD6] bg-[#5B3FD6]/10 px-2 py-0.5 rounded uppercase shrink-0">
                            {item.primary_domain}
                          </span>
                          <h3 className="text-xs sm:text-sm font-bold text-[#26205F] group-hover:text-[#5B3FD6] truncate transition-colors">
                            {item.title}
                          </h3>
                        </div>
                        <p className="text-[11px] text-[#74708F] truncate">
                          {item.district} &bull; {item.community_signals} signals &bull; <strong className="text-[#5B3FD6] font-mono">{item.match_score}% fit</strong>
                        </p>
                      </div>

                      <span className="text-xs font-bold text-[#26205F] group-hover:text-[#5B3FD6] shrink-0 inline-flex items-center gap-0.5">
                        <span>Review</span>
                        <span className="material-symbols-outlined text-xs group-hover:translate-x-1 transition-transform">arrow_forward</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN (lg:col-span-4 / ~32%) — TODAY'S PRIORITY & REQUIRES YOUR ATTENTION */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* 6. TODAY'S PRIORITY AMBER WORKSPACE BLOCK */}
            <div 
              onClick={() => navigate('/validation/queue')}
              className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-xl cursor-pointer hover:bg-amber-500/15 transition-colors space-y-1 group"
            >
              <span className="text-[10px] font-extrabold text-amber-900 uppercase tracking-[0.08em] block">
                TODAY&apos;S PRIORITY
              </span>
              <p className="text-xs font-bold text-[#26205F]">
                Validate: Rural Water Quality &bull; 32 community signals &bull; High impact
              </p>
              <div className="pt-1 flex justify-end">
                <span className="text-xs font-bold text-amber-900 group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5">
                  Action &rarr;
                </span>
              </div>
            </div>

            {/* 7. REQUIRES YOUR ATTENTION (COMPACT OPERATIONAL LIST) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-[#E4E2EC] pb-1.5">
                <h2 className="text-[10px] font-extrabold text-[#74708F] uppercase tracking-[0.08em]">
                  REQUIRES YOUR ATTENTION
                </h2>
                <span className="text-[10px] font-extrabold text-[#DC2626] uppercase tracking-[0.08em]">
                  Action Due
                </span>
              </div>

              {/* Single Operational Workspace List */}
              <div className="bg-white rounded-xl border border-[#E4E2EC] divide-y divide-[#E4E2EC] text-xs shadow-2xs">
                
                {/* Item 1 */}
                <div 
                  onClick={() => navigate('/validation/queue')}
                  className="p-3 hover:bg-[#F7F6FD] transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-start gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-[#DC2626] mt-1 shrink-0 animate-pulse"></span>
                    <div className="min-w-0 space-y-0.5">
                      <div className="font-bold text-[#26205F] group-hover:text-[#5B3FD6] truncate text-[12px]">
                        Challenge awaiting validation
                      </div>
                      <div className="text-[11px] text-[#74708F] font-medium truncate">
                        3 recurring signals in Simdega
                      </div>
                    </div>
                  </div>
                  <span className="font-bold text-[#26205F] shrink-0 text-[11px] inline-flex items-center gap-0.5 group-hover:text-[#5B3FD6]">
                    <span>Validate</span>
                    <span className="material-symbols-outlined text-xs group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </span>
                </div>

                {/* Item 2 */}
                <div 
                  onClick={() => navigate('/validation/queue')}
                  className="p-3 hover:bg-[#F7F6FD] transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-start gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-[#D97706] mt-1 shrink-0"></span>
                    <div className="min-w-0 space-y-0.5">
                      <div className="font-bold text-[#26205F] group-hover:text-[#5B3FD6] truncate text-[12px]">
                        Mentor approval
                      </div>
                      <div className="text-[11px] text-[#74708F] font-medium truncate">
                        Proposal #PR-204
                      </div>
                    </div>
                  </div>
                  <span className="font-bold text-[#26205F] shrink-0 text-[11px] inline-flex items-center gap-0.5 group-hover:text-[#5B3FD6]">
                    <span>Review</span>
                    <span className="material-symbols-outlined text-xs group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </span>
                </div>

                {/* Item 3 */}
                <div 
                  onClick={() => navigate('/student/proposals')}
                  className="p-3 hover:bg-[#F7F6FD] transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-start gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-[#5B3FD6] mt-1 shrink-0"></span>
                    <div className="min-w-0 space-y-0.5">
                      <div className="font-bold text-[#26205F] group-hover:text-[#5B3FD6] truncate text-[12px]">
                        Mentor assignment
                      </div>
                      <div className="text-[11px] text-[#74708F] font-medium truncate">
                        Faculty pending
                      </div>
                    </div>
                  </div>
                  <span className="font-bold text-[#26205F] shrink-0 text-[11px] inline-flex items-center gap-0.5 group-hover:text-[#5B3FD6]">
                    <span>Assign</span>
                    <span className="material-symbols-outlined text-xs group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </span>
                </div>

                {/* Item 4 */}
                <div 
                  onClick={() => navigate('/student/proposals')}
                  className="p-3 hover:bg-[#F7F6FD] transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-start gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-[#159B8C] mt-1 shrink-0"></span>
                    <div className="min-w-0 space-y-0.5">
                      <div className="font-bold text-[#26205F] group-hover:text-[#5B3FD6] truncate text-[12px]">
                        Student proposal
                      </div>
                      <div className="text-[11px] text-[#74708F] font-medium truncate">
                        Awaiting evaluation
                      </div>
                    </div>
                  </div>
                  <span className="font-bold text-[#26205F] shrink-0 text-[11px] inline-flex items-center gap-0.5 group-hover:text-[#5B3FD6]">
                    <span>Evaluate</span>
                    <span className="material-symbols-outlined text-xs group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </span>
                </div>

              </div>
            </div>

          </div>

        </section>

        {/* ==================================================
            9. INCOMING PROJECT PROPOSALS
            ================================================== */}
        <section className="space-y-2 pt-1">
          <div className="flex items-center justify-between border-b border-[#E4E2EC] pb-1.5">
            <div>
              <h2 className="text-[10px] font-extrabold text-[#74708F] uppercase tracking-[0.08em]">
                INCOMING PROJECT PROPOSALS
              </h2>
              <p className="text-[11px] text-[#74708F]">
                Student teams proposing solutions to validated community challenges.
              </p>
            </div>
            <button
              onClick={() => navigate('/student/proposals')}
              className="text-xs font-bold text-[#5B3FD6] hover:text-[#26205F] cursor-pointer inline-flex items-center gap-0.5 group shrink-0"
            >
              <span>View All Proposals</span>
              <span className="material-symbols-outlined text-xs group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-[#E4E2EC] overflow-x-auto shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFAFD] border-b border-[#E4E2EC] text-[10px] font-extrabold text-[#74708F] uppercase tracking-[0.08em]">
                <tr>
                  <th className="py-2.5 px-4">PROPOSAL</th>
                  <th className="py-2.5 px-4">CHALLENGE</th>
                  <th className="py-2.5 px-4">TEAM</th>
                  <th className="py-2.5 px-4">STAGE</th>
                  <th className="py-2.5 px-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E2EC]">
                {incomingProposals.map((prop) => (
                  <tr 
                    key={prop.id}
                    onClick={() => navigate('/student/proposals')}
                    className="hover:bg-[#F7F6FD] transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 font-bold text-[#26205F] group-hover:text-[#5B3FD6]">
                      {prop.proposal_title}
                    </td>
                    <td className="py-3 px-4 text-[#74708F]">
                      {prop.challenge_title}
                    </td>
                    <td className="py-3 px-4 text-[#26205F] font-medium">
                      {prop.team_name} &bull; <span className="text-[#74708F]">{prop.team_size} members</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        prop.stage_color === 'indigo' ? 'bg-[#5B3FD6]/10 text-[#5B3FD6] border-[#5B3FD6]/20' :
                        prop.stage_color === 'amber' ? 'bg-amber-500/10 text-amber-800 border-amber-500/20' :
                        'bg-purple-500/10 text-purple-800 border-purple-500/20'
                      }`}>
                        {prop.stage}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-[#5B3FD6]">
                      <span className="inline-flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                        {prop.action_text}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ==================================================
            10. PROJECT WORKSPACE
            ================================================== */}
        <section className="space-y-2 pt-1">
          <div className="flex items-center justify-between border-b border-[#E4E2EC] pb-1.5">
            <h2 className="text-[10px] font-extrabold text-[#74708F] uppercase tracking-[0.08em]">
              PROJECT WORKSPACE
            </h2>
            <button
              onClick={() => navigate('/university/projects')}
              className="text-xs font-bold text-[#5B3FD6] hover:text-[#26205F] cursor-pointer inline-flex items-center gap-0.5 group"
            >
              <span>Manage All Projects</span>
              <span className="material-symbols-outlined text-xs group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-[#E4E2EC] overflow-x-auto shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFAFD] border-b border-[#E4E2EC] text-[10px] font-extrabold text-[#74708F] uppercase tracking-[0.08em]">
                <tr>
                  <th className="py-2.5 px-4">PROJECT</th>
                  <th className="py-2.5 px-4">STAGE</th>
                  <th className="py-2.5 px-4">PROGRESS</th>
                  <th className="py-2.5 px-4">NEXT MILESTONE</th>
                  <th className="py-2.5 px-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E2EC]">
                {activeProjectsData.map((proj) => (
                  <tr 
                    key={proj.id}
                    onClick={() => navigate('/university/projects')}
                    className="hover:bg-[#F7F6FD] transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 font-bold text-[#26205F] group-hover:text-[#5B3FD6]">
                      {proj.title}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[#159B8C]">
                      {proj.stage}
                    </td>
                    <td className="py-3 px-4 min-w-[120px]">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-[#E4E2EC] h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#5B3FD6] h-full rounded-full" style={{ width: `${proj.progress}%` }}></div>
                        </div>
                        <span className="font-mono text-[10px] font-bold text-[#74708F]">{proj.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#74708F]">
                      {proj.next_milestone}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-[#5B3FD6]">
                      <span className="inline-flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                        Manage &rarr;
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ==================================================
            11. UNIVERSITY CAPABILITY
            ================================================== */}
        <section className="space-y-2 pt-1">
          <div className="flex items-center justify-between border-b border-[#E4E2EC] pb-1.5">
            <h2 className="text-[10px] font-extrabold text-[#74708F] uppercase tracking-[0.08em]">
              UNIVERSITY CAPABILITY
            </h2>
            <button
              onClick={() => navigate('/university/profile')}
              className="text-xs font-bold text-[#5B3FD6] hover:text-[#26205F] cursor-pointer inline-flex items-center gap-0.5 group"
            >
              <span>Manage Profile</span>
              <span className="material-symbols-outlined text-xs group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-[#E4E2EC] shadow-2xs space-y-2">
              <div className="flex justify-between text-xs font-bold text-[#26205F]">
                <span>Water Management</span>
                <span className="font-mono text-[#5B3FD6]">88% Capacity</span>
              </div>
              <div className="w-full bg-[#E4E2EC] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#5B3FD6] h-full rounded-full" style={{ width: '88%' }}></div>
              </div>
              <span className="text-[10px] text-[#74708F] block">Dept of Environmental Engineering</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#E4E2EC] shadow-2xs space-y-2">
              <div className="flex justify-between text-xs font-bold text-[#26205F]">
                <span>Agriculture</span>
                <span className="font-mono text-[#5B3FD6]">75% Capacity</span>
              </div>
              <div className="w-full bg-[#E4E2EC] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#5B3FD6] h-full rounded-full" style={{ width: '75%' }}></div>
              </div>
              <span className="text-[10px] text-[#74708F] block">Agri-Tech & Soil Science Center</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#E4E2EC] shadow-2xs space-y-2">
              <div className="flex justify-between text-xs font-bold text-[#26205F]">
                <span>Public Health</span>
                <span className="font-mono text-[#5B3FD6]">82% Capacity</span>
              </div>
              <div className="w-full bg-[#E4E2EC] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#5B3FD6] h-full rounded-full" style={{ width: '82%' }}></div>
              </div>
              <span className="text-[10px] text-[#74708F] block">Biotech Innovation Lab</span>
            </div>
          </div>
        </section>

        {/* ==================================================
            12. PARTNER NETWORK
            ================================================== */}
        <section className="space-y-2 pt-1">
          <div className="flex items-center justify-between border-b border-[#E4E2EC] pb-1.5">
            <h2 className="text-[10px] font-extrabold text-[#74708F] uppercase tracking-[0.08em]">
              PARTNER NETWORK
            </h2>
            <button
              onClick={() => navigate('/collaborations')}
              className="text-xs font-bold text-[#5B3FD6] hover:text-[#26205F] cursor-pointer inline-flex items-center gap-0.5 group"
            >
              <span>View All Partners</span>
              <span className="material-symbols-outlined text-xs group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white p-3 rounded-xl border border-[#E4E2EC] shadow-2xs flex items-center justify-between">
              <div>
                <strong className="text-xs font-bold text-[#26205F] block">Tata Steel Foundation</strong>
                <span className="text-[10px] text-[#74708F]">Field CSR Partner</span>
              </div>
              <span className="text-[9px] font-extrabold text-[#159B8C] bg-[#159B8C]/10 border border-[#159B8C]/20 px-1.5 py-0.5 rounded uppercase">
                ACTIVE
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-[#E4E2EC] shadow-2xs flex items-center justify-between">
              <div>
                <strong className="text-xs font-bold text-[#26205F] block">Jharkhand Water Board</strong>
                <span className="text-[10px] text-[#74708F]">Govt Deployment</span>
              </div>
              <span className="text-[9px] font-extrabold text-[#5B3FD6] bg-[#5B3FD6]/10 border border-[#5B3FD6]/20 px-1.5 py-0.5 rounded uppercase">
                APPROVED
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-[#E4E2EC] shadow-2xs flex items-center justify-between">
              <div>
                <strong className="text-xs font-bold text-[#26205F] block">MECON</strong>
                <span className="text-[10px] text-[#74708F]">Technical Mentorship</span>
              </div>
              <span className="text-[9px] font-extrabold text-[#159B8C] bg-[#159B8C]/10 border border-[#159B8C]/20 px-1.5 py-0.5 rounded uppercase">
                MENTORSHIP
              </span>
            </div>
          </div>
        </section>

        {/* ==================================================
            13. UNIVERSITY INNOVATION PIPELINE (STRATEGIC SUMMARY AT VERY END)
            ================================================== */}
        <footer className="bg-[#F0EEFA] p-4.5 rounded-2xl border border-[#E4E2EC] shadow-2xs space-y-3 pt-4">
          <div className="flex items-center justify-between border-b border-[#E4E2EC] pb-2">
            <h2 className="text-[10px] font-extrabold text-[#74708F] uppercase tracking-[0.08em]">
              UNIVERSITY INNOVATION PIPELINE
            </h2>
            <span className="text-[10px] text-[#74708F] font-medium">Strategic Overview</span>
          </div>

          {/* Continuous Path with 7 Nodes */}
          <div className="overflow-x-auto pb-1">
            <div className="min-w-[850px] flex items-center justify-between relative py-2 px-2">
              
              {/* Background Continuous Path Line */}
              <div className="absolute top-[20px] left-6 right-6 h-0.5 bg-[#E4E2EC] -z-0"></div>

              {/* Node 1 */}
              <div onClick={() => navigate('/citizen/track-problems')} className="relative z-10 flex flex-col items-center group cursor-pointer text-center space-y-1">
                <div className="w-6 h-6 rounded-full bg-white border border-[#E4E2EC] text-[#4F4A78] font-bold text-[10px] flex items-center justify-center ring-4 ring-[#F0EEFA]">
                  {metrics.totalSubmissions || 48}
                </div>
                <span className="text-[10px] font-medium text-[#4F4A78]">Community Signals</span>
              </div>

              {/* Node 2 */}
              <div onClick={() => navigate('/validation/queue')} className="relative z-10 flex flex-col items-center group cursor-pointer text-center space-y-1">
                <div className="w-6 h-6 rounded-full bg-white border border-[#E4E2EC] text-[#4F4A78] font-bold text-[10px] flex items-center justify-center ring-4 ring-[#F0EEFA]">
                  {metrics.newRequests || 14}
                </div>
                <span className="text-[10px] font-medium text-[#4F4A78]">Emerging Patterns</span>
              </div>

              {/* Node 3 (Active Stage with Indigo Halo) */}
              <div onClick={() => navigate('/validation/queue')} className="relative z-10 flex flex-col items-center group cursor-pointer text-center space-y-1">
                <div className="w-7 h-7 rounded-full bg-[#26205F] text-white font-extrabold text-[11px] flex items-center justify-center ring-4 ring-[#5B3FD6]/30 shadow-xs">
                  {metrics.underEvaluation || 8}
                </div>
                <span className="text-[10px] font-bold text-[#26205F]">Validated Challenges</span>
              </div>

              {/* Node 4 */}
              <div onClick={() => navigate('/student/proposals')} className="relative z-10 flex flex-col items-center group cursor-pointer text-center space-y-1">
                <div className="w-6 h-6 rounded-full bg-white border border-[#E4E2EC] text-[#4F4A78] font-bold text-[10px] flex items-center justify-center ring-4 ring-[#F0EEFA]">
                  {metrics.pending || 12}
                </div>
                <span className="text-[10px] font-medium text-[#4F4A78]">Student Teams</span>
              </div>

              {/* Node 5 */}
              <div onClick={() => navigate('/university/projects')} className="relative z-10 flex flex-col items-center group cursor-pointer text-center space-y-1">
                <div className="w-6 h-6 rounded-full bg-white border border-[#E4E2EC] text-[#4F4A78] font-bold text-[10px] flex items-center justify-center ring-4 ring-[#F0EEFA]">
                  {metrics.activeProjects || 12}
                </div>
                <span className="text-[10px] font-medium text-[#4F4A78]">Active Projects</span>
              </div>

              {/* Node 6 */}
              <div onClick={() => navigate('/university/projects')} className="relative z-10 flex flex-col items-center group cursor-pointer text-center space-y-1">
                <div className="w-6 h-6 rounded-full bg-white border border-[#E4E2EC] text-[#4F4A78] font-bold text-[10px] flex items-center justify-center ring-4 ring-[#F0EEFA]">
                  {metrics.active || 3}
                </div>
                <span className="text-[10px] font-medium text-[#4F4A78]">Pilot / Testing</span>
              </div>

              {/* Node 7 (Real Impact in Teal) */}
              <div onClick={() => navigate('/completed-solution')} className="relative z-10 flex flex-col items-center group cursor-pointer text-center space-y-1">
                <div className="w-6 h-6 rounded-full bg-[#159B8C]/15 text-[#159B8C] border border-[#159B8C]/30 font-bold text-[10px] flex items-center justify-center ring-4 ring-[#F0EEFA]">
                  {metrics.deployed || 4}
                </div>
                <span className="text-[10px] font-bold text-[#159B8C]">Real Impact</span>
              </div>

            </div>
          </div>
        </footer>

        {adminActionMsg && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2 ${
              adminActionMsg.type === 'error'
                ? 'bg-red-50 text-red-800 border-red-200'
                : adminActionMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-slate-100 text-slate-800 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">
                {adminActionMsg.type === 'error' ? 'error' : adminActionMsg.type === 'success' ? 'check_circle' : 'info'}
              </span>
              <span className="font-semibold">{adminActionMsg.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setAdminActionMsg(null)}
              className="material-symbols-outlined text-sm cursor-pointer opacity-60 hover:opacity-100"
            >
              close
            </button>
          </div>
        )}

      </main>
    </div>
  )
}
