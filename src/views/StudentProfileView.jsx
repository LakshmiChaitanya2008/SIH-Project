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
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-[#FAF8FF] via-white to-[#F6F3FB] text-on-surface">
      <main className="flex-grow pt-8 pb-20 px-6 md:px-margin-desktop max-w-[1240px] mx-auto w-full space-y-8">
        {/* Toast Alert */}
        {toastMsg && (
          <div className="fixed top-20 right-6 z-50 bg-brand-indigo text-white p-4 rounded-2xl shadow-xl border border-brand-violet/40 flex items-center gap-3 animate-fade-in-up">
            <span className="material-symbols-outlined text-emerald-400 text-2xl">verified</span>
            <span className="text-xs font-bold">{toastMsg}</span>
          </div>
        )}

        {/* Profile Hero Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-outline-variant/70 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-brand-indigo text-white flex items-center justify-center font-bold text-2xl sm:text-3xl shadow-md shrink-0">
              {profile.name.charAt(0)}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold text-brand-violet uppercase tracking-widest bg-brand-violet/10 border border-brand-violet/20 px-3 py-1 rounded-full">
                  STUDENT INNOVATOR
                </span>
                <span className="text-xs text-on-surface-variant font-semibold">• {profile.rollNo}</span>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">verified</span>
                  Verified Student
                </span>
              </div>

              <h1 className="font-display-lg text-brand-indigo text-3xl sm:text-4xl font-extrabold tracking-tight">
                {profile.name}
              </h1>

              <p className="text-xs sm:text-sm text-on-surface-variant font-medium">
                {profile.department} • <strong className="text-brand-indigo">{profile.university}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="bg-brand-indigo/5 text-brand-indigo hover:bg-brand-indigo hover:text-white border border-brand-indigo/20 px-5 py-2.5 rounded-full font-label-md text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">edit</span>
                <span>Edit Profile</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveProfile}
                className="bg-emerald-700 text-white px-5 py-2.5 rounded-full font-label-md text-xs font-bold hover:bg-emerald-800 transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">save</span>
                <span>Save Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* INNOVATION ACTIVITY STATS */}
        <div className="space-y-3">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant block">
            INNOVATION ACTIVITY &amp; RECOGNITION
          </span>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-outline-variant/70 shadow-2xs space-y-1 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block">CHALLENGES JOINED</span>
              <div className="text-3xl font-extrabold text-brand-indigo font-mono">2</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-outline-variant/70 shadow-2xs space-y-1 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block">ACTIVE PROJECTS</span>
              <div className="text-3xl font-extrabold text-brand-violet font-mono">1</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-outline-variant/70 shadow-2xs space-y-1 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block">TEAMS</span>
              <div className="text-3xl font-extrabold text-brand-indigo font-mono">1</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-outline-variant/70 shadow-2xs space-y-1 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block">PROPOSALS</span>
              <div className="text-3xl font-extrabold text-brand-violet font-mono">2</div>
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
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-outline-variant/70 shadow-2xs space-y-4">
              <h2 className="font-headline-md text-brand-indigo text-lg font-bold border-b border-outline-variant/40 pb-2">
                Academic &amp; Student Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase block">Full Name</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full p-2 bg-white rounded-lg border border-outline-variant/70 text-xs font-bold text-brand-indigo mt-1"
                    />
                  ) : (
                    <span className="font-bold text-brand-indigo">{profile.name}</span>
                  )}
                </div>

                <div>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase block">Institutional Email</span>
                  <span className="font-semibold text-brand-indigo">{profile.email}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase block">University</span>
                  <span className="font-semibold text-brand-indigo">{profile.university}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase block">Academic Year</span>
                  <span className="font-semibold text-brand-indigo">{profile.year}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-outline-variant/40 space-y-1">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase block">Innovation Mission Bio</span>
                {isEditing ? (
                  <textarea
                    rows="3"
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="w-full p-2.5 bg-white rounded-xl border border-outline-variant/70 text-xs text-brand-indigo"
                  />
                ) : (
                  <p className="text-xs text-on-surface leading-relaxed">{profile.bio}</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Skills & Interests (5 cols) */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-outline-variant/70 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-outline-variant/40 pb-2">
                <h3 className="font-headline-sm text-brand-indigo text-sm font-bold uppercase tracking-wider">
                  SKILLS &amp; CAPABILITIES
                </h3>
                <span className="text-[10px] text-brand-violet font-semibold">Influences Match Engine</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {profile.skills.map((sk, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold bg-brand-violet/10 text-brand-violet px-3 py-1 rounded-full border border-brand-violet/20 flex items-center gap-1.5"
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
                    className="flex-1 p-2 bg-white rounded-xl border border-outline-variant/70 text-xs text-brand-indigo"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="bg-brand-indigo text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-brand-violet transition-all cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
              )}
            </div>

            {/* Domain Interests */}
            <div className="bg-white p-6 rounded-3xl border border-outline-variant/70 shadow-2xs space-y-3">
              <h3 className="font-headline-sm text-brand-indigo text-sm font-bold uppercase tracking-wider border-b border-outline-variant/40 pb-2">
                DOMAIN INTERESTS
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((int, i) => (
                  <span key={i} className="text-xs font-medium bg-surface-container-low text-brand-indigo px-3 py-1 rounded-lg border border-outline-variant/40">
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
