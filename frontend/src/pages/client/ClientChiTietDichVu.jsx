import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaWrench, FaClock, FaCheckCircle, FaStar, FaUserCircle, FaWarehouse, FaMapMarkerAlt, FaInfoCircle, FaHeadset } from 'react-icons/fa';
import Navbar from '../../components/layout/Navbar';
import { api } from '../../services/api';
import BookingModal from '../../components/client/BookingModal';
import '../../assets/css/Home.css';

export default function ClientChiTietDichVu() {
    const { id } = useParams();
    const [service, setService] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [branches, setBranches] = useState([]);
    const [selectedBranchId, setSelectedBranchId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isBookingOpen, setIsBookingOpen] = useState(false);

    useEffect(() => {
        fetchServiceData();
    }, [id]);

    const fetchServiceData = async () => {
        try {
            setLoading(true);
            const [svcRes, reviewRes, branchRes] = await Promise.all([
                api.get(`/dich-vu/${id}`),
                api.get(`/danh-gia/dich-vu/${id}?size=10`).catch(() => ({ data: { data: { content: [] } } })),
                api.get('/kho-hang').catch(() => ({ data: { data: [] } }))
            ]);
            
            setService(svcRes.data?.data);
            setReviews(reviewRes.data?.data?.content || []);
            
            const list = branchRes.data?.data || [];
            const activeBranches = list.filter(b => b.trangThai);
            setBranches(activeBranches);
            if (activeBranches.length > 0) {
                setSelectedBranchId(activeBranches[0].id);
            }
        } catch (error) {
            console.error('Error fetching service details:', error);
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
        if (!selectedBranchId) {
            alert('Vui lòng chọn chi nhánh bạn muốn đăng ký dịch vụ!');
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

    if (!service) return <div style={{padding: '100px', textAlign: 'center'}}>Không tìm thấy thông tin dịch vụ.</div>;

    const selectedBranchData = branches.find(b => b.id === selectedBranchId);

    return (
        <div className="home-container" style={{ backgroundColor: '#f9fafb', minHeight: '100vh', paddingBottom: '60px' }}>
            <Navbar />
            <style>{`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                .warehouse-card { padding: 16px 20px; border-radius: 12px; border: 2px solid #e5e7eb; cursor: pointer; transition: all 0.25s ease; display: flex; align-items: center; gap: 14px; background: #fff; }
                .warehouse-card:hover { border-color: #111; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
                .warehouse-card.selected { border-color: #111; background: #f8fafc; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
                .wh-radio { width: 22px; height: 22px; border-radius: 50%; border: 2px solid #d1d5db; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.2s; }
                .wh-radio.checked { border-color: #111; background: #111; }
                .wh-radio.checked::after { content: ''; width: 8px; height: 8px; border-radius: 50%; background: #fff; }
            `}</style>
            
            <div style={{maxWidth: '1200px', margin: '40px auto', padding: '0 20px'}}>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', backgroundColor: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)'}}>
                    
                    {/* Visual Area */}
                    <div style={{backgroundColor: '#f9fafb', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', border: '1px solid #e5e7eb'}}>
                        <div style={{width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', marginBottom: '24px'}}>
                            <FaWrench />
                        </div>
                        <h2 style={{margin: 0, color: '#111', textAlign: 'center'}}>{service.tenDichVu}</h2>
                        <div style={{color: '#6b7280', marginTop: '12px'}}>Dịch Vụ Ủy Quyền Chính Hãng</div>
                    </div>

                    {/* Info */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', color: '#666', marginBottom: '8px', fontWeight: 600}}>Gói Dịch Vụ</div>
                        <h1 style={{fontSize: '36px', fontWeight: 800, margin: '0 0 16px 0', lineHeight: 1.2, color: '#111'}}>{service.tenDichVu}</h1>
                        
                        <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px'}}>
                            <div style={{display: 'flex', color: '#fbbf24', fontSize: '18px'}}>
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} color={i < Math.round(getAverageRating()) ? '#fbbf24' : '#e5e7eb'} />
                                ))}
                            </div>
                            <span style={{fontWeight: 700, fontSize: '16px'}}>{getAverageRating()}</span>
                            <span style={{color: '#6b7280'}}>({reviews.length} đánh giá)</span>
                        </div>

                        <div style={{fontSize: '32px', fontWeight: 'bold', color: '#ef4444', marginBottom: '32px'}}>
                            {formatPrice(service.gia)}
                        </div>

                        <div style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: '#f9fafb', borderRadius: '12px', marginBottom: '32px', border: '1px solid #e5e7eb'}}>
                            <FaClock style={{fontSize: '24px', color: '#4b5563'}} />
                            <div>
                                <div style={{fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600}}>Thời gian dự kiến</div>
                                <div style={{fontWeight: 700, fontSize: '16px', color: '#111'}}>{service.thoiGianUocTinh || 'Đang cập nhật'}</div>
                            </div>
                        </div>

                        {/* ── Branch Selection ── */}
                        <div style={{ marginBottom: '32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                                <FaWarehouse style={{ fontSize: '18px', color: '#4b5563' }} />
                                <span style={{ fontSize: '16px', fontWeight: 700, color: '#111' }}>Chọn chi nhánh thực hiện</span>
                            </div>
                            {branches.length === 0 ? (
                                <div style={{ padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '12px', color: '#6b7280', fontStyle: 'italic' }}>
                                    Đang tải danh sách chi nhánh...
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {branches.map(branch => {
                                        const isSelected = selectedBranchId === branch.id;
                                        return (
                                            <div
                                                key={branch.id}
                                                className={`warehouse-card ${isSelected ? 'selected' : ''}`}
                                                onClick={() => setSelectedBranchId(branch.id)}
                                            >
                                                <div className={`wh-radio ${isSelected ? 'checked' : ''}`} />
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 700, fontSize: '15px', color: '#111', marginBottom: '2px' }}>{branch.tenKho}</div>
                                                    <div style={{ fontSize: '13px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <FaMapMarkerAlt size={11} /> {branch.tinhThanhName} — {branch.diaChiChiTiet}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '16px', marginTop: 'auto' }}>
                            <button 
                                className="btn-primary" 
                                style={{ flex: 1, padding: '18px', fontSize: '18px', fontWeight: 'bold', borderRadius: '12px', boxShadow: '0 4px 14px 0 rgba(239, 68, 68, 0.39)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', opacity: selectedBranchId ? 1 : 0.5, cursor: selectedBranchId ? 'pointer' : 'not-allowed' }}
                                onClick={handleOpenBooking}
                            >
                                <FaClock /> Đặt lịch dịch vụ
                            </button>
                            <button style={{ padding: '18px 24px', fontSize: '18px', fontWeight: 'bold', borderRadius: '12px', backgroundColor: '#fff', border: '2px solid #e5e7eb', color: '#111', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '10px' }} onMouseOver={e => e.currentTarget.style.borderColor = '#111'} onMouseOut={e => e.currentTarget.style.borderColor = '#e5e7eb'}>
                                <FaHeadset /> Liên hệ tư vấn
                            </button>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div style={{marginTop: '40px', backgroundColor: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'}}>
                    <h2 style={{fontSize: '24px', fontWeight: 800, borderBottom: '1px solid #e5e7eb', paddingBottom: '16px', marginBottom: '24px', color: '#111', display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <FaInfoCircle /> Mô Tả Chi Tiết
                    </h2>
                    <div style={{lineHeight: 1.8, color: '#4b5563', backgroundColor: '#f9fafb', padding: '24px', borderRadius: '12px', fontSize: '16px'}}>
                        {service.moTa ? service.moTa.split('\n').map((para, i) => <p key={i} style={{marginBottom: '10px'}}>{para}</p>) : 'Gói dịch vụ hiện chưa có mô tả cụ thể.'}
                    </div>
                </div>

                {/* Reviews Section */}
                <div style={{marginTop: '40px', backgroundColor: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'}}>
                    <h2 style={{fontSize: '24px', fontWeight: 800, borderBottom: '1px solid #e5e7eb', paddingBottom: '16px', marginBottom: '24px', color: '#111'}}>Đánh Giá Khách Hàng ({reviews.length})</h2>
                    
                    {reviews.length === 0 ? (
                        <div style={{padding: '60px 20px', textAlign: 'center', background: '#f9fafb', borderRadius: '12px', color: '#6b7280'}}>
                            Chưa có ai đánh giá dịch vụ này.
                        </div>
                    ) : (
                        <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
                            {reviews.map(review => (
                                <div key={review.id} style={{padding: '24px', backgroundColor: '#f9fafb', borderRadius: '12px', display: 'flex', gap: '20px'}}>
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
            </div>

            {/* Booking Modal */}
            {isBookingOpen && (
                <BookingModal 
                    isOpen={isBookingOpen} 
                    onClose={() => setIsBookingOpen(false)} 
                    product={service}
                    type="DICH_VU"
                    selectedBranch={{ khoHangId: selectedBranchId, tenKho: selectedBranchData?.tenKho }}
                />
            )}
        </div>
    );
}
