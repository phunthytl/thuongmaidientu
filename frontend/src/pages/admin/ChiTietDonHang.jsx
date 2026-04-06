import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import '../../assets/css/ChiTiet.css';

const STATUS_MAP = {
    CHO_XAC_NHAN: { label: 'Chờ Xác Nhận',      color: '#f59e0b' },
    DA_XAC_NHAN:  { label: 'Đã Xác Nhận',        color: '#3b82f6' },
    DANG_XU_LY:   { label: 'Đang Xử Lý',         color: '#8b5cf6' },
    DANG_GIAO:    { label: 'Đang Giao Hàng',     color: '#06b6d4' },
    HOAN_THANH:   { label: 'Hoàn Thành',         color: '#10b981' },
    DA_HUY:       { label: 'Đã Hủy',             color: '#ef4444' },
};

const PAYMENT_MAP = {
    VNPAY:       'VNPay',
    MOMO:        'MoMo',
    TIEN_MAT:    'Tiền Mặt (COD)',
    CHUYEN_KHOAN:'Chuyển Khoản',
};

const PAYMENT_STATUS_MAP = {
    CHO_THANH_TOAN: { label: 'Chờ Thanh Toán', color: '#f59e0b' },
    DA_THANH_TOAN:  { label: 'Đã Thanh Toán',  color: '#10b981' },
    THAT_BAI:       { label: 'Thất Bại',        color: '#ef4444' },
    HOAN_TIEN:      { label: 'Đã Hoàn Tiền',   color: '#6b7280' },
};

const fmt = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);

const fmtDate = (d) => (d ? new Date(d).toLocaleString('vi-VN') : '---');

const getProductName = (item) => {
    if (item.loaiSanPham === 'OTO')     return item.oto?.tenXe     || 'Ô Tô';
    if (item.loaiSanPham === 'PHU_KIEN') return item.phuKien?.tenPhuKien || 'Phụ Kiện';
    if (item.loaiSanPham === 'DICH_VU') return item.dichVu?.tenDichVu   || 'Dịch Vụ';
    return 'Sản phẩm';
};

export default function ChiTietDonHang() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');
    const [processing, setProcessing] = useState(false);

    const fetchOrder = async () => {
        try {
            const res = await api.get(`/don-hang/${id}`);
            const data = res.data?.data;
            setOrder(data);
            setStatus(data?.trangThai || 'CHO_XAC_NHAN');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrder(); }, [id]);

    const handleUpdateStatus = async () => {
        if (!status || status === order.trangThai) return;
        setProcessing(true);
        try {
            await api.patch(`/don-hang/${id}/trang-thai?trangThai=${status}`);
            await fetchOrder();
            alert('Cập nhật trạng thái thành công!');
        } catch (err) {
            alert(err.response?.data?.message || 'Lỗi hệ thống: ' + (err.response?.data?.error || 'Vui lòng thử lại'));
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div className="view-loading">Đang tải đơn hàng...</div>;
    if (!order)  return <div className="view-empty">Không tìm thấy đơn hàng.</div>;

    const dia = order.diaChiGiaoHang;
    const kho = order.khoXuatHang;
    const statusInfo = STATUS_MAP[order.trangThai] || { label: order.trangThai, color: '#6b7280' };

    return (
        <div className="view-car-container" style={{ maxWidth: 1100, margin: '0 auto' }}>

            {/* ── HEADER ── */}
            <header className="view-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <button className="btn-back" onClick={() => navigate('/admin/orders')}>← Quản lý đơn hàng</button>
                    <h1 className="view-title" style={{ margin: '8px 0 4px' }}>
                        {order.maDonHang || `ORD-${order.id}`}
                    </h1>
                    <div style={{ fontSize: 13, color: '#6b7280' }}>Ngày tạo: {fmtDate(order.ngayTao)}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                    <span style={{
                        padding: '6px 16px', borderRadius: 20, fontWeight: 700, fontSize: 13,
                        background: statusInfo.color + '22', color: statusInfo.color,
                        border: `1.5px solid ${statusInfo.color}`
                    }}>
                        {statusInfo.label}
                    </span>
                    {order.maDonHangGhn && (
                        <span style={{
                            padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 700,
                            background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0'
                        }}>
                            🚚 GHN: {order.maDonHangGhn}
                        </span>
                    )}
                </div>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 24 }}>

                {/* ── ROW 1: Khách hàng + Địa chỉ giao ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

                    {/* Khách hàng */}
                    <div className="desc-card">
                        <h3>👤 Thông Tin Khách Hàng</h3>
                        <ul className="spec-list" style={{ marginTop: 12 }}>
                            <li>
                                <span className="spec-label">Họ tên</span>
                                <span className="spec-value" style={{ fontWeight: 600 }}>{order.tenKhachHang || '---'}</span>
                            </li>
                            <li>
                                <span className="spec-label">Số điện thoại</span>
                                <span className="spec-value">{order.soDienThoaiKhachHang || '---'}</span>
                            </li>
                            <li>
                                <span className="spec-label">Email</span>
                                <span className="spec-value">{order.emailKhachHang || '---'}</span>
                            </li>
                            {order.nhanVienXuLyTen && (
                                <li>
                                    <span className="spec-label">NV xử lý</span>
                                    <span className="spec-value">{order.nhanVienXuLyTen}</span>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Địa chỉ giao hàng */}
                    <div className="desc-card">
                        <h3>📍 Địa Chỉ Giao Hàng</h3>
                        {dia ? (
                            <ul className="spec-list" style={{ marginTop: 12 }}>
                                <li>
                                    <span className="spec-label">Người nhận</span>
                                    <span className="spec-value" style={{ fontWeight: 600 }}>{dia.tenNguoiNhan}</span>
                                </li>
                                <li>
                                    <span className="spec-label">SĐT nhận</span>
                                    <span className="spec-value">{dia.soDienThoai}</span>
                                </li>
                                <li>
                                    <span className="spec-label">Tỉnh / Thành</span>
                                    <span className="spec-value">{dia.tinhThanhTen || dia.tinhThanhId}</span>
                                </li>
                                {dia.xaPhuongTen && (
                                    <li>
                                        <span className="spec-label">Phường / Xã</span>
                                        <span className="spec-value">{dia.xaPhuongTen}</span>
                                    </li>
                                )}
                                <li>
                                    <span className="spec-label">Địa chỉ</span>
                                    <span className="spec-value">{dia.diaChiChiTiet}</span>
                                </li>
                            </ul>
                        ) : (
                            <p style={{ color: '#9ca3af', marginTop: 12, fontStyle: 'italic' }}>
                                Khách nhận tại showroom — không giao vận
                            </p>
                        )}
                    </div>
                </div>

                {/* ── ROW 2: Kho xuất hàng + Quản trị trạng thái ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

                    {/* Kho */}
                    <div className="desc-card">
                        <h3>🏭 Kho Xuất Hàng</h3>
                        {kho ? (
                            <ul className="spec-list" style={{ marginTop: 12 }}>
                                <li>
                                    <span className="spec-label">Tên kho</span>
                                    <span className="spec-value" style={{ fontWeight: 700 }}>{kho.tenKho}</span>
                                </li>
                                <li>
                                    <span className="spec-label">Địa điểm</span>
                                    <span className="spec-value">{kho.tinhThanhTen}</span>
                                </li>
                                <li>
                                    <span className="spec-label">SĐT kho</span>
                                    <span className="spec-value">{kho.soDienThoai}</span>
                                </li>
                                <li>
                                    <span className="spec-label">Chi tiết</span>
                                    <span className="spec-value">{kho.diaChiChiTiet}</span>
                                </li>
                            </ul>
                        ) : (
                            <p style={{ color: '#9ca3af', marginTop: 12, fontStyle: 'italic' }}>
                                Chưa phân công kho xuất hàng
                            </p>
                        )}
                    </div>

                    {/* Quản trị trạng thái */}
                    <div className="desc-card" style={{ borderTop: '3px solid #10b981' }}>
                        <h3>⚙️ Cập Nhật Trạng Thái</h3>
                        <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                style={{ flex: 1, minWidth: 180, padding: '10px 12px', borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: 14 }}
                            >
                                <option value="CHO_XAC_NHAN">Chờ Xác Nhận</option>
                                <option value="DA_XAC_NHAN">Duyệt — Chờ Lấy Hàng GHN</option>
                                <option value="DANG_XU_LY">Đang Xử Lý Nội Bộ</option>
                                <option value="DANG_GIAO">Đang Giao Hàng</option>
                                <option value="HOAN_THANH">Giao Thành Công</option>
                                <option value="DA_HUY">Hủy Đơn</option>
                            </select>
                            <button
                                className="btn-submit"
                                onClick={handleUpdateStatus}
                                disabled={processing || status === order.trangThai}
                                style={{ width: 'auto', padding: '0 20px', fontSize: 14, background: processing ? '#6b7280' : '#059669' }}
                            >
                                {processing ? 'Đang lưu...' : 'Lưu Trạng Thái'}
                            </button>
                        </div>
                        {order.ghiChu && (
                            <div style={{ marginTop: 16, background: '#fefce8', padding: 12, borderRadius: 8, border: '1px solid #fef08a' }}>
                                <div style={{ fontSize: 12, color: '#a16207', fontWeight: 600, marginBottom: 4 }}>Ghi chú khách hàng:</div>
                                <div style={{ color: '#854d0e', lineHeight: 1.6 }}>{order.ghiChu}</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── ROW 3: Sản phẩm ── */}
                <div className="desc-card">
                    <h3>🛒 Chi Tiết Giỏ Hàng</h3>
                    <div style={{ marginTop: 16, border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
                            <thead style={{ background: '#f9fafb' }}>
                                <tr>
                                    <th style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>Sản phẩm</th>
                                    <th style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>Loại</th>
                                    <th style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb', textAlign: 'center' }}>SL</th>
                                    <th style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}>Đơn giá</th>
                                    <th style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}>Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(order.chiTietDonHangs || []).length > 0 ? (
                                    (order.chiTietDonHangs).map((item, i) => (
                                        <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                                            <td style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6', fontWeight: 600 }}>
                                                {getProductName(item)}
                                            </td>
                                            <td style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6' }}>
                                                <span style={{
                                                    padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600,
                                                    background: item.loaiSanPham === 'OTO' ? '#dbeafe' : item.loaiSanPham === 'PHU_KIEN' ? '#dcfce7' : '#f3e8ff',
                                                    color: item.loaiSanPham === 'OTO' ? '#1d4ed8' : item.loaiSanPham === 'PHU_KIEN' ? '#166534' : '#7c3aed',
                                                }}>
                                                    {item.loaiSanPham === 'OTO' ? 'Ô Tô' : item.loaiSanPham === 'PHU_KIEN' ? 'Phụ Kiện' : 'Dịch Vụ'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6', textAlign: 'center' }}>
                                                {item.soLuong}
                                            </td>
                                            <td style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6', textAlign: 'right' }}>
                                                {fmt(item.donGia)}
                                            </td>
                                            <td style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6', textAlign: 'right', fontWeight: 700 }}>
                                                {fmt(item.thanhTien)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={5} style={{ padding: 24, textAlign: 'center', color: '#9ca3af' }}>Không có sản phẩm nào</td></tr>
                                )}
                            </tbody>
                        </table>

                        {/* Tổng tiền */}
                        <div style={{ padding: '16px 20px', background: '#f9fafb', borderTop: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                            {order.phiVanChuyen > 0 && (
                                <div style={{ display: 'flex', gap: 24, fontSize: 14, color: '#6b7280' }}>
                                    <span>Phí vận chuyển GHN:</span>
                                    <span style={{ fontWeight: 600, color: '#059669' }}>+ {fmt(order.phiVanChuyen)}</span>
                                </div>
                            )}
                            <div style={{ display: 'flex', gap: 24, fontSize: 18, fontWeight: 700 }}>
                                <span style={{ color: '#374151' }}>TỔNG THANH TOÁN:</span>
                                <span style={{ color: '#111827', fontSize: 22 }}>{fmt(order.tongTien)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── ROW 4: Thanh toán ── */}
                {order.thanhToan && (
                    <div className="desc-card">
                        <h3>💳 Thông Tin Thanh Toán</h3>
                        <ul className="spec-list" style={{ marginTop: 12 }}>
                            <li>
                                <span className="spec-label">Phương thức</span>
                                <span className="spec-value">{PAYMENT_MAP[order.thanhToan.phuongThuc] || order.thanhToan.phuongThuc}</span>
                            </li>
                            <li>
                                <span className="spec-label">Trạng thái TT</span>
                                <span className="spec-value">
                                    <span style={{
                                        padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700,
                                        background: (PAYMENT_STATUS_MAP[order.thanhToan.trangThai]?.color || '#6b7280') + '22',
                                        color: PAYMENT_STATUS_MAP[order.thanhToan.trangThai]?.color || '#6b7280',
                                    }}>
                                        {PAYMENT_STATUS_MAP[order.thanhToan.trangThai]?.label || order.thanhToan.trangThai}
                                    </span>
                                </span>
                            </li>
                            {order.thanhToan.maGiaoDich && (
                                <li>
                                    <span className="spec-label">Mã giao dịch</span>
                                    <span className="spec-value">{order.thanhToan.maGiaoDich}</span>
                                </li>
                            )}
                            {order.thanhToan.ngayThanhToan && (
                                <li>
                                    <span className="spec-label">Ngày TT</span>
                                    <span className="spec-value">{fmtDate(order.thanhToan.ngayThanhToan)}</span>
                                </li>
                            )}
                            <li>
                                <span className="spec-label">Số tiền TT</span>
                                <span className="spec-value" style={{ fontWeight: 700, color: '#059669', fontSize: 16 }}>
                                    {fmt(order.thanhToan.soTien)}
                                </span>
                            </li>
                        </ul>
                    </div>
                )}

            </div>
        </div>
    );
}
