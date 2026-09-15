import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { useSelector } from 'react-redux'
import { api } from '../lib/api'
import { useAuth } from '../lib/auth'

export default function TeamFormationView() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const userProfile = useSelector((state) => state.app.userProfile)

  // Retrieve challenge from location state or active challenges in Redux
  const passedChallenge = location.state?.challenge
  const reduxChallenges = useSelector((state) => state.app.challenges)
  const challenge = passedChallenge || reduxChallenges?.[0] || {
    id: null,
    title: 'Safe Water for Gumla Innovation Challenge',
    locations: 'Gumla District, Jharkhand',
    domain: 'WATER QUALITY & SANITATION',
  }

  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [teamName, setTeamName] = useState('')
  const [creating, setCreating] = useState(false)
  const [joiningId, setJoiningId] = useState(null)
  const [selectedRole, setSelectedRole] = useState('TECH_LEAD')

  const currentUserId = user?.id || 'd934a6cd-4138-44b8-a315-a6c24cecdfc1'

  const fetchTeams = async () => {
    setLoading(true)
    setError(null)
    try {
      const query = challenge?.id ? `challenge_id=${challenge.id}` : ''
      const res = await api.getTeams(query)
      setTeams(res?.teams || [])
    } catch (err) {
      console.warn('[Fetch Teams Error]:', err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeams()
  }, [challenge?.id])

  const handleCreateTeam = async (e) => {
    e.preventDefault()
    if (!teamName.trim()) return

    setCreating(true)
    setError(null)
    try {
      const payload = {
        name: teamName.trim(),
        challenge_id: challenge.id,
        lead_user_id: currentUserId,
      }
      await api.createTeam(payload)
      setTeamName('')
      await fetchTeams()
    } catch (err) {
      console.error('[Create Team Error]:', err)
      setError(`Failed to create team: ${err.message}`)
    } finally {
      setCreating(false)
    }
  }

  const handleJoinTeam = async (teamId) => {
    setJoiningId(teamId)
    setError(null)
    try {
      await api.joinTeam({
        team_id: teamId,
        user_id: currentUserId,
        role: selectedRole,
      })
      await fetchTeams()
    } catch (err) {
      console.error('[Join Team Error]:', err)
      setError(`Failed to join team: ${err.message}`)
    } finally {
      setJoiningId(null)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-[#FAF8FF] via-white to-[#F6F3FB] text-on-surface">
      <main className="flex-grow pt-8 pb-20 px-6 md:px-margin-desktop max-w-[1240px] mx-auto w-full space-y-8">
        {/* Back Navigation */}
        <div>
          <button
            type="button"
            onClick={() => navigate('/challenges')}
            className="inline-flex items-center gap-1.5 text-brand-indigo hover:text-brand-violet font-label-md text-xs font-bold transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span> Back to Published Challenges
          </button>
        </div>

        {/* Header */}
        <div className="space-y-2 border-b border-outline-variant/60 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-brand-violet uppercase tracking-widest bg-brand-violet/10 border border-brand-violet/20 px-3 py-1 rounded-full">
                TEAM FORMATION & REGISTRATION
              </span>
              <span className="text-xs text-on-surface-variant font-semibold">
                • {userProfile?.department || 'Ranchi University'}
              </span>
            </div>
            <h1 className="font-display-lg text-brand-indigo text-3xl sm:text-4xl font-extrabold tracking-tight">
              Student Innovation Teams
            </h1>
            <p className="text-xs text-on-surface-variant">
              Challenge: <strong className="text-brand-indigo">{challenge?.title}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/student/proposals', { state: { challenge } })}
            className="bg-brand-indigo text-white px-5 py-2.5 rounded-full font-label-md text-xs font-bold hover:bg-brand-violet transition-all shrink-0 flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>Proceed to Proposal &rarr;</span>
          </button>
        </div>

        {error && (
          <div className="p-4 bg-error-container text-on-error-container text-xs rounded-2xl border border-error/20 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-error">error</span>
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Existing Teams & Members (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-outline-variant/70 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-headline-md text-brand-indigo text-lg font-bold">
                  Registered Teams for this Challenge ({teams.length})
                </h2>
                <button
                  type="button"
                  onClick={fetchTeams}
                  className="text-xs text-brand-violet font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">refresh</span> Refresh
                </button>
              </div>

              {loading && (
                <div className="p-8 text-center text-xs text-brand-indigo">
                  <span className="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
                  <p className="mt-2">Loading teams...</p>
                </div>
              )}

              {!loading && teams.length === 0 && (
                <div className="p-8 bg-surface-container-low rounded-2xl border border-outline-variant/40 text-center space-y-2">
                  <span className="material-symbols-outlined text-3xl text-brand-indigo/40">groups</span>
                  <p className="text-xs font-bold text-brand-indigo">No teams formed yet for this challenge.</p>
                  <p className="text-[11px] text-on-surface-variant max-w-sm mx-auto">
                    Be the first innovator to register a team using the form on the right.
                  </p>
                </div>
              )}

              {!loading && teams.length > 0 && (
                <div className="space-y-4">
                  {teams.map((t) => {
                    const isMember = (t.members || []).some((m) => m.user_id === currentUserId)
                    return (
                      <div
                        key={t.id}
                        className="p-5 rounded-2xl border border-outline-variant/70 bg-white space-y-3 hover:border-brand-violet transition-all"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-full bg-brand-indigo/10 text-brand-indigo font-bold flex items-center justify-center text-xs font-mono">
                              {t.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-bold text-brand-indigo text-sm">{t.name}</h3>
                              <span className="text-[11px] text-on-surface-variant">
                                {t.members_count} Student Member{t.members_count > 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>

                          {isMember ? (
                            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                              ✓ You are a Member
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleJoinTeam(t.id)}
                              disabled={joiningId === t.id}
                              className="border border-brand-indigo text-brand-indigo px-4 py-1.5 rounded-full text-xs font-bold hover:bg-brand-indigo hover:text-white transition-all cursor-pointer disabled:opacity-50"
                            >
                              {joiningId === t.id ? 'Joining...' : '+ Join Team'}
                            </button>
                          )}
                        </div>

                        {/* Member Chips */}
                        <div className="pt-2 border-t border-outline-variant/40 flex flex-wrap gap-2">
                          {(t.members || []).map((m, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] font-medium bg-surface-container-low text-brand-indigo px-2.5 py-1 rounded-lg border border-outline-variant/40 flex items-center gap-1.5"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-teal"></span>
                              <span>{m.email?.split('@')[0] || `Student ${idx + 1}`}</span>
                              <span className="text-[9px] font-mono uppercase text-brand-violet font-bold">
                                ({m.role})
                              </span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Register New Team (4 cols) */}
          <div className="lg:col-span-4 space-y-6 sticky top-28">
            <div className="bg-white p-6 rounded-3xl border border-outline-variant/70 shadow-2xs space-y-4">
              <h3 className="font-headline-sm text-brand-indigo text-sm font-bold uppercase tracking-wider border-b border-outline-variant/40 pb-2">
                REGISTER NEW TEAM
              </h3>

              <form onSubmit={handleCreateTeam} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-indigo block">Team Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Team AquaInnovate"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full p-2.5 bg-white rounded-xl border border-outline-variant/70 text-xs font-medium text-brand-indigo focus:outline-none focus:border-brand-violet"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-indigo block">Your Initial Role</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full p-2.5 bg-white rounded-xl border border-outline-variant/70 text-xs font-medium text-brand-indigo focus:outline-none"
                  >
                    <option value="LEAD">Team Lead / Coordinator</option>
                    <option value="TECH_LEAD">Technical Lead / Engineer</option>
                    <option value="RESEARCHER">Domain Researcher</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={creating || !teamName.trim()}
                  className="w-full bg-brand-indigo text-white px-5 py-3 rounded-full font-label-md text-xs font-bold hover:bg-brand-violet transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {creating ? 'Registering...' : '+ Register Team'}
                </button>
              </form>

              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                As team lead, you can invite peers across engineering and science disciplines to co-author and submit your prototype proposal.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
