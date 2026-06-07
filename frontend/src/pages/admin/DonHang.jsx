import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import '../../assets/css/DonHang.css';

export default function DonHang() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/don-hang?size=200&sort=ngayTao,desc');
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

    const getOrderDate = (order) => order.createdAt || order.ngayTao || order.thoiGianCapNhat;

    const normalizeText = (value) => String(value || '').toLowerCase().trim();

    const matchesDateRange = (order) => {
        const rawDate = getOrderDate(order);
        if (!rawDate || (!dateFrom && !dateTo)) return true;

        const orderDate = new Date(rawDate);
        if (Number.isNaN(orderDate.getTime())) return true;

        if (dateFrom) {
            const from = new Date(`${dateFrom}T00:00:00`);
            if (orderDate < from) return false;
        }

        if (dateTo) {
            const to = new Date(`${dateTo}T23:59:59`);
            if (orderDate > to) return false;
        }

        return true;
    };

    const matchesSearch = (order) => {
        const keyword = normalizeText(searchTerm);
        if (!keyword) return true;

        const customerName = order.tenKhachHang || order.khachHang?.hoTen || order.nguoiDung?.hoTen;
        const customerPhone = order.soDienThoaiKhachHang || order.khachHang?.soDienThoai || order.nguoiDung?.soDienThoai;
        const haystack = [
            order.maDonHang,
            `ORD-${order.id}`,
            customerName,
            customerPhone,
            order.trangThai,
            order.tongTien,
            order.tongGiaTri
        ].map(normalizeText).join(' ');

        return haystack.includes(keyword);
    };

    const filteredOrders = orders.filter((order) =>
        (activeTab === 'ALL' || order.trangThai === activeTab) &&
        matchesDateRange(order) &&
        matchesSearch(order)
    );

    const resetFilters = () => {
        setSearchTerm('');
        setDateFrom('');
        setDateTo('');
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
                    <button className="btn-export-orders" style={{marginLeft: '8px'}}>Lịch sử Xuất Báo cáo</button>
                </div>
            </header>

            {/* Tabs Filter theo phong cách GHN */}
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
                    Chờ lấy hàng
                </div>
                <div 
                    onClick={() => setActiveTab('DANG_GIAO')} 
                    style={{cursor: 'pointer', color: activeTab === 'DANG_GIAO' ? '#ef4444' : 'inherit', borderBottom: activeTab === 'DANG_GIAO' ? '2px solid #ef4444' : 'none', paddingBottom: '8px'}}>
                    Đang giao
                </div>
                <div 
                    onClick={() => setActiveTab('HOAN_THANH')} 
                    style={{cursor: 'pointer', color: activeTab === 'HOAN_THANH' ? '#ef4444' : 'inherit', borderBottom: activeTab === 'HOAN_THANH' ? '2px solid #ef4444' : 'none', paddingBottom: '8px'}}>
                    Đã giao
                </div>
                <div 
                    onClick={() => setActiveTab('DA_HUY')} 
                    style={{cursor: 'pointer', color: activeTab === 'DA_HUY' ? '#ef4444' : 'inherit', borderBottom: activeTab === 'DA_HUY' ? '2px solid #ef4444' : 'none', paddingBottom: '8px'}}>
                    Trả hàng/Hoàn tiền/Hủy
                </div>
            </div>

            <div className="orders-filter-bar">
                <div className="orders-search-field">
                    <input
                        type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Tìm mã đơn, khách hàng, số điện thoại..."
                    />
                </div>
                <div className="orders-date-field">
                    <label>Từ ngày</label>
                    <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                    />
                </div>
                <div className="orders-date-field">
                    <label>Đến ngày</label>
                    <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                    />
                </div>
                <button className="btn-clear-order-filters" onClick={resetFilters}>
                    Xóa lọc
                </button>
                <div className="orders-filter-count">
                    {filteredOrders.length} / {orders.length} đơn
                </div>
            </div>

            <div className="orders-table-wrapper">
                <div className="table-header">
                    <div className="col-order-id">Mã Đơn Định Danh</div>
                    <div className="col-customer">Khách Hàng</div>
                    <div className="col-date">Thời Gian Cập Nhật</div>
                    <div className="col-total">Tổng Giá Trị</div>
                    <div className="col-status">Trạng Thái</div>
                    <div className="col-actions" style={{ flex: '0 0 100px', textAlign: 'right' }}>Thao Tác</div>
                </div>

                <div className="table-body">
                    {loading ? (
                        <div className="table-loading">Đang tải danh sách đơn hàng...</div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="table-empty">Không tìm thấy đơn hàng phù hợp với bộ lọc.</div>
                    ) : (
                        filteredOrders.map((item) => (
                            <div key={item.id} className="table-row">
                                <div className="col-order-id">{item.maDonHang || `ORD-${item.id}`}</div>
                                <div className="col-customer">
                                    <div className="customer-name">{item.tenKhachHang || item.khachHang?.hoTen || item.nguoiDung?.hoTen || 'Khách Vãng Lai'}</div>
                                    <div className="customer-phone">{item.soDienThoaiKhachHang || item.khachHang?.soDienThoai || item.nguoiDung?.soDienThoai || '---'}</div>
                                </div>
                                <div className="col-date">{formatDate(getOrderDate(item))}</div>
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
                                <div className="col-actions" style={{ flex: '0 0 100px', textAlign: 'right' }}>
                                    <button 
                                        onClick={() => navigate(`/admin/orders/${item.id}`)}
                                        style={{ background: 'transparent', border: '1px solid #d1d5db', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
                                    >
                                        Hồ Sơ
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
