import { useState } from 'react'
import { useAuth } from '../lib/auth'

const DEFAULT_PROFILE = {
  institution_name: 'Ranchi University Innovation Hub',
  accreditation: 'NAAC A+ Accredited',
  location: 'Ranchi, Jharkhand',
  website: 'https://ranchiuniversity.ac.in',
  contact_email: 'innovation@ranchiuniversity.ac.in',
  phone: '+91 651 2200112',
  departments: [
    {
      name: 'Environmental & Water Resources Engineering',
      sub: 'Water quality • Hydrology • Treatment systems',
      icon: 'water_drop',
    },
    {
      name: 'Agronomy & Plant Pathology Research',
      sub: 'Crop health • Agricultural systems • Rural innovation',
      icon: 'agriculture',
    },
    {
      name: 'Computer Science & IoT Sensor Systems',
      sub: 'AI • IoT • Embedded systems',
      icon: 'memory',
    },
    {
      name: 'Public Health & Community Sanitation',
      sub: 'Community health • Sanitation • Field programs',
      icon: 'health_and_safety',
    },
    {
      name: 'Chemical & Material Filtration Sciences',
      sub: 'Filtration • Materials • Water treatment',
      icon: 'science',
    },
  ],
  laboratories: [
    {
      name: 'Water Quality & ICP-MS Spectrometry Lab',
      sub: 'Analytical chemistry • Water contamination • Heavy-metal analysis',
      director: 'Dr. Anjali Kumar',
      status: 'ACTIVE',
      icon: 'science',
    },
    {
      name: 'Plant Pathology & Fungal AI Lab',
      sub: 'Plant disease detection • Agricultural diagnostics • Edge AI',
      director: 'Dr. Rameshwar Mahto',
      status: 'ACTIVE',
      icon: 'eco',
    },
    {
      name: 'Micro-controller & Embedded IoT Assembly',
      sub: 'Sensor systems • Embedded computing • IoT prototyping',
      director: 'Prof. S. K. Sinha',
      status: 'ACTIVE',
      icon: 'developer_board',
    },
  ],
  facilities: [
    {
      name: '3D Rapid Prototyping Workshop',
      sub: 'Rapid hardware prototyping & CAD enclosure design',
      icon: 'precision_manufacturing',
    },
    {
      name: 'CNC PCB Milling Machine',
      sub: 'Custom PCB fabrication & electronics prototyping',
      icon: 'hardware',
    },
    {
      name: 'District Field Testing Mobile Unit',
      sub: 'Community & field validation testbeds across 3 blocks',
      icon: 'local_shipping',
    },
    {
      name: 'Atal Incubation Center (AIC) Co-working Space',
      sub: 'Startup incubation, grant support & IP filing assistance',
      icon: 'business_center',
    },
  ],
}

export default function UniversityProfileView() {
  const { userProfile } = useAuth()

  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('samadhan_university_profile')
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE
    } catch (err) {
      return DEFAULT_PROFILE
    }
  })

  const [isEditing, setIsEditing] = useState(false)
  const [newDeptName, setNewDeptName] = useState('')
  const [newDeptSub, setNewDeptSub] = useState('')
  const [toastMsg, setToastMsg] = useState(null)

  const handleSaveProfile = () => {
    try {
      localStorage.setItem('samadhan_university_profile', JSON.stringify(profile))
      setToastMsg('Institutional capability profile saved persistently!')
      setIsEditing(false)
      setTimeout(() => setToastMsg(null), 4000)
    } catch (err) {
      console.warn('[Save University Profile Error]:', err)
    }
  }

  const handleAddDepartment = () => {
    if (!newDeptName.trim()) return
    const newDeptObj = {
      name: newDeptName.trim(),
      sub: newDeptSub.trim() || 'Multidisciplinary research & technical implementation',
      icon: 'school',
    }
    setProfile((prev) => ({
      ...prev,
      departments: [...prev.departments, newDeptObj],
    }))
    setNewDeptName('')
    setNewDeptSub('')
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-[#FAF8FF] via-white to-[#F6F3FB] text-on-surface">
      <main className="flex-grow pt-8 pb-20 px-6 md:px-margin-desktop max-w-[1240px] mx-auto w-full space-y-8">
        {/* Toast Alert */}
        {toastMsg && (
          <div className="fixed top-20 right-6 z-50 bg-brand-indigo text-white p-4 rounded-2xl shadow-xl border border-brand-violet/40 flex items-center gap-3 animate-fade-in-up">
            <span className="material-symbols-outlined text-emerald-400 text-2xl">verified</span>
            <span className="text-xs font-bold">{toastMsg}</span>
          </div>
        )}

        {/* 1. HERO SECTION */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-outline-variant/70 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold text-brand-violet uppercase tracking-widest bg-brand-violet/10 border border-brand-violet/20 px-3 py-1 rounded-full">
                INSTITUTION PROFILE
              </span>
              <span className="text-xs text-on-surface-variant font-semibold">
                • {profile.accreditation}
              </span>
              <span className="text-xs text-on-surface-variant font-semibold">
                • {profile.location}
              </span>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">verified</span>
                Verified Institution
              </span>
            </div>

            <h1 className="font-display-lg text-brand-indigo text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              {profile.institution_name}
            </h1>

            <p className="text-xs sm:text-sm text-on-surface-variant font-medium leading-relaxed">
              University capabilities powering community-driven innovation across Jharkhand. Member of the SamadhanSetu Civic Innovation Network.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="bg-brand-indigo/5 text-brand-indigo hover:bg-brand-indigo hover:text-white border border-brand-indigo/20 px-5 py-2.5 rounded-full font-label-md text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">edit</span>
                <span>Edit Capabilities</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveProfile}
                className="bg-emerald-700 text-white px-5 py-2.5 rounded-full font-label-md text-xs font-bold hover:bg-emerald-800 transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">save</span>
                <span>Save Capabilities</span>
              </button>
            )}
          </div>
        </div>

        {/* 2. INSTITUTIONAL SNAPSHOT */}
        <div className="space-y-3">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant block">
            INSTITUTIONAL SNAPSHOT
          </span>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-outline-variant/70 shadow-2xs space-y-2 hover:-translate-y-0.5 transition-all">
              <div className="flex items-center justify-between text-brand-indigo">
                <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">ACTIVE PROJECTS</span>
                <span className="material-symbols-outlined text-lg">engineering</span>
              </div>
              <div className="text-3xl font-extrabold text-brand-indigo font-mono">12</div>
              <p className="text-[11px] text-on-surface-variant">Student R&amp;D teams</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-outline-variant/70 shadow-2xs space-y-2 hover:-translate-y-0.5 transition-all">
              <div className="flex items-center justify-between text-brand-violet">
                <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">STUDENTS PARTICIPATING</span>
                <span className="material-symbols-outlined text-lg">school</span>
              </div>
              <div className="text-3xl font-extrabold text-brand-violet font-mono">48</div>
              <p className="text-[11px] text-on-surface-variant">Engineering innovators</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-outline-variant/70 shadow-2xs space-y-2 hover:-translate-y-0.5 transition-all">
              <div className="flex items-center justify-between text-brand-indigo">
                <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">FACULTY MENTORS</span>
                <span className="material-symbols-outlined text-lg">verified_user</span>
              </div>
              <div className="text-3xl font-extrabold text-brand-indigo font-mono">16</div>
              <p className="text-[11px] text-on-surface-variant">Domain specialists</p>
            </div>

            <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200/80 shadow-2xs space-y-2 hover:-translate-y-0.5 transition-all">
              <div className="flex items-center justify-between text-emerald-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900">SOLUTIONS DEPLOYED</span>
                <span className="material-symbols-outlined text-lg text-emerald-700">task_alt</span>
              </div>
              <div className="text-3xl font-extrabold text-emerald-800 font-mono">4</div>
              <p className="text-[11px] text-emerald-900 font-medium">Field-verified prototypes</p>
            </div>
          </div>
        </div>

        {/* 3. CHALLENGE MATCHING PROFILE (CORE INTELLIGENCE CARD) */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-outline-variant/70 shadow-2xs space-y-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-brand-indigo uppercase tracking-wider bg-brand-indigo/10 px-2.5 py-0.5 rounded-full">
                AI MATCHING ENABLED
              </span>
              <span className="text-xs text-on-surface-variant font-semibold">• High Match Confidence</span>
            </div>
            <h2 className="font-headline-md text-brand-indigo text-xl font-bold">
              CHALLENGE MATCHING PROFILE
            </h2>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Ranchi University is a multidisciplinary regional innovation hub specializing in three core domain verticals:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Block 1 */}
            <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/50 space-y-2">
              <div className="flex items-center gap-2 text-brand-indigo font-bold text-xs uppercase tracking-wider">
                <span className="material-symbols-outlined text-base text-brand-violet">water_drop</span>
                WATER &amp; ENVIRONMENT
              </div>
              <ul className="text-xs text-on-surface space-y-1 font-medium">
                <li>• Clean water telemetry</li>
                <li>• ICP-MS water quality analysis</li>
                <li>• Heavy metal filtration &amp; hydrology</li>
              </ul>
            </div>

            {/* Block 2 */}
            <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/50 space-y-2">
              <div className="flex items-center gap-2 text-brand-indigo font-bold text-xs uppercase tracking-wider">
                <span className="material-symbols-outlined text-base text-brand-violet">agriculture</span>
                AGRICULTURE &amp; RURAL SYSTEMS
              </div>
              <ul className="text-xs text-on-surface space-y-1 font-medium">
                <li>• Offline edge agricultural AI</li>
                <li>• Paddy plant pathology diagnostics</li>
                <li>• Smallholder extension technology</li>
              </ul>
            </div>

            {/* Block 3 */}
            <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/50 space-y-2">
              <div className="flex items-center gap-2 text-brand-indigo font-bold text-xs uppercase tracking-wider">
                <span className="material-symbols-outlined text-base text-brand-violet">memory</span>
                SMART HARDWARE
              </div>
              <ul className="text-xs text-on-surface space-y-1 font-medium">
                <li>• ESP32 &amp; micro-controller IoT sensors</li>
                <li>• Embedded firmware computing</li>
                <li>• Low-cost hardware prototyping</li>
              </ul>
            </div>
          </div>

          <div className="pt-2 border-t border-outline-variant/40 flex items-center gap-2 text-xs text-brand-indigo font-medium">
            <span className="material-symbols-outlined text-base text-brand-violet">auto_awesome</span>
            <span>These capabilities are used by SamadhanSetu&apos;s challenge-matching engine to recommend relevant societal challenges.</span>
          </div>
        </div>

        {/* 4. ACADEMIC EXPERTISE & DEPARTMENTS */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-outline-variant/70 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
            <div>
              <h2 className="font-headline-md text-brand-indigo text-lg font-bold">Academic Expertise &amp; Departments</h2>
              <p className="text-xs text-on-surface-variant">Faculty research areas contributing to multidisciplinary civic projects</p>
            </div>
            {isEditing && (
              <span className="text-xs text-brand-violet font-bold">Edit Mode Active</span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {profile.departments.map((dept, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/50 flex items-start justify-between gap-3 hover:border-brand-indigo transition-all"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-brand-violet/10 text-brand-violet flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-base">{dept.icon || 'school'}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-indigo text-xs">{dept.name}</h4>
                    <p className="text-[11px] text-on-surface-variant leading-tight mt-0.5">{dept.sub}</p>
                  </div>
                </div>

                {isEditing && (
                  <button
                    type="button"
                    onClick={() =>
                      setProfile((prev) => ({
                        ...prev,
                        departments: prev.departments.filter((_, i) => i !== idx),
                      }))
                    }
                    className="text-rose-600 hover:text-rose-800 text-xs font-bold cursor-pointer"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          {isEditing && (
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-outline-variant/40">
              <input
                type="text"
                placeholder="Department name (e.g. Mechanical & Renewable Energy)"
                value={newDeptName}
                onChange={(e) => setNewDeptName(e.target.value)}
                className="p-2.5 bg-white rounded-xl border border-outline-variant/70 text-xs text-brand-indigo flex-1 w-full"
              />
              <input
                type="text"
                placeholder="Specializations (e.g. Solar thermal • Micro-grids)"
                value={newDeptSub}
                onChange={(e) => setNewDeptSub(e.target.value)}
                className="p-2.5 bg-white rounded-xl border border-outline-variant/70 text-xs text-brand-indigo flex-1 w-full"
              />
              <button
                type="button"
                onClick={handleAddDepartment}
                className="bg-brand-indigo text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-brand-violet transition-all cursor-pointer shrink-0"
              >
                Add Department
              </button>
            </div>
          )}
        </div>

        {/* 5. CAPABILITY COVERAGE MICRO-VISUAL */}
        <div className="bg-white p-6 rounded-3xl border border-outline-variant/70 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-outline-variant/40 pb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-indigo flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-brand-violet">bar_chart</span>
              MULTIDISCIPLINARY CAPABILITY COVERAGE
            </span>
            <span className="text-xs text-on-surface-variant font-mono font-bold">24 Districts Reach</span>
          </div>

          <div className="space-y-2.5 text-xs">
            {[
              { label: 'Water & Environment', percent: 94, width: 'w-[94%]' },
              { label: 'Agriculture & Rural Systems', percent: 88, width: 'w-[88%]' },
              { label: 'AI & IoT Sensor Systems', percent: 85, width: 'w-[85%]' },
              { label: 'Prototyping & Hardware', percent: 80, width: 'w-[80%]' },
              { label: 'Public Health & Sanitation', percent: 72, width: 'w-[72%]' },
            ].map((bar, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-brand-indigo">{bar.label}</span>
                  <span className="font-mono text-brand-violet font-bold">{bar.percent}% Coverage</span>
                </div>
                <div className="w-full h-2 bg-surface-container-low rounded-full overflow-hidden">
                  <div className={`h-full ${bar.width} bg-brand-indigo rounded-full transition-all duration-500`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. RESEARCH LABORATORIES & PROTOTYPING FACILITIES (2-COLUMN GRID) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Research Labs */}
          <div className="bg-white p-6 rounded-3xl border border-outline-variant/70 shadow-2xs space-y-4">
            <h3 className="font-headline-sm text-brand-indigo text-sm font-bold uppercase tracking-wider border-b border-outline-variant/40 pb-2.5">
              SPECIALIZED RESEARCH LABORATORIES
            </h3>
            <div className="space-y-3">
              {profile.laboratories.map((lab, i) => (
                <div
                  key={i}
                  className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/50 space-y-2 hover:-translate-y-0.5 hover:border-brand-violet transition-all duration-200"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 font-bold text-brand-indigo text-xs">
                      <span className="material-symbols-outlined text-base text-brand-violet">{lab.icon || 'science'}</span>
                      <span>{lab.name}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                      {lab.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant">{lab.sub}</p>
                  <span className="text-[10px] font-semibold text-brand-indigo block">Director: {lab.director}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Prototyping & Incubation Facilities */}
          <div className="bg-white p-6 rounded-3xl border border-outline-variant/70 shadow-2xs space-y-4">
            <h3 className="font-headline-sm text-brand-indigo text-sm font-bold uppercase tracking-wider border-b border-outline-variant/40 pb-2.5">
              PROTOTYPING &amp; INCUBATION FACILITIES
            </h3>
            <div className="space-y-3">
              {profile.facilities.map((fac, i) => (
                <div
                  key={i}
                  className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/50 space-y-1.5 hover:-translate-y-0.5 hover:border-brand-violet transition-all duration-200"
                >
                  <div className="flex items-center gap-2 font-bold text-brand-indigo text-xs">
                    <span className="material-symbols-outlined text-base text-brand-violet">{fac.icon || 'build'}</span>
                    <span>{fac.name}</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant">{fac.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 7. WHY SAMADHANSETU USES THIS PROFILE */}
        <div className="bg-gradient-to-r from-brand-indigo/10 via-brand-violet/10 to-brand-teal/10 p-6 sm:p-7 rounded-3xl border border-brand-indigo/20 space-y-4 text-xs">
          <div className="space-y-1">
            <span className="font-bold text-brand-indigo uppercase text-[10px] tracking-wider block">
              INSTITUTIONAL LIFECYCLE INTEGRATION
            </span>
            <h3 className="font-headline-md text-brand-indigo text-base font-bold">
              WHY SAMADHANSETU USES THIS PROFILE
            </h3>
            <p className="text-on-surface-variant leading-relaxed">
              University capability data helps SamadhanSetu identify the institutions best positioned to solve community challenges.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-center text-xs font-bold">
            <div className="p-3 bg-white/90 rounded-2xl border border-outline-variant/40 space-y-1">
              <span className="text-[10px] text-on-surface-variant block uppercase font-bold">STEP 1</span>
              <span className="text-brand-indigo">COMMUNITY CHALLENGE</span>
            </div>
            <div className="p-3 bg-white/90 rounded-2xl border border-outline-variant/40 space-y-1">
              <span className="text-[10px] text-on-surface-variant block uppercase font-bold">STEP 2</span>
              <span className="text-brand-violet">CAPABILITY MATCH (94%)</span>
            </div>
            <div className="p-3 bg-white/90 rounded-2xl border border-outline-variant/40 space-y-1">
              <span className="text-[10px] text-on-surface-variant block uppercase font-bold">STEP 3</span>
              <span className="text-brand-indigo">MULTIDISCIPLINARY TEAM</span>
            </div>
            <div className="p-3 bg-white/90 rounded-2xl border border-outline-variant/40 space-y-1">
              <span className="text-[10px] text-on-surface-variant block uppercase font-bold">STEP 4</span>
              <span className="text-emerald-700">FIELD IMPLEMENTATION</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


