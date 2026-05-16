import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaSearch, FaCar, FaTools, FaCogs, FaArrowRight } from 'react-icons/fa';
import Navbar from '../../components/layout/Navbar';
import { api } from '../../services/api';
import { fallbackImages } from '../../utils/imageFallback';
import '../../assets/css/Home.css';
import '../../assets/css/DanhSachOto.css';

export default function SearchResults() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get('keyword') || '';
  
  const [results, setResults] = useState({
    oto: [],
    phuKien: [],
    dichVu: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!keyword) return;
      
      try {
        setLoading(true);
        const response = await api.get(`/search/suggestions?keyword=${keyword}`);
        if (response.data.status === 200) {
          const data = response.data.data;
          
          // Group results by type
          const grouped = {
            oto: data.filter(item => item.type === 'OTO'),
            phuKien: data.filter(item => item.type === 'PHU_KIEN'),
            dichVu: data.filter(item => item.type === 'DICH_VU')
          };
          
          setResults(grouped);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [keyword]);

  const formatPrice = (price) => {
    if (!price) return 'Liên hệ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const totalResults = results.oto.length + results.phuKien.length + results.dichVu.length;

  return (
    <div className="home-container">
      <Navbar />

      <div className="products-page-layout" style={{ gridTemplateColumns: '1fr' }}>
        <main className="products-content" style={{ padding: '2rem 5%' }}>
          <div className="content-header">
            <h1>Kết quả tìm kiếm cho: "{keyword}"</h1>
            <p>Tìm thấy {totalResults} kết quả phù hợp</p>
          </div>

          {loading ? (
            <div className="loading-grid">
              {[1, 2, 3, 4].map(i => <div key={i} className="skeleton-card"></div>)}
            </div>
          ) : totalResults === 0 ? (
            <div className="no-results">
              <FaSearch size={50} color="#ccc" />
              <h3>Rất tiếc, không tìm thấy kết quả nào phù hợp</h3>
              <p>Hãy thử từ khóa khác hoặc kiểm tra lại chính tả.</p>
              <Link to="/" className="btn-primary">Quay lại trang chủ</Link>
            </div>
          ) : (
            <div className="search-results-groups">
              {/* OTO Section */}
              {results.oto.length > 0 && (
                <section className="result-section" style={{ marginBottom: '4rem' }}>
                  <h2 className="section-title" style={{ 
                    fontSize: '1.8rem', 
                    fontWeight: '800', 
                    marginBottom: '2rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem',
                    borderBottom: '2px solid #eee',
                    paddingBottom: '1rem'
                  }}>
                    <FaCar style={{ color: '#111' }} /> Ô tô ({results.oto.length})
                  </h2>
                  <div className="cars-grid">
                    {results.oto.map(item => (
                      <div key={item.id} className="car-card">
                        <div className="car-image-container">
                          <img 
                            src={item.image || fallbackImages.car} 
                            alt={item.name}
                            onError={(e) => { e.target.src = fallbackImages.car; }}
                          />
                        </div>
                        <div className="car-info">
                          <h3>{item.name}</h3>
                          <p className="car-price">Từ {formatPrice(item.price)}</p>
                          <Link to={item.url} className="view-detail">Xem chi tiết <FaArrowRight /></Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* PHU_KIEN Section */}
              {results.phuKien.length > 0 && (
                <section className="result-section" style={{ marginBottom: '4rem' }}>
                  <h2 className="section-title" style={{ 
                    fontSize: '1.8rem', 
                    fontWeight: '800', 
                    marginBottom: '2rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem',
                    borderBottom: '2px solid #eee',
                    paddingBottom: '1rem'
                  }}>
                    <FaTools style={{ color: '#111' }} /> Phụ kiện ({results.phuKien.length})
                  </h2>
                  <div className="cars-grid">
                    {results.phuKien.map(item => (
                      <div key={item.id} className="car-card">
                        <div className="car-image-container">
                          <img 
                            src={item.image || fallbackImages.accessory} 
                            alt={item.name}
                            onError={(e) => { e.target.src = fallbackImages.accessory; }}
                          />
                        </div>
                        <div className="car-info">
                          <h3>{item.name}</h3>
                          <p className="car-price">{formatPrice(item.price)}</p>
                          <Link to={item.url} className="view-detail">Xem chi tiết <FaArrowRight /></Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* DICH_VU Section */}
              {results.dichVu.length > 0 && (
                <section className="result-section">
                  <h2 className="section-title" style={{ 
                    fontSize: '1.8rem', 
                    fontWeight: '800', 
                    marginBottom: '2rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem',
                    borderBottom: '2px solid #eee',
                    paddingBottom: '1rem'
                  }}>
                    <FaCogs style={{ color: '#111' }} /> Dịch vụ ({results.dichVu.length})
                  </h2>
                  <div className="cars-grid">
                    {results.dichVu.map(item => (
                      <div key={item.id} className="car-card">
                        <div className="car-image-container">
                          <img 
                            src={item.image || fallbackImages.service} 
                            alt={item.name}
                            onError={(e) => { e.target.src = fallbackImages.service; }}
                          />
                        </div>
                        <div className="car-info">
                          <h3>{item.name}</h3>
                          <p className="car-price">{formatPrice(item.price)}</p>
                          <Link to={item.url} className="view-detail">Xem chi tiết <FaArrowRight /></Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </main>
      </div>

      <footer className="footer" style={{ marginTop: 'auto' }}>
        <div className="footer-bottom">
          <p>© 2024 CarSales. Bảo lưu mọi quyền.</p>
        </div>
      </footer>
    </div>
  );
}
