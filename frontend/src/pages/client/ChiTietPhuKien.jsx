import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaShoppingCart, 
  FaShieldAlt, 
  FaTruck, 
  FaTools,
  FaCheckCircle
} from 'react-icons/fa';
import Navbar from '../../components/layout/Navbar';
import { productService } from '../../services/productService';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import '../../assets/css/ChiTietSanPham.css';

export default function ChiTietPhuKien() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [accessory, setAccessory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { isAuthenticated } = useAuthStore();
  const { addToCart } = useCartStore();

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await productService.getAccessoryDetail(id);
      setAccessory(res.data);
    } catch (error) {
      console.error('Error fetching accessory detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
      navigate('/login');
      return;
    }

    addToCart({
      id: accessory.id,
      name: accessory.tenPhuKien,
      gia: accessory.gia,
      image: '', // Placeholder
      type: 'PHU_KIEN'
    }, quantity);

    alert('Đã thêm vào giỏ hàng thành công!');
  };

  const formatPrice = (price) => {
    if (!price) return 'Liên hệ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (loading) return <div className="loading-container">Đang tải thông tin...</div>;
  if (!accessory) return <div className="error-container">Không tìm thấy phụ kiện!</div>;

  return (
    <div className="home-container">
      <Navbar />
      
      <div className="product-detail-layout">
        <div className="product-gallery">
          <div className="main-image">
            <FaTools size={100} color="#ddd" />
            <p>Ảnh sản phẩm đang được cập nhật</p>
          </div>
        </div>

        <div className="product-info-main">
          <div className="info-header">
            <span className="category-tag">{accessory.loaiPhuKien}</span>
            <h1>{accessory.tenPhuKien}</h1>
            <p className="brand">Hãng sản xuất: <strong>{accessory.hangSanXuat}</strong></p>
          </div>

          <div className="price-section">
            <span className="current-price">{formatPrice(accessory.gia)}</span>
            <span className="stock-status">
              <FaCheckCircle /> Còn hàng ({accessory.soLuong})
            </span>
          </div>

          <div className="description-section">
            <h3>Mô tả sản phẩm</h3>
            <p>{accessory.moTa || 'Chưa có mô tả cho sản phẩm này.'}</p>
          </div>

          <div className="specifications-section">
            <div className="spec-item">
              <span>Trọng lượng:</span>
              <strong>{accessory.trongLuong}g</strong>
            </div>
          </div>

          <div className="action-section">
            <div className="quantity-selector">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <input type="number" value={quantity} readOnly />
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
            <button className="btn-add-cart" onClick={handleAddToCart}>
              <FaShoppingCart /> Thêm vào giỏ hàng
            </button>
          </div>

          <div className="trust-badges">
            <div className="badge">
              <FaShieldAlt />
              <span>Chính hãng 100%</span>
            </div>
            <div className="badge">
              <FaTruck />
              <span>Giao hàng toàn quốc</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
