import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import '../../assets/css/ChiTiet.css';

export default function ChiTietOto() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await api.get(`/oto/${id}`);
                setCar(res.data?.data);
                
                // Fetch images for this car
                const imgRes = await api.get(`/media/OTO/${id}`);
                if (imgRes.data?.data) {
                    setImages(imgRes.data.data);
                }
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
    if (!car) return <div className="view-empty">Không tìm thấy thông tin ô tô này.</div>;

    const mainImage = images.length > 0 ? images[0].url : 'https://placehold.co/800x400/111/444?text=Chưa+Cập+Nhật+Ảnh+Xe';

    return (
        <div className="view-car-container">
            <header className="view-header">
                <div>
                     <button className="btn-back" onClick={() => navigate('/admin/products')}>&larr; Khối Ô Tô</button>
                     <h1 className="view-title">{car.tenXe}</h1>
                </div>
                <div className="view-status-badge status-available">
                    {car.trangThai || 'SẴN SÀNG'}
                </div>
            </header>

            <div className="view-content-wrapper">
                {/* Left Panel: Hero Image and Gallery */}
                <div className="view-media-panel">
                    <div className="main-image-wrapper">
                        <img src={mainImage} alt={car.tenXe} />
                    </div>
                    {images.length > 1 && (
                        <div className="gallery-grid">
                            {images.slice(1).map((img, idx) => (
                                <div key={idx} className="gallery-item">
                                    <img src={img.url} alt={`Gallery ${idx}`} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Panel: Specs & Pricing */}
                <div className="view-details-panel">
                    <div className="detail-card">
                        <h2 className="detail-price">{formatPrice(car.gia)}</h2>
                        <ul className="spec-list">
                            <li><span className="spec-label">Hãng sản xuất</span><span className="spec-value">{car.hangXe || '---'}</span></li>
                            <li><span className="spec-label">Phân khúc/Dòng</span><span className="spec-value">{car.dongXe || '---'}</span></li>
                            <li><span className="spec-label">Động cơ</span><span className="spec-value">{car.dongCo || '---'}</span></li>
                            <li><span className="spec-label">Hộp số</span><span className="spec-value">{car.hopSo || '---'}</span></li>
                            <li><span className="spec-label">Nhiên liệu</span><span className="spec-value">{car.nhienLieu || '---'}</span></li>
                            <li><span className="spec-label">Màu sắc</span><span className="spec-value">{car.mauSac || '---'}</span></li>
                            <li><span className="spec-label">Số km (Odo)</span><span className="spec-value">{car.soKm || 0} km</span></li>
                            <li><span className="spec-label">Năm hoàn thiện</span><span className="spec-value">{car.namSanXuat || '---'}</span></li>
                        </ul>
                    </div>

                    <div className="inventory-card">
                         <div className="inventory-stat">
                             <div className="stat-value">{car.soLuong || 0}</div>
                             <div className="stat-label">Chiếc trong kho</div>
                         </div>
                    </div>

                    <div className="desc-card">
                        <h3>Giới thiệu chuyên sâu</h3>
                        <p>{car.moTa || 'Dòng xe này chưa được cập nhật đặc tả kỹ thuật chi tiết.'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
