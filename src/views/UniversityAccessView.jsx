import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { setRole } from '../features/app/appSlice';

export default function UniversityAccessView() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAuthAction = (mode = 'signin') => {
    dispatch(setRole('mentor'));
    navigate('/auth', { state: { mode } });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-[#FAF8FF] via-white to-[#F6F3FB] text-on-surface">

      <header className="w-full pt-5 pb-2 px-6 md:px-margin-desktop max-w-container-max mx-auto bg-transparent relative z-20">
        <div className="flex items-center gap-4 sm:gap-6">
          <button onClick={() => navigate('/')} className="cursor-pointer group bg-transparent p-0 border-none shadow-none">
            <img
              src="/assests/logo.png"
              alt="SamadhanSetu — Civic Innovation Platform"
              className="w-[130px] sm:w-[145px] md:w-[160px] h-auto max-w-full object-contain block bg-transparent transition-transform duration-300 ease-out group-hover:scale-[1.02]"
              onError={(e) => { e.target.onerror = null; e.target.src = '/logo.png'; }}
            />
          </button>
          <div className="h-5 w-px bg-outline-variant/60 hidden sm:block"></div>
          <button onClick={() => navigate('/role-selection')} className="inline-flex items-center gap-1.5 text-brand-indigo hover:text-brand-violet font-label-md text-xs sm:text-sm font-semibold transition-colors group cursor-pointer">
            <span className="material-symbols-outlined text-base group-hover:-translate-x-1 transition-transform">arrow_back</span>
            <span>Back to Ecosystem</span>
          </button>
        </div>
      </header>

      <main className="flex-grow flex flex-col justify-center py-6 px-6 md:px-margin-desktop max-w-container-max mx-auto w-full relative z-10">

        <div className="absolute inset-0 pointer-events-none opacity-10 overflow-hidden -z-10 flex items-center justify-center">
          <svg className="w-full h-full text-brand-indigo max-w-5xl" viewBox="0 0 800 400" fill="none">
            <circle cx="250" cy="200" r="130" stroke="#352C85" strokeDasharray="6 6" strokeWidth="1.5" />
            <circle cx="550" cy="200" r="130" stroke="#159B8C" strokeDasharray="6 6" strokeWidth="1.5" />
            <path d="M 250 200 Q 400 120 550 200" stroke="#5B3FD6" strokeDasharray="4 4" strokeWidth="1.5" />
            <path d="M 250 200 Q 400 280 550 200" stroke="#159B8C" strokeDasharray="4 4" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="text-center max-w-2xl mx-auto mb-3 sm:mb-4 space-y-2">
          <span className="font-label-sm text-brand-violet uppercase tracking-widest text-xs font-bold block">
            UNIVERSITY COLLABORATION
          </span>
          <h1 className="font-display-lg text-brand-indigo text-3xl sm:text-4xl font-extrabold tracking-tight">
            Bring your institution into the innovation journey.
          </h1>
          <p className="font-body-md text-on-surface-variant text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Connect your university with real community challenges, enable faculty and students to build solutions, and create measurable social impact.
          </p>
        </div>

        {/* 8-12% Reduced Footprint Two-Column Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-[780px] mx-auto w-full mb-6">

          <div className="group cursor-pointer p-5 sm:p-6 rounded-3xl bg-white border border-outline-variant/70 shadow-2xs hover:border-brand-indigo hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-brand-indigo block mb-1">NEW TO SAMADHANSETU</span>
                  <h2 className="font-headline-md text-brand-indigo text-xl sm:text-2xl font-extrabold group-hover:text-brand-violet transition-colors">
                    Register Your Institution
                  </h2>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-brand-indigo/10 text-brand-indigo flex items-center justify-center group-hover:scale-105 group-hover:bg-brand-indigo group-hover:text-white transition-all shrink-0">
                  <span className="material-symbols-outlined text-2xl">school</span>
                </div>
              </div>
              <p className="font-body-md text-on-surface-variant text-xs sm:text-sm leading-relaxed mb-3">
                Create your institution profile and showcase your academic expertise, research capabilities, innovation ecosystem, and areas where your university can contribute.
              </p>
              <div className="space-y-1.5 py-3 border-t border-b border-outline-variant/40 my-3 text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-indigo/80 block mb-1">Institutional Capabilities Preview</span>
                <div className="flex items-center gap-2 text-xs font-medium text-brand-indigo">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-indigo shrink-0"></span>
                  <span>Academic &amp; research expertise</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-brand-indigo">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-indigo shrink-0"></span>
                  <span>Faculty and mentor network</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-brand-indigo">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-indigo shrink-0"></span>
                  <span>Innovation and incubation facilities</span>
                </div>
              </div>
            </div>
            <button onClick={() => handleAuthAction('signup')} className="w-full bg-brand-indigo text-white px-6 py-3.5 rounded-full font-label-md text-sm font-bold hover:bg-brand-violet transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-1">
              <span>Register Institution</span>
              <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>

          <div className="group cursor-pointer p-5 sm:p-6 rounded-3xl bg-white border border-outline-variant/70 shadow-2xs hover:border-brand-teal hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-brand-teal block mb-1">ALREADY CONNECTED</span>
                  <h2 className="font-headline-md text-brand-indigo text-xl sm:text-2xl font-extrabold group-hover:text-brand-teal transition-colors">
                    Access Your University Portal
                  </h2>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-brand-teal/10 text-brand-teal flex items-center justify-center group-hover:scale-105 group-hover:bg-brand-teal group-hover:text-white transition-all shrink-0">
                  <span className="material-symbols-outlined text-2xl">admin_panel_settings</span>
                </div>
              </div>
              <p className="font-body-md text-on-surface-variant text-xs sm:text-sm leading-relaxed mb-3">
                Sign in to manage incoming community problem requests, mentor innovation teams, track projects, and collaborate with ecosystem partners.
              </p>
              <div className="space-y-1.5 py-3 border-t border-b border-outline-variant/40 my-3 text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-teal block mb-1">Portal Management Features</span>
                <div className="flex items-center gap-2 text-xs font-medium text-brand-indigo">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-teal shrink-0"></span>
                  <span>Review incoming community problem requests</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-brand-indigo">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-teal shrink-0"></span>
                  <span>Guide &amp; mentor student solver teams</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-brand-indigo">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-teal shrink-0"></span>
                  <span>Track institutional impact &amp; metrics</span>
                </div>
              </div>
            </div>
            <button onClick={() => handleAuthAction('signin')} className="w-full border border-outline-variant text-brand-indigo px-6 py-3.5 rounded-full font-label-md text-sm font-bold hover:border-brand-violet hover:bg-brand-indigo/5 transition-all bg-white flex items-center justify-center gap-2 cursor-pointer mt-1">
              <span>Sign In</span>
              <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>

        </div>

        {/* Ecosystem Section */}
        <div className="max-w-[780px] mx-auto w-full bg-white/90 border border-outline-variant/70 rounded-2xl p-4 sm:p-5 shadow-2xs mb-3">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 text-center lg:text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-teal/10 text-brand-teal flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-lg">hub</span>
              </div>
              <span className="font-label-md text-xs sm:text-sm font-bold text-brand-indigo">
                Your institution becomes part of a connected innovation ecosystem.
              </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-on-surface-variant flex-wrap justify-center">
              <span className="px-2.5 py-1 rounded-full bg-surface-container-low text-brand-indigo border border-outline-variant/50">Community Problems</span>
              <span className="text-brand-teal font-bold">→</span>
              <span className="px-2.5 py-1 rounded-full bg-brand-indigo/10 text-brand-indigo border border-brand-indigo/20 font-bold">University Expertise</span>
              <span className="text-brand-teal font-bold">→</span>
              <span className="px-2.5 py-1 rounded-full bg-surface-container-low text-brand-indigo border border-outline-variant/50">Student Innovation</span>
              <span className="text-brand-teal font-bold">→</span>
              <span className="px-2.5 py-1 rounded-full bg-brand-teal/10 text-brand-teal border border-brand-teal/20 font-bold">Real-World Solutions</span>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-on-surface-variant/80 max-w-xl mx-auto mb-6 font-medium">
          Institutions are connected based on their expertise, capabilities, and areas of contribution.
        </p>

      </main>

    </div>
  );
}
