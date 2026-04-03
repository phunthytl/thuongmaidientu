export default function Products() {
  const inventory = [
    { id: 'VOX-11', model: 'Porsche 911 GT3 RS', category: 'Car', price: '$225,000', stock: 2, status: 'DANG_BAN' },
    { id: 'VOX-12', model: 'Ceramic Coating Kit Pro', category: 'Accessory', price: '$250', stock: 154, status: 'DANG_BAN' },
    { id: 'VOX-13', model: 'BMW M5 Competition', category: 'Car', price: '$130,000', stock: 0, status: 'NGUNG_BAN' },
    { id: 'VOX-14', model: 'Full Detailing Service', category: 'Service', price: '$850', stock: 999, status: 'DANG_BAN' },
    { id: 'VOX-15', model: 'Mercedes-AMG G 63', category: 'Car', price: '$179,000', stock: 1, status: 'DAT_TRUOC' },
  ];

  return (
    <div className="animate-in fade-in duration-700 ease-out">
      <header className="mb-12 flex justify-between items-end border-b border-[#e5e5e5] pb-6">
        <div>
          <h2 className="text-xs uppercase tracking-[0.3em] text-brand-accent mb-2">Inventory Module</h2>
          <h1 className="text-4xl font-serif text-brand-dark">Product Database</h1>
        </div>
        <div>
          <button className="bg-brand-dark text-white text-xs tracking-[0.2em] font-medium uppercase px-8 py-4 hover:bg-brand-accent transition-colors duration-300">
            Add New Asset
          </button>
        </div>
      </header>

      {/* Typography Brutalism Table */}
      <div className="w-full bg-brand-base border border-[#e5e5e5]">
        <div className="grid grid-cols-12 gap-4 border-b border-[#e5e5e5] p-6 bg-[#fafafa] text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500">
          <div className="col-span-2">Ref ID</div>
          <div className="col-span-4">Asset Name</div>
          <div className="col-span-2">Class</div>
          <div className="col-span-2 font-mono">Valuation</div>
          <div className="col-span-2 text-right">Status</div>
        </div>

        {/* List */}
        <div>
          {inventory.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-4 p-6 border-b border-[#e5e5e5] items-center hover:bg-[#fafafa] transition-colors group cursor-pointer last:border-0">
              <div className="col-span-2 text-xs font-mono text-gray-500 group-hover:text-brand-dark transition-colors">{item.id}</div>
              <div className="col-span-4 text-base font-serif text-brand-dark">{item.model}</div>
              <div className="col-span-2 text-xs text-brand-muted uppercase tracking-[0.1em]">{item.category}</div>
              <div className="col-span-2 text-sm text-brand-dark font-mono">{item.price}</div>
              <div className="col-span-2 text-right">
                <span className={`inline-block px-3 py-1.5 text-[10px] uppercase font-bold tracking-widest ${
                  item.status === 'DANG_BAN' ? 'bg-[#f0f9f0] text-green-700' : 
                  item.status === 'DAT_TRUOC' ? 'bg-[#fff9e6] text-[#b38600]' :
                  'bg-[#fdf0f0] text-red-700'
                }`}>
                  {item.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
