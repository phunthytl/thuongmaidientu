import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaTimes, FaCar, FaTools, FaCalendarAlt, FaClipboardList, FaMapMarkerAlt, FaClock, FaExclamationCircle, FaTruck } from 'react-icons/fa';
import Navbar from '../../components/layout/Navbar';
import { useAuthStore } from '../../stores/authStore';
import { api } from '../../services/api';
import { bookingService } from '../../services/bookingService';
import '../../assets/css/Home.css';

export default function LichSuDonHang() {
    const navigate = useNavigate();
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
    
    // Tracking Modal State
    const [trackingModalOpen, setTrackingModalOpen] = useState(false);
    const [trackingData, setTrackingData] = useState(null);
    const [trackingLoading, setTrackingLoading] = useState(false);
    const [trackingError, setTrackingError] = useState(null);

    const getGhnStatusText = (status) => {
        const map = {
            'ready_to_pick': 'Chờ lấy hàng',
            'picking': 'Đang lấy hàng',
            'money_collect_picking': 'Đang thu tiền lấy hàng',
            'picked': 'Đã lấy hàng',
            'storing': 'Đang lưu kho',
            'transporting': 'Đang luân chuyển',
            'sorting': 'Đang phân loại',
            'delivering': 'Đang giao hàng',
            'money_collect_delivering': 'Đang thu tiền giao hàng',
            'delivered': 'Giao hàng thành công',
            'delivery_fail': 'Giao hàng thất bại',
            'waiting_to_return': 'Chờ chuyển hoàn',
            'return': 'Đang chuyển hoàn',
            'returned': 'Đã chuyển hoàn',
            'return_fail': 'Chuyển hoàn thất bại',
            'cancel': 'Đã hủy đơn'
        };
        return map[status] || 'Đang cập nhật';
    };

    const getActiveStep = (status) => {
        if (!status) return 0;
        if (['ready_to_pick', 'picking', 'money_collect_picking'].includes(status)) return 1;
        if (['picked', 'storing', 'transporting', 'sorting'].includes(status)) return 2;
        if (['delivering', 'money_collect_delivering'].includes(status)) return 3;
        if (['delivered'].includes(status)) return 4;
        return 1;
    };

    const handleTrackOrder = async (ghnCode) => {
        setTrackingModalOpen(true);
        setTrackingLoading(true);
        setTrackingError(null);
        setTrackingData(null);
        try {
            const res = await api.get(`/ghn/order/${ghnCode}/detail`);
            const parsed = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
            if (parsed && parsed.data) {
                setTrackingData(parsed.data);
            } else {
                setTrackingError('Không tìm thấy dữ liệu vận đơn trên hệ thống GHN!');
            }
        } catch (err) {
            console.error('Lỗi lấy thông tin theo dõi:', err);
            setTrackingError('Không thể kết nối tới máy chủ GHN. Vui lòng thử lại sau!');
        } finally {
            setTrackingLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.id) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'PHU_KIEN') {
                const res = await api.get(`/don-hang/khach-hang/${user.id}?size=50&sort=ngayTao,desc`);
                const sortedOrders = (res.data?.data?.content || []).sort((a, b) => new Date(b.ngayTao) - new Date(a.ngayTao));
                setOrders(sortedOrders);
            } else {
                const res = await bookingService.getMyBookings();
                const type = activeTab === 'OTO' ? 'LAI_THU' : 'DICH_VU';
                const filteredBookings = (res.data?.data || []).filter(b => b.loaiLich === type);
                // Sắp xếp lịch hẹn theo ngày và giờ hẹn giảm dần (mới nhất lên đầu)
                const sortedBookings = filteredBookings.sort((a, b) => {
                    const timeA = new Date(`${a.ngayHen}T${a.gioHen || '00:00:00'}`);
                    const timeB = new Date(`${b.ngayHen}T${b.gioHen || '00:00:00'}`);
                    return timeB - timeA;
                });
                setBookings(sortedBookings);
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
                noiDung: reviewForm.noiDung,
                lichHenId: selectedItem.lichHenId || null,
                chiTietDonHangId: selectedItem.chiTietDonHangId || null
            };
            await api.post('/danh-gia', payload);
            alert('Cảm ơn bạn đã đánh giá sản phẩm!');
            setReviewModalOpen(false);
            fetchData();
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

    const getPaymentStatusBadge = (thanhToan) => {
        if (!thanhToan) {
            return (
                <span style={{ 
                    padding: '6px 12px', 
                    borderRadius: '6px', 
                    fontSize: '12px', 
                    fontWeight: 700, 
                    background: '#f3f4f6', 
                    color: '#4b5563', 
                    border: '1px solid #e5e7eb',
                    display: 'inline-flex',
                    alignItems: 'center'
                }}>
                    Thanh toán: COD (Chờ thanh toán)
                </span>
            );
        }

        const methodMap = {
            'VNPAY': 'VNPay',
            'MOMO': 'MoMo',
            'TIEN_MAT': 'Tiền mặt (COD)',
            'CHUYEN_KHOAN': 'Chuyển khoản'
        };

        const statusMap = {
            'CHO_THANH_TOAN': { text: 'Chờ thanh toán', bg: '#fef3c7', color: '#d97706', border: '#fde68a' },
            'DA_THANH_TOAN': { text: 'Đã thanh toán', bg: '#d1fae5', color: '#065f46', border: '#a7f3d0' },
            'THAT_BAI': { text: 'Thanh toán thất bại', bg: '#fee2e2', color: '#991b1b', border: '#fecaca' },
            'HOAN_TIEN': { text: 'Đã hoàn tiền', bg: '#e0f2fe', color: '#0369a1', border: '#bae6fd' }
        };

        const method = methodMap[thanhToan.phuongThuc] || thanhToan.phuongThuc || 'COD';
        const status = statusMap[thanhToan.trangThai] || { text: thanhToan.trangThai, bg: '#f3f4f6', color: '#4b5563', border: '#e5e7eb' };

        return (
            <span style={{ 
                padding: '6px 12px', 
                borderRadius: '6px', 
                fontSize: '12px', 
                fontWeight: 700, 
                background: status.bg, 
                color: status.color, 
                border: `1px solid ${status.border}`,
                display: 'inline-flex',
                alignItems: 'center'
            }}>
                Thanh toán: {status.text} ({method})
            </span>
        );
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
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', borderBottom: '1px solid #f3f4f6', paddingBottom: '16px' }}>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: '16px', color: '#111' }}>Mã: {order.maDonHang || `ORD-${order.id}`}</div>
                                                <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px', marginBottom: '12px' }}>Ngày đặt: {new Date(order.ngayTao).toLocaleDateString('vi-VN')}</div>
                                                {getPaymentStatusBadge(order.thanhToan)}
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
                                                            item.daDanhGia ? (
                                                                <span style={{ padding: '4px 12px', background: '#f3f4f6', color: '#6b7280', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
                                                                    Đã đánh giá
                                                                </span>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleOpenReview({ ...item, chiTietDonHangId: item.id })}
                                                                    style={{ padding: '4px 12px', background: '#fff', border: '1px solid #10b981', color: '#10b981', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
                                                                >
                                                                    Đánh giá
                                                                </button>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <button
                                                    onClick={() => navigate(`/my-disputes?donHangId=${order.id}`)}
                                                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: '#fff', border: '1px solid #f59e0b', color: '#b45309', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                                                    <FaExclamationCircle /> Khiếu nại đơn này
                                                </button>
                                                {order.maDonHangGhn && (
                                                    <button
                                                        onClick={() => handleTrackOrder(order.maDonHangGhn)}
                                                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: '#3b82f6', border: 'none', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                                                        <FaTruck /> Theo dõi đơn hàng
                                                    </button>
                                                )}
                                            </div>
                                            <div>
                                                <span style={{ color: '#6b7280', marginRight: '12px' }}>Tổng thanh toán:</span>
                                                <span style={{ fontSize: '20px', fontWeight: 800, color: '#ef4444' }}>{formatPrice(order.tongTien)}</span>
                                            </div>
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
                                            {book.trangThai === 'DA_HOAN_THANH' && (
                                                book.daDanhGia ? (
                                                    <span style={{ padding: '8px 16px', borderRadius: '8px', background: '#f3f4f6', color: '#6b7280', fontWeight: 600 }}>
                                                        Đã đánh giá
                                                    </span>
                                                ) : activeTab === 'DICH_VU' && book.dichVuId ? (
                                                    <button
                                                        onClick={() => handleOpenReview({
                                                            loaiSanPham: 'DICH_VU',
                                                            sanPhamId: book.dichVuId,
                                                            tenSanPham: book.tenDoiTuong,
                                                            lichHenId: book.id
                                                        })}
                                                        style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #10b981', background: '#fff', color: '#10b981', fontWeight: 600, cursor: 'pointer' }}
                                                    >
                                                        <FaStar style={{ marginRight: 6 }} /> Đánh giá
                                                    </button>
                                                ) : activeTab === 'OTO' && book.otoId ? (
                                                    <button
                                                        onClick={() => handleOpenReview({
                                                            loaiSanPham: 'OTO',
                                                            sanPhamId: book.otoId,
                                                            tenSanPham: book.tenDoiTuong,
                                                            lichHenId: book.id
                                                        })}
                                                        style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #10b981', background: '#fff', color: '#10b981', fontWeight: 600, cursor: 'pointer' }}
                                                    >
                                                        <FaStar style={{ marginRight: 6 }} /> Đánh giá
                                                    </button>
                                                ) : null
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

            {/* Real-time Order Tracking Modal */}
            {trackingModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                    <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', position: 'relative', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
                        <button onClick={() => setTrackingModalOpen(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#111'} onMouseLeave={(e) => e.target.style.color = '#6b7280'}><FaTimes /></button>
                        
                        <h2 style={{ marginTop: 0, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '22px', fontWeight: 800 }}>
                            <FaTruck color="#3b82f6" /> Theo Dõi Hành Trình Đơn Hàng
                        </h2>

                        {trackingLoading && (
                            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                <div style={{ border: '4px solid #f3f4f6', borderTop: '4px solid #3b82f6', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 16px auto' }} />
                                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                                <p style={{ color: '#4b5563', fontWeight: 600 }}>Đang kết nối với hệ thống GHN...</p>
                            </div>
                        )}

                        {trackingError && (
                            <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', padding: '16px', borderRadius: '8px', color: '#991b1b', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FaExclamationCircle /> {trackingError}
                            </div>
                        )}

                        {trackingData && (
                            <div>
                                {/* Order Metadata */}
                                <div style={{ background: '#f3f4f6', padding: '16px', borderRadius: '12px', marginBottom: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '14px' }}>
                                    <div>
                                        <div style={{ color: '#6b7280', marginBottom: '4px' }}>Mã vận đơn GHN</div>
                                        <div style={{ fontWeight: 700, color: '#111' }}>{trackingData.order_code}</div>
                                    </div>
                                    <div>
                                        <div style={{ color: '#6b7280', marginBottom: '4px' }}>Dự kiến giao hàng</div>
                                        <div style={{ fontWeight: 700, color: '#10b981' }}>
                                            {trackingData.leadtime ? new Date(trackingData.leadtime).toLocaleDateString('vi-VN') : 'Đang cập nhật'}
                                        </div>
                                    </div>
                                    {trackingData.shipper_name && (
                                        <div style={{ gridColumn: '1 / -1', borderTop: '1px solid #e5e7eb', paddingTop: '12px', marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
                                            <div>
                                                <span style={{ color: '#6b7280' }}>Nhân viên giao hàng: </span>
                                                <span style={{ fontWeight: 700 }}>{trackingData.shipper_name}</span>
                                            </div>
                                            {trackingData.shipper_phone && (
                                                <div>
                                                    <span style={{ color: '#6b7280' }}>SĐT: </span>
                                                    <a href={`tel:${trackingData.shipper_phone}`} style={{ fontWeight: 700, color: '#3b82f6', textDecoration: 'none' }}>{trackingData.shipper_phone}</a>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Progress Stepper */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', padding: '0 10px', position: 'relative' }}>
                                    {/* Line behind steps */}
                                    <div style={{ position: 'absolute', top: '15px', left: '40px', right: '40px', height: '3px', background: '#e5e7eb', zIndex: 1 }} />
                                    <div style={{ position: 'absolute', top: '15px', left: '40px', width: `${((getActiveStep(trackingData.status) - 1) / 3) * 100}%`, height: '3px', background: '#3b82f6', zIndex: 2, transition: 'width 0.3s ease' }} />

                                    {/* Step Circles */}
                                    {['Chờ lấy', 'Đã lấy', 'Đang giao', 'Thành công'].map((label, index) => {
                                        const stepNum = index + 1;
                                        const isActive = stepNum <= getActiveStep(trackingData.status);
                                        return (
                                            <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3, position: 'relative' }}>
                                                <div style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '50%',
                                                    background: isActive ? '#3b82f6' : '#fff',
                                                    border: `3px solid ${isActive ? '#3b82f6' : '#d1d5db'}`,
                                                    color: isActive ? '#fff' : '#9ca3af',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: 700,
                                                    fontSize: '13px',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                                    transition: 'all 0.3s ease'
                                                }}>
                                                    {stepNum}
                                                </div>
                                                <span style={{ fontSize: '12px', fontWeight: isActive ? 700 : 500, color: isActive ? '#111' : '#6b7280', marginTop: '8px' }}>{label}</span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Journey Log Timeline */}
                                <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '24px' }}>
                                    <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', color: '#111' }}>Nhật Ký Hành Trình</h3>
                                    
                                    {(!trackingData.log || trackingData.log.length === 0) ? (
                                        <p style={{ color: '#6b7280', fontSize: '14px', fontStyle: 'italic' }}>Đang chờ GHN cập nhật hành trình...</p>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '8px' }}>
                                            {trackingData.log.slice().reverse().map((lg, i) => (
                                                <div key={i} style={{ display: 'flex', gap: '16px', position: 'relative' }}>
                                                    {/* Vertical indicator line */}
                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                        <div style={{
                                                            width: i === 0 ? '12px' : '8px',
                                                            height: i === 0 ? '12px' : '8px',
                                                            borderRadius: '50%',
                                                            background: i === 0 ? '#3b82f6' : '#d1d5db',
                                                            boxShadow: i === 0 ? '0 0 0 4px rgba(59, 130, 246, 0.2)' : 'none',
                                                            zIndex: 2
                                                        }} />
                                                        {i < trackingData.log.length - 1 && (
                                                            <div style={{ width: '2px', background: '#e5e7eb', flexGrow: 1, margin: '4px 0', minHeight: '30px', zIndex: 1 }} />
                                                        )}
                                                    </div>
                                                    
                                                    <div style={{ paddingBottom: '20px' }}>
                                                        <div style={{ fontWeight: 700, fontSize: '14px', color: i === 0 ? '#3b82f6' : '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            {getGhnStatusText(lg.status)}
                                                            {i === 0 && <span style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '10px', textTransform: 'uppercase' }}>Mới nhất</span>}
                                                        </div>
                                                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                                                            {new Date(lg.updated_date).toLocaleString('vi-VN')}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
