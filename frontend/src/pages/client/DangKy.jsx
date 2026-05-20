import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FaCar,
  FaArrowLeft,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUser,
  FaPhone,
  FaGoogle,
  FaFacebookF,
  FaExclamationCircle,
} from 'react-icons/fa';
import { useAuthStore } from '../../stores/authStore';
import '../../assets/css/Login.css';

function checkPasswordStrength(pwd) {
  if (!pwd) return { score: 0, label: '', cls: '' };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
  if (/\d/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const map = [
    { label: '', cls: '' },
    { label: 'Yếu', cls: 'weak' },
    { label: 'Trung bình', cls: 'fair' },
    { label: 'Tốt', cls: 'good' },
    { label: 'Mạnh', cls: 'strong' },
  ];
  return { score, ...map[score] };
}

export default function DangKy() {
  const [formData, setFormData] = useState({
    hoTen: '',
    email: '',
    matKhau: '',
    xacNhanMatKhau: '',
    soDienThoai: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [localError, setLocalError] = useState('');
  const { register, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const strength = useMemo(
    () => checkPasswordStrength(formData.matKhau),
    [formData.matKhau]
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (localError) setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (formData.matKhau !== formData.xacNhanMatKhau) {
      setLocalError('Mật khẩu xác nhận không khớp!');
      return;
    }
    if (strength.score < 2) {
      setLocalError('Mật khẩu quá yếu. Hãy dùng ít nhất 8 ký tự, có chữ hoa và số.');
      return;
    }
    if (!agreed) {
      setLocalError('Bạn cần đồng ý với Điều khoản & Chính sách bảo mật.');
      return;
    }

    try {
      await register({
        hoTen: formData.hoTen,
        email: formData.email,
        matKhau: formData.matKhau,
        soDienThoai: formData.soDienThoai,
      });
      navigate('/login');
    } catch (err) {
      console.error('Registration failed', err);
    }
  };

  const displayError = localError || error;

  return (
    <div className="login-page">
      {/* LEFT — FORM */}
      <div className="login-left">
        <div className="login-form-wrapper">
          <div className="login-brand">
            <FaCar />
            <span>CarShop</span>
          </div>

          <h1>Tạo tài khoản</h1>
          <p className="login-subtitle">
            Đăng ký miễn phí — chỉ mất vài giây để bắt đầu.
          </p>

          {displayError && (
            <div className="error-msg">
              <FaExclamationCircle />
              <span>{displayError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="hoTen">Họ và tên</label>
              <div className="input-wrapper">
                <FaUser className="input-icon" />
                <input
                  id="hoTen"
                  type="text"
                  name="hoTen"
                  placeholder="Nguyễn Văn A"
                  required
                  autoComplete="name"
                  value={formData.hoTen}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="soDienThoai">Số điện thoại</label>
              <div className="input-wrapper">
                <FaPhone className="input-icon" />
                <input
                  id="soDienThoai"
                  type="tel"
                  name="soDienThoai"
                  placeholder="0912 345 678"
                  required
                  autoComplete="tel"
                  pattern="[0-9\s]{9,15}"
                  value={formData.soDienThoai}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Địa chỉ Email</label>
              <div className="input-wrapper">
                <FaEnvelope className="input-icon" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="matKhau">Mật khẩu</label>
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  id="matKhau"
                  type={showPassword ? 'text' : 'password'}
                  name="matKhau"
                  placeholder="Tối thiểu 8 ký tự"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={formData.matKhau}
                  onChange={handleChange}
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
              {formData.matKhau && (
                <div className="password-strength">
                  <div className="strength-bars">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={
                          'strength-bar' +
                          (i <= strength.score ? ' active-' + strength.cls : '')
                        }
                      />
                    ))}
                  </div>
                  <span className={'strength-label ' + strength.cls}>
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="xacNhanMatKhau">Xác nhận mật khẩu</label>
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  id="xacNhanMatKhau"
                  type={showConfirm ? 'text' : 'password'}
                  name="xacNhanMatKhau"
                  placeholder="Nhập lại mật khẩu"
                  required
                  autoComplete="new-password"
                  value={formData.xacNhanMatKhau}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirm((s) => !s)}
                  aria-label={showConfirm ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="form-options" style={{ marginBottom: '1.25rem' }}>
              <label className="checkbox-wrapper" style={{ alignItems: 'flex-start' }}>
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  style={{ marginTop: '2px' }}
                />
                <span style={{ fontSize: '0.85rem', lineHeight: 1.4 }}>
                  Tôi đồng ý với{' '}
                  <Link to="/dieu-khoan" className="forgot-link">
                    Điều khoản
                  </Link>{' '}
                  và{' '}
                  <Link to="/chinh-sach-bao-mat" className="forgot-link">
                    Chính sách bảo mật
                  </Link>
                  .
                </span>
              </label>
            </div>

            <button type="submit" disabled={isLoading} className="login-btn">
              {isLoading ? 'Đang xử lý...' : 'Đăng Ký Tài Khoản'}
            </button>
          </form>

          <div className="login-divider">
            <span>Hoặc đăng ký với</span>
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
            Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
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
              'url(https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=85)',
          }}
        />
        <div className="login-right-overlay">
          <span className="badge">Bắt đầu hành trình</span>
          <h2>
            Gia nhập cộng đồng
            <br />
            yêu xe hàng đầu.
          </h2>
          <p>
            Tạo tài khoản để lưu xe yêu thích, đặt lịch lái thử và nhận ưu đãi
            độc quyền dành riêng cho thành viên CarShop.
          </p>
          <div className="feature-list">
            <div className="feature-item">
              <span className="num">10K+</span>
              <span className="label">Thành viên</span>
            </div>
            <div className="feature-item">
              <span className="num">24/7</span>
              <span className="label">Hỗ trợ</span>
            </div>
            <div className="feature-item">
              <span className="num">100%</span>
              <span className="label">Miễn phí</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
