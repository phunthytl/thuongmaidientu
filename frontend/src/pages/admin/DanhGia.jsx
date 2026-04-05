import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import '../../assets/css/DanhSach.css';

export default function DanhGia() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        try {
            const res = await api.get('/danh-gia?size=20');
            if (res.data?.data?.content) {
                setReviews(res.data.data.content);
            } else if (Array.isArray(res.data?.data)) {
                setReviews(res.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch reviews', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm(`Xác nhận GỠ BỎ đánh giá (Mã DG-${id}) khỏi hệ thống? Hành động này không thể hoàn tác.`)) {
            try {
                await api.delete(`/danh-gia/${id}`);
                setReviews(prev => prev.filter(item => item.id !== id && item.idDanhGia !== id));
            } catch (err) {
                console.error('Failed to delete review', err);
                alert(err.response?.data?.message || 'Có lỗi xảy ra khi xóa đánh giá');
            }
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} style={{ color: i <= rating ? '#fbbf24' : '#e5e7eb', fontSize: '14px' }}>
                    ★
                </span>
            );
        }
        return stars;
    };

    return (
        <div className="products-container">
            <header className="products-header">
                <div className="title-group">
                    <h2 className="products-subtitle">Phân Hệ CSKH</h2>
                    <h1 className="products-title">Đánh Giá Của Khách Hàng</h1>
                </div>
            </header>

            <div className="products-table-wrapper">
                <div className="table-header">
                    <div className="col-id">Mã ĐG</div>
                    <div className="col-name" style={{ width: '20%' }}>Khách Hàng</div>
                    <div className="col-name" style={{ width: '25%' }}>Sản Phẩm / Dịch Vụ</div>
                    <div className="col-amount" style={{ width: '15%' }}>Mức Độ</div>
                    <div className="col-price" style={{ width: '15%' }}>Ngày Phản Hồi</div>
                    <div className="col-actions" style={{ width: '15%' }}>Thao Tác</div>
                </div>

                <div className="table-body">
                    {loading ? (
                        <div className="table-loading">Đang tổng hợp ý kiến phản hồi...</div>
                    ) : reviews.length === 0 ? (
                        <div className="table-empty">Hệ thống chưa ghi nhận đánh giá nào.</div>
                    ) : (
                        reviews.map((item) => (
                            <div key={item.id} className="table-row">
                                <div className="col-id">DG-{item.id}</div>
                                <div className="col-name" style={{ width: '20%', fontWeight: 600 }}>
                                    {item.tenKhachHang || 'Khách Vãng Lai'}
                                </div>
                                <div className="col-name" style={{ width: '25%', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '13px' }}>{item.tenSanPham || '---'}</span>
                                    <span style={{ fontSize: '11px', color: '#6366f1', fontWeight: 600, marginTop: '4px' }}>
                                        [{item.loaiSanPham || 'UNDEFINED'}]
                                    </span>
                                </div>
                                <div className="col-amount" style={{ width: '15%', display: 'flex', justifyContent: 'center' }}>
                                    {renderStars(item.diemDanhGia)}
                                </div>
                                <div className="col-price" style={{ width: '15%', fontSize: '13px', color: '#666', fontWeight: 'normal' }}>
                                    {item.ngayTao ? new Date(item.ngayTao).toLocaleDateString('vi-VN') : '---'}
                                </div>
                                <div className="col-actions" style={{ width: '15%' }}>
                                    <button className="btn-action delete" style={{ borderColor: '#fee2e2', color: '#b91c1c' }} onClick={() => handleDelete(item.id)}>Gỡ Bỏ</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
