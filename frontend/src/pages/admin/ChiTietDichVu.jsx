import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import '../../assets/css/ChiTiet.css';

export default function ChiTietDichVu() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState(null);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await api.get(`/dich-vu/${id}`);
                setService(res.data?.data);
                
                const imgRes = await api.get(`/media/DICH_VU/${id}`);
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
        if (!price || price === 0) return 'MIỄN PHÍ DỊCH VỤ';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    if (loading) return <div className="view-loading">Đang nạp hồ sơ dịch vụ...</div>;
    if (!service) return <div className="view-empty">Không tìm thấy thông tin gói dịch vụ này.</div>;

    const mainImage = images.length > 0 ? images[0].url : 'https://placehold.co/800x500/18181b/ffffff?text=Dịch+Vụ+Tiêu+Chuẩn';

    return (
        <div className="view-car-container">
            <header className="view-header">
                <div>
                     <button className="btn-back" onClick={() => navigate('/admin/services')}>&larr; Khối Dịch Vụ</button>
                     <h1 className="view-title">{service.tenDichVu}</h1>
                </div>
                <div className="view-status-badge status-available" style={{backgroundColor: '#e0e7ff', color: '#3730a3', borderColor: '#c7d2fe'}}>
                    ĐANG CUNG CẤP
                </div>
            </header>

            <div className="view-content-wrapper">
                {/* Left Panel: Hero Image and Gallery */}
                <div className="view-media-panel">
                    <div className="main-image-wrapper">
                        <img src={mainImage} alt={service.tenDichVu} style={{borderRadius: '8px'}} />
                    </div>
                </div>

                {/* Right Panel: Specs & Pricing */}
                <div className="view-details-panel">
                    <div className="detail-card">
                        <h2 className="detail-price" style={{color: '#3730a3'}}>{formatPrice(service.gia)}</h2>
                        <ul className="spec-list">
                            <li><span className="spec-label">Thời gian triển khai</span><span className="spec-value" style={{fontWeight: 'bold'}}>{service.thoiGianUocTinh || '---'}</span></li>
                        </ul>
                    </div>

                    <div className="desc-card">
                        <h3>Mô tả quy trình nghiệp vụ</h3>
                        <p>{service.moTa || 'Dịch vụ này không có ghi chú chuyên môn đi kèm.'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
