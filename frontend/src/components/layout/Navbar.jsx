import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaCar, 
  FaShoppingCart, 
  FaUser, 
  FaSearch, 
  FaChevronDown,
  FaSignOutAlt,
  FaListAlt,
  FaUserCircle
} from 'react-icons/fa';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import '../../assets/css/Home.css';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getItemCount } = useCartStore();
  const [searchKeyword, setSearchKeyword] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      navigate(`/products?keyword=${searchKeyword}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'inherit' }}>
          <FaCar className="logo-icon" />
          <span className="logo-text">CarSales</span>
        </Link>
      </div>
      <ul className="nav-links">
        <li><Link to="/">Trang chủ</Link></li>
        <li className="dropdown">
          <Link to="/products">Sản phẩm <FaChevronDown className="drop-icon" /></Link>
          <ul className="dropdown-menu">
            <li><Link to="/products">Ô tô</Link></li>
            <li><Link to="/accessories">Phụ kiện</Link></li>
          </ul>
        </li>
        <li><Link to="/services">Dịch vụ</Link></li>
        <li><Link to="/support">Hỗ trợ</Link></li>
      </ul>
      <div className="nav-actions">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Tìm kiếm xe..." 
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
        <div className="icon-btns">
          <Link to="/cart" className="icon-btn">
            <FaShoppingCart />
            <span className="badge">{getItemCount()}</span>
          </Link>
          
          {isAuthenticated ? (
            <div className="dropdown user-dropdown">
              <div className="icon-btn">
                <FaUser />
              </div>
              <ul className="dropdown-menu align-right">
                <li className="user-info-header">
                  <strong>{user?.hoTen}</strong>
                  <span>{user?.email}</span>
                </li>
                <hr />
                <li>
                  <Link to="/profile"><FaUserCircle /> Thông tin cá nhân</Link>
                </li>
                <li>
                  <Link to="/my-orders"><FaListAlt /> Đơn hàng của tôi</Link>
                </li>
                {user?.vaiTro !== 'KHACH_HANG' && (
                  <li>
                    <Link to="/admin/dashboard"><FaCar /> Trang quản trị</Link>
                  </li>
                )}
                <hr />
                <li>
                  <button onClick={handleLogout} className="logout-btn">
                    <FaSignOutAlt /> Đăng xuất
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <Link to="/login" className="icon-btn">
              <FaUser />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
