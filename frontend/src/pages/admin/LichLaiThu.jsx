import { useEffect, useState } from 'react';
import { bookingService } from '../../services/bookingService';
import '../../assets/css/DonHang.css';

export default function LichLaiThu() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('ALL');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const res = await bookingService.getBookingsByType('LAI_THU');
            setBookings(res.data?.data || []);
        } catch (err) {
            console.error('Failed to fetch test drive bookings', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await bookingService.updateBookingStatus(id, newStatus);
            setBookings(prev => prev.map(b => b.id === id ? { ...b, trangThai: newStatus } : b));
        } catch (err) {
            alert('Cập nhật thất bại!');
        }
    };

    const formatDate = (date, time) => {
        if (!date) return '---';
        return `${new Date(date).toLocaleDateString('vi-VN')} lúc ${time || '--:--'}`;
    };

    return (
        <div className="orders-container">
            <header className="orders-header">
                <div className="title-group">
                    <h2 className="orders-subtitle">Hệ Thống Quản Lý</h2>
                    <h1 className="orders-title">Lịch Đăng Ký Lái Thử</h1>
                </div>
            </header>

            <div className="orders-tabs" style={{display: 'flex', gap: '24px', borderBottom: '1px solid #e5e7eb', marginBottom: '20px', paddingBottom: '10px', fontSize: '14px', fontWeight: 500, color: '#4b5563'}}>
                <div 
                    onClick={() => setActiveTab('ALL')} 
                    style={{cursor: 'pointer', color: activeTab === 'ALL' ? '#ef4444' : 'inherit', borderBottom: activeTab === 'ALL' ? '2px solid #ef4444' : 'none', paddingBottom: '8px'}}>
                    Tất cả
                </div>
                <div 
                    onClick={() => setActiveTab('CHO_XAC_NHAN')} 
                    style={{cursor: 'pointer', color: activeTab === 'CHO_XAC_NHAN' ? '#ef4444' : 'inherit', borderBottom: activeTab === 'CHO_XAC_NHAN' ? '2px solid #ef4444' : 'none', paddingBottom: '8px'}}>
                    Chờ xác nhận
                </div>
                <div 
                    onClick={() => setActiveTab('DA_XAC_NHAN')} 
                    style={{cursor: 'pointer', color: activeTab === 'DA_XAC_NHAN' ? '#ef4444' : 'inherit', borderBottom: activeTab === 'DA_XAC_NHAN' ? '2px solid #ef4444' : 'none', paddingBottom: '8px'}}>
                    Đã xác nhận
                </div>
                <div 
                    onClick={() => setActiveTab('DA_HOAN_THANH')} 
                    style={{cursor: 'pointer', color: activeTab === 'DA_HOAN_THANH' ? '#ef4444' : 'inherit', borderBottom: activeTab === 'DA_HOAN_THANH' ? '2px solid #ef4444' : 'none', paddingBottom: '8px'}}>
                    Hoàn thành
                </div>
                <div 
                    onClick={() => setActiveTab('DA_HUY')} 
                    style={{cursor: 'pointer', color: activeTab === 'DA_HUY' ? '#ef4444' : 'inherit', borderBottom: activeTab === 'DA_HUY' ? '2px solid #ef4444' : 'none', paddingBottom: '8px'}}>
                    Đã hủy
                </div>
            </div>

            <div className="orders-table-wrapper">
                <div className="table-header">
                    <div style={{width: '10%'}}>ID</div>
                    <div style={{width: '25%'}}>Khách Hàng</div>
                    <div style={{width: '20%'}}>Xe Đăng Ký</div>
                    <div style={{width: '20%'}}>Chi Nhánh</div>
                    <div style={{width: '15%'}}>Thời Gian</div>
                    <div style={{width: '10%', textAlign: 'right'}}>Trạng Thái</div>
                </div>

                <div className="table-body">
                    {loading ? (
                        <div className="table-loading">Đang tải dữ liệu...</div>
                    ) : bookings.filter(b => activeTab === 'ALL' || b.trangThai === activeTab).length === 0 ? (
                        <div className="table-empty">Hệ thống chưa ghi nhận lịch lái thử nào.</div>
                    ) : (
                        bookings.filter(b => activeTab === 'ALL' || b.trangThai === activeTab).map((item) => (
                            <div key={item.id} className="table-row">
                                <div style={{width: '10%', fontFamily: 'monospace', fontWeight: 'bold'}}>#{item.id}</div>
                                <div style={{width: '25%'}} className="col-customer">
                                    <div className="customer-name">{item.hoTen}</div>
                                    <div className="customer-phone">{item.soDienThoai}</div>
                                </div>
                                <div style={{width: '20%', fontWeight: 600, color: '#111'}}>{item.tenDoiTuong}</div>
                                <div style={{width: '20%', fontSize: '13px'}}>{item.tenChiNhanh}</div>
                                <div style={{width: '15%', fontSize: '13px', color: '#4b5563'}}>{formatDate(item.ngayHen, item.gioHen)}</div>
                                <div style={{width: '10%', textAlign: 'right'}}>
                                    <select 
                                        className={`order-badge order-status-select order-status-${item.trangThai.toLowerCase()}`}
                                        value={item.trangThai}
                                        onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                                    >
                                        <option value="CHO_XAC_NHAN">Chờ xác nhận</option>
                                        <option value="DA_XAC_NHAN">Đã xác nhận</option>
                                        <option value="DA_HOAN_THANH">Hoàn thành</option>
                                        <option value="DA_HUY">Đã hủy</option>
                                    </select>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
