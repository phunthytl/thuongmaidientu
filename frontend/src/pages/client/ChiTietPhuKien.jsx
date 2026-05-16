import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaShoppingCart, 
  FaShieldAlt, 
  FaTruck, 
  FaTools,
  FaCheckCircle,
  FaWarehouse,
  FaMapMarkerAlt,
  FaStar,
  FaInfoCircle
} from 'react-icons/fa';
import Navbar from '../../components/layout/Navbar';
import { productService } from '../../services/productService';
import { inventoryService } from '../../services/inventoryService';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import { fallbackImages, getSafeImage } from '../../utils/imageFallback';
import '../../assets/css/ChiTietSanPham.css';

export default function ChiTietPhuKien() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [accessory, setAccessory] = useState(null);
  const [warehouses, setWarehouses] = useState([]);
  const [selectedKho, setSelectedKho] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [mainImage, setMainImage] = useState(fallbackImages.accessory);
  const { isAuthenticated } = useAuthStore();
  const { addToCart } = useCartStore();

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const [accRes, stockRes] = await Promise.all([
        productService.getAccessoryDetail(id),
        inventoryService.getStockByPhuKien(id).catch(() => ({ data: [] }))
      ]);

      const accData = accRes?.data || accRes;
      setAccessory(accData);
      setMainImage(getSafeImage(accData?.hinhAnhs?.[0], 'accessory'));
      
      const stocks = stockRes?.data || [];
      setWarehouses(stocks);
      
      // Auto-chọn kho có hàng đầu tiên
      const firstAvailable = stocks.find(w => w.soLuong > 0);
      if (firstAvailable) {
        setSelectedKho(firstAvailable.khoHangId);
      }
    } catch (error) {
      console.error('Error fetching accessory detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
      navigate('/login');
      return;
    }

    if (!selectedKho || addingToCart) {
      return;
    }

    const targetK = warehouses.find(k => k.khoHangId === selectedKho);
    if (!targetK || targetK.soLuong <= 0) {
      alert('Kho hàng này hiện đang hết hàng. Vui lòng chọn kho khác!');
      return;
    }

    if (quantity > targetK.soLuong) {
      alert(`Kho hàng này chỉ còn ${targetK.soLuong} sản phẩm!`);
      return;
    }

    setAddingToCart(true);
    try {
      await addToCart({
        id: accessory.id,
        name: accessory.tenPhuKien,
        gia: accessory.gia,
        image: '', 
        type: 'PHU_KIEN',
        khoHangId: selectedKho
      }, quantity);

      alert('Đã thêm vào giỏ hàng thành công!');
    } catch (err) {
      alert('Thêm vào giỏ thất bại: ' + (err.response?.data?.message || err.message));
    } finally {
      setAddingToCart(false);
    }
  };

  const formatPrice = (price) => {
    if (!price) return 'Liên hệ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
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

  if (!accessory) return <div className="error-container">Không tìm thấy phụ kiện!</div>;

  const totalStock = warehouses.reduce((s, w) => s + w.soLuong, 0);

  return (
    <div className="home-container" style={{ backgroundColor: '#f9fafb', minHeight: '100vh', paddingBottom: '60px' }}>
      <Navbar />
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .warehouse-card { padding: 16px 20px; border-radius: 12px; border: 2px solid #e5e7eb; cursor: pointer; transition: all 0.25s ease; display: flex; align-items: center; gap: 14px; background: #fff; }
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
      
      <div className="product-detail-layout" style={{ maxWidth: '1280px', margin: '40px auto', padding: '0 20px' }}>
        <div className="product-gallery">
          <div className="main-image" style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '40px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
            <img
              src={mainImage}
              alt={accessory.tenPhuKien}
              style={{ width: '100%', maxHeight: '320px', objectFit: 'contain' }}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = fallbackImages.accessory;
              }}
            />
          </div>
        </div>

        <div className="product-info-main" style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column' }}>
          <div className="info-header">
            <span className="category-tag" style={{ display: 'inline-block', padding: '6px 12px', backgroundColor: '#f3f4f6', color: '#4b5563', borderRadius: '20px', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '16px' }}>{accessory.loaiPhuKien}</span>
            <h1 style={{ fontSize: '36px', fontWeight: 800, margin: '0 0 16px 0', color: '#111' }}>{accessory.tenPhuKien}</h1>
            <p className="brand" style={{ color: '#6b7280', fontSize: '16px' }}>Hãng sản xuất: <strong style={{ color: '#111' }}>{accessory.hangSanXuat}</strong></p>
          </div>

          <div className="price-section" style={{ margin: '24px 0' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#ef4444' }}>{formatPrice(accessory.gia)}</div>
          </div>

          <div className="description-section" style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaInfoCircle /> Mô tả sản phẩm
            </h3>
            <p style={{ color: '#4b5563', lineHeight: 1.6 }}>{accessory.moTa || 'Chưa có mô tả cho sản phẩm này.'}</p>
          </div>

          {/* ── Warehouse Selection ── */}
          {warehouses.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <FaWarehouse style={{ fontSize: '18px', color: '#4b5563' }} />
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#111' }}>Chọn kho xuất hàng</span>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>({totalStock} SP có sẵn)</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {warehouses.map(wh => {
                  const available = wh.soLuong > 0;
                  const isSelected = selectedKho === wh.khoHangId;
                  return (
                    <div
                      key={wh.khoHangId}
                      className={`warehouse-card ${isSelected ? 'selected' : ''} ${!available ? 'disabled' : ''}`}
                      onClick={() => available && setSelectedKho(wh.khoHangId)}
                    >
                      <div className={`wh-radio ${isSelected ? 'checked' : ''}`} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '15px', color: '#111', marginBottom: '2px' }}>{wh.tenKho}</div>
                        <div style={{ fontSize: '13px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FaMapMarkerAlt size={11} /> {wh.tinhThanhTen} — {wh.diaChiChiTiet}
                        </div>
                      </div>
                      <span className={`stock-badge ${available ? 'in-stock' : 'out-of-stock'}`}>
                        {available ? `Còn ${wh.soLuong} SP` : 'Hết hàng'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="action-section" style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: 'auto', paddingTop: '20px' }}>
            <div className="quantity-selector" style={{ display: 'flex', alignItems: 'center', border: '2px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', height: '60px' }}>
              <button style={{ padding: '0 20px', border: 'none', background: '#fff', cursor: 'pointer', fontSize: '20px', height: '100%', display: 'flex', alignItems: 'center' }} onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <input type="number" value={quantity} readOnly style={{ width: '50px', textAlign: 'center', border: 'none', fontWeight: 'bold', fontSize: '18px' }} />
              <button style={{ padding: '0 20px', border: 'none', background: '#fff', cursor: 'pointer', fontSize: '20px', height: '100%', display: 'flex', alignItems: 'center' }} onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
            <button 
              className="btn-primary" 
              style={{ flex: 1, height: '60px', padding: '0 24px', fontSize: '18px', fontWeight: 'bold', borderRadius: '12px', boxShadow: '0 4px 14px 0 rgba(17, 17, 17, 0.39)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', opacity: selectedKho ? 1 : 0.5, cursor: selectedKho ? 'pointer' : 'not-allowed' }}
              onClick={handleAddToCart}
              disabled={!selectedKho || addingToCart}
            >
              <FaShoppingCart /> {addingToCart ? 'Đang thêm...' : 'Thêm Vào Giỏ'}
            </button>
            <button style={{ height: '60px', padding: '0 24px', fontSize: '18px', fontWeight: 'bold', borderRadius: '12px', backgroundColor: '#fff', border: '2px solid #e5e7eb', color: '#111', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseOver={e => e.currentTarget.style.borderColor = '#111'} onMouseOut={e => e.currentTarget.style.borderColor = '#e5e7eb'}>
              Liên Hệ Tư Vấn
            </button>
          </div>

          <div className="trust-badges" style={{ display: 'flex', gap: '20px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
            <div className="badge" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '14px' }}>
              <FaShieldAlt color="#10b981" />
              <span>Chính hãng 100%</span>
            </div>
            <div className="badge" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '14px' }}>
              <FaTruck color="#3b82f6" />
              <span>Giao hàng toàn quốc</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
