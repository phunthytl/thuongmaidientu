import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MinimalistAdminLayout from './components/layout/MinimalistAdminLayout';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        
        {/* Public Routes */}
        <Route path="/admin/login" element={<Login />} />
        
        {/* Protected/Admin Routes */}
        <Route path="/admin" element={<MinimalistAdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
