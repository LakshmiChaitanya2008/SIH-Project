export default function CollaborationsView() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-[#FAF8FF] via-white to-[#F6F3FB] text-on-surface">

      <main className="flex-grow pt-8 pb-20 px-6 md:px-margin-desktop max-w-[1240px] mx-auto w-full space-y-8">

        {/* Header */}
        <div className="space-y-2 border-b border-outline-variant/60 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-brand-violet uppercase tracking-widest bg-brand-violet/10 border border-brand-violet/20 px-3 py-1 rounded-full">
                ECOSYSTEM NETWORK
              </span>
              <span className="text-xs text-on-surface-variant font-semibold">• Ranchi University</span>
            </div>
            <h1 className="font-display-lg text-brand-indigo text-3xl sm:text-4xl font-extrabold tracking-tight">
              Project Collaborations
            </h1>
            <p className="text-xs text-on-surface-variant">External experts, government stakeholders, and research partners supporting university projects.</p>
          </div>

          <button className="bg-brand-indigo text-white px-5 py-2.5 rounded-full font-label-md text-xs font-bold hover:bg-brand-violet transition-all cursor-pointer shadow-2xs flex items-center gap-1.5 shrink-0">
            <span className="material-symbols-outlined text-base">person_add</span>
            <span>Invite Collaborator</span>
          </button>
        </div>

        {/* COLLABORATION CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* CARD 1 */}
          <div className="bg-white p-6 rounded-2xl border border-outline-variant/70 shadow-2xs space-y-4">
            <div className="w-10 h-10 rounded-full bg-brand-indigo/10 text-brand-indigo font-bold flex items-center justify-center text-sm">
              AK
            </div>
            <div>
              <h3 className="font-bold text-brand-indigo text-base">Dr. Anjali Kumar</h3>
              <p className="text-xs text-on-surface-variant font-medium">Faculty Mentor • Dept. of Environmental Engineering</p>
            </div>
            <span className="text-[10px] font-bold text-brand-violet bg-brand-violet/10 px-2.5 py-1 rounded-full inline-block">Internal Mentor</span>
          </div>

          {/* CARD 2 */}
          <div className="bg-white p-6 rounded-2xl border border-outline-variant/70 shadow-2xs space-y-4">
            <div className="w-10 h-10 rounded-full bg-brand-teal/10 text-brand-teal font-bold flex items-center justify-center text-sm">
              WR
            </div>
            <div>
              <h3 className="font-bold text-brand-indigo text-base">Water Research Lab</h3>
              <p className="text-xs text-on-surface-variant font-medium">Institutional Research Partner</p>
            </div>
            <span className="text-[10px] font-bold text-brand-teal bg-brand-teal/10 px-2.5 py-1 rounded-full inline-block">Research Lab</span>
          </div>

          {/* CARD 3 */}
          <div className="bg-white p-6 rounded-2xl border border-outline-variant/70 shadow-2xs space-y-4">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-800 font-bold flex items-center justify-center text-sm">
              PH
            </div>
            <div>
              <h3 className="font-bold text-brand-indigo text-base">Public Health Dept., Gumla</h3>
              <p className="text-xs text-on-surface-variant font-medium">Community & Government Stakeholder</p>
            </div>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-500/10 px-2.5 py-1 rounded-full inline-block">Govt Partner</span>
          </div>

        </div>

      </main>

    </div>
  );
}
