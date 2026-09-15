import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router'
import { useAuth } from '../lib/auth'

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signOut, user } = useAuth()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const activePath = location.pathname

  const handleLogout = async () => {
    await signOut()
    navigate('/admin/login')
  }

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard' },
    { label: 'Signals', path: '/validation/queue', icon: 'analytics' },
    { label: 'Universities', path: '/university/profile', icon: 'school' },
    { label: 'Challenges', path: '/challenges', icon: 'flag' },
    { label: 'Projects', path: '/university/projects', icon: 'engineering' },
    { label: 'Partners', path: '/university/collaborations', icon: 'handshake' },
    { label: 'Users', path: '/student/profile', icon: 'groups' },
    { label: 'Reports & Impact', path: '/completed-solution', icon: 'task_alt' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-on-surface">
      {/* Admin Top Header Bar */}
      <header className="bg-white border-b border-outline-variant/60 sticky top-0 z-40 h-16 px-4 md:px-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="md:hidden text-brand-indigo p-1.5 rounded-lg hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>

          <a onClick={() => navigate('/admin/dashboard')} className="cursor-pointer flex items-center gap-3">
            <img
              src="/assests/logo.png"
              alt="SamadhanSetu Logo"
              className="w-[140px] h-auto object-contain block"
              onError={(e) => { e.target.onerror = null; e.target.src = '/logo.png' }}
            />
            <div className="h-5 w-px bg-outline-variant/60 hidden sm:block"></div>
            <div className="hidden sm:block text-xs">
              <span className="font-bold text-on-surface block leading-none">SAMADHANSETU ADMINISTRATION</span>
              <span className="text-[10px] text-slate-500 font-medium">Jharkhand Civic Innovation Network</span>
            </div>
          </a>
        </div>

        {/* Top Search Bar & Administrative Controls */}
        <div className="flex items-center gap-4 flex-1 justify-end max-w-2xl">
          <div className="relative w-full max-w-md hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-2 text-slate-400 text-base">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problems, projects, universities..."
              className="w-full pl-9 pr-4 py-1.5 bg-[#F8F9FB] rounded-lg border border-outline-variant/60 text-xs text-on-surface focus:outline-none focus:border-brand-indigo transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              className="w-8 h-8 rounded-lg bg-[#F8F9FB] text-slate-600 hover:bg-slate-200 border border-outline-variant/40 flex items-center justify-center transition-colors cursor-pointer relative"
            >
              <span className="material-symbols-outlined text-base">notifications</span>
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-violet"></span>
            </button>

            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#F8F9FB] border border-outline-variant/40">
              <div className="w-6 h-6 rounded-md bg-brand-indigo text-white flex items-center justify-center font-bold text-[11px]">
                A
              </div>
              <div className="text-left hidden md:block">
                <span className="font-semibold text-on-surface text-xs block leading-none">Administrator</span>
                <span className="text-[10px] text-slate-500 block leading-tight">Platform Governance</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container with Sidebar */}
      <div className="flex flex-grow relative">
        {/* Sidebar Desktop & Mobile Drawer */}
        <aside
          className={`fixed md:sticky top-16 z-30 h-[calc(100vh-4rem)] w-60 bg-white border-r border-outline-variant/60 flex flex-col justify-between p-3.5 transition-transform duration-200 shrink-0 ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div className="space-y-3">
            <div className="px-3 py-1.5 border-b border-outline-variant/40">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">ADMINISTRATION</span>
              <span className="text-xs font-semibold text-on-surface">Control Center</span>
            </div>

            <nav className="space-y-1 text-xs">
              {navItems.map((item) => {
                const isActive = activePath === item.path
                return (
                  <a
                    key={item.path}
                    onClick={() => {
                      navigate(item.path)
                      setMobileSidebarOpen(false)
                    }}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                      isActive
                        ? 'bg-brand-indigo text-white font-semibold shadow-2xs'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-brand-indigo'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">{item.icon}</span>
                    <span>{item.label}</span>
                  </a>
                )
              })}
            </nav>
          </div>

          <div className="pt-3 border-t border-outline-variant/40 space-y-1 text-xs">
            <button
              type="button"
              onClick={() => navigate('/how-it-works')}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-slate-600 hover:text-brand-indigo hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-base">help</span>
              <span>Platform Support</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors font-semibold"
            >
              <span className="material-symbols-outlined text-base">logout</span>
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Content Outlet Canvas */}
        <div className="flex-grow p-5 md:p-7 max-w-[1280px] w-full mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
