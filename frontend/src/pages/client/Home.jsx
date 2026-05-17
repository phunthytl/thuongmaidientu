import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FaCar,
    FaShieldAlt,
    FaClock,
    FaCheckCircle,
    FaGasPump,
    FaCogs,
    FaArrowRight
} from 'react-icons/fa';
import { productService } from '../../services/productService';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { fallbackImages, getSafeImage } from '../../utils/imageFallback';
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
            const cars = res?.data?.content || res?.content || [];

            const carsWithImages = await Promise.all(
                cars.map(async (car) => {
                    try {
                        const imgRes = await productService.getCarImages(car.id);
                        const images = imgRes?.data || imgRes || [];
                        return {
                            ...car,
                            displayImage: getSafeImage(images.length > 0 ? images[0].url : '', 'car')
                        };
                    } catch (error) {
                        return { ...car, displayImage: fallbackImages.car };
                    }
                })
            );

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

            <section className="hero-section">
                <div className="hero-slideshow">
                    <div className="hero-slide hero-slide-1"></div>
                    <div className="hero-slide hero-slide-2"></div>
                    <div className="hero-slide hero-slide-3"></div>
                </div>
                <div className="hero-bg-overlay"></div>
                <div className="hero-content">
                    <p className="hero-subtitle">SỰ LỰA CHỌN HÀNG ĐẦU CHO XE SANG</p>
                    <h1 className="hero-title">Khám Phá <span className="highlight">Đẳng Cấp</span> Xe Hơi Mới Nhất</h1>
                    <p className="hero-description">Những mẫu xe từ thương hiệu hàng đầu thế giới. Cam kết chất lượng và dịch vụ tận tâm.</p>
                    <div className="hero-btns">
                        <Link to="/products" className="btn-primary">Xem danh sách xe <FaArrowRight /></Link>
                        <Link to="/products" className="btn-secondary">Đặt lịch lái thử</Link>
                    </div>
                </div>
            </section>

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

            <section className="featured-cars">
                <div className="section-header">
                    <h2>Xe Nổi Bật</h2>
                    <Link to="/products" className="view-all">Xem tất cả xe <FaArrowRight /></Link>
                </div>

                {loading ? (
                    <div className="loading-grid">
                        {[1, 2, 3, 4].map((i) => <div key={i} className="skeleton-card"></div>)}
                    </div>
                ) : (
                    <div className="cars-grid">
                        {featuredCars.map((car) => (
                            <div key={car.id} className="car-card">
                                <div className="car-image-container">
                                    <span className="car-tag">{car.dongXe || 'Premium'}</span>
                                    {car.displayImage ? (
                                        <img
                                            src={car.displayImage}
                                            alt={car.tenXe}
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = fallbackImages.car;
                                            }}
                                        />
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

            <section className="cta-banner">
                <div className="cta-content">
                    <h2>Sẵn sàng để sở hữu chiếc xe mơ ước?</h2>
                    <p>Hãy để chúng tôi đồng hành cùng bạn trên hành trình chinh phục những cung đường mới.</p>
                    <div className="cta-btns">
                        <Link to="/products" className="btn-white">Khám phá ngay</Link>
                        <Link to="/services" className="btn-outline-white">Liên hệ tư vấn</Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
