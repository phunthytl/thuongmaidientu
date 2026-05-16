import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FaCar,
    FaShoppingCart,
    FaUser,
    FaSearch,
    FaFilter,
    FaGasPump,
    FaCogs,
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
import '../../assets/css/Home.css'; // Reusing some base styles
import '../../assets/css/DanhSachOto.css';

export default function DanhSachOto() {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [params, setParams] = useState({
        page: 0,
        size: 12,
        keyword: '',
        hangXe: '',
        giaMin: '',
        giaMax: ''
    });
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchCars();
    }, [params.page, params.hangXe]); // Refresh when page or brand changes

    const fetchCars = async () => {
        try {
            setLoading(true);
            let res;
            if (params.hangXe) {
                res = await productService.getCarsByBrand(params.hangXe, params.page, params.size);
            } else if (params.keyword) {
                res = await productService.searchCars(params.keyword, params.page, params.size);
            } else {
                res = await productService.getCars({ page: params.page, size: params.size, sort: 'ngayTao,desc' });
            }

            const cars = res?.data?.content || res?.content || [];
            const carsWithImages = await Promise.all(cars.map(async (car) => {
                try {
                    const imgRes = await productService.getCarImages(car.id);
                    const images = imgRes?.data || imgRes || [];
                    return {
                        ...car,
                        displayImage: getSafeImage(images.length > 0 ? images[0].url : '', 'car')
                    };
                } catch (e) {
                    return { ...car, displayImage: fallbackImages.car };
                }
            }));

            setCars(carsWithImages);
            setTotalPages(res?.data?.totalPages || res?.totalPages || 0);
        } catch (error) {
            console.error('Error fetching cars:', error);
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

            <div className="products-page-layout">
                {/* Sidebar Filters */}
                <aside className="filters-sidebar">
                    <div className="filter-group">
                        <h3><FaFilter /> Bộ lọc</h3>
                        <div className="filter-item">
                            <label>Hãng xe</label>
                            <select
                                value={params.hangXe}
                                onChange={(e) => setParams({ ...params, hangXe: e.target.value, page: 0 })}
                            >
                                <option value="">Tất cả</option>
                                <option value="Mercedes-Benz">Mercedes-Benz</option>
                                <option value="BMW">BMW</option>
                                <option value="Audi">Audi</option>
                                <option value="Porsche">Porsche</option>
                                <option value="Toyota">Toyota</option>
                            </select>
                        </div>

                        <div className="filter-item">
                            <label>Khoảng giá</label>
                            <div className="price-inputs">
                                <input type="number" placeholder="Từ" />
                                <input type="number" placeholder="Đến" />
                            </div>
                            <button className="btn-apply-filter">Áp dụng</button>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="products-content">
                    <div className="content-header">
                        <h1>Danh sách xe hơi</h1>
                        <p>Hiển thị {cars.length} mẫu xe mới nhất</p>
                    </div>

                    {loading ? (
                        <div className="loading-grid">
                            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton-card"></div>)}
                        </div>
                    ) : (
                        <>
                            <div className="cars-grid">
                                {cars.map(car => (
                                    <div key={car.id} className="car-card">
                                        <div className="car-image-container">
                                            <span className="car-tag">{car.dongXe || 'New'}</span>
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

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="pagination">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            className={`page-btn ${params.page === i ? 'active' : ''}`}
                                            onClick={() => setParams({ ...params, page: i })}
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

            {/* Footer (Reusing Footer from Home would be better as a component, but I'll add it here for now) */}
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
                </div>
            </footer>
        </div>
    );
}
