import { Outlet, NavLink } from 'react-router-dom';

const Menus = [
  { name: 'Dashboard', path: '/admin' },
  { name: 'Inventory', path: '/admin/products' },
  { name: 'Orders', path: '/admin/orders' },
  { name: 'Clients', path: '/admin/clients' },
];

export default function MinimalistAdminLayout() {
  return (
    <div className="min-h-screen bg-brand-surface flex">
      {/* Sidebar - Sharp, no border, just a plain dark slate panel or clean white with a 1px right border */}
      <aside className="w-64 bg-brand-base border-r border-[#e5e5e5] h-screen sticky top-0 flex flex-col">
        <div className="p-8 border-b border-[#e5e5e5]">
          <h1 className="text-2xl font-serif font-bold text-brand-dark tracking-widest uppercase">
            Autovanguard
          </h1>
          <p className="text-xs tracking-[0.2em] text-brand-muted mt-2 uppercase">Systems Core</p>
        </div>
        
        <nav className="flex-1 pt-8 px-4 flex flex-col gap-2">
          {Menus.map((menu) => (
            <NavLink
              key={menu.name}
              to={menu.path}
              end={menu.path === '/admin'}
              className={({ isActive }) =>
                `px-4 py-3 text-sm tracking-wide transition-all duration-300 border-l-2 ${
                  isActive 
                  ? 'border-brand-dark text-brand-dark font-medium bg-[#f5f5f5]' 
                  : 'border-transparent text-gray-500 hover:text-brand-dark hover:bg-gray-50'
                }`
              }
            >
              {menu.name}
            </NavLink>
          ))}
        </nav>
        
        <div className="p-6 border-t border-[#e5e5e5]">
          <button className="text-xs uppercase tracking-widest text-brand-accent hover:text-brand-dark transition-colors duration-300">
            Sign Out &rarr;
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
