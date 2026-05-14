import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaTimes, FaUserLock } from 'react-icons/fa';
import { bookingService } from '../../services/bookingService';
import { useAuthStore } from '../../stores/authStore';

export default function BookingModal({ isOpen, onClose, product, type, selectedBranch }) {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    hoTen: '',
    soDienThoai: '',
    email: '',
    ngayHen: '',
    gioHen: '',
    ghiChu: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Auto-fill khi có user
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        hoTen: user.hoTen || '',
        soDienThoai: user.soDienThoai || '',
        email: user.email || ''
      }));
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Vui lòng đăng nhập để thực hiện đặt lịch!');
      navigate('/login');
      return;
    }
    
    if (!selectedBranch) {
      alert('Vui lòng chọn chi nhánh ở trang chi tiết trước!');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        loaiLich: type,
        chiNhanhId: selectedBranch.khoHangId,
        otoId: type === 'LAI_THU' ? product.id : null,
        dichVuId: type === 'DICH_VU' ? product.id : null
      };

      await bookingService.createBooking(payload);
      alert('Đăng ký đặt lịch thành công! Chúng tôi sẽ liên hệ sớm nhất.');
      onClose();
    } catch (err) {
      alert('Đã có lỗi xảy ra: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div style={{ backgroundColor: '#fff', borderRadius: '16px', width: '100%', maxWidth: '500px', overflow: 'hidden', position: 'relative', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'none', cursor: 'pointer', color: '#9ca3af' }}>
          <FaTimes size={24} />
        </button>

        <div style={{ padding: '32px' }}>
          {!user ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
               <div style={{ width: '80px', height: '80px', backgroundColor: '#fef2f2', color: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 24px' }}>
                  <FaUserLock />
               </div>
               <h2 style={{ marginBottom: '12px' }}>Yêu Cầu Đăng Nhập</h2>
               <p style={{ color: '#666', marginBottom: '32px' }}>Vui lòng đăng nhập để chúng tôi có thể hỗ trợ và giúp bạn quản lý lịch hẹn tốt nhất.</p>
               <button 
                  onClick={() => navigate('/login')}
                  style={{ width: '100%', padding: '16px', borderRadius: '12px', border: 'none', backgroundColor: '#111', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
               >
                  Đăng Nhập Ngay
               </button>
            </div>
          ) : (
            <>
              <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px', color: '#111' }}>
                {type === 'LAI_THU' ? 'Đăng ký Lái thử' : 'Đặt lịch Dịch vụ'}
              </h2>
              <p style={{ color: '#6b7280', marginBottom: '24px' }}>{product.tenXe || product.tenDichVu}</p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ backgroundColor: '#eff6ff', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FaMapMarkerAlt color="#3b82f6" />
                  <div style={{ fontSize: '14px', color: '#1e40af' }}>
                    <strong>Chi nhánh:</strong> {selectedBranch.tenKho}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', fontSize: '13px', background: '#ecfdf5', padding: '10px', borderRadius: '8px', border: '1px solid #d1fae5' }}>
                  <FaUserLock size={14} />
                  <span>Thông tin của bạn đã được tự động điền từ tài khoản. Bạn có thể chỉnh sửa nếu cần.</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#4b5563' }}>Họ và tên *</label>
                    <input required type="text" value={formData.hoTen} onChange={e => setFormData({...formData, hoTen: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px' }} />
                  </div>
                  <div className="form-group">
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#4b5563' }}>Số điện thoại *</label>
                    <input required type="tel" value={formData.soDienThoai} onChange={e => setFormData({...formData, soDienThoai: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px' }} />
                  </div>
                </div>

                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#4b5563' }}>Email xác nhận</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#4b5563' }}>Ngày hẹn *</label>
                    <input required type="date" value={formData.ngayHen} onChange={e => setFormData({...formData, ngayHen: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px' }} min={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div className="form-group">
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#4b5563' }}>Giờ hẹn *</label>
                    <input required type="time" value={formData.gioHen} onChange={e => setFormData({...formData, gioHen: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px' }} />
                  </div>
                </div>

                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#4b5563' }}>Ghi chú thêm</label>
                  <textarea rows="2" value={formData.ghiChu} onChange={e => setFormData({...formData, ghiChu: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', resize: 'none' }} placeholder="VD: Tôi muốn lái thử bản cao cấp nhất..."></textarea>
                </div>

                <button disabled={submitting} type="submit" style={{ marginTop: '12px', padding: '16px', borderRadius: '12px', border: 'none', backgroundColor: '#111', color: '#fff', fontWeight: 'bold', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1, fontSize: '16px' }}>
                  {submitting ? 'Đang gửi yêu cầu...' : 'Xác nhận Đặt lịch'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
