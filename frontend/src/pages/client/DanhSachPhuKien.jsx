import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaCar, 
  FaShoppingCart, 
  FaUser, 
  FaSearch, 
  FaFilter, 
  FaTools,
  FaArrowRight,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaChevronDown
} from 'react-icons/fa';
import { productService } from '../../services/productService';
import Navbar from '../../components/layout/Navbar';
import { fallbackImages, getSafeImage } from '../../utils/imageFallback';
import '../../assets/css/Home.css';
import '../../assets/css/DanhSachOto.css'; 

export default function DanhSachPhuKien() {
  const location = useLocation();
  const [accessories, setAccessories] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const queryParams = new URLSearchParams(location.search);
  const initialKeyword = queryParams.get('keyword') || '';

  const [params, setParams] = useState({
    page: 0,
    size: 12,
    keyword: initialKeyword,
    loai: '',
    giaMin: '',
    giaMax: '',
    sort: 'ngayTao,desc'
  });
  const [totalPages, setTotalPages] = useState(0);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await productService.getAccessoryTypes();
        if (res.status === 200) {
          setTypes(res.data);
        }
      } catch (error) {
        console.error('Error fetching accessory types:', error);
      }
    };
    fetchTypes();
  }, []);

  useEffect(() => {
    const currentKeyword = new URLSearchParams(location.search).get('keyword') || '';
    setParams(prev => ({ ...prev, keyword: currentKeyword, page: 0 }));
  }, [location.search]);

  useEffect(() => {
    fetchAccessories();
  }, [params.page, params.loai, params.keyword, params.giaMin, params.giaMax, params.sort]);

  const fetchAccessories = async () => {
    try {
      setLoading(true);
      const res = await productService.getFilteredAccessories({ 
        page: params.page, 
        size: params.size, 
        loaiPhuKien: params.loai,
        giaMin: params.giaMin,
        giaMax: params.giaMax,
        keyword: params.keyword,
        sort: params.sort
      });

      const data = res?.data?.content || [];
      setAccessories(data.map((item) => ({
        ...item,
        displayImage: getSafeImage(item?.hinhAnhs?.[0], 'accessory')
      })));
      setTotalPages(res?.data?.totalPages || 0);
    } catch (error) {
      console.error('Error fetching accessories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPriceFilter = () => {
    setParams({
      ...params,
      giaMin: priceRange.min,
      giaMax: priceRange.max,
      page: 0
    });
  };

  const formatPrice = (price) => {
    if (!price) return 'Liên hệ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="home-container">
      <Navbar />

      <div className="products-page-layout">
        {/* Sidebar Filters */}
        <aside className="filters-sidebar">
          <div className="filter-group">
            <h3><FaFilter /> Bộ lọc</h3>
            <div className="filter-item">
              <label>Loại phụ kiện</label>
              <select 
                value={params.loai} 
                onChange={(e) => setParams({...params, loai: e.target.value, page: 0})}
              >
                <option value="">Tất cả</option>
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="filter-item">
              <label>Khoảng giá (VNĐ)</label>
              <div className="price-inputs">
                <input 
                  type="number" 
                  placeholder="Từ" 
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                />
                <input 
                  type="number" 
                  placeholder="Đến" 
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                />
              </div>
              <button className="btn-apply-filter" onClick={handleApplyPriceFilter}>Áp dụng</button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="products-content">
          <div className="content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1>Danh sách phụ kiện</h1>
              <p>Nâng tầm xế yêu của bạn với những phụ kiện chính hãng</p>
            </div>
            <div className="sort-box">
              <label style={{ marginRight: '0.5rem', fontWeight: '500' }}>Sắp xếp:</label>
              <select 
                value={params.sort} 
                onChange={(e) => setParams({ ...params, sort: e.target.value, page: 0 })}
                style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd' }}
              >
                <option value="ngayTao,desc">Mới nhất</option>
                <option value="gia,asc">Giá thấp đến cao</option>
                <option value="gia,desc">Giá cao đến thấp</option>
                <option value="tenPhuKien,asc">Tên A-Z</option>
                <option value="tenPhuKien,desc">Tên Z-A</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="loading-grid">
              {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton-card"></div>)}
            </div>
          ) : (
            <>
              <div className="cars-grid">
                {accessories.map(item => (
                  <div key={item.id} className="car-card">
                    <div className="car-image-container">
                      <span className="car-tag">{item.loaiPhuKien || 'Accessory'}</span>
                      <img
                        src={item.displayImage || fallbackImages.accessory}
                        alt={item.tenPhuKien}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = fallbackImages.accessory;
                        }}
                      />
                    </div>
                    <div className="car-info">
                      <h3>{item.tenPhuKien}</h3>
                      <p className="car-price">{formatPrice(item.gia)}</p>
                      <div className="car-specs">
                        <span>Hãng: {item.hangSanXuat}</span>
                        <span>Trọng lượng: {item.trongLuong}g</span>
                      </div>
                      <Link to={`/products/accessory/${item.id}`} className="view-detail">Xem chi tiết <FaArrowRight /></Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  {[...Array(totalPages)].map((_, i) => (
                    <button 
                      key={i} 
                      className={`page-btn ${params.page === i ? 'active' : ''}`}
                      onClick={() => setParams({...params, page: i})}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="nav-logo">
              <FaCar className="logo-icon" />
              <span className="logo-text">CarSales</span>
            </div>
            <p>Hệ thống phân phối và cung cấp dịch vụ xe hơi cao cấp hàng đầu Việt Nam.</p>
            <div className="social-icons">
              <span><FaFacebookF /></span> 
              <span><FaTwitter /></span> 
              <span><FaInstagram /></span> 
              <span><FaYoutube /></span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 CarSales. Bảo lưu mọi quyền.</p>
        </div>
      </footer>
    </div>
  );
}
