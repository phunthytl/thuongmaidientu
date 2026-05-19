import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  FaCar,
  FaArrowLeft,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaFacebookF,
  FaExclamationCircle,
} from 'react-icons/fa';
import { useAuthStore } from '../../stores/authStore';
import '../../assets/css/Login.css';

export default function ClientLogin() {
  const [email, setEmail] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, matKhau, 'CLIENT_SIDE');
      navigate(location.state?.from?.pathname || '/', { replace: true });
    } catch (err) {
      console.error('Login failed', err);
    }
  };

  return (
    <div className="login-page">
      {/* LEFT — FORM */}
      <div className="login-left">
        <div className="login-form-wrapper">
          <div className="login-brand">
            <FaCar />
            <span>CarShop</span>
          </div>

          <h1>Chào mừng trở lại</h1>
          <p className="login-subtitle">
            Đăng nhập để tiếp tục hành trình tìm xế yêu của bạn.
          </p>

          {error && (
            <div className="error-msg">
              <FaExclamationCircle />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="email">Địa chỉ Email</label>
              <div className="input-wrapper">
                <FaEnvelope className="input-icon" />
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  value={matKhau}
                  onChange={(e) => setMatKhau(e.target.value)}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-wrapper">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Ghi nhớ tôi
              </label>
              <Link to="/quen-mat-khau" className="forgot-link">
                Quên mật khẩu?
              </Link>
            </div>

            <button type="submit" disabled={isLoading} className="login-btn">
              {isLoading ? 'Đang xử lý...' : 'Đăng Nhập'}
            </button>
          </form>

          <div className="login-divider">
            <span>Hoặc đăng nhập với</span>
          </div>

          <div className="social-buttons">
            <button type="button" className="social-btn">
              <FaGoogle style={{ color: '#ea4335' }} /> Google
            </button>
            <button type="button" className="social-btn">
              <FaFacebookF style={{ color: '#1877f2' }} /> Facebook
            </button>
          </div>

          <div className="login-footer">
            Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
          </div>

          <Link to="/" className="back-home">
            <FaArrowLeft /> Quay lại trang chủ
          </Link>
        </div>
      </div>

      {/* RIGHT — IMAGE */}
      <div className="login-right">
        <div
          className="login-right-image"
          style={{
            backgroundImage:
              'url(/demo-images/cars/005-mercedes-c200-avantgarde.jpg)',
          }}
        />
        <div className="login-right-overlay">
          <span className="badge">Premium Auto Marketplace</span>
          <h2>
            Tìm chiếc xe của
            <br />
            cuộc đời bạn.
          </h2>
          <p>
            Hàng nghìn mẫu xe từ các thương hiệu hàng đầu, dịch vụ chăm sóc
            tận tâm và quy trình mua bán minh bạch — tất cả tại CarShop.
          </p>
          <div className="feature-list">
            <div className="feature-item">
              <span className="num">10K+</span>
              <span className="label">Xe đã bán</span>
            </div>
            <div className="feature-item">
              <span className="num">50+</span>
              <span className="label">Thương hiệu</span>
            </div>
            <div className="feature-item">
              <span className="num">98%</span>
              <span className="label">Khách hài lòng</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
