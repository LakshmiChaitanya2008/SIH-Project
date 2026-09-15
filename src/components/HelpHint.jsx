import { useSelector, useDispatch } from 'react-redux'
import { setHelpModal } from '../features/app/appSlice'

export default function HelpHint() {
  const dispatch = useDispatch()
  const { helpModalOpen } = useSelector(s => s.app)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!helpModalOpen && (
        <button
          className="flex items-center gap-2 bg-brand-indigo text-white px-4 py-2.5 rounded-full font-label-md text-xs font-semibold shadow-lg hover:bg-brand-violet transition-all active:scale-95"
          onClick={() => dispatch(setHelpModal(true))}
        >
          <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">?</span>
          <span>Need help?</span>
        </button>
      )}

      {helpModalOpen && (
        <div className="fixed inset-0 bg-brand-indigo/30 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full border border-outline-variant shadow-2xl relative">
            <button className="absolute top-4 right-4 text-outline hover:text-brand-indigo text-2xl" onClick={() => dispatch(setHelpModal(false))}>
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="w-12 h-12 rounded-xl bg-surface-container-low text-brand-violet flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-3xl">help_center</span>
            </div>

            <h3 className="font-headline-md text-brand-indigo text-xl font-bold mb-4">How to report a problem</h3>

            <div className="space-y-4 text-sm text-on-surface-variant leading-relaxed">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-brand-teal text-xl shrink-0 mt-0.5">check_circle</span>
                <p>You can simply describe what you noticed in your village or neighborhood.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-brand-teal text-xl shrink-0 mt-0.5">check_circle</span>
                <p>You can speak or write in your own natural words in Hindi, English, or Telugu.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-brand-teal text-xl shrink-0 mt-0.5">check_circle</span>
                <p>You do <strong>not</strong> need to know which government department is responsible. SamadhanSetu's AI will organize it automatically.</p>
              </div>
            </div>

            <button
              className="w-full bg-brand-indigo text-white py-3 rounded-full font-label-md text-sm font-semibold hover:bg-brand-violet transition-all mt-6"
              onClick={() => dispatch(setHelpModal(false))}
            >
              Got it, thank you
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
