import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaCar,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaExclamationCircle,
  FaShieldAlt,
} from 'react-icons/fa';
import { api } from '../../services/api';
import '../../assets/css/DangNhap.css';

export default function DangNhap() {
  const [credentials, setCredentials] = useState({ email: '', matKhau: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/dang-nhap', {
        email: credentials.email,
        matKhau: credentials.matKhau,
      });

      if (res.data?.data?.accessToken) {
        localStorage.setItem('access_token', res.data.data.accessToken);
        if (res.data.data.refreshToken) {
          localStorage.setItem('refresh_token', res.data.data.refreshToken);
        }
        navigate('/admin');
      } else {
        setError('Email hoặc mật khẩu không chính xác.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi hệ thống. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <FaCar />
          <span>CarShop</span>
        </div>

        <div className="admin-badge">
          <FaShieldAlt /> Quản trị hệ thống
        </div>

        <h1>Đăng nhập</h1>
        <p className="admin-login-subtitle">
          Truy cập bằng tài khoản nhân sự được cấp.
        </p>

        {error && (
          <div className="admin-error-msg">
            <FaExclamationCircle />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} noValidate>
          <div className="admin-form-group">
            <label htmlFor="email">Email</label>
            <div className="admin-input-wrapper">
              <FaEnvelope className="admin-input-icon" />
              <input
                id="email"
                type="email"
                name="email"
                placeholder="nhanvien@carshop.com"
                value={credentials.email}
                onChange={handleChange}
                required
                autoComplete="email"
                disabled={loading}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label htmlFor="matKhau">Mật khẩu</label>
            <div className="admin-input-wrapper">
              <FaLock className="admin-input-icon" />
              <input
                id="matKhau"
                type={showPassword ? 'text' : 'password'}
                name="matKhau"
                placeholder="••••••••"
                value={credentials.matKhau}
                onChange={handleChange}
                required
                autoComplete="current-password"
                disabled={loading}
              />
              <button
                type="button"
                className="admin-password-toggle"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                tabIndex={-1}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="admin-login-btn"
            disabled={loading}
          >
            {loading ? 'Đang xác thực...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="admin-login-footer">
          Gặp sự cố? <a href="mailto:it-support@carshop.com">Liên hệ IT Support</a>
        </div>
      </div>
    </div>
  );
}
