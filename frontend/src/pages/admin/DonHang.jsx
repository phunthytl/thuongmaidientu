import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import '../../assets/css/DonHang.css';

export default function DonHang() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('ALL');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/don-hang?size=15');
                if (res.data?.data?.content) {
                    setOrders(res.data.data.content);
                }
            } catch (err) {
                console.error('Failed to fetch orders', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await api.patch(`/don-hang/${id}/trang-thai?trangThai=${newStatus}`);
            // Optimistic update
            setOrders(prev => prev.map(order => 
                order.id === id || order.maDonHang === id ? { ...order, trangThai: newStatus } : order
            ));
        } catch (err) {
            console.error('Failed to update status', err);
            alert(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật!');
        }
    };

    const formatPrice = (price) => {
        if (price == null) return '0 đ';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '---';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    }

    const getPaymentStatus = (order) => {
        const isPaid = order.thanhToan?.trangThai === 'DA_THANH_TOAN';
        return {
            label: isPaid ? 'Đã thanh toán' : 'Chưa thanh toán',
            className: isPaid ? 'payment-paid' : 'payment-unpaid',
            method: order.thanhToan?.phuongThuc === 'VNPAY' ? 'VNPay' : 'COD'
        };
    };

    return (
        <div className="orders-container">
            <header className="orders-header">
                <div className="title-group">
                    <h2 className="orders-subtitle">Hệ Thống Bán Lẻ</h2>
                    <h1 className="orders-title">Quản Lý Đơn Phụ Kiện</h1>
                </div>
                <div className="action-group">
                    <button className="btn-export-orders">Xuất Báo Cáo</button>
                    <button className="btn-export-orders btn-export-history">Lịch sử Xuất Báo cáo</button>
                </div>
            </header>

            {/* Premium Navigation Tabs */}
            <div className="orders-tabs">
                <button 
                    className={`tab-item ${activeTab === 'ALL' ? 'active' : ''}`}
                    onClick={() => setActiveTab('ALL')}
                >
                    Tất cả
                </button>
                <button 
                    className={`tab-item ${activeTab === 'CHO_XAC_NHAN' ? 'active' : ''}`}
                    onClick={() => setActiveTab('CHO_XAC_NHAN')}
                >
                    Chờ xác nhận
                </button>
                <button 
                    className={`tab-item ${activeTab === 'DA_XAC_NHAN' ? 'active' : ''}`}
                    onClick={() => setActiveTab('DA_XAC_NHAN')}
                >
                    Chờ lấy hàng
                </button>
                <button 
                    className={`tab-item ${activeTab === 'DANG_GIAO' ? 'active' : ''}`}
                    onClick={() => setActiveTab('DANG_GIAO')}
                >
                    Đang giao
                </button>
                <button 
                    className={`tab-item ${activeTab === 'HOAN_THANH' ? 'active' : ''}`}
                    onClick={() => setActiveTab('HOAN_THANH')}
                >
                    Đã giao
                </button>
                <button 
                    className={`tab-item ${activeTab === 'DA_HUY' ? 'active' : ''}`}
                    onClick={() => setActiveTab('DA_HUY')}
                >
                    Trả hàng/Hoàn tiền/Hủy
                </button>
            </div>

            <div className="orders-table-wrapper">
                <div className="table-header">
                    <div className="col-order-id">Mã Đơn Định Danh</div>
                    <div className="col-customer">Khách Hàng</div>
                    <div className="col-date">Thời Gian Cập Nhật</div>
                    <div className="col-total">Tổng Giá Trị</div>
                    <div className="col-status">Trạng Thái</div>
                    <div className="col-payment">Thanh Toán</div>
                    <div className="col-actions">Thao Tác</div>
                </div>

                <div className="table-body">
                    {loading ? (
                        <div className="table-loading">Đang tải danh sách đơn hàng...</div>
                    ) : orders.filter(o => activeTab === 'ALL' || o.trangThai === activeTab).length === 0 ? (
                        <div className="table-empty">Hệ thống chưa ghi nhận đơn hàng nào ở trạng thái này.</div>
                    ) : (
                        orders.filter(o => activeTab === 'ALL' || o.trangThai === activeTab).map((item) => {
                            const paymentStatus = getPaymentStatus(item);
                            return (
                            <div key={item.id} className="table-row">
                                <div className="col-order-id">{item.maDonHang || `ORD-${item.id}`}</div>
                                <div className="col-customer">
                                    <div className="customer-name">{item.tenKhachHang || item.khachHang?.hoTen || item.nguoiDung?.hoTen || 'Khách Vãng Lai'}</div>
                                    <div className="customer-phone">{item.soDienThoaiKhachHang || item.khachHang?.soDienThoai || item.nguoiDung?.soDienThoai || '---'}</div>
                                </div>
                                <div className="col-date">{formatDate(item.createdAt || item.ngayTao || item.thoiGianCapNhat)}</div>
                                <div className="col-total">{formatPrice(item.tongTien || item.tongGiaTri)}</div>
                                <div className="col-status">
                                    <select 
                                        className={`order-badge order-status-select order-status-${(item.trangThai || '').toLowerCase()}`}
                                        value={item.trangThai || 'CHO_XAC_NHAN'}
                                        onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                                        title="Thay đổi trạng thái"
                                    >
                                        <option value="CHO_XAC_NHAN">Chờ xác nhận</option>
                                        <option value="DA_XAC_NHAN">Đã xác nhận</option>
                                        <option value="DANG_XU_LY">Đang tiếp nhận</option>
                                        <option value="DANG_GIAO">Đang giao hàng</option>
                                        <option value="HOAN_THANH">Đã hoàn thành</option>
                                        <option value="DA_HUY">Đã hủy</option>
                                    </select>
                                </div>
                                <div className="col-payment">
                                    <span className={`payment-badge ${paymentStatus.className}`}>
                                        {paymentStatus.label}
                                    </span>
                                    <span className="payment-method">{paymentStatus.method}</span>
                                </div>
                                <div className="col-actions">
                                    <button 
                                        className="btn-view-order"
                                        onClick={() => navigate(`/admin/orders/${item.id}`)}
                                    >
                                        Hồ Sơ
                                    </button>
                                </div>
                            </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
