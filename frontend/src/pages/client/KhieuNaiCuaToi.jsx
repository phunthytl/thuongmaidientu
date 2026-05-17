import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaPlus, FaTimes, FaImage, FaInbox } from 'react-icons/fa';
import Navbar from '../../components/layout/Navbar';
import { useAuthStore } from '../../stores/authStore';
import { api } from '../../services/api';

export default function KhieuNaiCuaToi() {
    const { user } = useAuthStore();
    const [searchParams] = useSearchParams();
    const presetDonHangId = searchParams.get('donHangId');

    const [disputes, setDisputes] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [formOpen, setFormOpen] = useState(false);
    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedDispute, setSelectedDispute] = useState(null);
    const [disputeImages, setDisputeImages] = useState([]);

    const [form, setForm] = useState({
        tieuDe: '',
        noiDung: '',
        donHangId: ''
    });
    const [files, setFiles] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    const khachHangId = user?.khachHangId ?? user?.id;

    useEffect(() => {
        if (khachHangId) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [khachHangId]);

    useEffect(() => {
        if (presetDonHangId && !formOpen) {
            setForm(prev => ({ ...prev, donHangId: presetDonHangId }));
            setFormOpen(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [presetDonHangId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [disputesRes, ordersRes] = await Promise.all([
                api.get(`/khieu-nai/khach-hang/${khachHangId}?size=50&sort=ngayTao,desc`),
                api.get(`/don-hang/khach-hang/${khachHangId}?size=50`)
            ]);
            setDisputes(disputesRes.data?.data?.content || []);
            setOrders(ordersRes.data?.data?.content || []);
        } catch (err) {
            console.error('Lỗi tải khiếu nại:', err);
        } finally {
            setLoading(false);
        }
    };

    const openForm = () => {
        setForm({ tieuDe: '', noiDung: '', donHangId: presetDonHangId || '' });
        setFiles([]);
        setFormOpen(true);
    };

    const closeForm = () => {
        setFormOpen(false);
        setForm({ tieuDe: '', noiDung: '', donHangId: '' });
        setFiles([]);
    };

    const handleFileChange = (e) => {
        const selected = Array.from(e.target.files || []);
        if (selected.length > 5) {
            alert('Chỉ được đính kèm tối đa 5 ảnh');
            return;
        }
        setFiles(selected);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.tieuDe.trim() || !form.noiDung.trim()) {
            alert('Vui lòng nhập tiêu đề và nội dung khiếu nại');
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                khachHangId: khachHangId,
                tieuDe: form.tieuDe.trim(),
                noiDung: form.noiDung.trim(),
                donHangId: form.donHangId ? parseInt(form.donHangId) : null
            };

            const createRes = await api.post('/khieu-nai', payload);
            const newDispute = createRes.data?.data;

            if (newDispute?.id && files.length > 0) {
                const mediaForm = new FormData();
                mediaForm.append('loaiDoiTuong', 'KHIEU_NAI');
                mediaForm.append('doiTuongId', newDispute.id);
                files.forEach(f => mediaForm.append('files', f));
                await api.post('/media/upload-multiple', mediaForm, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            alert('Gửi khiếu nại thành công! Bộ phận chăm sóc khách hàng sẽ phản hồi sớm nhất.');
            closeForm();
            fetchData();
        } catch (err) {
            console.error('Lỗi gửi khiếu nại:', err);
            alert(err.response?.data?.message || 'Có lỗi xảy ra khi gửi khiếu nại');
        } finally {
            setSubmitting(false);
        }
    };

    const openDetail = async (dispute) => {
        setSelectedDispute(dispute);
        setDisputeImages([]);
        setDetailOpen(true);
        try {
            const res = await api.get(`/media/KHIEU_NAI/${dispute.id}/images`);
            setDisputeImages(res.data?.data || []);
        } catch (err) {
            console.error('Lỗi tải ảnh khiếu nại:', err);
        }
    };

    const closeDetail = () => {
        setDetailOpen(false);
        setSelectedDispute(null);
        setDisputeImages([]);
    };

    const statusLabel = (st) => ({
        MOI: 'Mới gửi',
        DANG_XU_LY: 'Đang xử lý',
        DA_GIAI_QUYET: 'Đã giải quyết',
        TU_CHOI: 'Từ chối'
    }[st] || st);

    const statusColor = (st) => ({
        MOI: { bg: '#fef9c3', color: '#854d0e' },
        DANG_XU_LY: { bg: '#dbeafe', color: '#1e40af' },
        DA_GIAI_QUYET: { bg: '#dcfce7', color: '#166534' },
        TU_CHOI: { bg: '#fee2e2', color: '#991b1b' }
    }[st] || { bg: '#f3f4f6', color: '#374151' });

    const formatDate = (d) => d ? new Date(d).toLocaleString('vi-VN') : '---';

    return (
        <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
            <Navbar />

            <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, color: '#111' }}>Khiếu nại của tôi</h1>
                        <p style={{ color: '#6b7280', marginTop: '8px' }}>Theo dõi tình trạng xử lý các phản ánh của bạn</p>
                    </div>
                    <button
                        onClick={openForm}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '12px 20px', background: '#111', color: '#fff',
                            border: 'none', borderRadius: '8px', cursor: 'pointer',
                            fontWeight: 700, fontSize: '14px'
                        }}>
                        <FaPlus /> Gửi khiếu nại mới
                    </button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>Đang tải dữ liệu...</div>
                ) : disputes.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px', background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                        <FaInbox style={{ fontSize: '48px', color: '#d1d5db', marginBottom: '16px' }} />
                        <h3 style={{ color: '#374151', margin: '0 0 8px' }}>Chưa có khiếu nại nào</h3>
                        <p style={{ color: '#6b7280' }}>Khi cần phản ánh về đơn hàng hoặc dịch vụ, bạn có thể tạo khiếu nại tại đây.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {disputes.map(d => {
                            const color = statusColor(d.trangThai);
                            return (
                                <div key={d.id}
                                    onClick={() => openDetail(d)}
                                    style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>KN-{d.id}</div>
                                            <h3 style={{ margin: 0, fontSize: '16px', color: '#111', fontWeight: 700 }}>{d.tieuDe}</h3>
                                        </div>
                                        <span style={{
                                            padding: '6px 12px', borderRadius: '6px',
                                            background: color.bg, color: color.color,
                                            fontSize: '12px', fontWeight: 700
                                        }}>
                                            {statusLabel(d.trangThai)}
                                        </span>
                                    </div>
                                    <p style={{ margin: '0 0 12px', color: '#4b5563', fontSize: '14px', lineHeight: 1.6,
                                        overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                        {d.noiDung}
                                    </p>
                                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                                        Gửi lúc {formatDate(d.ngayTao || d.createdAt)}
                                        {d.donHang && ` • Đơn ${d.donHang.maDonHang || `#${d.donHang.id}`}`}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {formOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
                        <button onClick={closeForm} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#666', zIndex: 1 }}><FaTimes /></button>

                        <form onSubmit={handleSubmit} style={{ padding: '32px' }}>
                            <h2 style={{ marginTop: 0, marginBottom: '4px' }}>Gửi khiếu nại</h2>
                            <p style={{ color: '#6b7280', marginBottom: '24px', fontSize: '14px' }}>Vui lòng mô tả rõ vấn đề để chúng tôi hỗ trợ nhanh nhất.</p>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px' }}>Tiêu đề *</label>
                                <input
                                    type="text"
                                    value={form.tieuDe}
                                    onChange={(e) => setForm({ ...form, tieuDe: e.target.value })}
                                    placeholder="Vd: Sản phẩm bị lỗi, giao thiếu hàng..."
                                    required
                                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }} />
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px' }}>Đơn hàng liên quan (không bắt buộc)</label>
                                <select
                                    value={form.donHangId}
                                    onChange={(e) => setForm({ ...form, donHangId: e.target.value })}
                                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', background: '#fff' }}>
                                    <option value="">-- Không gắn đơn nào --</option>
                                    {orders.map(o => (
                                        <option key={o.id} value={o.id}>
                                            {o.maDonHang || `#${o.id}`} — {new Date(o.ngayTao).toLocaleDateString('vi-VN')}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px' }}>Nội dung khiếu nại *</label>
                                <textarea
                                    rows={5}
                                    value={form.noiDung}
                                    onChange={(e) => setForm({ ...form, noiDung: e.target.value })}
                                    placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
                                    required
                                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', resize: 'vertical' }} />
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px' }}>
                                    Ảnh đính kèm (tối đa 5 ảnh)
                                </label>
                                <label htmlFor="khieuNaiFiles" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', border: '2px dashed #d1d5db', borderRadius: '8px', cursor: 'pointer', color: '#6b7280' }}>
                                    <FaImage /> Bấm để chọn ảnh
                                </label>
                                <input
                                    id="khieuNaiFiles"
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }} />
                                {files.length > 0 && (
                                    <div style={{ marginTop: '8px', fontSize: '13px', color: '#374151' }}>
                                        Đã chọn {files.length} ảnh: {files.map(f => f.name).join(', ')}
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={closeForm} style={{ padding: '12px 20px', background: '#fff', color: '#374151', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                                    Hủy
                                </button>
                                <button type="submit" disabled={submitting} style={{ padding: '12px 20px', background: '#111', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}>
                                    {submitting ? 'Đang gửi...' : 'Gửi khiếu nại'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {detailOpen && selectedDispute && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
                        <button onClick={closeDetail} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#666', zIndex: 1 }}><FaTimes /></button>

                        <div style={{ padding: '32px' }}>
                            <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>KN-{selectedDispute.id}</div>
                            <h2 style={{ marginTop: 0, marginBottom: '8px' }}>{selectedDispute.tieuDe}</h2>
                            <div style={{ marginBottom: '24px' }}>
                                {(() => {
                                    const color = statusColor(selectedDispute.trangThai);
                                    return (
                                        <span style={{ padding: '6px 12px', borderRadius: '6px', background: color.bg, color: color.color, fontSize: '12px', fontWeight: 700 }}>
                                            {statusLabel(selectedDispute.trangThai)}
                                        </span>
                                    );
                                })()}
                                <span style={{ marginLeft: '12px', fontSize: '13px', color: '#6b7280' }}>
                                    {formatDate(selectedDispute.ngayTao || selectedDispute.createdAt)}
                                </span>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ fontSize: '13px', fontWeight: 600, color: '#6b7280', marginBottom: '8px' }}>NỘI DUNG KHIẾU NẠI</div>
                                <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                                    {selectedDispute.noiDung}
                                </div>
                            </div>

                            {disputeImages.length > 0 && (
                                <div style={{ marginBottom: '20px' }}>
                                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#6b7280', marginBottom: '8px' }}>ẢNH ĐÍNH KÈM</div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px' }}>
                                        {disputeImages.map(img => (
                                            <a key={img.id} href={img.url} target="_blank" rel="noopener noreferrer">
                                                <img src={img.url} alt="" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedDispute.phanHoi ? (
                                <div style={{ padding: '16px', background: '#eff6ff', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
                                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e40af', marginBottom: '8px' }}>
                                        PHẢN HỒI TỪ {selectedDispute.nhanVienXuLy?.hoTen || 'NHÂN VIÊN'}
                                    </div>
                                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: '#1e3a8a' }}>
                                        {selectedDispute.phanHoi}
                                    </div>
                                </div>
                            ) : (
                                <div style={{ padding: '16px', background: '#fef9c3', borderRadius: '8px', color: '#854d0e', fontSize: '14px' }}>
                                    Khiếu nại đang chờ nhân viên xử lý. Vui lòng kiên nhẫn chờ phản hồi.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
