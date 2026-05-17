import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import '../../assets/css/TongQuan.css';

const ORDER_STATUS_LABELS = {
    CHO_XAC_NHAN: 'Chờ xác nhận',
    DA_XAC_NHAN: 'Đã xác nhận',
    DANG_XU_LY: 'Đang xử lý',
    DANG_GIAO: 'Đang giao',
    HOAN_THANH: 'Hoàn thành',
    DA_HUY: 'Đã hủy',
};

const DISPUTE_STATUS_LABELS = {
    MOI: 'Mới',
    DANG_XU_LY: 'Đang xử lý',
    DA_GIAI_QUYET: 'Đã giải quyết',
    TU_CHOI: 'Từ chối',
};

const emptyStats = {
    cars: 0,
    accessories: 0,
    services: 0,
    customers: 0,
    orders: 0,
    pendingOrders: 0,
    disputes: 0,
    openDisputes: 0,
    lowStock: 0,
    revenue: 0,
};

const unwrapPage = (res) => res?.data?.data?.content || [];
const unwrapTotal = (res) => res?.data?.data?.totalElements ?? unwrapPage(res).length ?? 0;

export default function TongQuan() {
    const navigate = useNavigate();
    const [stats, setStats] = useState(emptyStats);
    const [orders, setOrders] = useState([]);
    const [disputes, setDisputes] = useState([]);
    const [lowStockItems, setLowStockItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboard = async () => {
            setLoading(true);
            setError('');
            try {
                const [
                    carsRes,
                    accessoriesRes,
                    servicesRes,
                    customersRes,
                    ordersRes,
                    disputesRes,
                ] = await Promise.all([
                    api.get('/oto?size=1'),
                    api.get('/phu-kien?size=1000'),
                    api.get('/dich-vu?size=1'),
                    api.get('/nguoi-dung/khach-hang?size=1').catch(() => null),
                    api.get('/don-hang?size=1000&sort=ngayTao,desc'),
                    api.get('/khieu-nai?size=1000&sort=ngayTao,desc'),
                ]);

                const accessoryList = unwrapPage(accessoriesRes);
                const orderList = unwrapPage(ordersRes);
                const disputeList = unwrapPage(disputesRes);
                const stockAlerts = accessoryList
                    .filter((item) => (Number(item.soLuong) || 0) <= 5)
                    .sort((a, b) => (Number(a.soLuong) || 0) - (Number(b.soLuong) || 0))
                    .slice(0, 6);

                const completedRevenue = orderList
                    .filter((order) => order.trangThai !== 'DA_HUY')
                    .reduce((sum, order) => sum + Number(order.tongTien || order.tongGiaTri || 0), 0);

                setStats({
                    cars: unwrapTotal(carsRes),
                    accessories: unwrapTotal(accessoriesRes),
                    services: unwrapTotal(servicesRes),
                    customers: customersRes ? unwrapTotal(customersRes) : 0,
                    orders: unwrapTotal(ordersRes),
                    pendingOrders: orderList.filter((order) => ['CHO_XAC_NHAN', 'DA_XAC_NHAN', 'DANG_XU_LY'].includes(order.trangThai)).length,
                    disputes: unwrapTotal(disputesRes),
                    openDisputes: disputeList.filter((item) => ['MOI', 'DANG_XU_LY'].includes(item.trangThai)).length,
                    lowStock: stockAlerts.length,
                    revenue: completedRevenue,
                });
                setOrders(orderList.slice(0, 7));
                setDisputes(disputeList.slice(0, 5));
                setLowStockItems(stockAlerts);
            } catch (err) {
                console.error('Failed to fetch dashboard data', err);
                setError(err.response?.data?.message || 'Không tải được dữ liệu tổng quan.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const orderStatusCounts = useMemo(() => {
        return orders.reduce((map, order) => {
            const key = order.trangThai || 'UNKNOWN';
            map[key] = (map[key] || 0) + 1;
            return map;
        }, {});
    }, [orders]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0,
        }).format(value || 0);
    };

    const formatDate = (value) => {
        if (!value) return '---';
        return new Date(value).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="dashboard-title-group">
                    <h2 className="dashboard-subtitle">Báo cáo điều hành</h2>
                    <h1 className="dashboard-title">Bảng điều khiển quản trị</h1>
                    <p className="dashboard-description">Theo dõi đơn hàng, sản phẩm, tồn kho và khiếu nại trong hệ thống.</p>
                </div>
                <div className="dashboard-date-group">
                    <p className="dashboard-date-label">Cập nhật</p>
                    <p className="dashboard-date-value">{new Date().toLocaleString('vi-VN')}</p>
                </div>
            </header>

            {error && <div className="dashboard-alert">{error}</div>}

            <div className="dashboard-kpi-grid">
                <button className="kpi-card" onClick={() => navigate('/admin/orders')}>
                    <span className="kpi-title">Đơn hàng</span>
                    <strong className="kpi-value">{loading ? '...' : stats.orders}</strong>
                    <span className="kpi-trend">{stats.pendingOrders} cần xử lý</span>
                </button>
                <button className="kpi-card" onClick={() => navigate('/admin/products')}>
                    <span className="kpi-title">Ô tô đang quản lý</span>
                    <strong className="kpi-value">{loading ? '...' : stats.cars}</strong>
                    <span className="kpi-trend">Danh mục xe</span>
                </button>
                <button className="kpi-card" onClick={() => navigate('/admin/products/accessories')}>
                    <span className="kpi-title">Phụ kiện</span>
                    <strong className="kpi-value">{loading ? '...' : stats.accessories}</strong>
                    <span className={`kpi-trend ${stats.lowStock > 0 ? 'negative' : ''}`}>{stats.lowStock} sắp hết hàng</span>
                </button>
                <button className="kpi-card" onClick={() => navigate('/admin/disputes')}>
                    <span className="kpi-title">Khiếu nại</span>
                    <strong className="kpi-value">{loading ? '...' : stats.disputes}</strong>
                    <span className={`kpi-trend ${stats.openDisputes > 0 ? 'negative' : ''}`}>{stats.openDisputes} đang mở</span>
                </button>
            </div>

            <div className="dashboard-summary-grid">
                <section className="dashboard-panel dashboard-revenue-panel">
                    <div className="panel-header">
                        <div>
                            <h3>Doanh thu đơn phụ kiện</h3>
                            <p>Tính trên các đơn trong dữ liệu hiện có, không bao gồm đơn đã hủy.</p>
                        </div>
                    </div>
                    <div className="revenue-value">{formatCurrency(stats.revenue)}</div>
                    <div className="mini-metrics">
                        <div>
                            <span>Khách hàng</span>
                            <strong>{stats.customers}</strong>
                        </div>
                        <div>
                            <span>Dịch vụ</span>
                            <strong>{stats.services}</strong>
                        </div>
                    </div>
                </section>

                <section className="dashboard-panel">
                    <div className="panel-header">
                        <div>
                            <h3>Trạng thái đơn gần đây</h3>
                            <p>Phân bổ theo danh sách đơn mới nhất.</p>
                        </div>
                    </div>
                    <div className="status-stack">
                        {Object.entries(ORDER_STATUS_LABELS).map(([key, label]) => (
                            <div className="status-row" key={key}>
                                <span>{label}</span>
                                <strong>{orderStatusCounts[key] || 0}</strong>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <div className="dashboard-work-grid">
                <section className="dashboard-panel">
                    <div className="panel-header">
                        <div>
                            <h3>Đơn hàng mới</h3>
                            <p>Các đơn cần theo dõi gần đây.</p>
                        </div>
                        <button onClick={() => navigate('/admin/orders')}>Xem tất cả</button>
                    </div>
                    <div className="dashboard-list">
                        {orders.length === 0 ? (
                            <div className="dashboard-empty">Chưa có đơn hàng.</div>
                        ) : orders.map((order) => (
                            <button key={order.id} className="dashboard-list-row" onClick={() => navigate(`/admin/orders/${order.id}`)}>
                                <span>
                                    <strong>{order.maDonHang || `ORD-${order.id}`}</strong>
                                    <small>{order.tenKhachHang || order.khachHang?.hoTen || 'Khách hàng'}</small>
                                </span>
                                <span>
                                    <strong>{formatCurrency(order.tongTien || order.tongGiaTri)}</strong>
                                    <small>{ORDER_STATUS_LABELS[order.trangThai] || order.trangThai || '---'}</small>
                                </span>
                            </button>
                        ))}
                    </div>
                </section>

                <section className="dashboard-panel">
                    <div className="panel-header">
                        <div>
                            <h3>Cảnh báo tồn kho</h3>
                            <p>Phụ kiện có tổng số lượng thấp.</p>
                        </div>
                        <button onClick={() => navigate('/admin/inventory/accessories')}>Cập nhật</button>
                    </div>
                    <div className="dashboard-list">
                        {lowStockItems.length === 0 ? (
                            <div className="dashboard-empty">Không có mặt hàng sắp hết.</div>
                        ) : lowStockItems.map((item) => (
                            <button key={item.id} className="dashboard-list-row" onClick={() => navigate(`/admin/products/accessories/${item.id}`)}>
                                <span>
                                    <strong>{item.tenPhuKien || `PK-${item.id}`}</strong>
                                    <small>{item.hangSanXuat || 'Chưa có hãng sản xuất'}</small>
                                </span>
                                <span className={(item.soLuong || 0) === 0 ? 'danger-text' : ''}>
                                    <strong>{item.soLuong || 0}</strong>
                                    <small>tồn kho</small>
                                </span>
                            </button>
                        ))}
                    </div>
                </section>

                <section className="dashboard-panel">
                    <div className="panel-header">
                        <div>
                            <h3>Khiếu nại mới</h3>
                            <p>Các phản hồi cần xử lý.</p>
                        </div>
                        <button onClick={() => navigate('/admin/disputes')}>Xem thêm</button>
                    </div>
                    <div className="dashboard-list">
                        {disputes.length === 0 ? (
                            <div className="dashboard-empty">Chưa có khiếu nại.</div>
                        ) : disputes.map((item) => (
                            <button key={item.id} className="dashboard-list-row" onClick={() => navigate(`/admin/disputes/${item.id}`)}>
                                <span>
                                    <strong>{item.tieuDe || `KN-${item.id}`}</strong>
                                    <small>{item.khachHang?.hoTen || 'Khách hàng'} - {formatDate(item.createdAt || item.ngayTao)}</small>
                                </span>
                                <span>
                                    <strong>{DISPUTE_STATUS_LABELS[item.trangThai] || item.trangThai || '---'}</strong>
                                    <small>trạng thái</small>
                                </span>
                            </button>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
