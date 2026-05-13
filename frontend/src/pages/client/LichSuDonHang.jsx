import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBoxOpen, FaStar, FaTimes, FaCar } from 'react-icons/fa';
import Navbar from '../../components/layout/Navbar';
import { useAuthStore } from '../../stores/authStore';
import { api } from '../../services/api';
import '../../assets/css/Home.css'; // base styling

export default function LichSuDonHang() {
    const { user } = useAuthStore();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Review Modal State
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [reviewForm, setReviewForm] = useState({ diemDanhGia: 5, noiDung: '' });
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        if (user && user.id) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/don-hang/khach-hang/${user.id}?size=50`);
            setOrders(res.data?.data?.content || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenReview = (item) => {
        setSelectedItem(item);
        setReviewForm({ diemDanhGia: 5, noiDung: '' });
        setReviewModalOpen(true);
    };

    const handleSubmitReview = async () => {
        if (!selectedItem) return;
        setSubmittingReview(true);
        try {
            const payload = {
                khachHangId: user.id,
                loaiSanPham: selectedItem.loaiSanPham,
                otoId: selectedItem.loaiSanPham === 'OTO' ? selectedItem.sanPhamId : null,
                phuKienId: selectedItem.loaiSanPham === 'PHU_KIEN' ? selectedItem.sanPhamId : null,
                dichVuId: selectedItem.loaiSanPham === 'DICH_VU' ? selectedItem.sanPhamId : null,
                diemDanhGia: reviewForm.diemDanhGia,
                noiDung: reviewForm.noiDung
            };
            await api.post('/danh-gia', payload);
            alert('Cảm ơn bạn đã đánh giá sản phẩm!');
            setReviewModalOpen(false);
        } catch (error) {
            console.error('Error posting review:', error);
            alert(error.response?.data?.message || 'Có lỗi xảy ra khi gửi đánh giá');
        } finally {
            setSubmittingReview(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
    };

    return (
        <div className="home-container">
            <Navbar />
            
            <div className="orders-history-container" style={{maxWidth: '1200px', margin: '40px auto', padding: '0 20px', minHeight: '60vh'}}>
                <h1 style={{fontSize: '28px', marginBottom: '24px', fontFamily: 'Lora, serif'}}>Lịch Sử Đơn Hàng Của Bạn</h1>
                
                {loading ? (
                    <div>Đang tải thông tin đơn hàng...</div>
                ) : orders.length === 0 ? (
                    <div style={{textAlign: 'center', padding: '60px 20px', background: '#f9fafb', borderRadius: '8px'}}>
                        <FaBoxOpen style={{fontSize: '48px', color: '#ccc', marginBottom: '16px'}} />
                        <h3>Bạn chưa có đơn hàng nào</h3>
                        <Link to="/products" className="btn-primary" style={{marginTop: '16px', display: 'inline-block'}}>Mua sắm ngay</Link>
                    </div>
                ) : (
                    <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                        {orders.map(order => (
                            <div key={order.id} style={{border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff'}}>
                                <div style={{padding: '16px 24px', backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <div>
                                        <span style={{fontWeight: 600, marginRight: '16px'}}>Mã: {order.maDonHang}</span>
                                        <span style={{color: '#666', fontSize: '14px'}}>Ngày đặt: {new Date(order.ngayTao).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                    <div style={{fontWeight: 600, color: order.trangThai === 'HOAN_THANH' ? '#10b981' : '#f59e0b'}}>
                                        {order.trangThai}
                                    </div>
                                </div>
                                <div style={{padding: '0 24px'}}>
                                    {(order.chiTietDonHangs || []).map((item, idx) => (
                                        <div key={idx} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: idx < order.chiTietDonHangs.length - 1 ? '1px solid #f3f4f6' : 'none'}}>
                                            <div style={{display: 'flex', gap: '16px', flex: 1}}>
                                                <div style={{width: '80px', height: '80px', backgroundColor: '#f3f4f6', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                    <FaCar style={{color: '#d1d5db', fontSize: '32px'}} />
                                                </div>
                                                <div>
                                                    <h4 style={{margin: '0 0 8px 0', fontSize: '16px'}}>{item.tenSanPham || 'Sản phẩm'}</h4>
                                                    <div style={{color: '#666', fontSize: '14px'}}>Số lượng: {item.soLuong} | Phân loại: {item.loaiSanPham}</div>
                                                    <div style={{fontWeight: 600, marginTop: '8px', color: '#111'}}>{formatPrice(item.donGia)}</div>
                                                </div>
                                            </div>
                                            
                                            {/* Only show review button if order is HOAN_THANH */}
                                            {order.trangThai === 'HOAN_THANH' && (
                                                <div>
                                                    <button 
                                                        onClick={() => handleOpenReview(item)}
                                                        style={{padding: '8px 16px', background: '#fff', border: '1px solid #10b981', color: '#10b981', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px'}}
                                                    >
                                                        <FaStar /> Đánh giá
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div style={{padding: '16px 24px', backgroundColor: '#fdfdfd', borderTop: '1px solid #e5e7eb', textAlign: 'right'}}>
                                    <span style={{fontSize: '15px', color: '#666', marginRight: '16px'}}>Tổng số tiền:</span>
                                    <span style={{fontSize: '20px', fontWeight: 'bold', color: '#ef4444'}}>{formatPrice(order.tongTien)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Review Modal */}
            {reviewModalOpen && (
                <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
                    <div style={{background: '#fff', padding: '32px', borderRadius: '8px', width: '100%', maxWidth: '500px', position: 'relative'}}>
                        <button 
                            onClick={() => setReviewModalOpen(false)}
                            style={{position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#666'}}
                        >
                            <FaTimes />
                        </button>
                        <h2 style={{marginTop: 0, marginBottom: '8px'}}>Đánh giá sản phẩm</h2>
                        <p style={{color: '#666', marginBottom: '24px'}}>{selectedItem?.tenSanPham}</p>
                        
                        <div style={{marginBottom: '20px'}}>
                            <label style={{display: 'block', marginBottom: '8px', fontWeight: 600}}>Điểm đánh giá</label>
                            <div style={{display: 'flex', gap: '8px', fontSize: '24px'}}>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <FaStar 
                                        key={star} 
                                        style={{cursor: 'pointer', color: star <= reviewForm.diemDanhGia ? '#fbbf24' : '#e5e7eb'}}
                                        onClick={() => setReviewForm({...reviewForm, diemDanhGia: star})}
                                    />
                                ))}
                            </div>
                        </div>

                        <div style={{marginBottom: '24px'}}>
                            <label style={{display: 'block', marginBottom: '8px', fontWeight: 600}}>Trải nghiệm của bạn</label>
                            <textarea 
                                rows="4" 
                                placeholder="Hãy chia sẻ những điều bạn thích về sản phẩm này nhé..."
                                value={reviewForm.noiDung}
                                onChange={(e) => setReviewForm({...reviewForm, noiDung: e.target.value})}
                                style={{width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '4px', resize: 'vertical', fontFamily: 'inherit'}}
                            />
                        </div>

                        <button 
                            onClick={handleSubmitReview}
                            disabled={submittingReview}
                            style={{width: '100%', padding: '12px', background: '#111', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer'}}
                        >
                            {submittingReview ? 'Đang gửi...' : 'Gửi Đánh Giá'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
