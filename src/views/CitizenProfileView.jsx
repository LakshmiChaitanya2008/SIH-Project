import { useSelector } from 'react-redux'

export default function CitizenProfileView() {
  const user = useSelector(s => s.app.userProfile) || { name: 'Ramesh Sharma', location: 'Gumla District, Jharkhand', phone: '+91 94311 88221' }

  return (
    <main className="flex-grow pt-6 sm:pt-8 pb-20 px-6 md:px-margin-desktop max-w-[900px] mx-auto w-full space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-outline-variant/70 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-outline-variant/40">
          <div className="w-16 h-16 rounded-full bg-brand-indigo text-white flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
            {user.name.charAt(0)}
          </div>

          <div className="space-y-1 flex-grow">
            <div className="flex items-center gap-2">
              <h1 className="font-display-lg text-brand-indigo text-2xl font-extrabold">{user.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-teal/10 text-brand-teal border border-brand-teal/20">Verified Citizen</span>
            </div>
            <p className="text-xs text-on-surface-variant">&#x1F4CD; {user.location} &bull; &#x1F4F1; {user.phone || '+91 94311 88221'}</p>
          </div>

          <button className="border border-error text-error hover:bg-error/10 px-4 py-2 rounded-full font-label-md text-xs font-bold transition-all cursor-pointer shrink-0">
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/50 text-center space-y-1">
            <span className="text-[10px] font-bold text-brand-teal uppercase tracking-widest block">PROBLEMS REPORTED</span>
            <span className="font-display-lg text-brand-indigo text-2xl font-black">{user.reportedCount || 3}</span>
          </div>

          <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/50 text-center space-y-1">
            <span className="text-[10px] font-bold text-brand-violet uppercase tracking-widest block">PATTERNS CLUSTERED</span>
            <span className="font-display-lg text-brand-violet text-2xl font-black">2</span>
          </div>

          <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/50 text-center space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest block">SOLUTIONS DEPLOYED</span>
            <span className="font-display-lg text-emerald-700 text-2xl font-black">{user.resolvedCount || 1}</span>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <h3 className="font-headline-sm text-brand-indigo text-base font-bold">Preferences & Settings</h3>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl border border-outline-variant/50 bg-white flex items-center justify-between">
              <div>
                <span className="font-bold text-brand-indigo block">Preferred Language</span>
                <span className="text-on-surface-variant text-[11px]">Select your primary language for voice and text prompts</span>
              </div>
              <select className="bg-surface-container-low border border-outline-variant rounded-xl px-3 py-1.5 font-semibold text-brand-indigo focus:outline-none">
                <option value="en" defaultValue>English</option>
                <option value="hi">{'हिंदी (Hindi)'}</option>
                <option value="te">{'తెలుగు (Telugu)'}</option>
              </select>
            </div>

            <div className="p-4 rounded-2xl border border-outline-variant/50 bg-white flex items-center justify-between">
              <div>
                <span className="font-bold text-brand-indigo block">Notification Alerts</span>
                <span className="text-on-surface-variant text-[11px]">Receive updates when your reported problems change status</span>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-brand-indigo focus:ring-brand-violet cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
