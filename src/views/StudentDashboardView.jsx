import { useState } from 'react'
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

  const [studentProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('samadhan_student_profile')
      return saved ? JSON.parse(saved) : DEFAULT_STUDENT_PROFILE
    } catch (err) {
      return DEFAULT_STUDENT_PROFILE
    }
  })

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FAFAF8] text-on-surface">
      <main className="flex-grow pt-6 pb-20 px-6 md:px-margin-desktop max-w-[1240px] mx-auto w-full space-y-8">
        
        {/* 1. EDITORIAL HERO HEADER (No giant floating card) */}
        <div className="border-b border-outline-variant/50 pb-6 space-y-3">
          <div className="space-y-1">
            <div className="text-[11px] font-bold tracking-wider text-brand-violet uppercase">
              STUDENT INNOVATOR
            </div>
            <div className="text-xs text-on-surface-variant font-medium">
              {studentProfile.university} • {studentProfile.department}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="font-display-lg text-brand-indigo text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {studentProfile.name}
              </h1>
              <p className="text-xs sm:text-sm text-on-surface-variant font-medium">
                &quot;Turn real community problems into solutions.&quot;
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => navigate('/student/explorer')}
                className="bg-brand-indigo text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-brand-violet transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
              >
                <span>Explore Civic Challenges</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/student/profile')}
                className="border border-outline-variant text-brand-indigo hover:bg-surface-container-low px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <span>My Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. INSTITUTIONAL METRICS STRIP (Flat Information Row) */}
        <div className="bg-white rounded-xl border border-outline-variant/60 shadow-2xs overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-5 divide-x divide-y sm:divide-y-0 divide-outline-variant/40 text-center">
            <div className="p-4 space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block">CHALLENGES JOINED</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-brand-indigo font-mono">2</div>
              <span className="text-[11px] text-on-surface-variant block">Active civic tracks</span>
            </div>

            <div className="p-4 space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block">ACTIVE PROJECTS</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-brand-indigo font-mono">1</div>
              <span className="text-[11px] text-on-surface-variant block">TRL 4 prototype</span>
            </div>

            <div className="p-4 space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block">TEAMS</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-brand-indigo font-mono">1</div>
              <span className="text-[11px] text-on-surface-variant block">Team AquaSense</span>
            </div>

            <div className="p-4 space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block">PROPOSALS</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-brand-indigo font-mono">2</div>
              <span className="text-[11px] text-on-surface-variant block">1 Under review</span>
            </div>

            <div className="p-4 space-y-0.5 bg-emerald-50/50 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 block">SOLUTIONS DEPLOYED</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800 font-mono">1</div>
              <span className="text-[11px] text-emerald-800 font-medium block">Field-verified</span>
            </div>
          </div>
        </div>

        {/* 3. RECOMMENDED CHALLENGES (FEATURED HIERARCHY) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-outline-variant/40 pb-2.5">
            <div>
              <h2 className="text-lg font-bold text-brand-indigo">RECOMMENDED FOR YOU</h2>
              <p className="text-xs text-on-surface-variant font-medium">
                Based on your skills, department, and innovation interests
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/student/explorer')}
              className="text-xs font-bold text-brand-violet hover:underline cursor-pointer"
            >
              View all challenges &rarr;
            </button>
          </div>

          {/* Featured Dominant Challenge */}
          <div className="bg-white p-6 rounded-xl border border-brand-indigo/30 shadow-2xs hover:border-brand-violet transition-colors space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-brand-indigo">Water &amp; Sanitation</span>
                <span className="text-xs text-on-surface-variant">• Ranchi, Jharkhand</span>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                94% capability match
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-extrabold text-brand-indigo leading-tight">
                DRINKING WATER QUALITY &amp; HEAVY METAL FILTRATION
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                High iron concentration (Fe &gt; 3.2 mg/L) across hand pumps in 12 villages causes health hazards for 14,200 residents. Requires low-cost inline physical filtration and IoT telemetry.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-surface-container-low rounded-lg border border-outline-variant/40 text-xs">
              <div>
                <span className="text-[10px] text-on-surface-variant block uppercase font-bold">COMMUNITY REPORTS</span>
                <span className="font-bold text-brand-indigo">32 Verified Observations</span>
              </div>
              <div>
                <span className="text-[10px] text-on-surface-variant block uppercase font-bold">POTENTIALLY AFFECTED</span>
                <span className="font-bold text-brand-indigo">14,200 Citizens · 3 Blocks</span>
              </div>
              <div>
                <span className="text-[10px] text-on-surface-variant block uppercase font-bold">SEVERITY SCORE</span>
                <span className="font-bold text-rose-700">8.8 / 10 High Impact</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-1 text-xs">
              <div className="text-on-surface-variant font-medium">
                Required capabilities: <strong className="text-brand-indigo font-semibold">Environmental Engineering · Water Testing · IoT · Data Analysis</strong>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => navigate('/student/challenge/ch-water-gumla')}
                  className="bg-brand-indigo text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-brand-violet transition-colors cursor-pointer"
                >
                  View Challenge Intelligence
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/student/team-formation', { state: { challenge: { id: 'ch-water-gumla', title: 'Drinking Water Quality & Heavy Metal Filtration' } } })}
                  className="border border-brand-indigo text-brand-indigo hover:bg-brand-indigo/5 px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Join / Form Team
                </button>
              </div>
            </div>
          </div>

          {/* Secondary Quieter Recommendations Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-outline-variant/60 hover:border-brand-violet transition-colors space-y-2 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-brand-indigo">Agriculture &amp; Rural Systems</span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">91% Match</span>
                </div>
                <h4 className="font-bold text-brand-indigo text-sm">
                  Paddy Leaf Blast &amp; Fungal Spore Early Detection AI
                </h4>
                <p className="text-xs text-on-surface-variant leading-snug">
                  Khunti, Jharkhand • 8,500 affected • 18 community reports • 7.9/10 severity
                </p>
              </div>
              <div className="pt-2 border-t border-outline-variant/30 flex items-center justify-between text-xs">
                <span className="text-on-surface-variant text-[11px]">Edge AI · Plant Pathology</span>
                <button
                  type="button"
                  onClick={() => navigate('/student/challenge/ch-agri-blast')}
                  className="text-brand-indigo font-bold hover:underline cursor-pointer"
                >
                  View Challenge &rarr;
                </button>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-outline-variant/60 hover:border-brand-violet transition-colors space-y-2 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-brand-indigo">Smart Hardware &amp; Energy</span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">88% Match</span>
                </div>
                <h4 className="font-bold text-brand-indigo text-sm">
                  Low-Power Solar Smart Meter for Rural Micro-Grids
                </h4>
                <p className="text-xs text-on-surface-variant leading-snug">
                  Simdega, Jharkhand • 6,200 affected • 14 community reports • 7.5/10 severity
                </p>
              </div>
              <div className="pt-2 border-t border-outline-variant/30 flex items-center justify-between text-xs">
                <span className="text-on-surface-variant text-[11px]">Embedded Systems · ESP32</span>
                <button
                  type="button"
                  onClick={() => navigate('/student/challenge/ch-solar-meter')}
                  className="text-brand-indigo font-bold hover:underline cursor-pointer"
                >
                  View Challenge &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4. TWO-COLUMN: YOUR ACTIVE WORK & ACTION REQUIRED */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* YOUR ACTIVE WORK (7 cols) */}
          <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-outline-variant/60 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/40 pb-2.5">
              <h2 className="text-base font-bold text-brand-indigo">YOUR ACTIVE WORK</h2>
              <span className="text-xs text-on-surface-variant font-medium">1 Active Project in Field</span>
            </div>

            {/* Compact Project Row */}
            <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant/40 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-extrabold text-brand-indigo text-base">AquaSense</h3>
                  <p className="text-xs text-on-surface-variant font-medium">Smart Community Water Quality Monitoring</p>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  FIELD TESTING
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-on-surface-variant font-medium">
                <div>Challenge: <strong className="text-brand-indigo">Drinking Water Quality &amp; Heavy Metal Filtration</strong></div>
                <div>Mentor: <strong className="text-brand-indigo">Dr. Anjali Kumar</strong></div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-brand-indigo">Project Completion</span>
                  <span className="font-mono text-brand-violet font-bold">68%</span>
                </div>
                <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-outline-variant/40">
                  <div className="h-full w-[68%] bg-brand-indigo rounded-full"></div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate('/project/proj-water-01')}
                  className="bg-brand-indigo text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-brand-violet transition-colors cursor-pointer"
                >
                  Open Project Workspace &rarr;
                </button>
              </div>
            </div>
          </div>

          {/* ACTION REQUIRED (5 cols) */}
          <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-outline-variant/60 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-brand-indigo border-b border-outline-variant/40 pb-2.5">
              ACTION REQUIRED
            </h2>

            <div className="space-y-3 text-xs">
              <div
                onClick={() => navigate('/student/proposals')}
                className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/40 hover:border-brand-violet transition-colors cursor-pointer space-y-1"
              >
                <div className="flex items-center gap-2 font-bold text-brand-indigo">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                  <span>Proposal &quot;AquaSense&quot; — Faculty Review Pending</span>
                </div>
                <p className="text-[11px] text-on-surface-variant pl-4">
                  Dr. Anjali Kumar added review feedback for TRL 3 alumina filter model.
                </p>
                <div className="pl-4 pt-1 text-brand-violet font-bold">View proposal &rarr;</div>
              </div>

              <div
                onClick={() => navigate('/project/proj-water-01')}
                className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/40 hover:border-brand-violet transition-colors cursor-pointer space-y-1"
              >
                <div className="flex items-center gap-2 font-bold text-brand-indigo">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0"></span>
                  <span>Field Testing Milestone — Evidence Required</span>
                </div>
                <p className="text-[11px] text-on-surface-variant pl-4">
                  Upload water lab telemetry test results for Gumla hand pump 4.
                </p>
                <div className="pl-4 pt-1 text-brand-violet font-bold">Open project &rarr;</div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
