import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import '../../assets/css/AdminLayout.css';

const Menus = [
    { name: 'Tổng Quan', path: '/admin' },
    {
        name: 'Sản Phẩm',
        path: '/admin/products',
        hasSubs: true,
        subs: [
            { name: 'Ô tô', path: '/admin/products' },
            { name: 'Phụ kiện', path: '/admin/products/accessories' },
        ]
    },
    { name: 'Dịch Vụ', path: '/admin/services' },
    { name: 'Đơn Hàng', path: '/admin/orders' },
    { name: 'Khách Hàng', path: '/admin/customers' },
    { name: 'Đánh Giá', path: '/admin/reviews' },
    { name: 'Khiếu Nại', path: '/admin/disputes' },
    { name: 'Kho Hàng', path: '/admin/warehouse' },
    { name: 'Tin Nhắn', path: '/admin/messages' },
];

export default function MinimalistAdminLayout() {
    const { logout, user } = useAuthStore();
    const location = useLocation();
    // Giữ menu mở nếu đang ở trong url products
    const [openSub, setOpenSub] = useState(
        location.pathname.startsWith('/admin/products') ? 'Sản Phẩm' : ''
    );

    const toggleSub = (menuName, hasSubs) => {
        if (hasSubs) {
            setOpenSub(openSub === menuName ? '' : menuName);
        }
    };

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
                        <div key={menu.name} className="admin-menu-group">
                            {menu.hasSubs ? (
                                <>
                                    <div
                                        className={`admin-nav-item parent-item ${location.pathname.startsWith(menu.path) ? 'active' : ''}`}
                                        onClick={() => toggleSub(menu.name, menu.hasSubs)}
                                    >
                                        {menu.name}
                                        <span className={`caret ${openSub === menu.name ? 'open' : ''}`}>▾</span>
                                    </div>
                                    {openSub === menu.name && (
                                        <div className="admin-sub-menu">
                                            {menu.subs.map(sub => (
                                                <NavLink
                                                    key={sub.name}
                                                    to={sub.path}
                                                    end={sub.path === '/admin/products'} // end strictly for pure /products
                                                    className={({ isActive }) => `admin-nav-item sub-item ${isActive ? 'active' : ''}`}
                                                >
                                                    {sub.name}
                                                </NavLink>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <NavLink
                                    to={menu.path}
                                    end={menu.path === '/admin'}
                                    className={({ isActive }) =>
                                        `admin-nav-item ${isActive ? 'active' : ''}`
                                    }
                                >
                                    {menu.name}
                                </NavLink>
                            )}
                        </div>
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
