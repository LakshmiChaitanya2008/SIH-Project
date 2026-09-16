import { useState } from 'react'
import { useAuth } from '../lib/auth'

const DEFAULT_PROFILE = {
  name: 'Rahul Sharma',
  email: 'rahul.sharma@ranchiuniversity.ac.in',
  university: 'Ranchi University',
  department: 'Environmental & Water Resources Engineering',
  year: 'Final Year B.Tech (2022-2026)',
  rollNo: 'RU-ENG-2022-042',
  bio: 'Focusing on low-cost water telemetry sensors and community-scale heavy metal filtration systems across rural Jharkhand blocks.',
  skills: ['Water Testing', 'IoT Sensors', 'Environmental Engineering', 'Data Analysis', 'Field Validation', 'ESP32 Firmware'],
  interests: ['Clean Water', 'Rural Technology', 'Smart Agriculture', 'Public Health', 'Embedded Hardware'],
}

export default function StudentProfileView() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('samadhan_student_profile')
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE
    } catch (err) {
      return DEFAULT_PROFILE
    }
  })

  const [isEditing, setIsEditing] = useState(false)
  const [newSkill, setNewSkill] = useState('')
  const [toastMsg, setToastMsg] = useState(null)

  const handleSaveProfile = () => {
    try {
      localStorage.setItem('samadhan_student_profile', JSON.stringify(profile))
      setToastMsg('Student innovation profile updated persistently!')
      setIsEditing(false)
      setTimeout(() => setToastMsg(null), 4000)
    } catch (err) {
      console.warn('[Save Profile Error]:', err)
    }
  }

  const handleAddSkill = () => {
    if (!newSkill.trim()) return
    if (profile.skills.includes(newSkill.trim())) return
    setProfile((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill.trim()],
    }))
    setNewSkill('')
  }

  const handleRemoveSkill = (skillToRemove) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }))
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans pb-16">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Toast Alert */}
        {toastMsg && (
          <div className="fixed top-20 right-6 z-50 bg-[#26205F] text-white px-4 py-3 rounded-xl shadow-xl border border-purple-400/30 flex items-center gap-3 animate-fade-in-up">
            <span className="material-symbols-outlined text-emerald-400 text-xl">verified</span>
            <span className="text-xs font-semibold">{toastMsg}</span>
          </div>
        )}

        {/* Profile Hero Header */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#26205F] text-white flex items-center justify-center font-bold text-2xl sm:text-3xl shadow-md shrink-0">
              {profile.name.charAt(0)}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold text-[#26205F] uppercase tracking-wider bg-purple-50 border border-purple-200/60 px-2.5 py-0.5 rounded-full">
                  USER PROFILE &amp; INNOVATOR
                </span>
                <span className="text-xs text-slate-500 font-medium">• {profile.rollNo}</span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">verified</span>
                  Verified Administrator / Innovator
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#26205F] tracking-tight">
                {profile.name}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                {profile.department} • <strong className="text-[#26205F]">{profile.university}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="bg-[#26205F] text-white hover:bg-purple-900 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">edit</span>
                <span>Edit Profile</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveProfile}
                className="bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-emerald-800 transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">save</span>
                <span>Save Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* INNOVATION ACTIVITY STATS */}
        <div className="space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            INNOVATION ACTIVITY &amp; RECOGNITION
          </span>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">CHALLENGES JOINED</span>
              <div className="text-3xl font-extrabold text-[#26205F] font-mono">2</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">ACTIVE PROJECTS</span>
              <div className="text-3xl font-extrabold text-purple-700 font-mono">1</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">TEAMS</span>
              <div className="text-3xl font-extrabold text-[#26205F] font-mono">1</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">PROPOSALS</span>
              <div className="text-3xl font-extrabold text-purple-700 font-mono">2</div>
            </div>

            <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200/80 shadow-2xs space-y-1 text-center col-span-2 md:col-span-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 block">SOLUTIONS DEPLOYED</span>
              <div className="text-3xl font-extrabold text-emerald-800 font-mono">1</div>
            </div>
          </div>
        </div>

        {/* 2-COLUMN DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Academic & Bio (7 cols) */}
          <div className="md:col-span-7 space-y-6">
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
              <h2 className="text-base font-bold text-[#26205F] border-b border-slate-100 pb-2">
                Academic &amp; Student Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Full Name</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full p-2 bg-white rounded-lg border border-slate-200 text-xs font-bold text-[#26205F] mt-1 focus:outline-none focus:border-[#26205F]"
                    />
                  ) : (
                    <span className="font-bold text-[#26205F]">{profile.name}</span>
                  )}
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Institutional Email</span>
                  <span className="font-semibold text-[#26205F]">{profile.email}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">University</span>
                  <span className="font-semibold text-[#26205F]">{profile.university}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Academic Year</span>
                  <span className="font-semibold text-[#26205F]">{profile.year}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Innovation Mission Bio</span>
                {isEditing ? (
                  <textarea
                    rows="3"
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="w-full p-2.5 bg-white rounded-xl border border-slate-200 text-xs text-[#26205F] focus:outline-none focus:border-[#26205F]"
                  />
                ) : (
                  <p className="text-xs text-slate-600 leading-relaxed">{profile.bio}</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Skills & Interests (5 cols) */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-bold text-[#26205F] uppercase tracking-wider">
                  SKILLS &amp; CAPABILITIES
                </h3>
                <span className="text-[10px] text-purple-700 font-semibold">Influences Match Engine</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {profile.skills.map((sk, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold bg-purple-50 text-[#26205F] px-3 py-1 rounded-full border border-purple-200/60 flex items-center gap-1.5"
                  >
                    <span>{sk}</span>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(sk)}
                        className="text-rose-600 hover:text-rose-800 font-bold text-xs"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>

              {isEditing && (
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Add skill (e.g. Micro-controllers)"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="flex-1 p-2 bg-white rounded-xl border border-slate-200 text-xs text-[#26205F] focus:outline-none focus:border-[#26205F]"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="bg-[#26205F] text-white px-3 py-2 rounded-xl text-xs font-semibold hover:bg-purple-900 transition-all cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
              )}
            </div>

            {/* Domain Interests */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold text-[#26205F] uppercase tracking-wider border-b border-slate-100 pb-2">
                DOMAIN INTERESTS
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((int, i) => (
                  <span key={i} className="text-xs font-medium bg-slate-50 text-[#26205F] px-3 py-1 rounded-lg border border-slate-200">
                    • {int}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
