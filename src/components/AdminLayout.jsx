import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router'
import { useAuth } from '../lib/auth'

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signOut, user } = useAuth()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

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
    <div className="min-h-screen flex flex-col bg-[#F8F9FB] text-on-surface">
      {/* Admin Top Header */}
      <header className="bg-white border-b border-outline-variant/60 sticky top-0 z-40 h-16 px-4 md:px-8 flex items-center justify-between">
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
              alt="SamadhanSetu"
              className="w-[140px] h-auto object-contain block"
              onError={(e) => { e.target.onerror = null; e.target.src = '/logo.png' }}
            />
            <div className="h-5 w-px bg-outline-variant/60 hidden sm:block"></div>
            <div className="hidden sm:block text-xs">
              <span className="font-bold text-brand-indigo block leading-none">SAMADHANSETU ADMINISTRATION</span>
              <span className="text-[10px] text-slate-500 font-medium">Jharkhand Civic Innovation Network</span>
            </div>
          </a>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-outline-variant/40">
            <div className="w-7 h-7 rounded-lg bg-brand-indigo text-white flex items-center justify-center font-bold text-xs">
              A
            </div>
            <div className="text-left hidden sm:block">
              <span className="font-bold text-brand-indigo text-xs block leading-tight">Administrator</span>
              <span className="text-[10px] text-slate-500 block leading-tight">Platform Governance</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="border border-outline-variant text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Container with Sidebar */}
      <div className="flex flex-grow relative">
        {/* Sidebar Desktop & Mobile Drawer */}
        <aside
          className={`fixed md:sticky top-16 z-30 h-[calc(100vh-4rem)] w-64 bg-white border-r border-outline-variant/60 flex flex-col justify-between p-4 transition-transform duration-200 ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div className="space-y-4">
            <div className="px-3 py-2 border-b border-outline-variant/40">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">NAVIGATION CONTROL</span>
              <span className="text-xs font-bold text-brand-indigo">Administration Portal</span>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = activePath === item.path
                return (
                  <a
                    key={item.path}
                    onClick={() => {
                      navigate(item.path)
                      setMobileSidebarOpen(false)
                    }}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                      isActive
                        ? 'bg-brand-indigo text-white font-bold shadow-2xs'
                        : 'text-slate-700 hover:bg-surface-container-low hover:text-brand-indigo'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">{item.icon}</span>
                    <span>{item.label}</span>
                  </a>
                )
              })}
            </nav>
          </div>

          <div className="pt-4 border-t border-outline-variant/40 space-y-2">
            <div className="px-3 text-xs">
              <span className="font-bold text-brand-indigo block">SamadhanSetu Admin</span>
              <span className="text-[10px] text-slate-500 block">System Version 2.4.0</span>
            </div>
          </div>
        </aside>

        {/* Content Outlet */}
        <div className="flex-grow p-4 md:p-8 max-w-[1280px] w-full mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
