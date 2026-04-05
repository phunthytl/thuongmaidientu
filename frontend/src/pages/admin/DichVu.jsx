import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import '../../assets/css/DanhSach.css';

export default function DichVu() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      const res = await api.get('/dich-vu?size=20'); // Fetch dich vu
      if (res.data?.data?.content) {
          setServices(res.data.data.content);
      } else if (Array.isArray(res.data?.data)) {
          setServices(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch services', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Xác nhận xóa gói dịch vụ: ${name} (Mã số: DV-${id})? Hành động này không thể hoàn tác.`)) {
        try {
            await api.delete(`/dich-vu/${id}`);
            setServices(prev => prev.filter(item => item.id !== id && item.idDichVu !== id));
        } catch (err) {
            console.error('Failed to delete service', err);
            alert(err.response?.data?.message || 'Có lỗi xảy ra khi xóa');
        }
    }
  };

  const formatPrice = (price) => {
    if (price == null || price === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="products-container">
      <header className="products-header">
        <div className="title-group">
          <h2 className="products-subtitle">Phân Hệ Cung Ứng</h2>
          <h1 className="products-title">Hồ Sơ Dịch Vụ</h1>
        </div>
        <div className="action-group">
          <button className="btn-add-product" onClick={() => navigate('/admin/services/new')}>Tạo Gói Dịch Vụ Mới</button>
        </div>
      </header>

      <div className="products-table-wrapper">
        <div className="table-header">
          <div className="col-id">Mã DV</div>
          <div className="col-wide-name">Tên Dịch Vụ / Hạng Mục</div>
          <div className="col-time">Thời Gian (Ước Tính)</div>
          <div className="col-price">Chi Phí</div>
          <div className="col-actions">Thao Tác</div>
        </div>

        <div className="table-body">
          {loading ? (
             <div className="table-loading">Đang tải biểu mẫu dịch vụ...</div>
          ) : services.length === 0 ? (
             <div className="table-empty">Hệ thống chưa có gói dịch vụ nào.</div>
          ) : (
            services.map((item) => (
              <div key={item.id || item.idDichVu} className="table-row">
                <div className="col-id">DV-{item.id || item.idDichVu || 'N/A'}</div>
                <div className="col-wide-name" style={{justifyContent: 'flex-start', paddingLeft: '24px'}}>
                    <span style={{fontWeight: 600}}>{item.tenDichVu || 'Dịch vụ chưa đặt tên'}</span>
                </div>
                <div className="col-time">{item.thoiGianUocTinh || '---'}</div>
                <div className="col-price">{formatPrice(item.gia)}</div>
                <div className="col-actions">
                  <button className="btn-action view" onClick={() => navigate(`/admin/services/${item.id || item.idDichVu}`)}>Hồ Sơ</button>
                  <button className="btn-action delete" onClick={() => handleDelete(item.id || item.idDichVu, item.tenDichVu)}>Xóa</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
