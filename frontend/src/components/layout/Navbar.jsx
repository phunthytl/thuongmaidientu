import { useState, useEffect } from 'react';
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
import { api } from '../../services/api';
import '../../assets/css/Home.css';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getItemCount } = useCartStore();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  // Autocomplete logic
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchKeyword.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await api.get(`/search/suggestions?keyword=${searchKeyword}`);
        // Kiem tra status 200 theo ApiResponse.java
        if (response.data.status === 200) {
          setSuggestions(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchKeyword]);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setShowSuggestions(false);
      navigate(`/search?keyword=${searchKeyword}`);
    }
  };

  const handleSuggestionClick = (url) => {
    setSearchKeyword('');
    setSuggestions([]);
    setShowSuggestions(false);
    navigate(url);
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
        <li><Link to="/services">Hỗ trợ</Link></li>
      </ul>
      <div className="nav-actions">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Tìm kiếm xe..." 
            autoComplete="off"
            value={searchKeyword}
            onChange={(e) => {
              setSearchKeyword(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={handleSearch}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onFocus={() => setShowSuggestions(true)}
          />
          
          {showSuggestions && suggestions.length > 0 && (
            <div className="search-suggestions">
              {suggestions.map((item, index) => (
                <div 
                  key={index} 
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(item.url)}
                >
                  <div className="suggestion-info">
                    <span className="suggestion-name">{item.name}</span>
                    <span className="suggestion-type">
                      {item.type === 'OTO' ? 'Ô tô' : item.type === 'PHU_KIEN' ? 'Phụ kiện' : 'Dịch vụ'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
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
                    <Link to="/admin"><FaCar /> Trang quản trị</Link>
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
