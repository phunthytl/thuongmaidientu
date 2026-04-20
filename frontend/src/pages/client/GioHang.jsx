import { Link, useNavigate } from 'react-router-dom';
import { 
  FaTrash, 
  FaPlus, 
  FaMinus, 
  FaArrowLeft, 
  FaShoppingCart,
  FaTools,
  FaCar
} from 'react-icons/fa';
import Navbar from '../../components/layout/Navbar';
import { useCartStore } from '../../stores/cartStore';
import '../../assets/css/Home.css';
import '../../assets/css/GioHang.css';

export default function GioHang() {
  const { items, updateQuantity, removeFromCart, getTotalPrice } = useCartStore();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    if (!price) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (items.length === 0) {
    return (
      <div className="home-container">
        <Navbar />
        <div className="empty-cart">
          <div className="empty-icon"><FaShoppingCart /></div>
          <h2>Giỏ hàng của bạn đang trống</h2>
          <p>Hãy khám phá những mẫu xe và phụ kiện tuyệt vời từ CarSales.</p>
          <Link to="/products" className="btn-primary">Tiếp tục mua sắm</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <Navbar />
      
      <div className="cart-page-layout">
        <div className="cart-header">
          <h1>Giỏ hàng của bạn</h1>
          <p>Có {items.length} loại sản phẩm trong giỏ hàng</p>
        </div>

        <div className="cart-content">
          <div className="cart-items-list">
            <div className="list-header">
              <span>Sản phẩm</span>
              <span>Giá</span>
              <span>Số lượng</span>
              <span>Tổng</span>
              <span></span>
            </div>
            
            {items.map(item => (
              <div key={`${item.id}-${item.type}`} className="cart-item">
                <div className="item-main">
                  <div className="item-img">
                    {item.type === 'OTO' ? <FaCar size={30} /> : <FaTools size={30} />}
                  </div>
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <span className="item-type">{item.type === 'OTO' ? 'Ô tô' : 'Phụ kiện'}</span>
                  </div>
                </div>
                
                <div className="item-price">
                  {formatPrice(item.gia)}
                </div>
                
                <div className="item-quantity">
                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(item.id, item.type, Math.max(1, item.quantity - 1))}>
                      <FaMinus />
                    </button>
                    <input type="number" value={item.quantity} readOnly />
                    <button onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}>
                      <FaPlus />
                    </button>
                  </div>
                </div>
                
                <div className="item-subtotal">
                  {formatPrice(item.gia * item.quantity)}
                </div>
                
                <div className="item-actions">
                  <button onClick={() => removeFromCart(item.id, item.type)} className="remove-btn">
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}

            <div className="cart-footer-actions">
              <Link to="/products" className="btn-back">
                <FaArrowLeft /> Tiếp tục mua sắm
              </Link>
            </div>
          </div>

          <aside className="cart-summary">
            <h3>Tóm tắt đơn hàng</h3>
            <div className="summary-row">
              <span>Tạm tính</span>
              <span>{formatPrice(getTotalPrice())}</span>
            </div>
            <div className="summary-row">
              <span>Phí vận chuyển</span>
              <span>Liên hệ sau</span>
            </div>
            <hr />
            <div className="summary-row total">
              <span>Tổng cộng</span>
              <span className="total-price">{formatPrice(getTotalPrice())}</span>
            </div>
            <p className="tax-note">* Giá đã bao gồm thuế VAT (nếu có)</p>
            <button className="btn-checkout" onClick={() => navigate('/checkout')}>
              Tiến hành thanh toán
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}
