import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import '../../assets/css/DanhSach.css';

export default function KhachHang() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCustomers = async () => {
        try {
            const res = await api.get('/nguoi-dung/khach-hang?size=20');
            if (res.data?.data?.content) {
                setCustomers(res.data.data.content);
            } else if (Array.isArray(res.data?.data)) {
                setCustomers(res.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch customers', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = !currentStatus;
        const actionName = newStatus ? 'MỞ KHÓA' : 'KHÓA';

        if (window.confirm(`Xác nhận ${actionName} tài khoản khách hàng này?`)) {
            try {
                await api.patch(`/nguoi-dung/${id}/trang-thai?trangThai=${newStatus}`);
                // Update local state without reloading
                setCustomers(prev => prev.map(c => {
                    const cId = c.id || c.idNguoiDung;
                    return cId === id ? { ...c, trangThai: newStatus } : c;
                }));
                fetchCustomers();
            } catch (err) {
                console.error('Failed to toggle status', err);
                alert(err.response?.data?.message || 'Có lỗi xảy ra');
            }
        }
    };

    return (
        <div className="products-container">
            <header className="products-header">
                <div className="title-group">
                    <h2 className="products-subtitle">Phân Hệ Phục Vụ</h2>
                    <h1 className="products-title">Hồ Sơ Cư Dân (Khách Hàng)</h1>
                </div>
            </header>

            <div className="products-table-wrapper">
                <div className="table-header">
                    <div className="col-id">Mã KH</div>
                    <div className="col-wide-name">Họ Tên & Email</div>
                    <div className="col-phone">Số Điện Thoại</div>
                    <div className="col-status">Trạng Thái</div>
                    <div className="col-actions">Thao Tác</div>
                </div>

                <div className="table-body">
                    {loading ? (
                        <div className="table-loading">Đang tải danh sách tài khoản...</div>
                    ) : customers.length === 0 ? (
                        <div className="table-empty">Chưa có dữ liệu khách hàng.</div>
                    ) : (
                        customers.map((item) => {
                            const active = item.trangThai === true || item.trangThai === "true";
                            const cid = item.id || item.idNguoiDung;
                            return (
                                <div key={cid} className="table-row">
                                    <div className="col-id">KH-{cid || 'N/A'}</div>
                                    <div className="col-wide-name" style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                        <span style={{ fontWeight: '600' }}>{item.hoTen || '---'}</span>
                                        <span style={{ fontSize: '11px', color: '#888', fontFamily: 'monospace', letterSpacing: '0.05em' }}>{item.email || '---'}</span>
                                    </div>
                                    <div className="col-phone">{item.soDienThoai || '---'}</div>
                                    <div className="col-status">
                                        <span className={`status-badge`} style={{
                                            backgroundColor: active ? '#f0fdf4' : '#fef2f2',
                                            color: active ? '#15803d' : '#b91c1c',
                                            padding: '6px 12px',
                                            borderRadius: '4px',
                                            fontSize: '10px',
                                            fontWeight: '800',
                                            letterSpacing: '0.1em',
                                            textTransform: 'uppercase'
                                        }}>
                                            {active ? 'Hoạt Động' : 'Bị Khóa'}
                                        </span>
                                    </div>
                                    <div className="col-actions">
                                        <button
                                            className={`btn-action`}
                                            style={{
                                                color: active ? '#b91c1c' : '#15803d',
                                                border: `1px solid ${active ? '#fee2e2' : '#dcfce7'}`,
                                                backgroundColor: 'transparent'
                                            }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = active ? '#fef2f2' : '#f0fdf4'}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                            onClick={() => handleToggleStatus(cid, active)}
                                        >
                                            {active ? 'Khóa TK' : 'Mở Khóa'}
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
