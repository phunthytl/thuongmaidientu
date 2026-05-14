import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMoneyBillWave, FaArrowLeft, FaTruck, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';
import Navbar from '../../components/layout/Navbar';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import { api } from '../../services/api';
import '../../assets/css/Home.css';
import '../../assets/css/GioHang.css';

export default function ThanhToan() {
    const { user } = useAuthStore();
    const { items, getTotalPrice, clearCart } = useCartStore();
    const navigate = useNavigate();

    // Address & GHN state
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [detailAddress, setDetailAddress] = useState('');
    const [ghiChu, setGhiChu] = useState('');

    const [shippingFee, setShippingFee] = useState(0);
    const [isCalculatingFee, setIsCalculatingFee] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Address Book states
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState('');
    const [isAddingNew, setIsAddingNew] = useState(false);

    useEffect(() => {
        if (items.length === 0) {
            navigate('/cart');
        }
        fetchProvinces();
        fetchUserAddresses();
    }, [items, navigate]);

    const fetchUserAddresses = async () => {
        if (!user) return;
        try {
            const res = await api.get(`/khach-hang/${user.id}/dia-chi`);
            const addrList = res.data || [];
            setAddresses(addrList);
            
            // Mặc định chọn địa chỉ ưu tiên
            if (addrList.length > 0) {
                const defaultAddr = addrList.find(a => a.isDefault) || addrList[0];
                setSelectedAddressId(defaultAddr.id);
                setIsAddingNew(false);
                calculateShippingFee(defaultAddr.ghnDistrictId, defaultAddr.ghnWardCode);
            } else {
                setIsAddingNew(true);
            }
        } catch (error) {
            console.error('Lỗi tải sổ địa chỉ:', error);
            setIsAddingNew(true);
        }
    };

    useEffect(() => {
        if (selectedProvince) {
            fetchDistricts(selectedProvince);
            setSelectedDistrict('');
            setSelectedWard('');
            setShippingFee(0);
        }
    }, [selectedProvince]);

    useEffect(() => {
        if (selectedDistrict) {
            fetchWards(selectedDistrict);
            setSelectedWard('');
            setShippingFee(0);
        }
    }, [selectedDistrict]);

    useEffect(() => {
        if (selectedDistrict && selectedWard && isAddingNew) {
            calculateShippingFee(selectedDistrict, selectedWard);
        }
    }, [selectedDistrict, selectedWard, isAddingNew]);

    const fetchProvinces = async () => {
        try {
            const res = await api.get('/ghn/provinces');
            const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
            setProvinces(data.data || []);
        } catch (error) {
            console.error('Lỗi tải danh sách tỉnh thành:', error);
        }
    };

    const fetchDistricts = async (provinceId) => {
        try {
            const res = await api.get(`/ghn/districts?provinceId=${provinceId}`);
            const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
            setDistricts(data.data || []);
        } catch (error) {
            console.error('Lỗi tải danh sách quận huyện:', error);
        }
    };

    const fetchWards = async (districtId) => {
        try {
            const res = await api.get(`/ghn/wards?districtId=${districtId}`);
            const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
            setWards(data.data || []);
        } catch (error) {
            console.error('Lỗi tải danh sách phường xã:', error);
        }
    };

    const calculateShippingFee = async (districtId, wardCode) => {
        if (!districtId || !wardCode) return;
        try {
            setIsCalculatingFee(true);
            const totalWeight = items.reduce((sum, item) => sum + 500 * item.quantity, 0); 
            
            const res = await api.post(`/ghn/fee?toDistrictId=${districtId}&toWardCode=${wardCode}&weight=${Math.min(totalWeight, 30000)}`);
            const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
            if (data && data.data && data.data.total) {
                setShippingFee(data.data.total);
            }
        } catch (error) {
            console.error('Lỗi tính phí ship:', error);
            setShippingFee(45000); // Fallback
        } finally {
            setIsCalculatingFee(false);
        }
    };

    const handleSelectAddress = (addr) => {
        setSelectedAddressId(addr.id);
        setIsAddingNew(false);
        calculateShippingFee(addr.ghnDistrictId, addr.ghnWardCode);
    };

    const handlePlaceOrder = async () => {
        let finalAddressId = selectedAddressId;

        if (isAddingNew) {
            if (!selectedProvince || !selectedDistrict || !selectedWard || !detailAddress) {
                alert('Vui lòng điền đầy đủ địa chỉ giao hàng mới!');
                return;
            }

            // Tạo địa chỉ mới trước
            try {
                setIsSubmitting(true);
                const provinceName = provinces.find(p => p.ProvinceID.toString() === selectedProvince)?.ProvinceName || '';
                const districtName = districts.find(d => d.DistrictID.toString() === selectedDistrict)?.DistrictName || '';
                const wardName = wards.find(w => w.WardCode === selectedWard)?.WardName || '';

                const newAddrRes = await api.post(`/khach-hang/${user.id}/dia-chi`, {
                    tenNguoiNhan: user.hoTen,
                    soDienThoai: user.soDienThoai,
                    tinhThanhId: parseInt(selectedProvince),
                    tinhThanhTen: provinceName,
                    quanHuyenId: parseInt(selectedDistrict),
                    quanHuyenTen: districtName,
                    xaPhuongId: parseInt(selectedWard), // Lưu ý: GHN WardCode có thể là string
                    xaPhuongTen: wardName,
                    diaChiChiTiet: detailAddress,
                    ghnDistrictId: parseInt(selectedDistrict),
                    ghnWardCode: selectedWard,
                    isDefault: addresses.length === 0
                });
                finalAddressId = newAddrRes.data.id;
            } catch (err) {
                console.error('Lỗi tạo địa chỉ mới:', err);
                alert('Không thể tạo địa chỉ mới. Vui lòng thử lại!');
                setIsSubmitting(false);
                return;
            }
        }

        if (!finalAddressId) {
            alert('Vui lòng chọn địa chỉ giao hàng!');
            return;
        }

        const chiTietDonHangs = items.map(item => ({
            loaiSanPham: item.type,
            otoId: item.type === 'OTO' ? item.id : null,
            phuKienId: item.type === 'PHU_KIEN' ? item.id : null,
            dichVuId: item.type === 'DICH_VU' ? item.id : null,
            soLuong: item.quantity,
            khoHangId: item.khoHangId || null
        }));

        const payload = {
            khachHangId: user.id,
            chiTietDonHangs: chiTietDonHangs,
            ghiChu: ghiChu,
            diaChiGiaoHangId: finalAddressId
        };

        try {
            setIsSubmitting(true);
            await api.post('/don-hang', payload);
            
            clearCart();
            alert('Đặt hàng thành công! Cảm ơn bạn đã tin tưởng CarSales.');
            navigate('/my-orders');
        } catch (error) {
            console.error('Lỗi đặt hàng:', error);
            alert(error.response?.data?.message || 'Có lỗi xảy ra trong quá trình đặt hàng!');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
    };

    const cartTotal = getTotalPrice();
    const finalTotal = cartTotal + shippingFee;

    return (
        <div className="home-container">
            <Navbar />
            
            <div className="cart-page-layout" style={{marginTop: '40px', marginBottom: '80px'}}>
                <div className="cart-header">
                    <h1>Thanh Toán</h1>
                    <p>Hoàn tất thông tin để đặt hàng</p>
                </div>

                <div className="cart-content" style={{display: 'flex', gap: '32px', alignItems: 'flex-start'}}>
                    {/* Left Column: Forms */}
                    <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '24px'}}>
                        

                        {/* Shipping Address */}
                        <div style={{background: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                            <h2 style={{fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px', marginBottom: '20px'}}>
                                <FaMapMarkerAlt color="#3b82f6" /> Địa chỉ giao hàng
                            </h2>

                            {/* Saved Addresses List */}
                            {addresses.length > 0 && (
                                <div style={{marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px'}}>
                                    <p style={{fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px'}}>Chọn từ sổ địa chỉ:</p>
                                    {addresses.map(addr => (
                                        <div 
                                            key={addr.id}
                                            onClick={() => handleSelectAddress(addr)}
                                            style={{
                                                padding: '16px',
                                                borderRadius: '8px',
                                                border: `2px solid ${selectedAddressId === addr.id && !isAddingNew ? '#3b82f6' : '#e5e7eb'}`,
                                                background: selectedAddressId === addr.id && !isAddingNew ? '#eff6ff' : '#fff',
                                                cursor: 'pointer',
                                                position: 'relative',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px'}}>
                                                <span style={{fontWeight: 700, fontSize: '15px'}}>{addr.tenNguoiNhan}</span>
                                                <span style={{color: '#6b7280', fontSize: '14px'}}>{addr.soDienThoai}</span>
                                            </div>
                                            <p style={{margin: 0, fontSize: '14px', color: '#4b5563', lineHeight: 1.5}}>
                                                {addr.diaChiChiTiet}, {addr.xaPhuongTen}, {addr.quanHuyenTen}, {addr.tinhThanhTen}
                                            </p>
                                            {addr.isDefault && (
                                                <span style={{marginTop: '8px', display: 'inline-block', fontSize: '11px', background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '4px', fontWeight: 600}}>
                                                    Mặc định
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                    
                                    <button 
                                        onClick={() => { setIsAddingNew(true); setSelectedAddressId(''); setShippingFee(0); }}
                                        style={{
                                            padding: '12px',
                                            borderRadius: '8px',
                                            border: '2px dashed #d1d5db',
                                            background: isAddingNew ? '#f9fafb' : '#fff',
                                            color: '#4b5563',
                                            cursor: 'pointer',
                                            fontWeight: 600,
                                            textAlign: 'center',
                                            marginTop: '8px'
                                        }}
                                    >
                                        + Thêm địa chỉ mới
                                    </button>
                                </div>
                            )}

                            {/* New Address Form */}
                            {(isAddingNew || addresses.length === 0) && (
                                <div style={{
                                    marginTop: addresses.length > 0 ? '24px' : 0,
                                    paddingTop: addresses.length > 0 ? '24px' : 0,
                                    borderTop: addresses.length > 0 ? '1px dashed #e5e7eb' : 'none'
                                }}>
                                    {addresses.length > 0 && (
                                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
                                            <p style={{fontSize: '14px', fontWeight: 600, color: '#374151', margin: 0}}>Nhập địa chỉ mới:</p>
                                            <button 
                                                onClick={() => {
                                                    const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
                                                    handleSelectAddress(defaultAddr);
                                                }}
                                                style={{background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '13px', fontWeight: 600}}
                                            >
                                                Sử dụng địa chỉ đã lưu
                                            </button>
                                        </div>
                                    )}
                                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                                        <div>
                                            <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', color: '#4b5563'}}>Tỉnh / Thành phố *</label>
                                            <select 
                                                value={selectedProvince} 
                                                onChange={(e) => setSelectedProvince(e.target.value)}
                                                style={{width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d1d5db'}}
                                            >
                                                <option value="">Chọn Tỉnh/Thành phố</option>
                                                {provinces.map(p => (
                                                    <option key={p.ProvinceID} value={p.ProvinceID}>{p.ProvinceName}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', color: '#4b5563'}}>Quận / Huyện *</label>
                                            <select 
                                                value={selectedDistrict} 
                                                onChange={(e) => setSelectedDistrict(e.target.value)}
                                                disabled={!selectedProvince}
                                                style={{width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d1d5db'}}
                                            >
                                                <option value="">Chọn Quận/Huyện</option>
                                                {districts.map(d => (
                                                    <option key={d.DistrictID} value={d.DistrictID}>{d.DistrictName}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', color: '#4b5563'}}>Phường / Xã *</label>
                                            <select 
                                                value={selectedWard} 
                                                onChange={(e) => setSelectedWard(e.target.value)}
                                                disabled={!selectedDistrict}
                                                style={{width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d1d5db'}}
                                            >
                                                <option value="">Chọn Phường/Xã</option>
                                                {wards.map(w => (
                                                    <option key={w.WardCode} value={w.WardCode}>{w.WardName}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div style={{gridColumn: '1 / -1'}}>
                                            <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', color: '#4b5563'}}>Số nhà, Tên đường *</label>
                                            <input 
                                                type="text" 
                                                placeholder="Ví dụ: Số 123, Đường Nguyễn Văn Cừ"
                                                value={detailAddress}
                                                onChange={(e) => setDetailAddress(e.target.value)}
                                                style={{width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d1d5db'}} 
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div style={{marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #f3f4f6'}}>
                                <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', color: '#4b5563'}}>Ghi chú đơn hàng (Tùy chọn)</label>
                                <textarea 
                                    rows="3"
                                    placeholder="Lưu ý cho người giao hàng..."
                                    value={ghiChu}
                                    onChange={(e) => setGhiChu(e.target.value)}
                                    style={{width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d1d5db', resize: 'vertical'}} 
                                />
                            </div>
                        </div>
                        
                        <button onClick={() => navigate('/cart')} style={{alignSelf: 'flex-start', background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600}}>
                            <FaArrowLeft /> Quay lại giỏ hàng
                        </button>
                    </div>

                    {/* Right Column: Order Summary */}
                    <aside className="cart-summary" style={{width: '380px', flexShrink: 0, position: 'sticky', top: '100px'}}>
                        <h3 style={{marginBottom: '20px'}}>Chi tiết thanh toán</h3>
                        
                        <div style={{marginBottom: '20px', maxHeight: '300px', overflowY: 'auto'}}>
                            {items.map((item, idx) => (
                                <div key={idx} style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px'}}>
                                    <div style={{flex: 1, paddingRight: '16px'}}>
                                        <div style={{fontWeight: 600}}>{item.name}</div>
                                        <div style={{color: '#666', fontSize: '12px'}}>SL: {item.quantity}</div>
                                    </div>
                                    <div style={{fontWeight: 600}}>{formatPrice(item.gia * item.quantity)}</div>
                                </div>
                            ))}
                        </div>
                        
                        <hr style={{margin: '20px 0', borderColor: '#e5e7eb'}} />

                        <div className="summary-row">
                            <span style={{color: '#4b5563'}}>Tổng tiền hàng</span>
                            <span style={{fontWeight: 600}}>{formatPrice(cartTotal)}</span>
                        </div>
                        <div className="summary-row">
                            <span style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#4b5563'}}>
                                <FaTruck /> Phí vận chuyển (GHN)
                            </span>
                            <span>
                                {isCalculatingFee ? 'Đang tính...' : (shippingFee > 0 ? formatPrice(shippingFee) : 'Chưa xác định')}
                            </span>
                        </div>
                        
                        <hr style={{margin: '20px 0', borderColor: '#e5e7eb'}} />
                        
                        <div className="summary-row total">
                            <span>Tổng thanh toán</span>
                            <span className="total-price" style={{fontSize: '24px', color: '#ef4444'}}>{formatPrice(finalTotal)}</span>
                        </div>
                        
                        <div style={{marginTop: '24px', padding: '16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', display: 'flex', gap: '12px', alignItems: 'flex-start'}}>
                            <FaMoneyBillWave color="#16a34a" size={24} style={{flexShrink: 0}} />
                            <div>
                                <h4 style={{margin: '0 0 4px 0', color: '#166534', fontSize: '14px'}}>Thanh toán khi nhận hàng (COD)</h4>
                                <p style={{margin: 0, fontSize: '12px', color: '#15803d', lineHeight: 1.5}}>Bạn chỉ thanh toán khi đã nhận và kiểm tra đầy đủ sản phẩm.</p>
                            </div>
                        </div>

                        <button 
                            className="btn-checkout" 
                            onClick={handlePlaceOrder}
                            disabled={isSubmitting || !selectedWard}
                            style={{marginTop: '24px', opacity: (isSubmitting || !selectedWard) ? 0.7 : 1}}
                        >
                            {isSubmitting ? 'Đang xử lý...' : 'ĐẶT HÀNG NGAY'}
                        </button>
                    </aside>
                </div>
            </div>
        </div>
    );
}
