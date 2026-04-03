import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children, allowedRoles, allowedChucVu }) {
  const { user, isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const location = useLocation();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const verify = async () => {
      if (!isAuthenticated) {
        await checkAuth();
      }
      setAuthChecked(true);
    };
    verify();
  }, [checkAuth, isAuthenticated]);

  if (!authChecked || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-surface text-brand-dark tracking-widest uppercase text-xs">
        Đang khởi tạo phiên...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    if (location.pathname.startsWith('/admin')) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check VaiTro
  if (allowedRoles && !allowedRoles.includes(user.vaiTro)) {
    if (user.vaiTro === 'KHACH_HANG') {
      return <Navigate to="/" replace />;
    } else {
      return <Navigate to="/admin" replace />;
    }
  }

  // Check ChucVu if specified
  if (allowedChucVu && !allowedChucVu.includes(user.chucVu)) {
     return (
        <div className="p-12 text-center">
            <h1 className="font-serif text-3xl text-brand-dark mb-4">Access Denied</h1>
            <p className="text-sm tracking-wide text-brand-muted">Bạn không có quyền thực hiện chức năng này.</p>
        </div>
     );
  }

  return children;
}
