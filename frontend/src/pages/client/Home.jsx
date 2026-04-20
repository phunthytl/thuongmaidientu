import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FaCar,
    FaShoppingCart,
    FaUser,
    FaShieldAlt,
    FaClock,
    FaCheckCircle,
    FaGasPump,
    FaCogs,
    FaArrowRight,
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaYoutube,
    FaSearch,
    FaChevronDown
} from 'react-icons/fa';
import { productService } from '../../services/productService';
import Navbar from '../../components/layout/Navbar';
import '../../assets/css/Home.css';

export default function Home() {
    const [featuredCars, setFeaturedCars] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await productService.getFeaturedCars(0, 4);

            // Lấy ảnh cho từng xe
            const carsWithImages = await Promise.all(res.data.content.map(async (car) => {
                try {
                    const imgRes = await productService.getCarImages(car.id);
                    return {
                        ...car,
                        displayImage: imgRes.data && imgRes.data.length > 0 ? imgRes.data[0].url : ''
                    };
                } catch (e) {
                    return { ...car, displayImage: '' };
                }
            }));

            setFeaturedCars(carsWithImages);
        } catch (error) {
            console.error('Error fetching home data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        if (!price) return 'Liên hệ';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    return (
        <div className="home-container">
            <Navbar />

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <p className="hero-subtitle">SỰ LỰA CHỌN HÀNG ĐẦU CHO XE SANG</p>
                    <h1 className="hero-title">Khám Phá <span className="highlight">Đẳng Cấp</span> Xe Hơi Mới Nhất</h1>
                    <p className="hero-description">Những mẫu xe từ thương hiệu hàng đầu thế giới. Cam kết chất lượng và dịch vụ tận tâm.</p>
                    <div className="hero-btns">
                        <button className="btn-primary">Xem danh sách xe <FaArrowRight /></button>
                        <button className="btn-secondary">Đặt lịch lái thử</button>
                    </div>
                </div>
                <div className="hero-bg-overlay"></div>
            </section>

            {/* Features Grid */}
            <section className="features-grid">
                <div className="feature-card">
                    <div className="feature-icon-wrapper red">
                        <FaCar />
                    </div>
                    <h3>Đa dạng mẫu mã</h3>
                    <p>Hơn 500+ mẫu xe từ 20 thương hiệu nổi tiếng toàn cầu.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon-wrapper red">
                        <FaShieldAlt />
                    </div>
                    <h3>Bảo hành uy tín</h3>
                    <p>Chính sách bảo hành lên đến 5 năm hoặc 100.000 km.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon-wrapper red">
                        <FaClock />
                    </div>
                    <h3>Hỗ trợ 24/7</h3>
                    <p>Đội ngũ kỹ thuật viên luôn sẵn sàng hỗ trợ bạn mọi lúc mọi nơi.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon-wrapper red">
                        <FaCheckCircle />
                    </div>
                    <h3>Chất lượng cam kết</h3>
                    <p>Mọi xe đều được kiểm định qua 160 điểm kỹ thuật nghiêm ngặt.</p>
                </div>
            </section>

            {/* Featured Cars */}
            <section className="featured-cars">
                <div className="section-header">
                    <h2>Xe Nổi Bật</h2>
                    <Link to="/products" className="view-all">Xem tất cả xe <FaArrowRight /></Link>
                </div>

                {loading ? (
                    <div className="loading-grid">
                        {[1, 2, 3, 4].map(i => <div key={i} className="skeleton-card"></div>)}
                    </div>
                ) : (
                    <div className="cars-grid">
                        {featuredCars.map(car => (
                            <div key={car.id} className="car-card">
                                <div className="car-image-container">
                                    <span className="car-tag">{car.dongXe || 'Premium'}</span>
                                    {car.displayImage ? (
                                        <img src={car.displayImage} alt={car.tenXe} />
                                    ) : (
                                        <div className="image-placeholder">No Image Available</div>
                                    )}
                                </div>
                                <div className="car-info">
                                    <h3>{car.tenXe}</h3>
                                    <p className="car-price">Từ {formatPrice(car.gia)}</p>
                                    <div className="car-specs">
                                        <span><FaGasPump /> {car.nhienLieu || 'Xăng'}</span>
                                        <span><FaCogs /> {car.hopSo || 'Tự động'}</span>
                                    </div>
                                    <Link to={`/products/oto/${car.id}`} className="view-detail">Xem chi tiết <FaArrowRight /></Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* CTA Banner */}
            <section className="cta-banner">
                <div className="cta-content">
                    <h2>Sẵn sàng để sở hữu chiếc xe mơ ước?</h2>
                    <p>Hãy để chúng tôi đồng hành cùng bạn trên hành trình chinh phục những cung đường mới.</p>
                    <div className="cta-btns">
                        <button className="btn-white">Khám phá ngay</button>
                        <button className="btn-outline-white">Liên hệ tư vấn</button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-top">
                    <div className="footer-brand">
                        <div className="nav-logo">
                            <FaCar className="logo-icon" />
                            <span className="logo-text">CarSales</span>
                        </div>
                        <p>Hệ thống phân phối và cung cấp dịch vụ xe hơi cao cấp hàng đầu Việt Nam. Mang lại trải nghiệm lái xe đẳng cấp cho khách hàng.</p>
                        <div className="social-icons">
                            <span><FaFacebookF /></span>
                            <span><FaTwitter /></span>
                            <span><FaInstagram /></span>
                            <span><FaYoutube /></span>
                        </div>
                    </div>
                    <div className="footer-links">
                        <h4>CÔNG TY</h4>
                        <ul>
                            <li>Về chúng tôi</li>
                            <li>Tuyển dụng</li>
                            <li>Tin tức</li>
                        </ul>
                    </div>
                    <div className="footer-links">
                        <h4>SẢN PHẨM</h4>
                        <ul>
                            <li>Xe mới</li>
                            <li>Xe cũ</li>
                            <li>Phụ kiện</li>
                        </ul>
                    </div>
                    <div className="footer-links">
                        <h4>DỊCH VỤ</h4>
                        <ul>
                            <li>Bảo hành</li>
                            <li>Sửa chữa</li>
                            <li>Cứu hộ 24/7</li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2024 CarSales. Bảo lưu mọi quyền.</p>
                    <div className="bottom-links">
                        <span>Chính sách bảo mật</span>
                        <span>Điều khoản sử dụng</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
