import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import '../../assets/css/Login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [matKhau, setMatKhau] = useState('');
    const { login, isLoading, error } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, matKhau, 'ADMIN_SIDE');
            navigate('/admin');
        } catch (err) {
            console.error('Login failed', err);
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-box">
                <h2>Đăng Nhập Quản Trị</h2>
                {error && <div className="admin-login-error">{error}</div>}
                
                <form onSubmit={handleSubmit} className="admin-login-form">
                    <div className="admin-login-group">
                        <label htmlFor="email">Tài khoản (Email)</label>
                        <input
                            type="email"
                            id="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Nhập email..."
                        />
                    </div>
                    
                    <div className="admin-login-group">
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            required
                            value={matKhau}
                            onChange={(e) => setMatKhau(e.target.value)}
                            placeholder="Nhập mật khẩu..."
                        />
                    </div>
                    
                    <button type="submit" disabled={isLoading} className="admin-login-btn">
                        {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </button>
                </form>
            </div>
        </div>
    );
}
