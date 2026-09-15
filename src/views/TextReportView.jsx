import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { updateReportDraft } from '../features/app/appSlice';
import { useTranslation } from '../lib/useTranslation';

export default function TextReportView() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const currentDescription = useSelector((state) => state.app.reportDraft.description) || '';
  const [description, setDescription] = useState(currentDescription);
  const [error, setError] = useState('');

  const minLength = 10;
  const charCount = description.trim().length;

  const handleContinue = () => {
    if (charCount < minLength) {
      setError(`Please describe the problem in a bit more detail (minimum ${minLength} characters).`);
      return;
    }
    setError('');
    dispatch(updateReportDraft({ description: description.trim(), method: 'text' }));
    navigate('/citizen/report/evidence');
  };

  return (
    <main className="flex-grow pt-8 pb-24 px-6 md:px-margin-desktop max-w-container-max mx-auto w-full flex flex-col items-center justify-center">
      {/* Back Link */}
      <div className="w-full max-w-xl mb-6">
        <button
          onClick={() => navigate('/citizen/report/method')}
          className="inline-flex items-center gap-1.5 text-brand-indigo hover:text-brand-violet font-label-md text-sm font-semibold transition-colors group cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span> {t('reporting.common.back')}
        </button>
      </div>

      {/* Container */}
      <div className="w-full max-w-xl bg-white border border-outline-variant rounded-2xl p-8 shadow-sm">

        <div className="text-center mb-6">
          <span className="font-label-sm text-brand-violet uppercase tracking-widest text-xs font-bold bg-surface-container-low px-4 py-1.5 rounded-full border border-outline-variant/40 inline-block mb-3">
            {t('reporting.text.stepTag')}
          </span>

          <h1 className="font-display-lg text-brand-indigo text-3xl font-extrabold mb-2">
            {t('reporting.text.title')}
          </h1>

          <p className="font-body-lg text-on-surface-variant text-base">
            {t('reporting.text.subtitle')}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-xl bg-error-container text-on-error-container text-xs font-semibold mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm shrink-0">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Text Area */}
        <div className="mb-2">
          <textarea
            className="w-full h-44 p-4 rounded-xl border-2 border-outline-variant bg-surface-container-lowest focus:border-brand-violet focus:ring-4 focus:ring-brand-violet/10 transition-all font-body-md text-on-surface text-base leading-relaxed resize-none"
            placeholder={t('reporting.text.placeholder')}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (error && e.target.value.trim().length >= minLength) setError('');
            }}
          />
        </div>

        {/* Character Counter */}
        <div className="flex items-center justify-between text-xs text-on-surface-variant mb-6 px-1">
          <span className="text-[11px]">{t('reporting.text.hint')}</span>
          <span className={`font-mono font-semibold ${charCount < minLength ? 'text-on-surface-variant/70' : 'text-brand-teal font-bold'}`}>
            {charCount} chars {charCount >= minLength && '✓'}
          </span>
        </div>

        {/* Equal Voice Alternative Banner */}
        <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/40 flex items-center justify-between mb-8">
          <span className="text-xs font-semibold text-on-surface-variant">{t('reporting.text.preferVoice')}</span>
          <button
            onClick={() => navigate('/citizen/report/voice')}
            className="bg-white border border-outline-variant text-brand-indigo px-4 py-2 rounded-full font-label-md text-xs font-bold hover:border-brand-violet hover:text-brand-violet transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">mic</span> {t('reporting.text.recordVoiceBtn')}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/citizen/report/method')}
            className="w-1/3 border border-outline-variant text-on-surface-variant py-3.5 rounded-full font-label-md font-semibold text-sm hover:border-brand-indigo transition-colors text-center cursor-pointer"
          >
            {t('reporting.common.back')}
          </button>
          <button
            onClick={handleContinue}
            className="w-2/3 bg-brand-indigo text-white py-3.5 rounded-full font-label-md font-semibold text-sm hover:bg-brand-violet transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{t('reporting.text.continue')}</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>

      </div>
    </main>
  );
}
