import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { FaWarehouse, FaPlus, FaEdit, FaToggleOn, FaToggleOff, FaMapMarkerAlt, FaPhone, FaUser } from 'react-icons/fa';

export default function KhoHang() {
  const [khoList, setKhoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingKho, setEditingKho] = useState(null);
  const [form, setForm] = useState({
    tenKho: '', nguoiLienHe: '', soDienThoai: '',
    tinhThanhId: 0, tinhThanhTen: '', xaPhuongId: null, xaPhuongTen: '',
    diaChiChiTiet: '', trangThai: true
  });

  useEffect(() => { fetchKhoList(); }, []);

  const fetchKhoList = async () => {
    try {
      setLoading(true);
      const res = await api.get('/kho-hang');
      setKhoList(res.data?.data?.content || res.data?.data || res.data || []);
    } catch (err) {
      console.error('Lỗi tải kho:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ tenKho: '', nguoiLienHe: '', soDienThoai: '', tinhThanhId: 0, tinhThanhTen: '', xaPhuongId: null, xaPhuongTen: '', diaChiChiTiet: '', trangThai: true });
    setEditingKho(null);
  };

  const openAdd = () => { resetForm(); setShowModal(true); };
  const openEdit = (kho) => {
    setEditingKho(kho);
    setForm({
      tenKho: kho.tenKho, nguoiLienHe: kho.nguoiLienHe || '',
      soDienThoai: kho.soDienThoai, tinhThanhId: kho.tinhThanhId || 0,
      tinhThanhTen: kho.tinhThanhTen || kho.tinhThanhName || '',
      xaPhuongId: kho.xaPhuongId || null, xaPhuongTen: kho.xaPhuongTen || kho.phuongXaName || '',
      diaChiChiTiet: kho.diaChiChiTiet, trangThai: kho.trangThai
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editingKho) {
        await api.put(`/kho-hang/${editingKho.id}`, form);
      } else {
        await api.post('/kho-hang', form);
      }
      setShowModal(false);
      fetchKhoList();
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message));
    }
  };

  const toggleTrangThai = async (kho) => {
    try {
      await api.put(`/kho-hang/${kho.id}`, { ...kho, trangThai: !kho.trangThai });
      fetchKhoList();
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message));
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: '8px',
    border: '1px solid #d1d5db', fontSize: '14px', outline: 'none',
    transition: 'border-color 0.2s'
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111', margin: 0 }}>Quản lý Kho hàng</h1>
          <p style={{ color: '#6b7280', margin: '4px 0 0' }}>Quản lý các kho hàng và tồn kho hệ thống</p>
        </div>
        <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', backgroundColor: '#111', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
          <FaPlus /> Thêm kho mới
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>Đang tải...</div>
      ) : khoList.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <FaWarehouse style={{ fontSize: '48px', color: '#d1d5db', marginBottom: '16px' }} />
          <h3 style={{ color: '#111', margin: '0 0 8px' }}>Chưa có kho hàng nào</h3>
          <p style={{ color: '#6b7280' }}>Hãy thêm kho hàng đầu tiên để bắt đầu quản lý tồn kho.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '20px' }}>
          {khoList.map(kho => (
            <div key={kho.id} style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: `2px solid ${kho.trangThai ? '#e5e7eb' : '#fee2e2'}`, transition: 'all 0.2s', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: kho.trangThai ? '#f0fdf4' : '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaWarehouse style={{ fontSize: '20px', color: kho.trangThai ? '#16a34a' : '#dc2626' }} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#111' }}>{kho.tenKho}</h3>
                    <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '12px', fontWeight: 600, background: kho.trangThai ? '#dcfce7' : '#fee2e2', color: kho.trangThai ? '#166534' : '#991b1b' }}>
                      {kho.trangThai ? 'Hoạt động' : 'Ngưng'}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => openEdit(kho)} title="Sửa" style={{ padding: '8px', background: '#f3f4f6', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#374151' }}>
                    <FaEdit />
                  </button>
                  <button onClick={() => toggleTrangThai(kho)} title={kho.trangThai ? 'Tắt' : 'Bật'} style={{ padding: '8px', background: '#f3f4f6', border: 'none', borderRadius: '8px', cursor: 'pointer', color: kho.trangThai ? '#16a34a' : '#dc2626' }}>
                    {kho.trangThai ? <FaToggleOn size={18} /> : <FaToggleOff size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: '#4b5563' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaMapMarkerAlt size={13} style={{ color: '#9ca3af', flexShrink: 0 }} />
                  <span>{kho.diaChiChiTiet}, {kho.tinhThanhTen || kho.tinhThanhName}</span>
                </div>
                {kho.nguoiLienHe && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaUser size={13} style={{ color: '#9ca3af' }} /> {kho.nguoiLienHe}
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaPhone size={13} style={{ color: '#9ca3af' }} /> {kho.soDienThoai}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ margin: '0 0 24px', fontSize: '22px', fontWeight: 800 }}>
              {editingKho ? 'Sửa kho hàng' : 'Thêm kho hàng mới'}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px' }}>Tên kho *</label>
                <input style={inputStyle} value={form.tenKho} onChange={e => setForm({...form, tenKho: e.target.value})} placeholder="VD: Kho Hà Nội" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px' }}>Người liên hệ</label>
                  <input style={inputStyle} value={form.nguoiLienHe} onChange={e => setForm({...form, nguoiLienHe: e.target.value})} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px' }}>Số điện thoại *</label>
                  <input style={inputStyle} value={form.soDienThoai} onChange={e => setForm({...form, soDienThoai: e.target.value})} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px' }}>Tỉnh / Thành phố *</label>
                <input style={inputStyle} value={form.tinhThanhTen} onChange={e => setForm({...form, tinhThanhTen: e.target.value})} placeholder="VD: Hà Nội" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px' }}>Địa chỉ chi tiết *</label>
                <input style={inputStyle} value={form.diaChiChiTiet} onChange={e => setForm({...form, diaChiChiTiet: e.target.value})} placeholder="VD: 123 Cầu Giấy, Hà Nội" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" checked={form.trangThai} onChange={e => setForm({...form, trangThai: e.target.checked})} id="trangThai" style={{ width: '18px', height: '18px' }} />
                <label htmlFor="trangThai" style={{ fontWeight: 600, fontSize: '14px' }}>Đang hoạt động</label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #d1d5db', background: '#fff', fontWeight: 600, cursor: 'pointer' }}>Hủy</button>
              <button onClick={handleSave} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: '#111', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
                {editingKho ? 'Cập nhật' : 'Tạo kho'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
