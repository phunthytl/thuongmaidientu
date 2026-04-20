import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaCar, FaArrowLeft } from 'react-icons/fa';
import { useAuthStore } from '../../stores/authStore';
import '../../assets/css/Login.css';

export default function DangKy() {
  const [formData, setFormData] = useState({
    hoTen: '',
    email: '',
    matKhau: '',
    xacNhanMatKhau: '',
    soDienThoai: ''
  });
  const { register, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.matKhau !== formData.xacNhanMatKhau) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }

    try {
      await register({
        hoTen: formData.hoTen,
        email: formData.email,
        matKhau: formData.matKhau,
        soDienThoai: formData.soDienThoai
      });
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (err) {
      console.error('Registration failed', err);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo"><FaCar /></div>
        <h1>Tạo tài khoản mới</h1>
        <p className="login-subtitle">Gia nhập cộng đồng CarSales ngay hôm nay</p>
        
        {error && (
          <div className="error-msg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Họ và tên</label>
            <input 
              type="text" 
              name="hoTen"
              placeholder="Nguyễn Văn A"
              required
              value={formData.hoTen}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Số điện thoại</label>
            <input 
              type="tel" 
              name="soDienThoai"
              placeholder="0912 345 678"
              required
              value={formData.soDienThoai}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Địa chỉ Email</label>
            <input 
              type="email" 
              name="email"
              placeholder="name@example.com"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label>Mật khẩu</label>
            <input 
              type="password" 
              name="matKhau"
              placeholder="••••••••"
              required
              value={formData.matKhau}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Xác nhận mật khẩu</label>
            <input 
              type="password" 
              name="xacNhanMatKhau"
              placeholder="••••••••"
              required
              value={formData.xacNhanMatKhau}
              onChange={handleChange}
            />
          </div>
          
          <button 
            type="submit"
            disabled={isLoading}
            className="login-btn"
          >
            {isLoading ? 'Đang xử lý...' : 'Đăng Ký Tài Khoản'}
          </button>
        </form>
        
        <div className="login-footer">
          Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
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
