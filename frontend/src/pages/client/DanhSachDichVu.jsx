import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaArrowRight,
  FaCalendarCheck,
  FaCarSide,
  FaClock,
  FaFilter,
  FaShieldAlt,
  FaStar,
  FaTools,
  FaWrench
} from 'react-icons/fa';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { api } from '../../services/api';
import '../../assets/css/Home.css';
import '../../assets/css/DichVu.css';

const fallbackServiceImages = [
  'https://images.unsplash.com/photo-1632823469850-1b7b1e8b7e1e?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1625047509168-a7026f36de04?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=900&q=80'
];

const benefits = [
  {
    icon: <FaShieldAlt />,
    title: 'Bảo hành minh bạch',
    text: 'Mọi hạng mục sửa chữa đều có quy trình kiểm tra và bảo hành rõ ràng.'
  },
  {
    icon: <FaClock />,
    title: 'Đặt lịch nhanh',
    text: 'Chọn dịch vụ, chi nhánh và thời gian phù hợp trực tiếp trên hệ thống.'
  },
  {
    icon: <FaCarSide />,
    title: 'Kỹ thuật chuyên sâu',
    text: 'Đội ngũ kỹ thuật viên có kinh nghiệm với nhiều dòng xe phổ biến.'
  }
];

export default function DanhSachDichVu() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('ngayTao,desc');
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    fetchServices();
  }, [sort]);

  const filteredServices = useMemo(() => {
    const value = keyword.trim().toLowerCase();
    if (!value) return services;

    return services.filter((service) => {
      const name = service.tenDichVu || '';
      const desc = service.moTa || '';
      return `${name} ${desc}`.toLowerCase().includes(value);
    });
  }, [keyword, services]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dich-vu', {
        params: {
          page: 0,
          size: 12,
          sort
        }
      });

      const content = res.data?.data?.content || res.data?.data || [];
      const servicesWithImages = await Promise.all(
        content.map(async (service, index) => {
          try {
            const mediaRes = await api.get(`/media/DICH_VU/${service.id}/images`);
            const imageUrl = mediaRes.data?.data?.[0]?.url;
            return {
              ...service,
              displayImage: imageUrl || fallbackServiceImages[index % fallbackServiceImages.length]
            };
          } catch {
            return {
              ...service,
              displayImage: fallbackServiceImages[index % fallbackServiceImages.length]
            };
          }
        })
      );

      setServices(servicesWithImages);
    } catch (error) {
      console.error('Lỗi tải danh sách dịch vụ:', error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (!price) return 'Liên hệ';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="home-container">
      <Navbar />

      <section className="service-hero">
        <div className="service-hero__overlay" />
        <div className="service-hero__content">
          <span className="service-eyebrow">CarSales Service Center</span>
          <h1>Dịch Vụ Hậu Mãi Đẳng Cấp</h1>
          <p>
            Bảo dưỡng, sửa chữa và chăm sóc xe chuyên nghiệp với hệ thống trang
            thiết bị hiện đại.
          </p>
          <div className="service-hero__actions">
            <a href="#service-list" className="service-primary-btn">
              Xem dịch vụ <FaArrowRight />
            </a>
            <Link to="/support" className="service-secondary-btn">
              Cần tư vấn?
            </Link>
          </div>
        </div>
      </section>

      <section className="service-benefits">
        {benefits.map((item) => (
          <article key={item.title} className="service-benefit-card">
            <div className="service-benefit-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      <section id="service-list" className="service-page-section">
        <div className="service-section-header">
          <div>
            <span className="service-eyebrow dark">Dịch vụ của chúng tôi</span>
            <h2>Chăm sóc xe trọn gói</h2>
            <p>Lựa chọn gói dịch vụ phù hợp và đặt lịch tại chi nhánh gần bạn.</p>
          </div>

          <div className="service-toolbar">
            <div className="service-search">
              <FaFilter />
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Tìm dịch vụ..."
              />
            </div>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="ngayTao,desc">Mới nhất</option>
              <option value="gia,asc">Giá thấp đến cao</option>
              <option value="gia,desc">Giá cao đến thấp</option>
              <option value="tenDichVu,asc">Tên A-Z</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="service-grid">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="service-skeleton" />
            ))}
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="service-empty">
            <FaTools />
            <h3>Chưa có dịch vụ phù hợp</h3>
            <p>Thử đổi từ khóa tìm kiếm hoặc quay lại sau.</p>
          </div>
        ) : (
          <div className="service-grid">
            {filteredServices.map((service, index) => (
              <article key={service.id} className="service-card">
                <div className="service-card__image">
                  <img
                    src={service.displayImage}
                    alt={service.tenDichVu}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = fallbackServiceImages[index % fallbackServiceImages.length];
                    }}
                  />
                  <span className="service-card__badge">
                    <FaWrench /> Dịch vụ
                  </span>
                </div>

                <div className="service-card__body">
                  <div className="service-card__rating">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <span>5.0</span>
                  </div>
                  <h3>{service.tenDichVu}</h3>
                  <p>{service.moTa || 'Dịch vụ chăm sóc xe chuyên nghiệp, giúp xe vận hành ổn định và bền bỉ hơn.'}</p>

                  <div className="service-card__meta">
                    <span>
                      <FaClock /> {service.thoiGianUocTinh || '60-90 phút'}
                    </span>
                    <strong>{formatPrice(service.gia)}</strong>
                  </div>

                  <Link to={`/services/${service.id}`} className="service-card__link">
                    Đặt lịch ngay <FaCalendarCheck />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="service-cta">
        <div>
          <span className="service-eyebrow dark">Hỗ trợ nhanh</span>
          <h2>Cần tư vấn bảo dưỡng xe?</h2>
          <p>Đội ngũ CarSales sẽ gọi lại và đề xuất gói dịch vụ phù hợp với tình trạng xe của bạn.</p>
        </div>
        <Link to="/support" className="service-primary-btn dark">
          Liên hệ hỗ trợ <FaArrowRight />
        </Link>
      </section>

      <Footer />
    </div>
  );
}
