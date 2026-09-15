import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { useAuth } from '../lib/auth'

const DEFAULT_STUDENT_PROFILE = {
  name: 'Rahul Sharma',
  university: 'Ranchi University',
  department: 'Environmental & Water Resources Engineering',
  year: 'Final Year B.Tech',
  skills: ['Water Testing', 'IoT Sensors', 'Environmental Engineering', 'Data Analysis', 'Field Validation'],
}

export default function StudentDashboardView() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const userProfile = useSelector((state) => state.app.userProfile) || DEFAULT_STUDENT_PROFILE

  const [studentProfile, setStudentProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('samadhan_student_profile')
      return saved ? JSON.parse(saved) : DEFAULT_STUDENT_PROFILE
    } catch (err) {
      return DEFAULT_STUDENT_PROFILE
    }
  })

  // Recommended Challenges Data
  const recommendedChallenges = [
    {
      id: 'ch-water-gumla',
      title: 'Drinking Water Quality & Heavy Metal Filtration',
      domain: 'Water & Sanitation',
      district: 'Ranchi, Jharkhand',
      affectedPopulation: '14,200',
      reportsCount: 32,
      severity: '8.8 / 10',
      matchScore: 94,
      skillsNeeded: ['Water Testing', 'IoT Sensors', 'Filtration', 'Field Validation'],
      teamStatus: 'Team AquaSense (Active)',
      hasTeam: true,
    },
    {
      id: 'ch-agri-blast',
      title: 'Paddy Leaf Blast & Fungal Spore Early Detection AI',
      domain: 'Agriculture & Rural Systems',
      district: 'Khunti, Jharkhand',
      affectedPopulation: '8,500',
      reportsCount: 18,
      severity: '7.9 / 10',
      matchScore: 91,
      skillsNeeded: ['Edge AI', 'Plant Pathology', 'Computer Vision', 'Mobile Diagnostics'],
      teamStatus: 'Open for Teams',
      hasTeam: false,
    },
    {
      id: 'ch-solar-meter',
      title: 'Low-Power Solar Smart Meter for Rural Micro-Grids',
      domain: 'Smart Hardware & Energy',
      district: 'Simdega, Jharkhand',
      affectedPopulation: '6,200',
      reportsCount: 14,
      severity: '7.5 / 10',
      matchScore: 88,
      skillsNeeded: ['Embedded Systems', 'ESP32', 'Micro-controller Assembly', 'Telemetry'],
      teamStatus: 'Open for Teams',
      hasTeam: false,
    },
  ]

  // Active Student Work
  const activeWork = [
    {
      id: 'work-1',
      title: 'Bio-Char & Activated Alumina Filtration System',
      type: 'PROPOSAL DRAFT',
      status: 'Under Faculty Review',
      statusColor: 'bg-amber-100 text-amber-900 border-amber-300',
      mentor: 'Dr. Anjali Kumar',
      dueDate: 'Action Required',
      route: '/student/proposal/prop-101',
    },
    {
      id: 'work-2',
      title: 'AquaSense Community Water Telemetry Unit',
      type: 'ACTIVE PROJECT',
      status: 'TRL 4 — Field Testing',
      statusColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      mentor: 'Dr. Anjali Kumar',
      dueDate: 'Milestone Due in 3 days',
      route: '/project/proj-water-01',
    },
  ]

  // Recent Activity Feed
  const recentActivity = [
    {
      id: 1,
      icon: 'verified',
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      text: 'Faculty Mentor Dr. Anjali Kumar reviewed your TRL 3 lab filtration results.',
      time: '2 hours ago',
    },
    {
      id: 2,
      icon: 'groups',
      color: 'text-brand-violet bg-brand-violet/10 border-brand-violet/20',
      text: 'Joined Team AquaSense as Lead Environmental Engineer.',
      time: '1 day ago',
    },
    {
      id: 3,
      icon: 'description',
      color: 'text-brand-indigo bg-brand-indigo/10 border-brand-indigo/20',
      text: 'Submitted Proposal: Bio-Char & Activated Alumina Filtration System.',
      time: '3 days ago',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-[#FAF8FF] via-white to-[#F6F3FB] text-on-surface">
      <main className="flex-grow pt-8 pb-20 px-6 md:px-margin-desktop max-w-[1240px] mx-auto w-full space-y-8">
        {/* Welcome Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-outline-variant/70 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold text-brand-violet uppercase tracking-widest bg-brand-violet/10 border border-brand-violet/20 px-3 py-1 rounded-full">
                STUDENT INNOVATOR PORTAL
              </span>
              <span className="text-xs text-on-surface-variant font-semibold">
                • {studentProfile.university}
              </span>
              <span className="text-xs text-on-surface-variant font-semibold">
                • {studentProfile.department}
              </span>
            </div>

            <h1 className="font-display-lg text-brand-indigo text-3xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, <span className="text-brand-violet">{studentProfile.name}</span>
            </h1>

            <p className="text-xs sm:text-sm text-on-surface-variant font-medium">
              &quot;Turn real community problems into solutions.&quot; — Ranchi University Civic Innovation Cell
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => navigate('/student/explorer')}
              className="bg-brand-indigo text-white px-5 py-2.5 rounded-full font-label-md text-xs font-bold hover:bg-brand-violet transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">explore</span>
              <span>Explore Civic Challenges</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/student/profile')}
              className="border border-brand-indigo text-brand-indigo hover:bg-brand-indigo/5 px-4 py-2.5 rounded-full font-label-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">person</span>
              <span>My Profile</span>
            </button>
          </div>
        </div>

        {/* STUDENT SNAPSHOT */}
        <div className="space-y-3">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant block">
            STUDENT SNAPSHOT
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-outline-variant/70 shadow-2xs space-y-2 hover:-translate-y-0.5 transition-all">
              <div className="flex items-center justify-between text-brand-indigo">
                <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">CHALLENGES JOINED</span>
                <span className="material-symbols-outlined text-lg">flag</span>
              </div>
              <div className="text-3xl font-extrabold text-brand-indigo font-mono">2</div>
              <p className="text-[11px] text-on-surface-variant">Active civic tracks</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-outline-variant/70 shadow-2xs space-y-2 hover:-translate-y-0.5 transition-all">
              <div className="flex items-center justify-between text-brand-violet">
                <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">ACTIVE PROJECTS</span>
                <span className="material-symbols-outlined text-lg">engineering</span>
              </div>
              <div className="text-3xl font-extrabold text-brand-violet font-mono">1</div>
              <p className="text-[11px] text-on-surface-variant">TRL 4 prototype</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-outline-variant/70 shadow-2xs space-y-2 hover:-translate-y-0.5 transition-all">
              <div className="flex items-center justify-between text-brand-indigo">
                <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">TEAMS</span>
                <span className="material-symbols-outlined text-lg">groups</span>
              </div>
              <div className="text-3xl font-extrabold text-brand-indigo font-mono">1</div>
              <p className="text-[11px] text-on-surface-variant">Team AquaSense</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-outline-variant/70 shadow-2xs space-y-2 hover:-translate-y-0.5 transition-all">
              <div className="flex items-center justify-between text-brand-violet">
                <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">PROPOSALS</span>
                <span className="material-symbols-outlined text-lg">description</span>
              </div>
              <div className="text-3xl font-extrabold text-brand-violet font-mono">2</div>
              <p className="text-[11px] text-on-surface-variant">1 Under review</p>
            </div>

            <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200/80 shadow-2xs space-y-2 hover:-translate-y-0.5 transition-all col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between text-emerald-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900">IMPACT / SOLUTIONS</span>
                <span className="material-symbols-outlined text-lg text-emerald-700">task_alt</span>
              </div>
              <div className="text-3xl font-extrabold text-emerald-800 font-mono">1</div>
              <p className="text-[11px] text-emerald-900 font-medium">Deployed in field</p>
            </div>
          </div>
        </div>

        {/* RECOMMENDED CHALLENGES */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-outline-variant/70 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-brand-violet uppercase tracking-widest bg-brand-violet/10 px-2.5 py-0.5 rounded-full">
                  CAPABILITY MATCHED
                </span>
                <span className="text-xs text-on-surface-variant font-semibold">• Based on your skills &amp; department</span>
              </div>
              <h2 className="font-headline-md text-brand-indigo text-xl font-bold mt-1">
                RECOMMENDED CHALLENGES FOR YOU
              </h2>
            </div>

            <button
              type="button"
              onClick={() => navigate('/student/explorer')}
              className="text-xs font-bold text-brand-violet hover:underline flex items-center gap-1 cursor-pointer"
            >
              View All Challenges &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {recommendedChallenges.map((ch) => (
              <div
                key={ch.id}
                className="p-5 bg-surface-container-low rounded-2xl border border-outline-variant/50 hover:border-brand-violet transition-all space-y-3 flex flex-col justify-between hover:-translate-y-0.5"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-1 flex-wrap">
                    <span className="text-[10px] font-bold text-brand-teal uppercase tracking-widest bg-brand-teal/10 border border-brand-teal/20 px-2.5 py-0.5 rounded-full">
                      {ch.domain}
                    </span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {ch.matchScore}% Match
                    </span>
                  </div>

                  <h3 className="font-bold text-brand-indigo text-base leading-snug">
                    {ch.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-on-surface-variant font-medium">
                    <span>📍 {ch.district}</span>
                    <span>•</span>
                    <span>👥 {ch.affectedPopulation} affected</span>
                    <span>•</span>
                    <span className="text-rose-700 font-bold">Severity: {ch.severity}</span>
                  </div>

                  {/* Skills Chips */}
                  <div className="pt-2 border-t border-outline-variant/40 flex flex-wrap gap-1.5">
                    {ch.skillsNeeded.map((sk, i) => (
                      <span key={i} className="text-[10px] font-medium bg-white text-brand-indigo px-2 py-0.5 rounded-md border border-outline-variant/40">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-outline-variant/40 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-brand-violet">
                    {ch.teamStatus}
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate(`/student/challenge/${ch.id}`)}
                    className="bg-brand-indigo text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-brand-violet transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Challenge</span>
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2-COLUMN GRID: MY ACTIVE WORK & RECENT ACTIVITY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* MY ACTIVE WORK (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-outline-variant/70 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
              <h2 className="font-headline-md text-brand-indigo text-lg font-bold">
                MY ACTIVE WORK
              </h2>
              <span className="text-xs text-on-surface-variant font-medium">Tasks requiring action</span>
            </div>

            <div className="space-y-3">
              {activeWork.map((work) => (
                <div
                  key={work.id}
                  onClick={() => navigate(work.route)}
                  className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/50 hover:border-brand-violet transition-all cursor-pointer space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-brand-indigo uppercase tracking-wider bg-brand-indigo/10 px-2.5 py-0.5 rounded-full">
                      {work.type}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${work.statusColor}`}>
                      {work.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-brand-indigo text-sm">
                    {work.title}
                  </h3>

                  <div className="flex items-center justify-between text-xs text-on-surface-variant font-medium">
                    <span>Mentor: <strong>{work.mentor}</strong></span>
                    <span className="text-brand-violet font-bold flex items-center gap-1">
                      <span>{work.dueDate}</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/student/proposals')}
                className="text-xs text-brand-indigo font-bold hover:text-brand-violet cursor-pointer"
              >
                View Proposals &rarr;
              </button>
              <span className="text-on-surface-variant text-xs">•</span>
              <button
                type="button"
                onClick={() => navigate('/university/projects')}
                className="text-xs text-brand-indigo font-bold hover:text-brand-violet cursor-pointer"
              >
                View Projects &rarr;
              </button>
            </div>
          </div>

          {/* RECENT ACTIVITY (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-outline-variant/70 shadow-2xs space-y-4">
            <h2 className="font-headline-md text-brand-indigo text-lg font-bold border-b border-outline-variant/40 pb-3">
              RECENT ACTIVITY
            </h2>

            <div className="space-y-3">
              {recentActivity.map((act) => (
                <div key={act.id} className="p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/40 flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${act.color}`}>
                    <span className="material-symbols-outlined text-base">{act.icon}</span>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs text-brand-indigo font-medium leading-snug">{act.text}</p>
                    <span className="text-[10px] text-on-surface-variant font-mono">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
