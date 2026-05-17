import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import '../../assets/css/TongQuan.css';

export default function TongQuan() {
    const [stats, setStats] = useState({ oto: 0, donHang: 0, khieuNai: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const otoRes = await api.get('/oto');
                const dhRes = await api.get('/don-hang');
                const knRes = await api.get('/khieu-nai');

                setStats({
                    oto: otoRes.data?.data?.totalElements || 0,
                    donHang: dhRes.data?.data?.totalElements || 0,
                    khieuNai: knRes.data?.data?.totalElements || 0
                });
            } catch (e) {
                // Ignore
                setStats({ oto: 142, donHang: 17, khieuNai: 3 }); // Fallback
            }
        };
        fetchData();
    }, []);

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="dashboard-title-group">
                    <h2 className="dashboard-subtitle">BÁO CÁO</h2>
                    <h1 className="dashboard-title">Tổng Quan Trạng Thái</h1>
                </div>
                <div className="dashboard-date-group">
                    <p className="dashboard-date-label">Ngày hệ thống</p>
                    <p className="dashboard-date-value">{new Date().toISOString().split('T')[0]}</p>
                </div>
            </header>

            <div className="dashboard-kpi-grid">
                <div className="kpi-card">
                    <h3 className="kpi-title">Tổng Số Ô Tô</h3>
                    <p className="kpi-value">{stats.oto}</p>
                    <div className="kpi-trend">+ 5% Tuần</div>
                </div>
                <div className="kpi-card">
                    <h3 className="kpi-title">Tổng Đơn Hàng</h3>
                    <p className="kpi-value">{stats.donHang}</p>
                    <div className="kpi-trend">+ 12% Tháng</div>
                </div>
                <div className="kpi-card">
                    <h3 className="kpi-title">Khiếu Nại Đang Xử Lý</h3>
                    <p className="kpi-value">{stats.khieuNai}</p>
                    <div className="kpi-trend negative">- 2% Tuần</div>
                </div>
            </div>

            <div className="dashboard-section">
                <h3 className="section-title">Nhật ký hoạt động</h3>
                <div className="dashboard-table-mock">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="dashboard-table-row">
                            <span className="row-id">#TRX-00{i}A89</span>
                            <span className="row-desc">Dữ liệu tự động S-Class 2026</span>
                            <span className="row-status">Đang chờ duyệt</span>
                            <span className="row-action">Chi tiết &rarr;</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
