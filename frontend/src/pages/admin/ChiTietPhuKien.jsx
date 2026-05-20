import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { inventoryService } from '../../services/inventoryService';
import MediaGalleryManager from '../../components/admin/MediaGalleryManager';
import '../../assets/css/ChiTiet.css';

export default function ChiTietPhuKien() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [acc, setAcc] = useState(null);
    const [images, setImages] = useState([]);
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const [accRes, imgRes, stockRes] = await Promise.all([
                    api.get(`/phu-kien/${id}`),
                    api.get(`/media/PHU_KIEN/${id}`).catch(() => ({ data: { data: [] } })),
                    inventoryService.getStockByPhuKien(id).catch(() => ({ data: [] }))
                ]);
                setAcc(accRes.data?.data);
                setImages(imgRes.data?.data || []);
                setStocks(stockRes?.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    const formatPrice = (price) => {
        if (!price) return 'Liên hệ';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    if (loading) return <div className="view-loading">Đang giải nén dữ liệu...</div>;
    if (!acc) return <div className="view-empty">Không tìm thấy thông tin phụ kiện.</div>;

    const mainImage = images.length > 0 ? images[0].url : 'https://placehold.co/800x400/222/555?text=Chưa+Có+Ảnh+Phụ+Kiện';
    const totalStock = stocks.reduce((sum, s) => sum + (s.soLuong || 0), 0);

    return (
        <div className="view-car-container">
            <header className="view-header">
                <div>
                     <button className="btn-back" onClick={() => navigate('/admin/products/accessories')}>&larr; Khối Phụ Kiện</button>
                     <h1 className="view-title">{acc.tenPhuKien}</h1>
                </div>
                <div className="view-status-badge status-available">
                    TỔNG TỒN KHO: {totalStock} CHIẾC
                </div>
            </header>

            <div className="view-content-wrapper">
                {/* Left Panel: Hero Image and Gallery */}
                <div className="view-media-panel">
                    <div className="main-image-wrapper" style={{aspectRatio: '1/1'}}>
                        <img src={mainImage} alt={acc.tenPhuKien} style={{objectFit: 'contain', backgroundColor: '#f9fafb'}}/>
                    </div>
                    <div style={{ marginTop: '16px' }}>
                        <MediaGalleryManager
                            loaiDoiTuong="PHU_KIEN"
                            doiTuongId={id}
                            onChange={async () => {
                                try {
                                    const r = await api.get(`/media/PHU_KIEN/${id}`);
                                    setImages(r.data?.data || []);
                                } catch (_) {}
                            }}
                        />
                    </div>
                </div>

                {/* Right Panel: Specs & Pricing */}
                <div className="view-details-panel">
                    <div className="detail-card">
                        <h2 className="detail-price">{formatPrice(acc.gia)}</h2>
                        <ul className="spec-list">
                            <li><span className="spec-label">Phân loại</span><span className="spec-value">{acc.loaiPhuKien || '---'}</span></li>
                            <li><span className="spec-label">Hãng sản xuất</span><span className="spec-value">{acc.hangSanXuat || '---'}</span></li>
                        </ul>
                    </div>

                    <div className="desc-card">
                        <h3>Giới thiệu chuyên sâu</h3>
                        <p>{acc.moTa || 'Vật tư này chưa có văn bản thuyết minh.'}</p>
                    </div>

                    <div className="desc-card" style={{ marginTop: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <h3 style={{ margin: 0 }}>Tồn kho theo chi nhánh</h3>
                            <button
                                onClick={() => navigate('/admin/inventory/accessories')}
                                style={{ padding: '8px 16px', background: '#111', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}
                            >
                                Phân bổ tồn kho
                            </button>
                        </div>
                        {stocks.length === 0 ? (
                            <p style={{ color: '#6b7280', margin: 0 }}>Chưa có chi nhánh kho nào. Hãy tạo kho trước.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {stocks.map(s => (
                                    <div key={s.khoHangId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: '#f9fafb', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
                                        <div>
                                            <div style={{ fontWeight: 700, color: '#111', fontSize: '14px' }}>{s.tenKho}</div>
                                            <div style={{ fontSize: '12px', color: '#6b7280' }}>{s.diaChiChiTiet}, {s.tinhThanhTen}</div>
                                        </div>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            fontWeight: 700,
                                            background: (s.soLuong || 0) > 0 ? '#dcfce7' : '#fee2e2',
                                            color: (s.soLuong || 0) > 0 ? '#166534' : '#991b1b'
                                        }}>
                                            {(s.soLuong || 0) > 0 ? `Còn ${s.soLuong}` : 'Hết hàng'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
