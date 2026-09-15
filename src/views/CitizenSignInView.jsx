import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../lib/auth';
import { useTranslation } from '../lib/useTranslation';

export default function CitizenSignInView() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithPhoneCredential } = useAuth();
  const { t } = useTranslation();

  const [step, setStep] = useState('mobile');
  const [mobileNumber, setMobileNumber] = useState('9431188221');
  const [otp, setOtp] = useState(['4', '8', '2', '1']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formatMobile = (num) => {
    if (num.length === 10) {
      return `+91 ${num.slice(0, 5)} ${num.slice(5)}`;
    }
    return `+91 ${num}`;
  };

  const handleMobileSubmit = (e) => {
    e.preventDefault();
    const cleanNum = mobileNumber.replace(/\D/g, '');
    if (cleanNum.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setError('');
    setStep('otp');
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 4) {
      setError('Please enter the complete 4-digit verification code.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await signInWithPhoneCredential(mobileNumber, otpCode);
      const destination = location.state?.from || '/citizen/home';
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) {
      const nextInput = document.querySelector(`#otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.querySelector(`#otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-[#FAF8FF] via-white to-[#F6F3FB] text-on-surface">
      
      {/* Minimal Dedicated Header */}
      <header className="w-full pt-5 pb-2 px-6 md:px-margin-desktop max-w-container-max mx-auto bg-transparent relative z-20">
        <div className="flex items-center gap-4 sm:gap-6">
          <a onClick={() => navigate('/')} className="cursor-pointer group bg-transparent p-0 border-none shadow-none">
            <img 
              src="/assests/logo.png" 
              alt="SamadhanSetu — Civic Innovation Platform" 
              className="w-[130px] sm:w-[145px] md:w-[160px] h-auto max-w-full object-contain block bg-transparent transition-transform duration-300 ease-out group-hover:scale-[1.02]" 
              onError={(e) => { e.target.onerror = null; e.target.src = '/logo.png'; }}
            />
          </a>

          <div className="h-5 w-px bg-outline-variant/60 hidden sm:block"></div>

          <button onClick={() => navigate('/citizen/access')} className="inline-flex items-center gap-1.5 text-brand-indigo hover:text-brand-violet font-label-md text-xs sm:text-sm font-semibold transition-colors group cursor-pointer">
            <span className="material-symbols-outlined text-base group-hover:-translate-x-1 transition-transform">arrow_back</span>
            <span>Back to Citizen Access</span>
          </button>
        </div>
      </header>

      {/* Main Sign-In Container */}
      <main className="flex-grow flex flex-col justify-center py-6 px-6 md:px-margin-desktop max-w-container-max mx-auto w-full relative z-10">
        
        <div className="w-full max-w-md mx-auto bg-white border border-outline-variant/70 rounded-3xl p-8 shadow-sm">
          
          <div className="text-center mb-6">
            <span className="text-[11px] font-bold text-brand-teal uppercase tracking-widest block mb-1">
              {t('auth.citizenTag')}
            </span>
            <h1 className="font-display-lg text-brand-indigo text-2xl font-extrabold mb-2">
              {t('auth.signInTitle')}
            </h1>
            <p className="font-body-md text-on-surface-variant text-xs leading-relaxed">
              {t('auth.signInSubtitle')}
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-error-container text-on-error-container text-xs font-semibold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm shrink-0">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Mobile Number Form */}
          {step === 'mobile' && (
            <form onSubmit={handleMobileSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-brand-indigo uppercase tracking-wider mb-2">
                  {t('auth.mobileLabel')}
                </label>
                <div className="flex items-center border border-outline-variant rounded-2xl overflow-hidden focus-within:border-brand-violet focus-within:ring-2 focus-within:ring-brand-violet/20 bg-white">
                  <span className="px-4 py-3.5 bg-surface-container-low text-brand-indigo font-bold text-sm border-r border-outline-variant/60 shrink-0">
                    +91
                  </span>
                  <input 
                    type="tel" 
                    maxLength="10" 
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full px-4 py-3.5 text-sm text-on-surface font-semibold focus:outline-none placeholder:text-on-surface-variant/50 placeholder:font-normal" 
                    placeholder={t('auth.mobilePlaceholder')}
                    required
                  />
                </div>
                <p className="text-[11px] text-on-surface-variant/70 mt-1.5">
                  {t('auth.mobileHint')}
                </p>
              </div>

              <button 
                type="submit" 
                className="w-full bg-brand-indigo text-white py-3.5 rounded-full font-label-md font-semibold text-sm hover:bg-brand-violet transition-all shadow-xs flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>{t('auth.continue')}</span>
                <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </form>
          )}

          {/* STEP 2: OTP Verification Form */}
          {step === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-5">
              <div className="p-3 bg-brand-teal/10 rounded-2xl border border-brand-teal/20 text-xs text-brand-indigo flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-brand-teal block">OTP SENT TO</span>
                  <span className="font-bold font-mono text-sm">{formatMobile(mobileNumber)}</span>
                </div>
                <button type="button" onClick={() => { setStep('mobile'); setError(''); }} className="text-xs text-brand-violet font-bold hover:underline cursor-pointer">
                  Change
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-indigo uppercase tracking-wider mb-2 text-center">
                  {t('auth.otpLabel')}
                </label>
                <div className="flex justify-center gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="otp-box w-12 h-12 text-center text-xl font-bold font-mono border border-outline-variant rounded-xl focus:outline-none focus:border-brand-violet focus:ring-2 focus:ring-brand-violet/20 bg-white"
                    />
                  ))}
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-brand-indigo text-white py-3.5 rounded-full font-label-md font-semibold text-sm hover:bg-brand-violet transition-all shadow-xs flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                    <span>Verifying session...</span>
                  </>
                ) : (
                  <>
                    <span>{t('auth.verifyBtn')}</span>
                    <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">check_circle</span>
                  </>
                )}
              </button>

              <div className="text-center text-xs text-on-surface-variant">
                Didn't receive the code? 
                <button 
                  type="button" 
                  onClick={() => { setError(''); setOtp(['4', '8', '2', '1']); }}
                  className="text-brand-violet font-semibold hover:underline cursor-pointer ml-1"
                >
                  {t('auth.resendOtp')}
                </button>
              </div>
            </form>
          )}

        </div>

      </main>
    </div>
  );
}
