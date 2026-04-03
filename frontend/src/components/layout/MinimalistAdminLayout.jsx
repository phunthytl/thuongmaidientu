import { Outlet, NavLink } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import '../../assets/css/AdminLayout.css';

const Menus = [
  { name: 'Tổng Quan', path: '/admin' },
  { name: 'Sản Phẩm', path: '/admin/products' },
  { name: 'Đơn Hàng', path: '/admin/orders' },
  { name: 'Khách Hàng', path: '/admin/clients' },
];

export default function MinimalistAdminLayout() {
  const { logout, user } = useAuthStore();

  return (
    <div className="admin-layout-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h1 className="admin-sidebar-brand">
            CarShop
          </h1>
          <p className="admin-sidebar-subtitle">Quản Trị Hệ Thống</p>
        </div>
        
        <nav className="admin-sidebar-nav">
          {Menus.map((menu) => (
            <NavLink
              key={menu.name}
              to={menu.path}
              end={menu.path === '/admin'}
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? 'active' : ''}`
              }
            >
              {menu.name}
            </NavLink>
          ))}
        </nav>
        
        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <span>Nhân sự:</span> {user?.hoTen || 'Chưa rõ'}
          </div>
          <button onClick={logout} className="admin-logout-btn">
            Đăng Xuất &rarr;
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main-content">
        <div className="admin-content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
