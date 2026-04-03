import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MinimalistAdminLayout from './components/layout/MinimalistAdminLayout';
import AdminLogin from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import ClientLogin from './pages/client/Login';
import ProtectedRoute from './components/routes/ProtectedRoute';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/admin" replace />} />

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
                        <Products />
                        // </ProtectedRoute>
                    } />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
