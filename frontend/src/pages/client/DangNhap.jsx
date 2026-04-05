import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

export default function ClientLogin() {
  const [email, setEmail] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // CLIENT_SIDE doesn't strictly block in store if we don't throw, but it's passed here
      await login(email, matKhau, 'CLIENT_SIDE');
      navigate('/');
    } catch (err) {
      console.error('Login failed', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
      <div className="bg-white p-12 lg:p-16 border border-[#e5e5e5] w-full max-w-md">
        <div className="text-center mb-10">
          <p className="text-brand-accent uppercase tracking-[0.3em] text-xs font-bold mb-2">AutoVanguard</p>
          <h1 className="text-2xl font-serif text-brand-dark">Cổng Dành Cho Khách Hàng</h1>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-xs tracking-wider text-center">
            {error}
          </div>
        )}

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="relative">
            <input 
              type="email" 
              className="w-full border-b border-gray-300 py-3 text-brand-dark bg-transparent focus:outline-none focus:border-brand-dark transition-colors peer placeholder-transparent"
              placeholder="Email"
              id="client_email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <label htmlFor="client_email" className="absolute left-0 top-3 text-sm text-gray-400 transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-brand-dark peer-valid:-top-4 peer-valid:text-xs">
              Địa Chỉ Email
            </label>
          </div>
          
          <div className="relative mt-2">
            <input 
              type="password" 
              className="w-full border-b border-gray-300 py-3 text-brand-dark bg-transparent focus:outline-none focus:border-brand-dark transition-colors peer placeholder-transparent"
              placeholder="Password"
              id="client_password"
              required
              value={matKhau}
              onChange={e => setMatKhau(e.target.value)}
            />
            <label htmlFor="client_password" className="absolute left-0 top-3 text-sm text-gray-400 transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-brand-dark peer-valid:-top-4 peer-valid:text-xs">
              Mật Khẩu
            </label>
          </div>
          
          <button 
            type="submit"
            disabled={isLoading}
            className="mt-6 bg-brand-dark text-white py-4 font-medium tracking-widest text-xs hover:bg-brand-accent transition-colors duration-300 disabled:opacity-50"
          >
            {isLoading ? 'Đang Xác Thực...' : 'Đăng Nhập'}
          </button>
        </form>
        
        <div className="mt-8 text-center text-xs text-gray-500 tracking-wide">
          Chưa có tài khoản CarShop? <a href="#" className="underline hover:text-brand-dark">Đăng ký ngay</a>
        </div>
      </div>
    </div>
  );
}
