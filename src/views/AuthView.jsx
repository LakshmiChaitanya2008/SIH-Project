import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { setRole } from '../features/app/appSlice';
import { useAuth } from '../lib/auth';
import Footer from '../components/Footer';
import { useTranslation } from '../lib/useTranslation';
import LanguageSelector from '../components/LanguageSelector';

export default function AuthView() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { signIn, signUp } = useAuth();
  const { t } = useTranslation();
  const currentRole = useSelector((state) => state.app.userRole) || 'citizen';

  useEffect(() => {
    document.title = "Sign In | SamadhanSetu";
  }, []);

  const [mode, setMode] = useState(location.state?.mode === 'signup' ? 'signup' : 'signin');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [district, setDistrict] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const roleTitles = {
    citizen: t('roleSelection.citizenTitle') || 'Citizen / Community',
    student: t('roleSelection.studentTitle') || 'Student / Innovator',
    mentor: t('roleSelection.mentorTitle') || 'University / Mentor',
    partner: t('roleSelection.partnerTitle') || 'Industry / Organization'
  };

  const roleIcons = {
    citizen: 'groups',
    student: 'lightbulb',
    mentor: 'school',
    partner: 'handshake'
  };

  const demoCredentialsMap = {
    citizen: {
      title: 'Citizen Demo Credentials',
      email: 'citizen@samadhansetu.in',
      password: 'citizen123',
      buttonText: 'Fill Demo',
      role: 'citizen',
    },
    student: {
      title: 'Student Demo Credentials',
      email: 'student@demo.ac.in',
      password: 'student123',
      buttonText: 'Fill Student',
      role: 'student',
    },
    mentor: {
      title: 'University Demo Credentials',
      email: 'admin@samadhansetu.in',
      password: 'admin123',
      buttonText: 'Fill Admin',
      role: 'mentor',
    },
    partner: {
      title: 'Partner Demo Credentials',
      email: 'partner@samadhansetu.in',
      password: 'partner123',
      buttonText: 'Fill Partner',
      role: 'partner',
    },
  };

  const activeDemo = demoCredentialsMap[currentRole] || demoCredentialsMap.citizen;

  // Map UI roles to DB roles
  const dbRole = currentRole === 'mentor' ? 'admin' : currentRole;

  const homeRoutes = {
    citizen: '/citizen/home',
    student: '/student/explorer',
    mentor: '/mentor/dashboard',
    admin: '/mentor/dashboard',
    partner: '/partner/dashboard'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'signup' && !fullName.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        await signUp({
          email: email.trim(),
          password,
          fullName: fullName.trim(),
          role: dbRole,
          district: district.trim() || 'Gumla',
          state: 'Jharkhand',
          institution: dbRole === 'admin' ? 'Ranchi University' : '',
        });
        await signIn({ email: email.trim(), password });
      } else {
        await signIn({ email: email.trim(), password });
      }
      navigate(location.state?.from || homeRoutes[currentRole] || '/citizen/home');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-[#FAF8FF] via-white to-[#F6F3FB] text-on-surface overflow-x-hidden">
      
      {/* Dedicated Auth Header */}
      <header className="w-full pt-3 pb-1.5 px-6 md:px-margin-desktop max-w-container-max mx-auto bg-transparent relative z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Official SamadhanSetu Logo Asset */}
            <a 
              onClick={() => navigate('/')} 
              className="cursor-pointer group bg-transparent p-0 border-none shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet/40 rounded-lg"
            >
              <img 
                src="/assests/logo.png" 
                alt="SamadhanSetu — Civic Innovation Platform" 
                className="w-[130px] sm:w-[150px] md:w-[165px] h-auto max-w-full object-contain block bg-transparent transition-transform duration-300 ease-out group-hover:scale-[1.02]" 
                onError={(e) => { e.target.onerror = null; e.target.src = '/logo.png'; }}
              />
            </a>

            {/* Vertical Divider & Change Role Button */}
            <div className="h-5 w-px bg-outline-variant/60 hidden sm:block"></div>

            <button 
              onClick={() => navigate('/role-selection')} 
              className="inline-flex items-center gap-1.5 text-brand-indigo hover:text-brand-violet font-label-md text-xs sm:text-sm font-semibold transition-colors group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet/40 rounded-md py-1 px-1.5"
            >
              <span className="material-symbols-outlined text-base group-hover:-translate-x-1 transition-transform duration-200">arrow_back</span>
              <span>{t('authPage.changeRole')}</span>
            </button>
          </div>

          <div>
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Main Authentication Workspace */}
      <main className="flex-grow flex flex-col items-center justify-center pt-1 sm:pt-2 pb-3 px-6 md:px-margin-desktop max-w-container-max mx-auto w-full relative z-10">
        
        {/* Central Authentication Card */}
        <div className="w-full max-w-[540px] bg-white border border-outline-variant/70 rounded-2xl p-5 sm:p-6 shadow-2xs -mt-5 sm:-mt-8 md:-mt-10">
          
          {/* Integrated Selected Pathway Context Panel */}
          <div className="flex items-center gap-3 p-2.5 sm:p-3 bg-[#F8F6FC] rounded-xl border border-outline-variant/40 mb-3.5">
            <div className="w-9 h-9 rounded-lg bg-brand-indigo text-white flex items-center justify-center shrink-0 shadow-2xs">
              <span className="material-symbols-outlined text-xl">{roleIcons[currentRole] || 'person'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-brand-teal uppercase tracking-widest block">{t('authPage.selectedPathway')}</span>
              <span className="font-headline-sm text-brand-indigo font-bold text-xs sm:text-sm">{roleTitles[currentRole] || 'Citizen / Community'}</span>
            </div>
          </div>

          {/* Clean Mode Toggle Tabs (Sign In / Create Account) */}
          <div className="flex border-b border-outline-variant/60 mb-3.5">
            <button 
              onClick={() => { setMode('signin'); setError(''); }} 
              className={`flex-1 py-2.5 font-label-md text-xs sm:text-sm font-bold transition-all duration-200 ease-out cursor-pointer -mb-[1px] ${mode === 'signin' ? 'text-brand-violet border-b-2 border-brand-violet' : 'text-on-surface-variant hover:text-brand-indigo border-b-2 border-transparent'}`}
            >
              {t('authPage.signInTab')}
            </button>
            <button 
              onClick={() => { setMode('signup'); setError(''); }} 
              className={`flex-1 py-2.5 font-label-md text-xs sm:text-sm font-bold transition-all duration-200 ease-out cursor-pointer -mb-[1px] ${mode === 'signup' ? 'text-brand-violet border-b-2 border-brand-violet' : 'text-on-surface-variant hover:text-brand-indigo border-b-2 border-transparent'}`}
            >
              {t('authPage.createAccountTab')}
            </button>
          </div>

          {/* Heading */}
          <h2 className="font-display-lg text-[#1E1B4B] text-xl sm:text-2xl font-extrabold mb-1 animate-heading-slide-left">
            {mode === 'signin' ? t('authPage.welcomeBack') : t('authPage.createAccountHeader')}
          </h2>

          <p className="font-body-md text-on-surface-variant text-xs sm:text-sm leading-relaxed mb-3.5">
            {mode === 'signin'
              ? t('auth.citizenLoginSub')
              : t('authPage.createAccountHeader')
            }
          </p>

          {/* Demo Credentials Container */}
          {mode === 'signin' && (
            <div className="mb-3.5 p-2.5 sm:p-3 rounded-xl bg-brand-violet/5 border border-brand-violet/15 flex items-center justify-between gap-3">
              <div className="text-[11px] text-brand-indigo font-medium">
                <strong className="block text-brand-violet font-bold">{activeDemo.title}</strong>
                <span>{activeDemo.email} / {activeDemo.password}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEmail(activeDemo.email);
                  setPassword(activeDemo.password);
                  dispatch(setRole(activeDemo.role));
                }}
                className="px-3 py-1 rounded-full bg-brand-indigo text-white text-[11px] font-bold hover:bg-brand-violet transition-colors duration-200 shrink-0 cursor-pointer shadow-2xs"
              >
                {activeDemo.buttonText}
              </button>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="p-2.5 rounded-xl bg-error-container text-on-error-container text-xs font-semibold mb-3.5 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* Authentication Form */}
          <form onSubmit={handleSubmit} className="space-y-3" noValidate>
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-brand-indigo uppercase tracking-wider mb-1">{t('authPage.fullName')}</label>
                <input 
                  type="text" 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)} 
                  className="w-full bg-white border border-outline-variant/70 rounded-xl px-3.5 py-2.5 text-sm text-on-surface placeholder:text-outline/70 focus:outline-none focus:border-brand-violet focus:ring-2 focus:ring-brand-violet/15 transition-all duration-200" 
                  placeholder="e.g. Ramesh Sharma" 
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-brand-indigo uppercase tracking-wider mb-1">{t('authPage.email')}</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full bg-white border border-outline-variant/70 rounded-xl px-3.5 py-2.5 text-sm text-on-surface placeholder:text-outline/70 focus:outline-none focus:border-brand-violet focus:ring-2 focus:ring-brand-violet/15 transition-all duration-200" 
                placeholder="you@example.org" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-indigo uppercase tracking-wider mb-1">{t('authPage.password')}</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full bg-white border border-outline-variant/70 rounded-xl px-4 py-2.5 text-sm text-on-surface placeholder:text-outline/70 focus:outline-none focus:border-brand-violet focus:ring-2 focus:ring-brand-violet/15 transition-all duration-200" 
                placeholder="••••••••" 
              />
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-brand-indigo uppercase tracking-wider mb-1">{t('authPage.district')}</label>
                <input 
                  type="text" 
                  value={district} 
                  onChange={(e) => setDistrict(e.target.value)} 
                  className="w-full bg-white border border-outline-variant/70 rounded-xl px-3.5 py-2.5 text-sm text-on-surface placeholder:text-outline/70 focus:outline-none focus:border-brand-violet focus:ring-2 focus:ring-brand-violet/15 transition-all duration-200" 
                  placeholder="e.g. Gumla District, Jharkhand" 
                />
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-brand-indigo text-white py-3 rounded-full font-label-md font-bold text-sm hover:bg-brand-violet hover:-translate-y-0.5 hover:shadow-md hover:shadow-brand-violet/20 transition-all duration-200 shadow-2xs mt-3.5 flex items-center justify-center gap-2 group/btn cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                  <span>{mode === 'signin' ? 'Signing In...' : 'Creating Account...'}</span>
                </>
              ) : (
                <>
                  <span>{mode === 'signin' ? t('authPage.signInSubmit') : t('authPage.createSubmit')}</span>
                  <span className="material-symbols-outlined text-base group-hover/btn:translate-x-1 transition-transform duration-200 ease-out">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-3.5 text-center text-xs text-on-surface-variant font-medium">
            {t('authPage.termsNotice')}
          </div>
        </div>
      </main>

      {/* Clean Premium Footer */}
      <Footer />
    </div>
  );
}
