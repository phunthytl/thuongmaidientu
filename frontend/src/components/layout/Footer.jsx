import { Link } from 'react-router-dom';
import {
  FaCar,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock
} from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="nav-logo">
            <FaCar className="logo-icon" />
            <span className="logo-text">CarSales</span>
          </div>
          <p>
            Hệ thống phân phối và cung cấp dịch vụ xe hơi cao cấp hàng đầu Việt Nam.
            Mang lại trải nghiệm lái xe đẳng cấp cho khách hàng.
          </p>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><FaFacebookF /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter"><FaTwitter /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"><FaYoutube /></a>
          </div>
        </div>

        <div className="footer-links">
          <h4>SẢN PHẨM</h4>
          <ul>
            <li><Link to="/products">Xe mới</Link></li>
            <li><Link to="/products">Xe cũ</Link></li>
            <li><Link to="/accessories">Phụ kiện</Link></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>DỊCH VỤ</h4>
          <ul>
            <li><Link to="/services">Bảo hành</Link></li>
            <li><Link to="/services">Sửa chữa</Link></li>
            <li><Link to="/support">Cứu hộ 24/7</Link></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>LIÊN HỆ</h4>
          <ul>
            <li>
              <FaMapMarkerAlt className="contact-icon" />
              <span>123 Đường Trần Phú, Hà Nội</span>
            </li>
            <li>
              <FaPhoneAlt className="contact-icon" />
              <a href="tel:19001234">1900 1234</a>
            </li>
            <li>
              <FaEnvelope className="contact-icon" />
              <a href="mailto:support@carsales.vn">support@carsales.vn</a>
            </li>
            <li>
              <FaClock className="contact-icon" />
              <span>T2 - CN: 8:00 - 22:00</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} CarSales. Bảo lưu mọi quyền.</p>
        <div className="bottom-links">
          <Link to="/support">Chính sách bảo mật</Link>
          <Link to="/support">Điều khoản sử dụng</Link>
        </div>
      </div>
    </footer>
  );
}
