import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import '../../assets/css/DangNhap.css';

export default function DangNhap() {
    const [credentials, setCredentials] = useState({ email: '', matKhau: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await api.post('/auth/dang-nhap', {
                email: credentials.email,
                matKhau: credentials.matKhau
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
        <div className="login-container modern-admin-login">
            <div className="login-split-layout">
                {/* Left Side - Geometric/Brand Design */}
                <div className="login-visual-side">
                    <div className="visual-content">
                        <div className="brand-badge-login">CARSHOP</div>
                        <h1>Nền Tảng Quản Trị Cấp Cao.</h1>
                        <p>Trung tâm điều hành và phân tích dữ liệu kinh doanh ô tô trực tuyến.</p>

                        <div className="abstract-shapes">
                            <div className="shape shape-1"></div>
                            <div className="shape shape-2"></div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="login-form-side">
                    <div className="login-wrapper">
                        <div className="login-header">
                            <h2>Đăng Nhập</h2>
                            <p>Sử dụng tài khoản nhân sự được cấp để truy cập hệ thống CarShop.</p>
                        </div>

                        {error && (
                            <div className="system-alert error-alert">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="login-form">
                            <div className="input-group">
                                <label htmlFor="email">Email Hệ Thống</label>
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

                            <div className="input-group">
                                <label htmlFor="matKhau">Cổng Bảo Mật (Mật Khẩu)</label>
                                <input
                                    id="matKhau"
                                    type="password"
                                    name="matKhau"
                                    placeholder="••••••••"
                                    value={credentials.matKhau}
                                    onChange={handleChange}
                                    required
                                    autoComplete="current-password"
                                    disabled={loading}
                                />
                            </div>

                            <button
                                type="submit"
                                className={`login-button ${loading ? 'loading' : ''}`}
                                disabled={loading}
                            >
                                {loading ? 'Đang Xác Thực...' : 'Truy Cập Trung Tâm Điều Hành'}
                            </button>
                        </form>

                        <div className="login-footer">
                            <p>Bạn gặp sự cố? <a href="#">Liên hệ IT Support</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
