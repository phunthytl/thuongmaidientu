import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaCar, FaChartLine, FaClipboardList, FaExclamationCircle } from 'react-icons/fa';
import { api } from '../../services/api';
import '../../assets/css/TongQuan.css';

const PERIODS = [
    { key: 'day', label: 'Ngày' },
    { key: 'week', label: 'Tuần' },
    { key: 'month', label: 'Tháng' },
    { key: 'year', label: 'Năm' },
];

const STATUS_LABELS = {
    CHO_XAC_NHAN: 'Chờ xác nhận',
    DA_XAC_NHAN: 'Đã xác nhận',
    DANG_GIAO: 'Đang giao',
    HOAN_THANH: 'Hoàn thành',
    DA_HUY: 'Đã hủy',
};

const formatCurrency = (value) =>
    new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
    }).format(value || 0);

const formatDate = (date) =>
    new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(date);

const toDate = (value) => (value ? new Date(value) : new Date());

const isSameDay = (date, now) =>
    date.getFullYear() === now.getFullYear()
    && date.getMonth() === now.getMonth()
    && date.getDate() === now.getDate();

const getWeekStart = (date) => {
    const result = new Date(date);
    const day = result.getDay() || 7;
    result.setHours(0, 0, 0, 0);
    result.setDate(result.getDate() - day + 1);
    return result;
};

const getPeriodStart = (period, now = new Date()) => {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);

    if (period === 'day') return start;
    if (period === 'week') return getWeekStart(now);
    if (period === 'month') {
        start.setDate(1);
        return start;
    }
    start.setMonth(0, 1);
    return start;
};

const isInPeriod = (date, period, now = new Date()) => {
    if (period === 'day') return isSameDay(date, now);
    return date >= getPeriodStart(period, now) && date <= now;
};

const getChartBuckets = (period, now = new Date()) => {
    if (period === 'day') {
        return Array.from({ length: 8 }, (_, index) => {
            const hour = index * 3;
            const from = new Date(now);
            from.setHours(hour, 0, 0, 0);
            const to = new Date(now);
            to.setHours(hour + 2, 59, 59, 999);
            return { label: `${hour.toString().padStart(2, '0')}h`, from, to };
        });
    }

    if (period === 'week') {
        const start = getWeekStart(now);
        return Array.from({ length: 7 }, (_, index) => {
            const from = new Date(start);
            from.setDate(start.getDate() + index);
            const to = new Date(from);
            to.setHours(23, 59, 59, 999);
            return { label: index + 2 > 7 ? 'CN' : `T${index + 2}`, from, to };
        });
    }

    if (period === 'month') {
        const year = now.getFullYear();
        const month = now.getMonth();
        const ranges = [
            [1, 7],
            [8, 14],
            [15, 21],
            [22, 31],
        ];
        return ranges.map(([first, last], index) => {
            const from = new Date(year, month, first);
            const to = new Date(year, month, last, 23, 59, 59, 999);
            return { label: `Tuần ${index + 1}`, from, to };
        });
    }

    return Array.from({ length: 12 }, (_, index) => ({
        label: `T${index + 1}`,
        from: new Date(now.getFullYear(), index, 1),
        to: new Date(now.getFullYear(), index + 1, 0, 23, 59, 59, 999),
    }));
};

const isRevenueOrder = (order) => order.trangThai !== 'DA_HUY';

function RevenueLineChart({ data }) {
    const width = 720;
    const height = 260;
    const padding = 34;
    const max = Math.max(...data.map((item) => item.value), 1);
    const step = data.length > 1 ? (width - padding * 2) / (data.length - 1) : 0;

    const points = data.map((item, index) => {
        const x = padding + step * index;
        const y = height - padding - (item.value / max) * (height - padding * 2);
        return { ...item, x, y };
    });

    const path = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
    const chartKey = data.map((item) => `${item.label}:${item.value}`).join('|');

    return (
        <div className="revenue-chart">
            <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Biểu đồ doanh thu">
                <line className="chart-axis" x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} />
                <line className="chart-axis" x1={padding} y1={padding} x2={padding} y2={height - padding} />
                {[0.25, 0.5, 0.75].map((ratio) => (
                    <line
                        key={ratio}
                        className="chart-grid-line"
                        x1={padding}
                        y1={height - padding - ratio * (height - padding * 2)}
                        x2={width - padding}
                        y2={height - padding - ratio * (height - padding * 2)}
                    />
                ))}
                <path key={chartKey} className="chart-line" d={path} pathLength="100" />
                {points.map((point) => (
                    <g key={`${point.label}-${point.value}`} className="chart-point-group">
                        <circle className="chart-point" cx={point.x} cy={point.y} r="5" />
                        <title>{`${point.label}: ${formatCurrency(point.value)}`}</title>
                        <text className="chart-label" x={point.x} y={height - 8} textAnchor="middle">{point.label}</text>
                    </g>
                ))}
            </svg>
        </div>
    );
}

export default function TongQuan() {
    const navigate = useNavigate();
    const [period, setPeriod] = useState('month');
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({ oto: 0, phuKien: 0, khieuNai: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                const [otoRes, phuKienRes, donHangRes, khieuNaiRes] = await Promise.all([
                    api.get('/oto?size=1'),
                    api.get('/phu-kien?size=1'),
                    api.get('/don-hang?size=1000'),
                    api.get('/khieu-nai?size=1'),
                ]);

                setStats({
                    oto: otoRes.data?.data?.totalElements || 0,
                    phuKien: phuKienRes.data?.data?.totalElements || 0,
                    khieuNai: khieuNaiRes.data?.data?.totalElements || 0,
                });
                setOrders(donHangRes.data?.data?.content || []);
            } catch (err) {
                setError(err.response?.data?.message || 'Không thể tải dữ liệu tổng quan.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const dashboardData = useMemo(() => {
        const now = new Date();
        const revenueOrders = orders.filter(isRevenueOrder);
        const filteredOrders = revenueOrders.filter((order) => isInPeriod(toDate(order.ngayTao), period, now));
        const buckets = getChartBuckets(period, now).map((bucket) => {
            const value = filteredOrders
                .filter((order) => {
                    const date = toDate(order.ngayTao);
                    return date >= bucket.from && date <= bucket.to;
                })
                .reduce((sum, order) => sum + Number(order.tongTien || 0), 0);
            return { ...bucket, value };
        });

        const totalRevenue = filteredOrders.reduce((sum, order) => sum + Number(order.tongTien || 0), 0);
        const averageOrder = filteredOrders.length ? totalRevenue / filteredOrders.length : 0;
        const statusCounts = orders.reduce((acc, order) => {
            acc[order.trangThai] = (acc[order.trangThai] || 0) + 1;
            return acc;
        }, {});
        const recentOrders = [...orders]
            .sort((a, b) => toDate(b.ngayTao) - toDate(a.ngayTao))
            .slice(0, 6);

        return {
            filteredOrders,
            buckets,
            totalRevenue,
            averageOrder,
            statusCounts,
            recentOrders,
        };
    }, [orders, period]);

    const maxStatus = Math.max(...Object.values(dashboardData.statusCounts), 1);
    const currentPeriod = PERIODS.find((item) => item.key === period)?.label.toLowerCase();
    const goTo = (path) => navigate(path);

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div>
                    <p className="dashboard-subtitle">Báo cáo vận hành</p>
                    <h1 className="dashboard-title">Tổng quan kinh doanh</h1>
                    <p className="dashboard-description">Theo dõi doanh thu, đơn hàng và trạng thái hệ thống theo thời gian.</p>
                </div>
                <div className="dashboard-date-group">
                    <span><FaCalendarAlt /> Ngày hệ thống</span>
                    <strong>{formatDate(new Date())}</strong>
                </div>
            </header>

            <div className="dashboard-filter-bar">
                <div>
                    <span className="filter-label">Lọc doanh thu</span>
                    <div className="period-tabs" role="tablist" aria-label="Lọc doanh thu">
                        {PERIODS.map((item) => (
                            <button
                                key={item.key}
                                type="button"
                                className={period === item.key ? 'active' : ''}
                                onClick={() => setPeriod(item.key)}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {error && <div className="dashboard-alert">{error}</div>}

            <section className="dashboard-kpi-grid">
                <article
                    className="kpi-card revenue-card clickable-card"
                    role="button"
                    tabIndex={0}
                    onClick={() => goTo('/admin/orders')}
                    onKeyDown={(event) => event.key === 'Enter' && goTo('/admin/orders')}
                >
                    <div className="kpi-icon"><FaChartLine /></div>
                    <span className="kpi-title">Doanh thu {currentPeriod}</span>
                    <strong className="kpi-value money">{formatCurrency(dashboardData.totalRevenue)}</strong>
                    <span className="kpi-note">Không tính đơn đã hủy</span>
                </article>
                <article
                    className="kpi-card clickable-card"
                    role="button"
                    tabIndex={0}
                    onClick={() => goTo('/admin/orders')}
                    onKeyDown={(event) => event.key === 'Enter' && goTo('/admin/orders')}
                >
                    <div className="kpi-icon"><FaClipboardList /></div>
                    <span className="kpi-title">Đơn hàng {currentPeriod}</span>
                    <strong className="kpi-value">{dashboardData.filteredOrders.length}</strong>
                    <span className="kpi-note">Giá trị TB: {formatCurrency(dashboardData.averageOrder)}</span>
                </article>
                <article
                    className="kpi-card clickable-card"
                    role="button"
                    tabIndex={0}
                    onClick={() => goTo('/admin/products')}
                    onKeyDown={(event) => event.key === 'Enter' && goTo('/admin/products')}
                >
                    <div className="kpi-icon"><FaCar /></div>
                    <span className="kpi-title">Sản phẩm đang quản lý</span>
                    <strong className="kpi-value">{stats.oto + stats.phuKien}</strong>
                    <span className="kpi-note">{stats.oto} ô tô, {stats.phuKien} phụ kiện</span>
                </article>
                <article
                    className="kpi-card clickable-card"
                    role="button"
                    tabIndex={0}
                    onClick={() => goTo('/admin/disputes')}
                    onKeyDown={(event) => event.key === 'Enter' && goTo('/admin/disputes')}
                >
                    <div className="kpi-icon warning"><FaExclamationCircle /></div>
                    <span className="kpi-title">Khiếu nại</span>
                    <strong className="kpi-value">{stats.khieuNai}</strong>
                    <span className="kpi-note">Cần theo dõi xử lý</span>
                </article>
            </section>

            <section className="dashboard-main-grid">
                <article className="dashboard-panel chart-panel">
                    <div className="panel-heading">
                        <div>
                            <h2>Biểu đồ doanh thu</h2>
                            <p>Doanh thu gom theo mốc thời gian đã chọn</p>
                        </div>
                        {loading && <span className="panel-chip">Đang tải...</span>}
                    </div>
                    <RevenueLineChart data={dashboardData.buckets} />
                </article>

                <article className="dashboard-panel status-panel">
                    <div className="panel-heading">
                        <div>
                            <h2>Trạng thái đơn</h2>
                            <p>Tổng hợp toàn bộ đơn hàng</p>
                        </div>
                    </div>
                    <div className="status-list">
                        {Object.entries(STATUS_LABELS).map(([key, label]) => {
                            const value = dashboardData.statusCounts[key] || 0;
                            return (
                                <div
                                    className="status-item clickable-status"
                                    key={key}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => goTo('/admin/orders')}
                                    onKeyDown={(event) => event.key === 'Enter' && goTo('/admin/orders')}
                                >
                                    <div className="status-item-row">
                                        <span>{label}</span>
                                        <strong>{value}</strong>
                                    </div>
                                    <div className="status-bar">
                                        <span style={{ width: `${(value / maxStatus) * 100}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </article>
            </section>

            <section className="dashboard-panel recent-panel">
                <div className="panel-heading">
                    <div>
                        <h2>Đơn hàng gần đây</h2>
                        <p>Các giao dịch mới nhất trong hệ thống</p>
                    </div>
                </div>
                <div className="recent-table">
                    <div className="recent-row recent-head">
                        <span>Mã đơn</span>
                        <span>Khách hàng</span>
                        <span>Ngày tạo</span>
                        <span>Trạng thái</span>
                        <span>Giá trị</span>
                    </div>
                    {dashboardData.recentOrders.length === 0 ? (
                        <div className="empty-state">Chưa có đơn hàng để hiển thị.</div>
                    ) : dashboardData.recentOrders.map((order) => (
                        <div className="recent-row" key={order.id}>
                            <span className="order-code">{order.maDonHang || `ORD-${order.id}`}</span>
                            <span>{order.tenKhachHang || 'Khách hàng'}</span>
                            <span>{formatDate(toDate(order.ngayTao))}</span>
                            <span><em>{STATUS_LABELS[order.trangThai] || order.trangThai}</em></span>
                            <span className="money-cell">{formatCurrency(order.tongTien)}</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
