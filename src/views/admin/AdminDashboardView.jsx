import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { api } from '../../lib/api'

export default function AdminDashboardView() {
  const navigate = useNavigate()

  const [metrics, setMetrics] = useState({
    communityReports: 1248,
    aiPatterns: 86,
    validatedPatterns: 42,
    activeChallenges: 24,
    universities: 18,
    activeProjects: 31,
    solutionsDeployed: 7,
  })

  useEffect(() => {
    async function loadAdminData() {
      try {
        const res = await api.getDashboard()
        if (res && res.metrics) {
          setMetrics((prev) => ({
            ...prev,
            communityReports: res.metrics.totalSubmissions || 1248,
            aiPatterns: res.metrics.pending || 86,
            activeChallenges: res.metrics.active || 24,
            activeProjects: res.metrics.activeProjects || 31,
            solutionsDeployed: res.metrics.deployed || 7,
          }))
        }
      } catch (err) {
        console.warn('[Admin Dashboard API Fallback]: Using deterministic ecosystem metrics:', err.message)
      }
    }
    loadAdminData()
  }, [])

  // Action Required Items (Rendered as Screenshot 1 Visual Tint Cards)
  const actionRequiredItems = [
    {
      id: 'act-1',
      count: 12,
      title: 'Community Patterns Awaiting Validation',
      subtitle: 'Review & verify AI-clustered signals',
      route: '/admin/submissions',
      btnText: 'Review Queue →',
      bgColor: 'bg-[#FEF2F2]',
      borderColor: 'border-rose-200/80',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      textColor: 'text-rose-950',
      countColor: 'text-rose-700',
      btnColor: 'text-rose-700 hover:text-rose-900',
      iconBg: 'bg-rose-100 text-rose-600',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },
    {
      id: 'act-2',
      count: 4,
      title: 'Challenges Awaiting Publication',
      subtitle: 'Formulate open innovation briefs',
      route: '/admin/clusters',
      btnText: 'Inspect Signals →',
      bgColor: 'bg-[#ECFDF5]',
      borderColor: 'border-emerald-200/80',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      textColor: 'text-emerald-950',
      countColor: 'text-emerald-700',
      btnColor: 'text-emerald-700 hover:text-emerald-900',
      iconBg: 'bg-emerald-100 text-emerald-600',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      id: 'act-3',
      count: 7,
      title: 'Proposals Awaiting Decision',
      subtitle: 'Evaluate university team applications',
      route: '/admin/projects',
      btnText: 'Review Proposals →',
      bgColor: 'bg-[#EFF6FF]',
      borderColor: 'border-blue-200/80',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      textColor: 'text-blue-950',
      countColor: 'text-blue-700',
      btnColor: 'text-blue-700 hover:text-blue-900',
      iconBg: 'bg-blue-100 text-blue-600',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      id: 'act-4',
      count: 3,
      title: 'Projects Requiring Milestone Review',
      subtitle: 'Assess TRL progress & field pilots',
      route: '/admin/projects',
      btnText: 'Review Milestones →',
      bgColor: 'bg-[#F3E8FF]',
      borderColor: 'border-purple-200/80',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      textColor: 'text-purple-950',
      countColor: 'text-purple-700',
      btnColor: 'text-purple-700 hover:text-purple-900',
      iconBg: 'bg-purple-100 text-purple-600',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
  ]

  // Ecosystem Operational Health Indicators
  const ecosystemHealth = [
    { label: 'Community signal processing', percent: 86, width: 'w-[86%]' },
    { label: 'Challenge pipeline', percent: 92, width: 'w-[92%]' },
    { label: 'University participation', percent: 78, width: 'w-[78%]' },
    { label: 'Project progression', percent: 74, width: 'w-[74%]' },
    { label: 'Deployment conversion', percent: 41, width: 'w-[41%]' },
  ]

  // Problem to Impact Pipeline Steps (Styled as Ecosystem Flow cards from Screenshot 1)
  const pipelineSteps = [
    { count: '1,248', label: 'Citizen Reports', sub: 'Citizen observations', icon: '📢', active: false },
    { count: '86', label: 'AI Understanding', sub: 'Processing & clustered', icon: '🧠', active: false },
    { count: '42', label: 'Admin Validation', sub: 'Awaiting review', icon: '🔍', active: true },
    { count: '24', label: 'Active Challenges', sub: 'Open innovation', icon: '🎯', active: false },
    { count: '31', label: 'R&D Projects', sub: 'Student teams', icon: '🔬', active: false },
    { count: '7', label: 'Solutions Deployed', sub: 'Field verified', icon: '🚀', active: false },
  ]

  // Priority Problems Table
  const priorityProblems = [
    {
      id: 'SS-2026-00871',
      fullId: '00000000-0000-0000-0002-000000000001',
      title: 'Unfiltered Industrial Runoff & River Pollution',
      domain: 'Water & Sanitation',
      location: 'Subarnarekha Basin, Ranchi',
      severity: 'High',
      reports: 3,
      time: '12 min ago',
      route: '/admin/problem/00000000-0000-0000-0002-000000000001',
    },
    {
      id: 'SS-2026-00872',
      fullId: 'SS-2026-00872',
      title: 'Rice Disease Affecting Farmers',
      domain: 'Agriculture',
      location: 'Khunti District',
      severity: 'Medium',
      reports: 8,
      time: '45 min ago',
      route: '/admin/problem/00000000-0000-0000-0002-000000000001',
    },
    {
      id: 'SS-2026-00873',
      fullId: 'SS-2026-00873',
      title: 'Community Sanitation & Drainage Blockage',
      domain: 'Public Health',
      location: 'Ranchi Rural',
      severity: 'High',
      reports: 11,
      time: '1 hour ago',
      route: '/admin/problem/00000000-0000-0000-0002-000000000001',
    },
    {
      id: 'SS-2026-00874',
      fullId: 'SS-2026-00874',
      title: 'Off-Grid Micro-Grid Battery Storage Failure',
      domain: 'Energy & Hardware',
      location: 'Simdega District',
      severity: 'Medium',
      reports: 6,
      time: '2 hours ago',
      route: '/admin/problem/00000000-0000-0000-0002-000000000001',
    },
  ]

  // Recent Activity Feed (Rendered as Screenshot 1 Timeline)
  const recentActivities = [
    { time: '2 min ago', title: 'New citizen problem submitted', desc: 'Water contamination in Gumla district', dotColor: 'bg-[#26205F]' },
    { time: '12 min ago', title: 'AI detected duplicate pattern cluster', desc: '4 similar citizen reports merged automatically', dotColor: 'bg-emerald-600' },
    { time: '1 hour ago', title: 'Admin validated community signal', desc: 'Signal verified by mentor Dr. Anjali Kumar', dotColor: 'bg-indigo-600' },
    { time: '3 hours ago', title: 'University accepted challenge', desc: 'BIT Mesra accepted Water Sanitation initiative', dotColor: 'bg-purple-600' },
    { time: 'Today', title: 'Proposal approved for TRL 4 prototype', desc: 'R&D funding allocated for prototype development', dotColor: 'bg-blue-600' },
  ]

  // Domain Overview Matrix
  const domainData = [
    { domain: 'Water & Sanitation', challenges: 7, projects: 9, deployed: 2 },
    { domain: 'Agriculture', challenges: 5, projects: 7, deployed: 1 },
    { domain: 'Healthcare', challenges: 4, projects: 5, deployed: 1 },
    { domain: 'Infrastructure', challenges: 3, projects: 4, deployed: 1 },
    { domain: 'Environment', challenges: 3, projects: 3, deployed: 1 },
    { domain: 'Livelihoods', challenges: 2, projects: 2, deployed: 1 },
    { domain: 'Accessibility', challenges: 1, projects: 1, deployed: 0 },
  ]

  return (
    <div className="space-y-7 pb-8 text-slate-800">

      {/* 1. SCREENSHOT 1 GREETING HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Good morning, Administrator <span className="animate-bounce inline-block">👋</span>
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Here is what is happening across the <span className="font-semibold text-slate-700">Jharkhand Innovation ecosystem</span> today.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Ecosystem Live
          </span>
        </div>
      </div>

      {/* 2. ECOSYSTEM FLOW (Screenshot 1 Visual Pipeline Flow Strip) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">
            Ecosystem Flow & Pipeline Status
          </h2>
          <span className="text-xs text-slate-500 font-medium">6 Stage Lifecycle</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 items-center">
          {pipelineSteps.map((step, idx) => (
            <div key={idx} className="relative group">
              <div
                className={`p-4 rounded-2xl border transition-all duration-200 ${step.active
                    ? 'bg-[#26205F] text-white border-[#26205F] shadow-lg shadow-purple-900/15 ring-2 ring-[#26205F]/20'
                    : 'bg-white text-slate-800 border-slate-200/80 shadow-2xs hover:border-slate-300'
                  }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-base">{step.icon}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${step.active ? 'text-purple-200' : 'text-slate-400'}`}>
                    0{idx + 1}
                  </span>
                </div>
                <div className={`text-2xl font-extrabold font-mono tracking-tight ${step.active ? 'text-white' : 'text-slate-900'}`}>
                  {step.count}
                </div>
                <div className={`text-xs font-bold mt-1 line-clamp-1 ${step.active ? 'text-purple-100' : 'text-slate-700'}`}>
                  {step.label}
                </div>
                <div className={`text-[11px] font-normal truncate ${step.active ? 'text-purple-200/80' : 'text-slate-400'}`}>
                  {step.sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. METRICS OVERVIEW STRIP */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-1">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-y sm:divide-y-0 divide-slate-100 text-center">
          <div className="p-4 space-y-1">
            <span className="text-xs font-medium text-slate-500 block">Community Reports</span>
            <div className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight">{metrics.communityReports.toLocaleString()}</div>
          </div>
          <div className="p-4 space-y-1">
            <span className="text-xs font-medium text-slate-500 block">AI Patterns</span>
            <div className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight">{metrics.aiPatterns}</div>
          </div>
          <div className="p-4 space-y-1">
            <span className="text-xs font-medium text-slate-500 block">Active Challenges</span>
            <div className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight">{metrics.activeChallenges}</div>
          </div>
          <div className="p-4 space-y-1">
            <span className="text-xs font-medium text-slate-500 block">Universities</span>
            <div className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight">{metrics.universities}</div>
          </div>
          <div className="p-4 space-y-1">
            <span className="text-xs font-medium text-slate-500 block">Active Projects</span>
            <div className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight">{metrics.activeProjects}</div>
          </div>
          <div className="p-4 space-y-1 bg-emerald-50/50 rounded-r-xl">
            <span className="text-xs font-bold text-emerald-800 block">Solutions Deployed</span>
            <div className="text-2xl font-extrabold text-emerald-700 font-mono tracking-tight">{metrics.solutionsDeployed}</div>
          </div>
        </div>
      </div>

      {/* 4. ACTION REQUIRED HIGHLIGHT CARDS (SCREENSHOT 1 SIGNATURE ACTION CARDS) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">
            Attention & Priority Action Queue
          </h2>
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            26 Pending Total
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {actionRequiredItems.map((act) => (
            <div
              key={act.id}
              onClick={() => navigate(act.route)}
              className={`${act.bgColor} border ${act.borderColor} rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group min-h-[170px]`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-xl ${act.iconBg}`}>
                    {act.icon}
                  </div>
                  <span className={`font-mono text-xl font-extrabold px-2.5 py-0.5 rounded-lg border ${act.badgeColor}`}>
                    {act.count}
                  </span>
                </div>
                <div>
                  <h3 className={`text-base font-extrabold leading-snug tracking-tight ${act.textColor}`}>
                    {act.title}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium mt-1">
                    {act.subtitle}
                  </p>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-200/40">
                <span className={`text-xs font-bold transition-all group-hover:translate-x-1 flex items-center gap-1 ${act.btnColor}`}>
                  {act.btnText}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. 2-COLUMN GRID: PRIORITY PROBLEMS FOR REVIEW & LIVE ECOSYSTEM ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Priority Problems Table (7 cols - Matching Screenshot 1 Table & Button Style) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Priority Problems for Review</h2>
              <p className="text-xs text-slate-500 font-normal">High priority community reports awaiting administrative verification</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/admin/submissions')}
              className="text-xs font-bold text-[#26205F] hover:underline cursor-pointer flex items-center gap-1"
            >
              View All &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-3">ID / Title</th>
                  <th className="pb-3">Category / Location</th>
                  <th className="pb-3">Status / Severity</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {priorityProblems.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-3.5 pr-3 max-w-[220px]">
                      <span className="font-mono text-[10px] text-slate-400 block tracking-tight">{p.id}</span>
                      <span className="font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-[#26205F] transition-colors">
                        {p.title}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{p.time}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-bold text-slate-800 block">{p.domain}</span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <svg className="w-3 h-3 text-slate-400 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {p.location}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="space-y-1">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide inline-block ${p.severity === 'High'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}>
                          {p.severity} Severity
                        </span>
                        <span className="text-[10px] text-slate-400 block font-mono">{p.reports} Reports</span>
                      </div>
                    </td>
                    <td className="py-3.5 pl-3 text-right">
                      <button
                        type="button"
                        onClick={() => navigate(p.route)}
                        className="bg-[#26205F] text-white hover:bg-[#1C1748] px-3.5 py-1.5 rounded-lg font-bold text-xs shadow-2xs transition-all duration-150 cursor-pointer inline-flex items-center gap-1 group-hover:shadow-xs"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Ecosystem Activity Timeline (5 cols - Screenshot 1 Vertical Dot Timeline) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Live Ecosystem Activity</h2>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          </div>

          <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {recentActivities.map((act, i) => (
              <div key={i} className="relative group">
                <span className={`absolute -left-[21px] top-1.5 w-3 h-3 rounded-full ${act.dotColor} ring-4 ring-white shadow-2xs`}></span>
                <div>
                  <span className="font-mono text-[11px] text-slate-400 font-medium block">{act.time}</span>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">{act.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 font-normal leading-relaxed">{act.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 6. 2-COLUMN BOTTOM SECTION: ECOSYSTEM HEALTH & DOMAIN OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Operational Ecosystem Health Ratios (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Ecosystem Health</h2>
              <p className="text-xs text-slate-500 font-normal">Operational throughput and conversion ratios</p>
            </div>
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
              Ratios
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            {ecosystemHealth.map((item, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between font-bold text-slate-700">
                  <span>{item.label}</span>
                  <span className="font-mono text-slate-900 font-extrabold">{item.percent}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.width} bg-[#26205F] rounded-full transition-all duration-500`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Domain Overview Matrix (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Domain Overview</h2>
              <p className="text-xs text-slate-500 font-normal">Statewide innovation breakdown across priority focus areas</p>
            </div>
            <span className="text-[11px] font-bold text-slate-500">7 Domains</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-3">Domain</th>
                  <th className="pb-3 text-center">Active Challenges</th>
                  <th className="pb-3 text-center">Active Projects</th>
                  <th className="pb-3 text-right">Solutions Deployed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {domainData.map((d, i) => (
                  <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 pr-2 font-bold text-slate-900">{d.domain}</td>
                    <td className="py-2.5 px-2 text-center font-mono font-semibold text-slate-700">{d.challenges}</td>
                    <td className="py-2.5 px-2 text-center font-mono font-semibold text-slate-700">{d.projects}</td>
                    <td className="py-2.5 pl-2 text-right font-mono text-emerald-700 font-extrabold">{d.deployed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  )
}

