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
    { label: 'Signals & Queue', path: '/admin/submissions', icon: 'analytics' },
    { label: 'Projects', path: '/admin/projects', icon: 'engineering' },
    { label: 'Community Problems', path: '/admin/clusters', icon: 'bubble_chart' },
    { label: 'Universities', path: '/admin/institutions', icon: 'school' },
    { label: 'Partners', path: '/admin/partners', icon: 'handshake' },
    { label: 'Reports & Impact', path: '/admin/reports', icon: 'task_alt' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800 font-sans">
      {/* Admin Top Header Bar */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40 h-16 px-4 md:px-8 flex items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="md:hidden text-[#26205F] p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>

          <a onClick={() => navigate('/admin/dashboard')} className="cursor-pointer flex items-center gap-3">
            <img
              src="/assests/logo.png"
              alt="SamadhanSetu Logo"
              className="w-[135px] h-auto object-contain block"
              onError={(e) => { e.target.onerror = null; e.target.src = '/logo.png' }}
            />
            <div className="h-5 w-px bg-slate-200 hidden sm:block"></div>
            <div className="hidden sm:block text-xs">
              <span className="font-extrabold text-slate-900 block leading-none tracking-tight">SAMADHANSETU ADMINISTRATION</span>
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
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#26205F] transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              className="w-8 h-8 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-200 border border-slate-200 flex items-center justify-center transition-colors cursor-pointer relative"
            >
              <span className="material-symbols-outlined text-base">notifications</span>
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple-600"></span>
            </button>

            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200">
              <div className="w-6 h-6 rounded-md bg-[#26205F] text-white flex items-center justify-center font-bold text-[11px]">
                A
              </div>
              <div className="text-left hidden md:block">
                <span className="font-bold text-slate-900 text-xs block leading-none">Administrator</span>
                <span className="text-[10px] text-slate-500 block leading-tight font-medium">Platform Governance</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container with Sidebar */}
      <div className="flex flex-grow relative">
        {/* Sidebar Desktop & Mobile Drawer */}
        <aside
          className={`fixed md:sticky top-16 z-30 h-[calc(100vh-4rem)] w-60 bg-white border-r border-slate-200/80 flex flex-col justify-between p-3.5 transition-transform duration-200 shrink-0 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            }`}
        >
          <div className="space-y-3">
            <div className="px-3 py-1.5 border-b border-slate-100">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">ADMINISTRATION</span>
              <span className="text-xs font-bold text-slate-900">Control Center</span>
            </div>

            <nav className="space-y-1 text-xs">
              {navItems.map((item) => {
                const isActive = activePath === item.path ||
                  (item.path === '/admin/projects' && activePath.startsWith('/admin/projects')) ||
                  (item.path === '/admin/submissions' && (activePath.startsWith('/admin/submissions') || activePath === '/admin/signals' || activePath === '/admin/review'))
                return (
                  <a
                    key={item.path}
                    onClick={() => {
                      navigate(item.path)
                      setMobileSidebarOpen(false)
                    }}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-150 ${isActive
                        ? 'bg-[#26205F] text-white shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-[#26205F]'
                      }`}
                  >
                    <span className="material-symbols-outlined text-base">{item.icon}</span>
                    <span>{item.label}</span>
                  </a>
                )
              })}
            </nav>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-1 text-xs">
            <button
              type="button"
              onClick={() => navigate('/how-it-works')}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-slate-600 hover:text-[#26205F] hover:bg-slate-50 rounded-lg cursor-pointer transition-colors font-medium"
            >
              <span className="material-symbols-outlined text-base">help</span>
              <span>Platform Support</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors font-bold"
            >
              <span className="material-symbols-outlined text-base">logout</span>
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Content Outlet Canvas */}
        <div className="flex-grow p-5 md:p-8 max-w-[1280px] w-full mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

