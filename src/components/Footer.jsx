import { useNavigate } from 'react-router'

export default function Footer() {
  const navigate = useNavigate()

  return (
    <footer className="bg-surface-container-low border-t border-outline-variant/60 py-5 sm:py-6 px-6 md:px-margin-desktop mt-auto z-10">
      <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-5 sm:gap-6">

        {/* Left Side: Official SamadhanSetu Logo & Brand Copyright Statement */}
        <div className="space-y-1.5 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 bg-transparent p-0 border-none shadow-none">
            <a onClick={() => navigate('/')} className="cursor-pointer group">
              <img
                src="/assests/logo.png"
                alt="SamadhanSetu — Civic Innovation Platform"
                className="w-[110px] sm:w-[125px] md:w-[135px] h-auto max-w-full object-contain block bg-transparent transition-transform duration-300 group-hover:scale-[1.02]"
                onError={(e) => { e.target.onerror = null; e.target.src = '/logo.png' }}
              />
            </a>
          </div>
          <p className="font-body-md text-xs text-on-surface-variant max-w-md leading-relaxed">
            © 2026 SamadhanSetu. Building resilient societal infrastructure through community innovation and empathy.
          </p>
        </div>

        {/* Right Side: Useful Links */}
        <nav className="flex flex-wrap items-center justify-center md:justify-end gap-5 sm:gap-6 text-xs font-semibold text-on-surface-variant">
          <a className="hover:text-brand-violet transition-colors duration-200 cursor-pointer" onClick={() => navigate('/')}>About Us</a>
          <a className="hover:text-brand-violet transition-colors duration-200 cursor-pointer" onClick={() => navigate('/how-it-works')}>How it works</a>
          <a className="hover:text-brand-violet transition-colors duration-200 cursor-pointer" onClick={() => navigate('/explore-challenges')}>Explore Challenges</a>
          <a className="hover:text-brand-violet transition-colors duration-200 cursor-pointer">Privacy Policy</a>
          <a className="hover:text-brand-violet transition-colors duration-200 cursor-pointer">Terms of Service</a>
        </nav>

      </div>
    </footer>
  )
}
