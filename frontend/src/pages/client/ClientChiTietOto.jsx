import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaGasPump, FaCogs, FaStar, FaUserCircle, FaCalendarAlt, FaCar, FaInfoCircle, FaComments, FaWarehouse, FaCheckCircle, FaMapMarkerAlt, FaHeadset } from 'react-icons/fa';
import Navbar from '../../components/layout/Navbar';
import { productService } from '../../services/productService';
import { inventoryService } from '../../services/inventoryService';
import { api } from '../../services/api';
import BookingModal from '../../components/client/BookingModal';
import '../../assets/css/Home.css';

export default function ClientChiTietOto() {
    const { id } = useParams();
    const [car, setCar] = useState(null);
    const [images, setImages] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [selectedKho, setSelectedKho] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(null);
    const [activeTab, setActiveTab] = useState('details');
    const [isBookingOpen, setIsBookingOpen] = useState(false);

    useEffect(() => {
        fetchCarData();
    }, [id]);

    const fetchCarData = async () => {
        try {
            setLoading(true);
            const [carRes, imgRes, reviewRes, branchRes] = await Promise.all([
                productService.getCarDetail(id),
                productService.getCarImages(id).catch(() => ({ data: [] })),
                api.get(`/danh-gia/oto/${id}?size=10`).catch(() => ({ data: { data: { content: [] } } })),
                api.get('/kho-hang/active').catch(() => ({ data: { data: [] } }))
            ]);
            
            const carData = carRes?.data || carRes;
            setCar(carData);
            
            const imgs = imgRes?.data || [];
            setImages(imgs);
            if (imgs.length > 0) setActiveImage(imgs[0].url);

            const revs = reviewRes?.data?.data?.content || reviewRes?.data?.content || [];
            setReviews(revs);

            const branches = branchRes?.data?.data || [];
            setWarehouses(branches);
            // Auto-chọn chi nhánh đầu tiên
            if (branches.length > 0) setSelectedKho(branches[0].id);
        } catch (error) {
            console.error('Error fetching car details:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        if (!price) return 'Liên hệ';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const getAverageRating = () => {
        if (!reviews.length) return 5.0;
        const total = reviews.reduce((sum, r) => sum + r.diemDanhGia, 0);
        return (total / reviews.length).toFixed(1);
    };

    const handleOpenBooking = () => {
        if (!selectedKho) {
            alert('Vui lòng chọn chi nhánh bạn muốn đăng ký lái thử!');
            return;
        }
        setIsBookingOpen(true);
    };

    if (loading) {
        return (
            <div className="home-container">
                <Navbar />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <div className="loading-spinner" style={{ width: '50px', height: '50px', border: '5px solid #f3f3f3', borderTop: '5px solid #111', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                </div>
            </div>
        );
    }
    
    if (!car) {
        return (
            <div className="home-container">
                <Navbar />
                <div style={{ padding: '100px', textAlign: 'center', fontSize: '20px', color: '#ef4444' }}>
                    Không tìm thấy thông tin xe.
                </div>
            </div>
        );
    }

    const selectedBranchData = warehouses.find(w => w.id === selectedKho);

    return (
        <div className="home-container" style={{ backgroundColor: '#f9fafb', minHeight: '100vh', paddingBottom: '60px' }}>
            <Navbar />
            <style>{`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                .thumbnail-img { opacity: 0.6; transition: all 0.3s ease; cursor: pointer; border: 2px solid transparent; }
                .thumbnail-img:hover { opacity: 0.9; }
                .thumbnail-img.active { opacity: 1; border-color: #111; }
                .spec-card { background: #fff; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); display: flex; align-items: center; gap: 16px; transition: transform 0.2s; }
                .spec-card:hover { transform: translateY(-3px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
                .tab-btn { padding: 12px 24px; font-size: 16px; font-weight: 600; border: none; background: transparent; cursor: pointer; border-bottom: 3px solid transparent; color: #6b7280; transition: all 0.2s; }
                .tab-btn.active { color: #111; border-bottom-color: #111; }
                .tab-btn:hover:not(.active) { color: #374151; }
                .warehouse-card { padding: 16px 20px; border-radius: 12px; border: 2px solid #e5e7eb; cursor: pointer; transition: all 0.25s ease; display: flex; align-items: center; gap: 14px; }
                .warehouse-card:hover:not(.disabled) { border-color: #111; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
                .warehouse-card.selected { border-color: #111; background: #f8fafc; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
                .warehouse-card.disabled { opacity: 0.45; cursor: not-allowed; pointer-events: none; background: #f9fafb; }
                .wh-radio { width: 22px; height: 22px; border-radius: 50%; border: 2px solid #d1d5db; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.2s; }
                .wh-radio.checked { border-color: #111; background: #111; }
                .wh-radio.checked::after { content: ''; width: 8px; height: 8px; border-radius: 50%; background: #fff; }
                .stock-badge { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; }
                .stock-badge.in-stock { background: #dcfce7; color: #166534; }
                .stock-badge.out-of-stock { background: #fee2e2; color: #991b1b; }
            `}</style>
            
            <div style={{ maxWidth: '1280px', margin: '40px auto', padding: '0 20px' }}>
                {/* Hero Section */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px', backgroundColor: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}>
                    
                    {/* Left: Image Gallery */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ width: '100%', aspectRatio: '16/10', backgroundColor: '#f3f4f6', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
                            {activeImage ? (
                                <img src={activeImage} alt={car.tenXe} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s' }} />
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ca3af', flexDirection: 'column', gap: '12px' }}>
                                    <FaCar size={48} />
                                    <span>Chưa có hình ảnh</span>
                                </div>
                            )}
                            <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.9)', padding: '6px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <FaStar color="#fbbf24" /> {getAverageRating()}
                            </div>
                        </div>
                        
                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
                                {images.map((img, idx) => (
                                    <div 
                                        key={idx} 
                                        onClick={() => setActiveImage(img.url)}
                                        className={`thumbnail-img ${activeImage === img.url ? 'active' : ''}`}
                                        style={{ width: '80px', height: '60px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}
                                    >
                                        <img src={img.url} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Essential Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ display: 'inline-block', padding: '6px 12px', backgroundColor: '#f3f4f6', color: '#4b5563', borderRadius: '20px', fontSize: '13px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px', alignSelf: 'flex-start' }}>
                            {car.hangXe || 'Thương hiệu'}
                        </div>
                        
                        <h1 style={{ fontSize: '42px', fontWeight: 800, margin: '0 0 16px 0', lineHeight: 1.2, color: '#111' }}>
                            {car.tenXe}
                        </h1>

                        <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#ef4444', marginBottom: '24px' }}>
                            {formatPrice(car.gia)}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                            <div className="spec-card">
                                <FaGasPump style={{ fontSize: '28px', color: '#3b82f6' }} />
                                <div>
                                    <div style={{ fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 500 }}>Nhiên liệu</div>
                                    <div style={{ fontWeight: 700, fontSize: '16px', color: '#111' }}>{car.nhienLieu || 'Xăng'}</div>
                                </div>
                            </div>
                            <div className="spec-card">
                                <FaCogs style={{ fontSize: '28px', color: '#8b5cf6' }} />
                                <div>
                                    <div style={{ fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 500 }}>Hộp số</div>
                                    <div style={{ fontWeight: 700, fontSize: '16px', color: '#111' }}>{car.hopSo || 'Tự động'}</div>
                                </div>
                            </div>
                            <div className="spec-card">
                                <FaCalendarAlt style={{ fontSize: '28px', color: '#10b981' }} />
                                <div>
                                    <div style={{ fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 500 }}>Sản xuất</div>
                                    <div style={{ fontWeight: 700, fontSize: '16px', color: '#111' }}>{car.namSanXuat || '2023'}</div>
                                </div>
                            </div>
                            <div className="spec-card">
                                <FaCar style={{ fontSize: '28px', color: '#f59e0b' }} />
                                <div>
                                    <div style={{ fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 500 }}>Dòng xe</div>
                                    <div style={{ fontWeight: 700, fontSize: '16px', color: '#111' }}>{car.dongXe || 'Sedan'}</div>
                                </div>
                            </div>
                        </div>

                        {/* ── Warehouse Selection ── */}
                        {warehouses.length > 0 && (
                            <div style={{ marginBottom: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                                    <FaWarehouse style={{ fontSize: '18px', color: '#4b5563' }} />
                                    <span style={{ fontSize: '16px', fontWeight: 700, color: '#111' }}>Chọn chi nhánh lái thử</span>
                                    <span style={{ fontSize: '13px', color: '#6b7280' }}>(Vui lòng chọn chi nhánh gần bạn nhất)</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {warehouses.map(wh => {
                                        const isSelected = selectedKho === wh.id;
                                        return (
                                            <div
                                                key={wh.id}
                                                className={`warehouse-card ${isSelected ? 'selected' : ''}`}
                                                onClick={() => setSelectedKho(wh.id)}
                                            >
                                                <div className={`wh-radio ${isSelected ? 'checked' : ''}`} />
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontWeight: 700, fontSize: '15px', color: '#111', marginBottom: '2px' }}>{wh.tenKho}</div>
                                                    <div style={{ fontSize: '13px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <FaMapMarkerAlt size={11} /> {wh.tinhThanhName} — {wh.diaChiChiTiet}
                                                    </div>
                                                </div>
                                                <span className="stock-badge in-stock">
                                                    Sẵn sàng
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '16px', marginTop: 'auto' }}>
                            <button 
                                className="btn-primary" 
                                style={{ flex: 1, padding: '18px', fontSize: '18px', fontWeight: 'bold', borderRadius: '12px', boxShadow: '0 4px 14px 0 rgba(17, 17, 17, 0.39)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', opacity: selectedKho ? 1 : 0.5, cursor: selectedKho ? 'pointer' : 'not-allowed' }}
                                onClick={handleOpenBooking}
                            >
                                <FaCalendarAlt /> Đăng ký lái thử
                            </button>
                            <button style={{ padding: '18px 24px', fontSize: '18px', fontWeight: 'bold', borderRadius: '12px', backgroundColor: '#fff', border: '2px solid #e5e7eb', color: '#111', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '10px' }} onMouseOver={e => e.currentTarget.style.borderColor = '#111'} onMouseOut={e => e.currentTarget.style.borderColor = '#e5e7eb'}>
                                <FaHeadset /> Liên hệ tư vấn
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Tabs */}
                <div style={{ marginTop: '40px', backgroundColor: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    <div style={{ display: 'flex', gap: '32px', borderBottom: '1px solid #e5e7eb', marginBottom: '32px' }}>
                        <button 
                            className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
                            onClick={() => setActiveTab('details')}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            <FaInfoCircle /> Chi tiết xe
                        </button>
                        <button 
                            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                            onClick={() => setActiveTab('reviews')}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            <FaComments /> Đánh giá ({reviews.length})
                        </button>
                    </div>

                    {/* Tab Content: Details */}
                    {activeTab === 'details' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
                            <div>
                                <h3 style={{ fontSize: '24px', marginBottom: '20px', color: '#111' }}>Mô Tả Sản Phẩm</h3>
                                <div style={{ fontSize: '16px', lineHeight: 1.8, color: '#4b5563', whiteSpace: 'pre-line' }}>
                                    {car.moTa || 'Sản phẩm hiện chưa có mô tả chi tiết. Vui lòng liên hệ để biết thêm thông tin.'}
                                </div>
                            </div>
                            <div style={{ backgroundColor: '#f9fafb', padding: '24px', borderRadius: '12px' }}>
                                <h3 style={{ fontSize: '20px', marginBottom: '20px', color: '#111' }}>Thông số kỹ thuật</h3>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
                                        <span style={{ color: '#6b7280' }}>Thương hiệu</span>
                                        <span style={{ fontWeight: 600 }}>{car.hangXe}</span>
                                    </li>
                                    <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
                                        <span style={{ color: '#6b7280' }}>Dòng xe</span>
                                        <span style={{ fontWeight: 600 }}>{car.dongXe}</span>
                                    </li>
                                    <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
                                        <span style={{ color: '#6b7280' }}>Năm sản xuất</span>
                                        <span style={{ fontWeight: 600 }}>{car.namSanXuat}</span>
                                    </li>
                                    <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
                                        <span style={{ color: '#6b7280' }}>Động cơ</span>
                                        <span style={{ fontWeight: 600 }}>{car.dongCo || 'Đang cập nhật'}</span>
                                    </li>
                                    <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
                                        <span style={{ color: '#6b7280' }}>Màu sắc</span>
                                        <span style={{ fontWeight: 600 }}>{car.mauSac || 'Nhiều màu'}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Tab Content: Reviews */}
                    {activeTab === 'reviews' && (
                        <div>
                            {reviews.length === 0 ? (
                                <div style={{ padding: '60px 20px', textAlign: 'center', background: '#f9fafb', borderRadius: '12px', color: '#6b7280' }}>
                                    <FaComments style={{ fontSize: '48px', color: '#d1d5db', marginBottom: '166px' }} />
                                    <h3 style={{ margin: '0 0 8px 0', color: '#111' }}>Chưa có đánh giá</h3>
                                    <p style={{ margin: 0 }}>Chưa có khách hàng nào đánh giá sản phẩm này.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    {reviews.map(review => (
                                        <div key={review.id} style={{ padding: '24px', backgroundColor: '#f9fafb', borderRadius: '12px', display: 'flex', gap: '20px' }}>
                                            <div style={{ flexShrink: 0 }}>
                                                <div style={{ width: '48px', height: '48px', backgroundColor: '#e5e7eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <FaUserCircle style={{ fontSize: '32px', color: '#9ca3af' }} />
                                                </div>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                    <div>
                                                        <div style={{ fontWeight: 700, color: '#111', fontSize: '16px' }}>{review.tenKhachHang || 'Khách Hàng'}</div>
                                                        <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>{new Date(review.ngayTao).toLocaleDateString('vi-VN')}</div>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '4px' }}>
                                                        {[...Array(5)].map((_, i) => (
                                                            <FaStar key={i} color={i < review.diemDanhGia ? '#fbbf24' : '#e5e7eb'} size={16} />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p style={{ margin: 0, color: '#4b5563', lineHeight: 1.6, fontSize: '15px' }}>
                                                    {review.noiDung || 'Khách hàng không để lại bình luận.'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Booking Modal */}
            {isBookingOpen && (
                <BookingModal 
                    isOpen={isBookingOpen} 
                    onClose={() => setIsBookingOpen(false)} 
                    product={car}
                    type="LAI_THU"
                    selectedBranch={{ ...selectedBranchData, khoHangId: selectedBranchData?.id }}
                />
            )}
        </div>
    );
}
