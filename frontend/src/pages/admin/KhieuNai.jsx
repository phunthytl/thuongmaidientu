import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/DanhSach.css';

export default function KhieuNai() {
    const navigate = useNavigate();
    const [disputes, setDisputes] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDisputes = async () => {
        try {
            const res = await api.get('/khieu-nai?size=20&sort=createdAt,desc');
            if (res.data?.data?.content) {
                setDisputes(res.data.data.content);
            } else if (Array.isArray(res.data?.data)) {
                setDisputes(res.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch disputes', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDisputes();
    }, []);

    const statusFormat = (stt) => {
        switch (stt) {
            case 'MOI': return 'Mới';
            case 'DANG_XU_LY': return 'Đang xử lý';
            case 'DA_GIAI_QUYET': return 'Đã giải quyết';
            case 'TU_CHOI': return 'Từ chối';
            default: return stt;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '---';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    }

    return (
        <div className="products-container">
            <header className="products-header">
                <div className="title-group">
                    <h2 className="products-subtitle">Phân Hệ Pháp Lý</h2>
                    <h1 className="products-title">Khiếu Nại Của Khách Hàng</h1>
                </div>
            </header>

            <div className="products-table-wrapper">
                <div className="table-header">
                    <div className="col-id">Mã KN</div>
                    <div className="col-name" style={{ width: '30%' }}>Tiêu Đề Báo Cáo</div>
                    <div className="col-brand" style={{ width: '20%' }}>Khách Hàng</div>
                    <div className="col-amount" style={{ width: '15%' }}>Ngày Gửi</div>
                    <div className="col-status" style={{ width: '15%' }}>Trạng Thái</div>
                    <div className="col-actions" style={{ width: '10%' }}>Thao Tác</div>
                </div>

                <div className="table-body">
                    {loading ? (
                        <div className="table-loading">Đang tải biểu mẫu khiếu nại...</div>
                    ) : disputes.length === 0 ? (
                        <div className="table-empty">Hệ thống an toàn, không có khiếu nại nào cần xử lý.</div>
                    ) : (
                        disputes.map((item) => (
                            <div key={item.id} className="table-row">
                                <div className="col-id">KN-{item.id}</div>
                                <div className="col-name" style={{ width: '30%', fontWeight: 600 }}>
                                    {item.tieuDe || '---'}
                                </div>
                                <div className="col-brand" style={{ width: '20%' }}>
                                    {item.khachHang?.hoTen || 'Khách Vãng Lai'}
                                </div>
                                <div className="col-amount" style={{ width: '15%' }}>
                                    {formatDate(item.createdAt || item.ngayTao)}
                                </div>
                                <div className="col-status" style={{ width: '15%' }}>
                                    <span className={`status-badge status-${(item.trangThai || '').toLowerCase()}`}>
                                        {statusFormat(item.trangThai)}
                                    </span>
                                </div>
                                <div className="col-actions" style={{ width: '10%' }}>
                                    <button
                                        className="btn-action view"
                                        onClick={() => navigate(`/admin/disputes/${item.id}`)}
                                        style={{ borderColor: '#6366f1', color: '#4f46e5' }}
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
