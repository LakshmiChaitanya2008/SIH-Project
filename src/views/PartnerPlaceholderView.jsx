import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';

export default function PartnerPlaceholderView() {
  const navigate = useNavigate();
  const userName = useSelector((state) => state.app.userProfile.name);

  return (
    <main className="flex-grow pt-12 pb-24 px-6 md:px-margin-desktop max-w-container-max mx-auto w-full">
      <div className="max-w-2xl mx-auto bg-white p-10 rounded-2xl border border-outline-variant text-center shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-surface-container-low text-brand-violet flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-4xl">handshake</span>
        </div>
        <span className="text-xs font-bold text-brand-violet uppercase tracking-widest block mb-2">PARTNER & ORGANIZATIONAL PORTAL</span>
        <h1 className="font-display-lg text-brand-indigo text-3xl font-bold mb-4">Welcome, {userName}</h1>
        <p className="font-body-md text-on-surface-variant text-base mb-8 leading-relaxed">
          Your account as a <strong>Partner / Organization</strong> is active. Partner resource grants and implementation funding tracking will unlock in future phases!
        </p>
        <button onClick={() => navigate('/')} className="bg-brand-indigo text-white px-6 py-3 rounded-full font-label-md text-sm font-semibold hover:bg-brand-violet">
          Return Home
        </button>
      </div>
    </main>
  );
}
