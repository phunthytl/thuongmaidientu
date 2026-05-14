import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBoxOpen, FaStar, FaTimes, FaCar, FaTools, FaCalendarAlt, FaClipboardList, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import Navbar from '../../components/layout/Navbar';
import { useAuthStore } from '../../stores/authStore';
import { api } from '../../services/api';
import { bookingService } from '../../services/bookingService';
import '../../assets/css/Home.css';

export default function LichSuDonHang() {
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState('PHU_KIEN'); // OTO, PHU_KIEN, DICH_VU
    const [statusFilter, setStatusFilter] = useState('ALL');
    
    const [orders, setOrders] = useState([]); // Cho phụ kiện
    const [bookings, setBookings] = useState([]); // Cho oto và dịch vụ
    const [loading, setLoading] = useState(true);
    
    // Review Modal State
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [reviewForm, setReviewForm] = useState({ diemDanhGia: 5, noiDung: '' });
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        if (user && user.id) {
            fetchData();
        }
    }, [user, activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'PHU_KIEN') {
                const res = await api.get(`/don-hang/khach-hang/${user.id}?size=50`);
                setOrders(res.data?.data?.content || []);
            } else {
                const res = await bookingService.getMyBookings();
                const type = activeTab === 'OTO' ? 'LAI_THU' : 'DICH_VU';
                setBookings((res.data?.data || []).filter(b => b.loaiLich === type));
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenReview = (item) => {
        setSelectedItem(item);
        setReviewForm({ diemDanhGia: 5, noiDung: '' });
        setReviewModalOpen(true);
    };

    const handleSubmitReview = async () => {
        if (!selectedItem) return;
        setSubmittingReview(true);
        try {
            const payload = {
                khachHangId: user.id,
                loaiSanPham: selectedItem.loaiSanPham,
                otoId: selectedItem.loaiSanPham === 'OTO' ? selectedItem.sanPhamId : null,
                phuKienId: selectedItem.loaiSanPham === 'PHU_KIEN' ? selectedItem.sanPhamId : null,
                dichVuId: selectedItem.loaiSanPham === 'DICH_VU' ? selectedItem.sanPhamId : null,
                diemDanhGia: reviewForm.diemDanhGia,
                noiDung: reviewForm.noiDung
            };
            await api.post('/danh-gia', payload);
            alert('Cảm ơn bạn đã đánh giá sản phẩm!');
            setReviewModalOpen(false);
        } catch (error) {
            console.error('Error posting review:', error);
            alert(error.response?.data?.message || 'Có lỗi xảy ra khi gửi đánh giá');
        } finally {
            setSubmittingReview(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
    };

    const formatDate = (date, time) => {
        if (!date) return '---';
        return `${new Date(date).toLocaleDateString('vi-VN')} ${time ? `lúc ${time}` : ''}`;
    };

    const getStatusText = (status) => {
        const map = {
            'CHO_XAC_NHAN': 'Chờ xác nhận',
            'DA_XAC_NHAN': 'Đã xác nhận',
            'DANG_GIAO': 'Đang giao hàng',
            'HOAN_THANH': 'Hoàn thành',
            'DA_HOAN_THANH': 'Đã hoàn thành',
            'DA_HUY': 'Đã hủy'
        };
        return map[status] || status;
    };

    return (
        <div className="home-container" style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            <Navbar />
            
            <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '32px', color: '#111' }}>Lịch Sử Hoạt Động</h1>
                
                {/* Main Tabs */}
                <div style={{ display: 'flex', gap: '40px', borderBottom: '1px solid #e5e7eb', marginBottom: '32px' }}>
                    <button 
                        onClick={() => { setActiveTab('PHU_KIEN'); setStatusFilter('ALL'); }}
                        style={{ padding: '16px 0', fontSize: '16px', fontWeight: 700, border: 'none', background: 'none', cursor: 'pointer', borderBottom: activeTab === 'PHU_KIEN' ? '3px solid #111' : '3px solid transparent', color: activeTab === 'PHU_KIEN' ? '#111' : '#9ca3af', display: 'flex', alignItems: 'center', gap: '10px' }}
                    >
                        <FaClipboardList /> Đơn phụ kiện
                    </button>
                    <button 
                        onClick={() => { setActiveTab('OTO'); setStatusFilter('ALL'); }}
                        style={{ padding: '16px 0', fontSize: '16px', fontWeight: 700, border: 'none', background: 'none', cursor: 'pointer', borderBottom: activeTab === 'OTO' ? '3px solid #111' : '3px solid transparent', color: activeTab === 'OTO' ? '#111' : '#9ca3af', display: 'flex', alignItems: 'center', gap: '10px' }}
                    >
                        <FaCar /> Lịch lái thử
                    </button>
                    <button 
                        onClick={() => { setActiveTab('DICH_VU'); setStatusFilter('ALL'); }}
                        style={{ padding: '16px 0', fontSize: '16px', fontWeight: 700, border: 'none', background: 'none', cursor: 'pointer', borderBottom: activeTab === 'DICH_VU' ? '3px solid #111' : '3px solid transparent', color: activeTab === 'DICH_VU' ? '#111' : '#9ca3af', display: 'flex', alignItems: 'center', gap: '10px' }}
                    >
                        <FaTools /> Lịch dịch vụ
                    </button>
                </div>

                {/* Sub-filters (Status) */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
                    {['ALL', 'CHO_XAC_NHAN', 'DA_XAC_NHAN', 'DANG_GIAO', 'HOAN_THANH', 'DA_HUY'].map(st => {
                        if (activeTab !== 'PHU_KIEN' && st === 'DANG_GIAO') return null; // Booking ko có đang giao
                        const displayStatus = st === 'ALL' ? 'Tất cả' : getStatusText(st === 'HOAN_THANH' && activeTab !== 'PHU_KIEN' ? 'DA_HOAN_THANH' : st);
                        return (
                            <button 
                                key={st}
                                onClick={() => setStatusFilter(st)}
                                style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #e5e7eb', background: statusFilter === st ? '#111' : '#fff', color: statusFilter === st ? '#fff' : '#4b5563', fontSize: '13px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
                            >
                                {displayStatus}
                            </button>
                        );
                    })}
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải dữ liệu...</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {activeTab === 'PHU_KIEN' ? (
                            // Render Đơn hàng Phụ kiện
                            orders.filter(o => statusFilter === 'ALL' || o.trangThai === statusFilter).length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '12px' }}>Bạn chưa có đơn hàng nào ở trạng thái này.</div>
                            ) : (
                                orders.filter(o => statusFilter === 'ALL' || o.trangThai === statusFilter).map(order => (
                                    <div key={order.id} style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid #f3f4f6', paddingBottom: '16px' }}>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: '16px', color: '#111' }}>Mã: {order.maDonHang || `ORD-${order.id}`}</div>
                                                <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>Ngày đặt: {new Date(order.ngayTao).toLocaleDateString('vi-VN')}</div>
                                            </div>
                                            <div style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', background: order.trangThai === 'HOAN_THANH' ? '#dcfce7' : '#fef9c3', color: order.trangThai === 'HOAN_THANH' ? '#166534' : '#854d0e' }}>
                                                {getStatusText(order.trangThai)}
                                            </div>
                                        </div>
                                        <div>
                                            {(order.chiTietDonHangs || []).map((item, idx) => (
                                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: idx < order.chiTietDonHangs.length - 1 ? '16px' : 0 }}>
                                                    <div style={{ display: 'flex', gap: '16px' }}>
                                                        <div style={{ width: '64px', height: '64px', background: '#f3f4f6', borderRadius: '8px', overflow: 'hidden' }}>
                                                            <img src={item.hinhAnh || ''} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: 600, color: '#111' }}>{item.tenSanPham}</div>
                                                            <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>Số lượng: {item.soLuong}</div>
                                                        </div>
                                                    </div>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <div style={{ fontWeight: 700, marginBottom: '8px' }}>{formatPrice(item.donGia)}</div>
                                                        {order.trangThai === 'HOAN_THANH' && (
                                                            <button 
                                                                onClick={() => handleOpenReview(item)}
                                                                style={{ padding: '4px 12px', background: '#fff', border: '1px solid #10b981', color: '#10b981', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
                                                            >
                                                                Đánh giá
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div style={{ textAlign: 'right', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
                                            <span style={{ color: '#6b7280', marginRight: '12px' }}>Tổng thanh toán:</span>
                                            <span style={{ fontSize: '20px', fontWeight: 800, color: '#ef4444' }}>{formatPrice(order.tongTien)}</span>
                                        </div>
                                    </div>
                                ))
                            )
                        ) : (
                            // Render Lịch hẹn (Ô tô hoặc Dịch vụ)
                            bookings.filter(b => statusFilter === 'ALL' || b.trangThai === (statusFilter === 'HOAN_THANH' ? 'DA_HOAN_THANH' : statusFilter)).length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '12px' }}>Không tìm thấy lịch hẹn nào.</div>
                            ) : (
                                bookings.filter(b => statusFilter === 'ALL' || b.trangThai === (statusFilter === 'HOAN_THANH' ? 'DA_HOAN_THANH' : statusFilter)).map(book => (
                                    <div key={book.id} style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                            <div style={{ display: 'flex', gap: '16px' }}>
                                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: activeTab === 'OTO' ? '#eff6ff' : '#fff7ed', color: activeTab === 'OTO' ? '#3b82f6' : '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                                                    {activeTab === 'OTO' ? <FaCar /> : <FaTools />}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 800, fontSize: '18px', color: '#111' }}>{book.tenDoiTuong}</div>
                                                    <div style={{ fontSize: '14px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                                                        <FaMapMarkerAlt size={12} /> {book.tenChiNhanh}
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, height: 'fit-content', background: book.trangThai === 'DA_HOAN_THANH' ? '#dcfce7' : '#f3f4f6', color: book.trangThai === 'DA_HOAN_THANH' ? '#166534' : '#4b5563' }}>
                                                {getStatusText(book.trangThai)}
                                            </div>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: '#f9fafb', padding: '16px', borderRadius: '8px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <FaCalendarAlt color="#6b7280" />
                                                <div style={{ fontSize: '14px' }}><strong>Ngày hẹn:</strong> {formatDate(book.ngayHen)}</div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <FaClock color="#6b7280" />
                                                <div style={{ fontSize: '14px' }}><strong>Giờ hẹn:</strong> {book.gioHen}</div>
                                            </div>
                                        </div>
                                        {book.ghiChu && (
                                            <div style={{ marginTop: '12px', fontSize: '13px', color: '#6b7280', fontStyle: 'italic' }}>
                                                Ghi chú: {book.ghiChu}
                                            </div>
                                        )}
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', gap: '12px' }}>
                                            {book.trangThai === 'CHO_XAC_NHAN' && (
                                                <button 
                                                    onClick={async () => {
                                                        if (window.confirm('Bạn có chắc chắn muốn hủy lịch hẹn này?')) {
                                                            try {
                                                                await bookingService.cancelBooking(book.id);
                                                                fetchData();
                                                            } catch (err) {
                                                                alert('Hủy lịch thất bại!');
                                                            }
                                                        }
                                                    }}
                                                    style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #ef4444', background: '#fff', color: '#ef4444', fontWeight: 600, cursor: 'pointer' }}
                                                >
                                                    Hủy lịch
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )
                        )}
                    </div>
                )}
            </div>

            {/* Review Modal (Giữ nguyên logic cũ cho Phụ kiện) */}
            {reviewModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', width: '100%', maxWidth: '500px', position: 'relative' }}>
                        <button onClick={() => setReviewModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#666' }}><FaTimes /></button>
                        <h2 style={{ marginTop: 0, marginBottom: '8px' }}>Đánh giá sản phẩm</h2>
                        <p style={{ color: '#666', marginBottom: '24px' }}>{selectedItem?.tenSanPham}</p>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Điểm đánh giá</label>
                            <div style={{ display: 'flex', gap: '8px', fontSize: '24px' }}>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <FaStar key={star} style={{ cursor: 'pointer', color: star <= reviewForm.diemDanhGia ? '#fbbf24' : '#e5e7eb' }} onClick={() => setReviewForm({ ...reviewForm, diemDanhGia: star })} />
                                ))}
                            </div>
                        </div>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Trải nghiệm của bạn</label>
                            <textarea rows="4" placeholder="Chia sẻ cảm nhận của bạn..." value={reviewForm.noiDung} onChange={(e) => setReviewForm({ ...reviewForm, noiDung: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', resize: 'none', fontFamily: 'inherit' }} />
                        </div>
                        <button onClick={handleSubmitReview} disabled={submittingReview} style={{ width: '100%', padding: '14px', background: '#111', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>{submittingReview ? 'Đang gửi...' : 'Gửi Đánh Giá'}</button>
                    </div>
                </div>
            )}
        </div>
    );
}
