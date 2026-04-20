import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MinimalistAdminLayout from './components/layout/MinimalistAdminLayout';
import AdminLogin from './pages/admin/DangNhap';
import Dashboard from './pages/admin/TongQuan';
import Oto from './pages/admin/Oto';
import ThemOto from './pages/admin/ThemOto';
import ChiTietOto from './pages/admin/ChiTietOto';
import PhuKien from './pages/admin/PhuKien';
import ThemPhuKien from './pages/admin/ThemPhuKien';
import ChiTietPhuKien from './pages/admin/ChiTietPhuKien';
import DichVu from './pages/admin/DichVu';
import ThemDichVu from './pages/admin/ThemDichVu';
import ChiTietDichVu from './pages/admin/ChiTietDichVu';
import KhachHang from './pages/admin/KhachHang';
import DonHang from './pages/admin/DonHang';
import ChiTietDonHang from './pages/admin/ChiTietDonHang';
import DanhGia from './pages/admin/DanhGia';
import KhieuNai from './pages/admin/KhieuNai';
import ChiTietKhieuNai from './pages/admin/ChiTietKhieuNai';
import ClientLogin from './pages/client/DangNhap';
import Home from './pages/client/Home';
import DanhSachOto from './pages/client/DanhSachOto';
import DanhSachPhuKien from './pages/client/DanhSachPhuKien';
import ClientChiTietPhuKien from './pages/client/ChiTietPhuKien';
import GioHang from './pages/client/GioHang';
import DangKy from './pages/client/DangKy';
import ProtectedRoute from './components/routes/ProtectedRoute';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<DanhSachOto />} />
                <Route path="/accessories" element={<DanhSachPhuKien />} />
                <Route path="/products/accessory/:id" element={<ClientChiTietPhuKien />} />
                <Route path="/cart" element={<GioHang />} />
                <Route path="/register" element={<DangKy />} />

                {/* Public Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/login" element={<ClientLogin />} />

                {/* Protected/Admin Routes */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN', 'NHAN_VIEN']}>
                            <MinimalistAdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Dashboard />} />
                    <Route path="products" element={
                        // Example of ChucVu specific route protecting:
                        // <ProtectedRoute allowedChucVu={['QUAN_LY', 'NHAN_VIEN_KHO']}>
                        <Oto />
                        // </ProtectedRoute>
                    } />
                    <Route path="products/add-car" element={
                        <ThemOto />
                    } />
                    <Route path="products/oto/:id" element={
                        <ChiTietOto />
                    } />
                    <Route path="products/accessories" element={
                        <PhuKien />
                    } />
                    <Route path="products/accessories/new" element={
                        <ThemPhuKien />
                    } />
                    <Route path="products/accessories/:id" element={
                        <ChiTietPhuKien />
                    } />
                    <Route path="services" element={<DichVu />} />
                    <Route path="services/new" element={<ThemDichVu />} />
                    <Route path="services/:id" element={<ChiTietDichVu />} />
                    <Route path="customers" element={<KhachHang />} />
                    <Route path="orders" element={<DonHang />} />
                    <Route path="orders/:id" element={<ChiTietDonHang />} />
                    <Route path="reviews" element={<DanhGia />} />
                    <Route path="disputes" element={<KhieuNai />} />
                    <Route path="disputes/:id" element={<ChiTietKhieuNai />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
