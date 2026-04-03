export default function Dashboard() {
  return (
    <div className="animate-in fade-in duration-700 ease-out">
      <header className="mb-12 flex justify-between items-end border-b border-[#e5e5e5] pb-6">
        <div>
          <h2 className="text-xs uppercase tracking-[0.3em] text-brand-accent mb-2">Overview</h2>
          <h1 className="text-4xl font-serif text-brand-dark">Executive Summary</h1>
        </div>
        <div className="text-right">
          <p className="text-sm font-sans text-gray-400 uppercase tracking-widest">System Date</p>
          <p className="text-lg font-mono text-brand-dark mt-1">2026-03-27</p>
        </div>
      </header>

      {/* Brutalist KPI Cards - No border radius, solid borders, no shadow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {['Total Assets', 'Pending Deliveries', 'Active Disputes'].map((title, idx) => (
          <div key={idx} className="border border-[#e5e5e5] p-8 bg-brand-base hover:border-brand-dark transition-colors duration-300">
            <h3 className="text-xs text-brand-muted tracking-[0.1em] uppercase mb-6">{title}</h3>
            <p className="text-5xl font-serif text-brand-dark">
              {idx === 0 ? '142' : idx === 1 ? '17' : '3'}
            </p>
            <div className="mt-8 flex items-center text-xs">
              <span className="text-brand-accent tracking-widest uppercase font-mono">+ {idx + 4}% YTD</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Minimalist Table Placeholder for recent activity */}
      <div>
         <h3 className="text-sm uppercase tracking-widest font-sans mb-6 border-b border-[#e5e5e5] pb-4 text-brand-dark">Recent Operations</h3>
         <div className="bg-brand-base border border-[#e5e5e5]">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex justify-between p-6 border-b border-[#e5e5e5] last:border-0 hover:bg-[#fafafa] transition-colors cursor-pointer group">
                <span className="text-xs font-mono text-gray-400 group-hover:text-brand-dark transition-colors">#TRX-00{i}A89</span>
                <span className="text-sm font-serif text-brand-dark w-1/3">Mercedes-Benz S-Class 2026</span>
                <span className="text-xs tracking-widest uppercase text-brand-accent">Awaiting clearance</span>
                <span className="text-xs uppercase tracking-widest">Detail &rarr;</span>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}
