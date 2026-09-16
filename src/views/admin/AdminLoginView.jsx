import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { useAuth } from '../../lib/auth'

export default function AdminLoginView() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, isAuthenticated, profile } = useAuth()

  const [email, setEmail] = useState('admin@samadhansetu.gov.in')
  const [password, setPassword] = useState('admin123')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  // Redirect if already authenticated as Admin
  useEffect(() => {
    if (isAuthenticated && profile?.role === 'admin') {
      const from = location.state?.from || '/admin/dashboard'
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, profile, navigate, location.state])

  const handleLogin = async (e) => {
    e?.preventDefault()
    if (!email.trim() || !password) return

    setSubmitting(true)
    setError(null)

    try {
      await signIn({ email: email.trim(), password })
      const from = location.state?.from || '/admin/dashboard'
      navigate(from, { replace: true })
    } catch (err) {
      console.error('[Admin Login Error]:', err)
      setError(err.message || 'Invalid administrative credentials.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDemoAdmin = async () => {
    setEmail('admin@samadhansetu.gov.in')
    setPassword('admin123')
    setSubmitting(true)
    setError(null)
    try {
      await signIn({ email: 'admin@samadhansetu.gov.in', password: 'admin123' })
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Failed to authenticate demo admin.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8FAFC] text-slate-800 font-sans">
      {/* Minimal Header */}
      <header className="w-full py-4 px-6 max-w-[1240px] mx-auto flex items-center justify-between border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <img
            src="/assests/logo.png"
            alt="SamadhanSetu Logo"
            className="w-[145px] h-auto object-contain"
            onError={(e) => { e.target.onerror = null; e.target.src = '/logo.png' }}
          />
          <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>
          <span className="text-xs font-semibold text-slate-500 hidden sm:block">
            Governance &amp; Administrative Services
          </span>
        </div>

        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-xs font-bold text-[#26205F] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          <span>Public Portal</span>
        </button>
      </header>

      {/* Main Login Form Container */}
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm space-y-6">
          <div className="space-y-2 border-b border-slate-100 pb-4">
            <span className="text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-wider block">
              SAMADHANSETU ADMINISTRATION
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Control Center Sign In
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              Jharkhand Civic Innovation Network • Authorized access for platform administration and governance.
            </p>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2 font-medium">
              <span className="material-symbols-outlined text-base text-rose-700 shrink-0">error</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Administrative Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@samadhansetu.gov.in"
                className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#26205F] transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Security Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#26205F] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#26205F] text-white py-3.5 rounded-xl font-bold text-xs hover:bg-[#1C1748] transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-base">admin_panel_settings</span>
              <span>{submitting ? 'Authenticating...' : 'Sign in to Control Center'}</span>
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="pt-2 border-t border-slate-100 space-y-2 text-center">
            <span className="text-[11px] text-slate-500 font-medium block">Demo Administrative Account Credentials:</span>
            <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 text-[11px] text-slate-800 font-mono flex items-center justify-between">
              <span className="font-bold text-[#26205F]">admin@samadhansetu.gov.in</span>
              <button
                type="button"
                onClick={handleDemoAdmin}
                className="text-[#26205F] font-sans font-extrabold hover:underline cursor-pointer"
              >
                Quick Sign In &rarr;
              </button>
            </div>
          </div>

          <div className="pt-2 text-center">
            <span className="text-[11px] font-semibold text-slate-400">
              Authorized Personnel Only • State Mission Control
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-slate-400 border-t border-slate-200/60">
        SamadhanSetu Civic Innovation Network © 2026 Government of Jharkhand
      </footer>
    </div>
  )
}

