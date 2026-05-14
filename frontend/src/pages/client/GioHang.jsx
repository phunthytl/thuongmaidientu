import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaTrash, 
  FaPlus, 
  FaMinus, 
  FaArrowLeft, 
  FaShoppingCart,
  FaTools,
  FaCar,
  FaWarehouse
} from 'react-icons/fa';
import Navbar from '../../components/layout/Navbar';
import { useCartStore } from '../../stores/cartStore';
import { inventoryService } from '../../services/inventoryService';
import { api } from '../../services/api';
import '../../assets/css/Home.css';
import '../../assets/css/GioHang.css';

export default function GioHang() {
  const { items, updateQuantity, removeFromCart, getTotalPrice, updateItemKho } = useCartStore();
  const navigate = useNavigate();
  const [warehouseMap, setWarehouseMap] = useState({});
  const [branches, setBranches] = useState([]);

  // Load tồn kho/chi nhánh cho các mặt hàng trong giỏ
  useEffect(() => {
    // Load chi nhánh cho Dịch vụ
    api.get('/kho-hang').then(res => {
      const list = res.data?.data || [];
      setBranches(list.filter(b => b.trangThai));
    }).catch(() => {});

    // Load kho hàng cho Ô tô và Phụ kiện
    items.forEach(async (item) => {
      if (!warehouseMap[item.id]) {
        if (item.type === 'OTO') {
          try {
            const res = await inventoryService.getStockByOto(item.id);
            setWarehouseMap(prev => ({ ...prev, [item.id]: res.data || [] }));
          } catch {}
        } else if (item.type === 'PHU_KIEN') {
          try {
            const res = await inventoryService.getStockByPhuKien(item.id);
            setWarehouseMap(prev => ({ ...prev, [item.id]: res.data || [] }));
          } catch {}
        }
      }
    });
  }, [items]);

  const formatPrice = (price) => {
    if (!price) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleKhoChange = (itemId, itemType, khoHangId) => {
    if (updateItemKho && khoHangId) {
      updateItemKho(itemId, itemType, parseInt(khoHangId));
    }
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
            
            {items.map(item => {
              const warehouses = item.type !== 'DICH_VU' ? (warehouseMap[item.id] || []) : [];
              return (
                <div key={item.chiTietId ?? `${item.id}-${item.type}`} className="cart-item">
                  <div className="item-main">
                    <div className="item-img">
                      {item.hinhAnh
                        ? <img src={item.hinhAnh} alt={item.name || item.tenSanPham} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                        : item.type === 'OTO' ? <FaCar size={30} /> : <FaTools size={30} />}
                    </div>
                    <div className="item-details">
                      <h3>{item.name || item.tenSanPham}</h3>
                      <span className="item-type">
                        {item.type === 'OTO' ? 'Ô tô' : item.type === 'PHU_KIEN' ? 'Phụ kiện' : 'Dịch vụ'}
                      </span>
                      
                      {/* Warehouse/Branch selector */}
                      {item.type !== 'DICH_VU' ? (
                        // Ô tô và Phụ kiện
                        warehouses.length > 0 && (
                          <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FaWarehouse size={14} style={{ color: '#6b7280' }} />
                            <select 
                              value={item.khoHangId || ''} 
                              onChange={(e) => handleKhoChange(item.id, item.type, e.target.value)}
                              style={{ 
                                padding: '6px 10px', 
                                borderRadius: '8px', 
                                border: '1px solid #d1d5db', 
                                fontSize: '13px',
                                color: '#374151',
                                background: '#fff',
                                cursor: 'pointer',
                                maxWidth: '240px'
                              }}
                            >
                              <option value="">-- Chọn kho --</option>
                              {warehouses.map(wh => (
                                <option 
                                  key={wh.khoHangId} 
                                  value={wh.khoHangId}
                                  disabled={wh.soLuong <= 0}
                                >
                                  {wh.tenKho} — {wh.tinhThanhTen} {wh.soLuong > 0 ? `(Còn ${wh.soLuong})` : '(Hết hàng)'}
                                </option>
                              ))}
                            </select>
                          </div>
                        )
                      ) : (
                        // Dịch vụ
                        branches.length > 0 && (
                          <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FaWarehouse size={14} style={{ color: '#6b7280' }} />
                            <select 
                              value={item.khoHangId || ''} 
                              onChange={(e) => handleKhoChange(item.id, item.type, e.target.value)}
                              style={{ 
                                padding: '6px 10px', 
                                borderRadius: '8px', 
                                border: '1px solid #d1d5db', 
                                fontSize: '13px',
                                color: '#374151',
                                background: '#fff',
                                cursor: 'pointer',
                                maxWidth: '240px'
                              }}
                            >
                              <option value="">-- Chọn chi nhánh hỗ trợ --</option>
                              {branches.map(br => (
                                <option key={br.id} value={br.id}>
                                  {br.tenKho} — {br.tinhThanhTen}
                                </option>
                              ))}
                            </select>
                          </div>
                        )
                      )}
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
              );
            })}

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
