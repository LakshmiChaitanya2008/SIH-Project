import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';

export default function ReportReviewView() {
  const navigate = useNavigate();
  const draft = useSelector((state) => state.app.reportDraft);
  const selectedLanguage = useSelector((state) => state.app.selectedLanguage);
  const isVoice = draft.method === 'voice' || draft.voiceRecorded;

  return (
    <main className="flex-grow pt-12 pb-24 px-6 md:px-margin-desktop max-w-container-max mx-auto w-full flex flex-col items-center justify-center">
      {/* Container */}
      <div className="w-full max-w-xl bg-white border border-outline-variant rounded-2xl p-8 shadow-sm text-center">

        <div className="w-16 h-16 rounded-full bg-brand-teal/10 text-brand-teal flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-4xl">check_circle</span>
        </div>

        <span className="font-label-sm text-brand-teal uppercase tracking-widest text-xs font-bold block mb-2">
          DRAFT CREATED
        </span>

        <h1 className="font-display-lg text-brand-indigo text-3xl font-extrabold mb-3">
          Your problem description is ready.
        </h1>

        <p className="font-body-lg text-on-surface-variant text-base mb-8">
          We have recorded what you shared. You can review your input below.
        </p>

        {/* Draft Summary Card */}
        <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/60 text-left mb-8 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-indigo uppercase tracking-wider">Captured Signal</span>
            <span className="text-xs font-semibold bg-brand-indigo/10 text-brand-indigo px-3 py-1 rounded-full flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">{isVoice ? 'mic' : 'edit_note'}</span>
              {isVoice ? 'Voice Input' : 'Text Input'}
            </span>
          </div>

          <div className="p-4 bg-white rounded-xl border border-outline-variant/30 text-sm text-on-surface">
            {isVoice ? (
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-brand-violet text-2xl">graphic_eq</span>
                <div>
                  <div className="font-bold text-brand-indigo text-sm">Voice Note Recorded (0:18)</div>
                  <div className="text-xs text-on-surface-variant">Language: {selectedLanguage.toUpperCase()} • Speech synthesis pending AI structuring</div>
                </div>
              </div>
            ) : (
              <p className="italic text-on-surface-variant">&quot;{draft.description || 'The water from our hand pump has turned rusty brown after the monsoon rains...'}&quot;</p>
            )}
          </div>

          <div className="text-xs text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-brand-teal">location_on</span>
            <span>Location: <strong>{draft.location?.label || 'Gumla District, Jharkhand'}</strong></span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/citizen/report/evidence')}
            className="w-full bg-brand-indigo text-white py-4 rounded-full font-label-md font-semibold text-sm hover:bg-brand-violet transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>Continue reporting</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full border border-outline-variant text-on-surface-variant py-3.5 rounded-full font-label-md font-semibold text-sm hover:border-brand-indigo transition-colors"
          >
            Save and finish later
          </button>
        </div>

      </div>
    </main>
  );
}
