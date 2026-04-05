import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import '../../assets/css/ChiTiet.css';

export default function ChiTietPhuKien() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [acc, setAcc] = useState(null);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await api.get(`/phu-kien/${id}`);
                setAcc(res.data?.data);
                
                const imgRes = await api.get(`/media/PHU_KIEN/${id}`);
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
    if (!acc) return <div className="view-empty">Không tìm thấy thông tin phụ kiện.</div>;

    const mainImage = images.length > 0 ? images[0].url : 'https://placehold.co/800x400/222/555?text=Chưa+Có+Ảnh+Phụ+Kiện';

    return (
        <div className="view-car-container">
            <header className="view-header">
                <div>
                     <button className="btn-back" onClick={() => navigate('/admin/products/accessories')}>&larr; Khối Phụ Kiện</button>
                     <h1 className="view-title">{acc.tenPhuKien}</h1>
                </div>
                <div className="view-status-badge status-available">
                    KHO BÃI TỒN: {acc.soLuong || 0} CHIẾC
                </div>
            </header>

            <div className="view-content-wrapper">
                {/* Left Panel: Hero Image and Gallery */}
                <div className="view-media-panel">
                    <div className="main-image-wrapper" style={{aspectRatio: '1/1'}}>
                        <img src={mainImage} alt={acc.tenPhuKien} style={{objectFit: 'contain', backgroundColor: '#f9fafb'}}/>
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
                </div>
            </div>
        </div>
    );
}
