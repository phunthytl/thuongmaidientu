import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
    PieChart, Pie, Cell, Legend,
    BarChart, Bar,
} from 'recharts';
import { api } from '../../services/api';
import '../../assets/css/TongQuan.css';

const STATUS_LABEL = {
    CHO_XAC_NHAN: 'Chờ Xác Nhận',
    DA_XAC_NHAN:  'Đã Xác Nhận',
    DANG_XU_LY:   'Đang Xử Lý',
    DANG_GIAO:    'Đang Giao',
    HOAN_THANH:   'Hoàn Thành',
    DA_HUY:       'Đã Hủy',
};

const STATUS_COLOR = {
    CHO_XAC_NHAN: '#f59e0b',
    DA_XAC_NHAN:  '#3b82f6',
    DANG_XU_LY:   '#8b5cf6',
    DANG_GIAO:    '#06b6d4',
    HOAN_THANH:   '#10b981',
    DA_HUY:       '#ef4444',
};

const PRODUCT_TYPE_LABEL = {
    OTO: 'Ô tô', PHU_KIEN: 'Phụ kiện', DICH_VU: 'Dịch vụ',
};

const formatVND = (n) => new Intl.NumberFormat('vi-VN').format(Math.round(n || 0)) + '₫';
const formatVNDCompact = (n) => {
    const v = Number(n || 0);
    if (v >= 1e9) return (v / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
    if (v >= 1e6) return (v / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
    if (v >= 1e3) return (v / 1e3).toFixed(0) + 'K';
    return v.toString();
};
const formatPct = (p) => {
    if (p == null || isNaN(p)) return '—';
    const sign = p > 0 ? '+' : '';
    return `${sign}${p.toFixed(1)}%`;
};

function KpiCard({ title, value, change, prefix = '', suffix = '' }) {
    const isUp = change > 0;
    const isDown = change < 0;
    return (
        <div className="kpi-card">
            <h3 className="kpi-title">{title}</h3>
            <p className="kpi-value" style={{ fontSize: '36px' }}>
                {prefix}{value}{suffix}
            </p>
            <div className={`kpi-trend ${isDown ? 'negative' : ''}`} style={{ color: isUp ? '#10b981' : isDown ? '#ef4444' : '#888' }}>
                {isUp ? '▲' : isDown ? '▼' : '•'} {formatPct(change)} so với kỳ trước
            </div>
        </div>
    );
}

export default function TongQuan() {
    const [days, setDays] = useState(30);
    const [loading, setLoading] = useState(true);
    const [kpi, setKpi] = useState(null);
    const [trend, setTrend] = useState([]);
    const [statusStats, setStatusStats] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const [kpiR, trendR, statusR, topR, recentR] = await Promise.all([
                    api.get(`/admin/dashboard/kpi?days=${days}`),
                    api.get(`/admin/dashboard/revenue-trend?days=${days}`),
                    api.get(`/admin/dashboard/order-status?days=${days}`),
                    api.get(`/admin/dashboard/top-products?days=${days}&limit=5`),
                    api.get(`/admin/dashboard/recent-orders`),
                ]);
                setKpi(kpiR.data?.data);
                setTrend(trendR.data?.data || []);
                setStatusStats(statusR.data?.data || []);
                setTopProducts(topR.data?.data || []);
                setRecentOrders(recentR.data?.data || []);
            } catch (err) {
                console.error('Dashboard load error', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [days]);

    const trendChartData = useMemo(() =>
        (trend || []).map(p => ({
            ngay: p.ngay,
            label: p.ngay ? new Date(p.ngay).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) : '',
            doanhThu: Number(p.doanhThu || 0),
            soDonHang: Number(p.soDonHang || 0),
        })),
    [trend]);

    const statusPieData = useMemo(() =>
        (statusStats || []).filter(s => s.soLuong > 0).map(s => ({
            name: STATUS_LABEL[s.trangThai] || s.trangThai,
            value: Number(s.soLuong || 0),
            color: STATUS_COLOR[s.trangThai] || '#999',
        })),
    [statusStats]);

    const totalOrdersInPeriod = useMemo(() =>
        (statusStats || []).reduce((s, x) => s + Number(x.soLuong || 0), 0),
    [statusStats]);

    return (
        <div className="dashboard-container">
            {/* HEADER */}
            <header className="dashboard-header" style={{ alignItems: 'center' }}>
                <div className="dashboard-title-group">
                    <h2 className="dashboard-subtitle">BÁO CÁO</h2>
                    <h1 className="dashboard-title">Tổng Quan Kinh Doanh</h1>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: 13, color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>Khoảng thời gian:</span>
                    <select
                        value={days}
                        onChange={e => setDays(Number(e.target.value))}
                        style={{
                            padding: '10px 16px', border: '1px solid #d1d5db', borderRadius: '8px',
                            background: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                            fontFamily: 'inherit',
                        }}
                    >
                        <option value={7}>7 ngày qua</option>
                        <option value={30}>30 ngày qua</option>
                        <option value={90}>90 ngày qua</option>
                        <option value={365}>1 năm qua</option>
                    </select>
                </div>
            </header>

            {/* KPI CARDS */}
            <div className="dashboard-kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                <KpiCard
                    title="Doanh Thu"
                    value={loading ? '—' : formatVND(kpi?.tongDoanhThu)}
                    change={kpi?.doanhThuChangePercent}
                />
                <KpiCard
                    title="Số Đơn Hàng"
                    value={loading ? '—' : (kpi?.soDonHang ?? 0)}
                    change={kpi?.donHangChangePercent}
                />
                <KpiCard
                    title="Khách Đặt Hàng"
                    value={loading ? '—' : (kpi?.khachMoi ?? 0)}
                    change={kpi?.khachMoiChangePercent}
                />
                <KpiCard
                    title="Giá Trị TB / Đơn"
                    value={loading ? '—' : formatVND(kpi?.aov)}
                    change={kpi?.aovChangePercent}
                />
            </div>

            {/* CHARTS ROW */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '48px' }} className="dashboard-charts-row">

                {/* REVENUE TREND */}
                <div className="chart-card">
                    <div className="chart-card-header">
                        <h3>Doanh thu theo ngày</h3>
                        <span className="chart-card-sub">{days} ngày qua — chỉ tính đơn HOÀN THÀNH</span>
                    </div>
                    <div style={{ width: '100%', height: 280 }}>
                        <ResponsiveContainer>
                            <AreaChart data={trendChartData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#c5a059" stopOpacity={0.35} />
                                        <stop offset="100%" stopColor="#c5a059" stopOpacity={0.02} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} />
                                <YAxis tickFormatter={formatVNDCompact} tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    formatter={(v) => [formatVND(v), 'Doanh thu']}
                                    labelFormatter={(l) => 'Ngày ' + l}
                                    contentStyle={{ border: '1px solid #e5e5e5', borderRadius: '8px', fontSize: 13 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="doanhThu"
                                    stroke="#c5a059"
                                    strokeWidth={2.5}
                                    fill="url(#revGrad)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* ORDER STATUS DONUT */}
                <div className="chart-card">
                    <div className="chart-card-header">
                        <h3>Trạng thái đơn</h3>
                        <span className="chart-card-sub">Tổng {totalOrdersInPeriod} đơn</span>
                    </div>
                    {statusPieData.length === 0 ? (
                        <div className="chart-empty">Chưa có đơn hàng trong kỳ này</div>
                    ) : (
                        <div style={{ width: '100%', height: 280 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={statusPieData}
                                        innerRadius={55}
                                        outerRadius={90}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {statusPieData.map((s, i) => (
                                            <Cell key={i} fill={s.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(v, n) => [`${v} đơn`, n]} contentStyle={{ border: '1px solid #e5e5e5', borderRadius: '8px', fontSize: 13 }} />
                                    <Legend
                                        verticalAlign="bottom"
                                        iconType="circle"
                                        wrapperStyle={{ fontSize: 11 }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            </div>

            {/* TOP PRODUCTS + RECENT ORDERS */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }} className="dashboard-bottom-row">

                {/* TOP PRODUCTS */}
                <div className="chart-card">
                    <div className="chart-card-header">
                        <h3>Top 5 sản phẩm bán chạy</h3>
                        <span className="chart-card-sub">Theo doanh thu — {days} ngày</span>
                    </div>
                    {topProducts.length === 0 ? (
                        <div className="chart-empty">Chưa có sản phẩm bán ra</div>
                    ) : (
                        <ul className="top-product-list">
                            {topProducts.map((p, i) => (
                                <li key={`${p.loaiSanPham}-${p.sanPhamId}`}>
                                    <span className="rank">{i + 1}</span>
                                    <div className="info">
                                        <div className="name" title={p.tenSanPham}>{p.tenSanPham}</div>
                                        <div className="meta">
                                            <span className={`type-badge type-${p.loaiSanPham}`}>{PRODUCT_TYPE_LABEL[p.loaiSanPham] || p.loaiSanPham}</span>
                                            <span>· {p.soLuongBan} đã bán</span>
                                        </div>
                                    </div>
                                    <div className="revenue">{formatVND(p.doanhThu)}</div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* RECENT ORDERS */}
                <div className="chart-card">
                    <div className="chart-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3>Đơn hàng gần đây</h3>
                            <span className="chart-card-sub">10 đơn mới nhất</span>
                        </div>
                        <Link to="/admin/orders" style={{ fontSize: 12, color: '#c5a059', textDecoration: 'none', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                            Xem tất cả →
                        </Link>
                    </div>
                    {recentOrders.length === 0 ? (
                        <div className="chart-empty">Chưa có đơn hàng</div>
                    ) : (
                        <table className="recent-orders-table">
                            <thead>
                                <tr>
                                    <th>Mã đơn</th>
                                    <th>Khách hàng</th>
                                    <th style={{ textAlign: 'right' }}>Tổng tiền</th>
                                    <th>Trạng thái</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map(o => (
                                    <tr key={o.id}>
                                        <td className="mono">{o.maDonHang || `#${o.id}`}</td>
                                        <td>{o.tenKhachHang || '—'}</td>
                                        <td className="num">{formatVND(o.tongTien)}</td>
                                        <td>
                                            <span className="status-pill" style={{
                                                background: (STATUS_COLOR[o.trangThai] || '#999') + '20',
                                                color: STATUS_COLOR[o.trangThai] || '#999',
                                            }}>
                                                {STATUS_LABEL[o.trangThai] || o.trangThai}
                                            </span>
                                        </td>
                                        <td>
                                            <Link to={`/admin/orders/${o.id}`} className="row-action-link">→</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
