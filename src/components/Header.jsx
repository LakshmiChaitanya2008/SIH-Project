import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../lib/auth'
import { useTranslation } from '../lib/useTranslation'
import LanguageSelector from './LanguageSelector'

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const { t } = useTranslation()
  const { isAuthenticated, userRole, userProfile, notifications } = useSelector(s => s.app)

  const activeRoute = location.pathname
  const isMentor = userRole === 'mentor' || userRole === 'admin' || activeRoute.startsWith('/mentor') || activeRoute.startsWith('/validation') || activeRoute.startsWith('/challenge') || activeRoute.startsWith('/university')
  const authed = isAuthenticated
  const user = userProfile || { name: 'Citizen User' }
  const unreadCount = notifications ? notifications.filter(n => n.unread).length : 0

  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const notifRef = useRef(null)
  const profileRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSignOut = async (e) => {
    e?.preventDefault()
    setProfileOpen(false)
    setMobileOpen(false)
    await signOut()
    navigate('/')
  }

  const handleNav = (path) => {
    navigate(path)
    setMobileOpen(false)
  }

  const isCitizenNavActive = (key, path) => {
    if (key === 'home') return activeRoute === '/citizen/home'
    if (key === 'myProblems') return activeRoute.startsWith('/citizen/my-problems') || activeRoute.startsWith('/citizen/my-reports')
    if (key === 'community') return activeRoute.startsWith('/community')
    if (key === 'track') return activeRoute.startsWith('/citizen/track')
    return activeRoute === path
  }

  const logo = (
    <img
      src="/assests/logo.png"
      alt="SamadhanSetu — Civic Innovation Platform"
      className="w-[160px] sm:w-[175px] h-auto object-contain block bg-transparent"
      onError={(e) => { e.target.onerror = null; e.target.src = '/logo.png' }}
    />
  )

  return (
    <header className="bg-[#FAFAF8] sticky top-0 w-full z-50 border-b border-outline-variant/50">
      <div className="flex justify-between items-center h-16 px-4 md:px-12 max-w-[1280px] mx-auto">

        <div className="flex items-center gap-3 md:gap-4">
          <a
            className="flex items-center cursor-pointer group py-1 bg-transparent p-0 border-none shadow-none"
            onClick={() => handleNav(isMentor ? '/mentor/dashboard' : authed ? '/citizen/home' : '/')}
          >
            {logo}
          </a>
          {isMentor && <div className="h-4 w-px bg-outline-variant/50 hidden sm:block" />}
        </div>

        {isMentor ? (
          <>
            <nav className="hidden md:flex items-center gap-6">
              {[
                { path: '/mentor/dashboard', label: 'Dashboard' },
                { path: '/validation/queue', label: 'Opportunities' },
                { path: '/university/profile', label: 'My University' },
                { path: '/university/projects', label: 'Projects' },
                { path: '/university/collaborations', label: 'Collaborations' },
              ].map(item => (
                <a
                  key={item.path}
                  className={`cursor-pointer font-label-md text-sm font-semibold transition-colors duration-200 py-1 relative ${
                    activeRoute === item.path
                      ? 'text-brand-indigo font-bold border-b-2 border-brand-indigo'
                      : 'text-[#4A4D73] hover:text-brand-indigo'
                  }`}
                  onClick={() => handleNav(item.path)}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3 relative">
              <LanguageSelector />

              <div className="relative" ref={notifRef}>
                <button
                  className="w-9 h-9 rounded-lg bg-[#F1F0FA] hover:bg-[#E5E3F5] border border-outline-variant/40 text-[#24285B] flex items-center justify-center transition-colors relative cursor-pointer"
                  onClick={() => setNotifOpen(!notifOpen)}
                >
                  <span className="material-symbols-outlined text-lg">notifications</span>
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#3F3A8A]" />
                </button>
                {notifOpen && (
                  <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl border border-outline-variant/70 shadow-xl p-4 z-50 space-y-3">
                    <div className="flex items-center justify-between border-b border-outline-variant/40 pb-2">
                      <span className="font-bold text-[#24285B] text-xs uppercase tracking-wider">{t('nav.notifications')}</span>
                      <button className="text-xs font-bold text-[#3F3A8A] hover:underline" onClick={() => handleNav('/validation/queue')}>View All</button>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      <div className="p-2.5 rounded-xl bg-[#F1F0FA] border border-[#3F3A8A]/20 cursor-pointer hover:bg-white transition-all space-y-0.5" onClick={() => handleNav('/validation/queue')}>
                        <div className="flex items-center justify-between text-xs font-bold text-[#24285B]">
                          <span>New Matched Problem Request</span>
                          <span className="text-[10px] text-on-surface-variant font-normal">10m ago</span>
                        </div>
                        <p className="text-[11px] text-on-surface-variant leading-snug">Water Hand Pump Discoloration in Gumla has been matched to your research department.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative" ref={profileRef}>
                <button
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-[#F1F0FA] hover:bg-[#E5E3F5] border border-outline-variant/40 transition-all cursor-pointer"
                  onClick={() => setProfileOpen(!profileOpen)}
                >
                  <div className="w-7 h-7 rounded-lg bg-[#24285B] text-white flex items-center justify-center font-bold text-xs">U</div>
                  <span className="font-semibold text-xs text-[#24285B] max-w-[130px] truncate">Ranchi University</span>
                  <span className="material-symbols-outlined text-base text-on-surface-variant">expand_more</span>
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl border border-outline-variant/70 shadow-xl p-2 z-50 space-y-1">
                    <div className="p-3 border-b border-outline-variant/40">
                      <div className="font-bold text-brand-indigo text-sm">Ranchi University</div>
                      <div className="text-[11px] text-on-surface-variant">University Partner Portal</div>
                    </div>
                    <a className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-on-surface-variant hover:text-brand-violet hover:bg-surface-container-low rounded-xl cursor-pointer" onClick={() => handleNav('/university/profile')}>
                      <span className="material-symbols-outlined text-base">school</span> University Profile
                    </a>
                    <div className="border-t border-outline-variant/40 pt-1">
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-error hover:bg-error/10 rounded-xl cursor-pointer" onClick={handleSignOut}>
                        <span className="material-symbols-outlined text-base">logout</span> {t('nav.logout')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : authed ? (
          <>
            {/* Authenticated Citizen Navbar: Home, My Problems, Community, Track */}
            <nav className="hidden md:flex items-center gap-6">
              {[
                { key: 'home', path: '/citizen/home', label: t('nav.home') },
                { key: 'myProblems', path: '/citizen/my-problems', label: t('nav.myProblems') },
                { key: 'community', path: '/community/patterns', label: t('nav.community') },
                { key: 'track', path: '/citizen/track-problems', label: t('nav.track') },
              ].map(item => {
                const isActive = isCitizenNavActive(item.key, item.path)
                return (
                  <a
                    key={item.key}
                    className={`nav-link-indicator cursor-pointer font-label-md text-sm font-semibold transition-colors duration-200 ${
                      isActive
                        ? 'active text-brand-violet font-bold border-b-2 border-brand-violet pb-0.5'
                        : 'text-on-surface-variant hover:text-brand-indigo'
                    }`}
                    onClick={() => handleNav(item.path)}
                  >
                    {item.label}
                  </a>
                )
              })}
            </nav>

            <div className="hidden md:flex items-center gap-3 relative">
              <LanguageSelector />

              <div className="relative" ref={notifRef}>
                <button
                  className="w-9 h-9 rounded-full bg-surface-container-low hover:bg-surface-container text-brand-indigo flex items-center justify-center transition-colors relative cursor-pointer"
                  onClick={() => setNotifOpen(!notifOpen)}
                >
                  <span className="material-symbols-outlined text-lg">notifications</span>
                  {unreadCount > 0 && (
                    <>
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-violet animate-ping" />
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-violet text-[8px] font-bold text-white flex items-center justify-center">{unreadCount}</span>
                    </>
                  )}
                </button>
                {notifOpen && (
                  <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl border border-outline-variant/70 shadow-xl p-4 z-50 space-y-3">
                    <div className="flex items-center justify-between border-b border-outline-variant/40 pb-2">
                      <span className="font-bold text-brand-indigo text-xs uppercase tracking-wider">{t('nav.notifications')}</span>
                      <button className="text-xs font-bold text-brand-violet hover:underline" onClick={() => handleNav('/citizen/track-problems')}>View All</button>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {notifications.map(n => (
                        <div
                          key={n.id}
                          className={`p-2.5 rounded-xl ${n.unread ? 'bg-brand-violet/5 border border-brand-violet/20' : 'bg-surface-container-low'} cursor-pointer hover:bg-white transition-all space-y-0.5`}
                          onClick={() => { setNotifOpen(false); handleNav('/' + n.route) }}
                        >
                          <div className="flex items-center justify-between text-xs font-bold text-brand-indigo">
                            <span>{n.title}</span>
                            <span className="text-[10px] text-on-surface-variant font-normal">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-on-surface-variant leading-snug">{n.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative" ref={profileRef}>
                <button
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full bg-surface-container-low hover:bg-surface-container border border-outline-variant/60 transition-all cursor-pointer"
                  onClick={() => setProfileOpen(!profileOpen)}
                >
                  <div className="w-7 h-7 rounded-full bg-brand-indigo text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                    {user.name.charAt(0)}
                  </div>
                  <span className="font-semibold text-xs text-brand-indigo max-w-[110px] truncate">{user.name}</span>
                  <span className="material-symbols-outlined text-base text-on-surface-variant">expand_more</span>
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl border border-outline-variant/70 shadow-xl p-2 z-50 space-y-1">
                    <div className="p-3 border-b border-outline-variant/40">
                      <div className="font-bold text-brand-indigo text-sm">{user.name}</div>
                      <div className="text-[11px] text-on-surface-variant">{user.phone || 'Verified Citizen'}</div>
                    </div>
                    <a className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-on-surface-variant hover:text-brand-violet hover:bg-surface-container-low rounded-xl cursor-pointer" onClick={() => handleNav('/citizen/profile')}>
                      <span className="material-symbols-outlined text-base">person</span> {t('nav.profile')}
                    </a>
                    <div className="border-t border-outline-variant/40 pt-1">
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-error hover:bg-error/10 rounded-xl cursor-pointer" onClick={handleSignOut}>
                        <span className="material-symbols-outlined text-base">logout</span> {t('nav.logout')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <nav className="hidden md:flex items-center gap-6">
              <a className={`nav-link-indicator cursor-pointer font-label-md text-sm font-semibold transition-colors duration-200 ${activeRoute === '/' ? 'active text-brand-violet font-bold' : 'text-on-surface-variant hover:text-brand-indigo'}`} onClick={() => handleNav('/')}>
                {t('nav.home')}
              </a>
              <a className={`nav-link-indicator cursor-pointer font-label-md text-sm font-semibold transition-colors duration-200 ${activeRoute === '/how-it-works' ? 'active text-brand-violet font-bold' : 'text-on-surface-variant hover:text-brand-indigo'}`} onClick={() => handleNav('/how-it-works')}>
                {t('nav.howItWorks')}
              </a>
              <a className={`nav-link-indicator cursor-pointer font-label-md text-sm font-semibold transition-colors duration-200 ${activeRoute === '/explore-challenges' ? 'active text-brand-violet font-bold' : 'text-on-surface-variant hover:text-brand-indigo'}`} onClick={() => handleNav('/explore-challenges')}>
                {t('nav.exploreChallenges')}
              </a>
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <LanguageSelector />
              <a
                className="bg-brand-indigo text-white px-5 py-2 rounded-full font-label-md text-xs font-semibold hover:bg-brand-violet transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 flex items-center gap-1.5 group/btn cursor-pointer"
                onClick={() => handleNav('/role-selection')}
              >
                <span>{t('nav.getStarted')}</span>
                <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform duration-200">arrow_forward</span>
              </a>
              <a
                className="border border-outline-variant text-brand-indigo px-4 py-2 rounded-full font-label-md text-xs font-semibold hover:border-brand-violet hover:text-brand-violet hover:bg-brand-indigo/5 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 bg-white cursor-pointer"
                onClick={() => handleNav('/auth')}
              >
                {t('nav.signIn')}
              </a>
            </div>
          </>
        )}

        <div className="md:hidden flex items-center gap-2">
          <LanguageSelector />
          <button className="text-brand-indigo p-1.5 rounded-lg hover:bg-surface-container transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-outline-variant px-6 py-4 space-y-3">
          {authed ? (
            isMentor ? (
              <>
                <div className="text-[10px] font-bold text-brand-teal uppercase tracking-widest px-1">University Portal</div>
                <a className="block text-on-surface-variant hover:text-brand-indigo font-semibold py-1.5 cursor-pointer" onClick={() => handleNav('/mentor/dashboard')}>Dashboard</a>
                <a className="block text-on-surface-variant hover:text-brand-indigo font-semibold py-1.5 cursor-pointer" onClick={() => handleNav('/validation/queue')}>Opportunities</a>
                <a className="block text-on-surface-variant hover:text-brand-indigo font-semibold py-1.5 cursor-pointer" onClick={() => handleNav('/university/profile')}>My University</a>
                <a className="block text-on-surface-variant hover:text-brand-indigo font-semibold py-1.5 cursor-pointer" onClick={() => handleNav('/university/projects')}>Projects</a>
                <a className="block text-on-surface-variant hover:text-brand-indigo font-semibold py-1.5 cursor-pointer" onClick={() => handleNav('/university/collaborations')}>Collaborations</a>
                <div className="border-t border-outline-variant/40 pt-2">
                  <button className="w-full text-left text-error font-bold py-1.5 flex items-center gap-2 cursor-pointer" onClick={handleSignOut}>
                    <span className="material-symbols-outlined text-base">logout</span> {t('nav.logout')}
                  </button>
                </div>
              </>
            ) : userRole === 'student' ? (
              <>
                <div className="text-[10px] font-bold text-brand-violet uppercase tracking-widest px-1">Student Innovator</div>
                <a className="block text-on-surface-variant hover:text-brand-violet font-semibold py-1.5 cursor-pointer" onClick={() => handleNav('/student/explorer')}>Explore Challenges</a>
                <a className="block text-on-surface-variant hover:text-brand-violet font-semibold py-1.5 cursor-pointer" onClick={() => handleNav('/student/proposals')}>My Proposals</a>
                <div className="border-t border-outline-variant/40 pt-2">
                  <button className="w-full text-left text-error font-bold py-1.5 flex items-center gap-2 cursor-pointer" onClick={handleSignOut}>
                    <span className="material-symbols-outlined text-base">logout</span> {t('nav.logout')}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-[10px] font-bold text-brand-teal uppercase tracking-widest px-1">Citizen Portal</div>
                <a className="block text-on-surface-variant hover:text-brand-violet font-semibold py-1.5 cursor-pointer" onClick={() => handleNav('/citizen/home')}>{t('nav.home')}</a>
                <a className="block text-on-surface-variant hover:text-brand-violet font-semibold py-1.5 cursor-pointer" onClick={() => handleNav('/citizen/my-problems')}>{t('nav.myProblems')}</a>
                <a className="block text-on-surface-variant hover:text-brand-violet font-semibold py-1.5 cursor-pointer" onClick={() => handleNav('/community/patterns')}>{t('nav.community')}</a>
                <a className="block text-on-surface-variant hover:text-brand-violet font-semibold py-1.5 cursor-pointer" onClick={() => handleNav('/citizen/track-problems')}>{t('nav.track')}</a>
                <a className="block text-on-surface-variant hover:text-brand-violet font-semibold py-1.5 cursor-pointer" onClick={() => handleNav('/citizen/profile')}>{t('nav.profile')}</a>
                <div className="border-t border-outline-variant/40 pt-2">
                  <button className="w-full text-left text-error font-bold py-1.5 flex items-center gap-2 cursor-pointer" onClick={handleSignOut}>
                    <span className="material-symbols-outlined text-base">logout</span> {t('nav.logout')}
                  </button>
                </div>
              </>
            )
          ) : (
            <>
              <a className="block text-on-surface-variant hover:text-brand-violet font-semibold py-2 cursor-pointer" onClick={() => handleNav('/')}>{t('nav.home')}</a>
              <a className="block text-on-surface-variant hover:text-brand-violet font-semibold py-2 cursor-pointer" onClick={() => handleNav('/how-it-works')}>{t('nav.howItWorks')}</a>
              <a className="block text-on-surface-variant hover:text-brand-violet font-semibold py-2 cursor-pointer" onClick={() => handleNav('/explore-challenges')}>{t('nav.exploreChallenges')}</a>
              <a className="block bg-brand-indigo text-white text-center py-2.5 rounded-full font-semibold cursor-pointer" onClick={() => handleNav('/role-selection')}>{t('nav.getStarted')}</a>
              <a className="block text-center border border-outline-variant text-brand-indigo py-2 rounded-full font-semibold cursor-pointer" onClick={() => handleNav('/auth')}>{t('nav.signIn')}</a>
            </>
          )}
        </div>
      )}
    </header>
  )
}
