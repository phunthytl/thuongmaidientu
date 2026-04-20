import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaCar, FaArrowLeft } from 'react-icons/fa';
import { useAuthStore } from '../../stores/authStore';
import '../../assets/css/Login.css';

export default function ClientLogin() {
  const [email, setEmail] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, matKhau, 'CLIENT_SIDE');
      navigate('/');
    } catch (err) {
      console.error('Login failed', err);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo"><FaCar /></div>
        <h1>Chào mừng trở lại</h1>
        <p className="login-subtitle">Đăng nhập vào tài khoản CarSales của bạn</p>
        
        {error && (
          <div className="error-msg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Địa chỉ Email</label>
            <input 
              type="email" 
              placeholder="name@example.com"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>Mật khẩu</label>
            <input 
              type="password" 
              placeholder="••••••••"
              required
              value={matKhau}
              onChange={e => setMatKhau(e.target.value)}
            />
          </div>
          
          <button 
            type="submit"
            disabled={isLoading}
            className="login-btn"
          >
            {isLoading ? 'Đang xử lý...' : 'Đăng Nhập'}
          </button>
        </form>
        
        <div className="login-footer">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </div>
        <div style={{marginTop: '1rem'}}>
            <Link to="/" style={{fontSize: '0.8rem', color: '#999', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px'}}>
                <FaArrowLeft /> Quay lại trang chủ
            </Link>
        </div>
      </div>
    </div>
  );
}
