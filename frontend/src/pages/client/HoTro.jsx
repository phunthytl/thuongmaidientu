import { Link } from 'react-router-dom';
import {
    FaArrowRight,
    FaCar,
    FaClipboardList,
    FaCreditCard,
    FaEnvelope,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaTools,
    FaTruck
} from 'react-icons/fa';
import Navbar from '../../components/layout/Navbar';
import '../../assets/css/Home.css';

export default function HoTro() {
    const supportItems = [
        {
            icon: <FaClipboardList />,
            title: 'Tra cứu đơn hàng',
            text: 'Theo dõi trạng thái xác nhận, giao hàng và lịch sử mua hàng.',
            link: '/my-orders',
            action: 'Xem đơn hàng'
        },
        {
            icon: <FaCreditCard />,
            title: 'Thanh toán',
            text: 'Hỗ trợ COD và thanh toán VNPay sandbox cho đơn phụ kiện.',
            link: '/cart',
            action: 'Đến giỏ hàng'
        },
        {
            icon: <FaTools />,
            title: 'Dịch vụ xe',
            text: 'Đặt lịch bảo dưỡng, sửa chữa và các dịch vụ chăm sóc xe.',
            link: '/services',
            action: 'Xem dịch vụ'
        }
    ];

    const faqs = [
        {
            question: 'Thanh toán VNPay có phải tiền thật không?',
            answer: 'Môi trường hiện tại là sandbox, dùng thông tin test do VNPay cấp để kiểm thử.'
        },
        {
            question: 'Vì sao đơn hàng vẫn chờ xác nhận sau khi thanh toán?',
            answer: 'Thanh toán và duyệt đơn là hai bước riêng. Nhân viên admin sẽ xác nhận đơn để tiếp tục xử lý.'
        },
        {
            question: 'Không thấy ảnh sản phẩm thì sao?',
            answer: 'Ảnh có thể chưa được cập nhật hoặc chưa cấu hình Cloudinary cho môi trường local.'
        },
        {
            question: 'Phí vận chuyển GHN bị lỗi?',
            answer: 'Nếu chưa có GHN token, hệ thống dùng luồng demo và vẫn cho phép xử lý đơn hàng.'
        }
    ];

    return (
        <div className="home-container" style={{ minHeight: '100vh', background: '#f8f9fb' }}>
            <Navbar />

            <main style={{ padding: '48px 10% 72px' }}>
                <section style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1.2fr) minmax(320px, 0.8fr)',
                    gap: '32px',
                    alignItems: 'start'
                }}>
                    <div>
                        <p style={{
                            margin: 0,
                            color: '#6b7280',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            fontSize: '13px'
                        }}>
                            Trung tâm hỗ trợ
                        </p>
                        <h1 style={{
                            margin: '12px 0 16px',
                            fontSize: '42px',
                            lineHeight: 1.15,
                            color: '#111827',
                            letterSpacing: 0
                        }}>
                            CarSales Support
                        </h1>
                        <p style={{
                            maxWidth: '720px',
                            margin: 0,
                            color: '#4b5563',
                            lineHeight: 1.7,
                            fontSize: '16px'
                        }}>
                            Cần hỗ trợ về đơn hàng, thanh toán, phụ kiện hoặc dịch vụ xe?
                            Chọn đúng kênh bên dưới để được xử lý nhanh hơn.
                        </p>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                            gap: '16px',
                            marginTop: '32px'
                        }}>
                            {supportItems.map((item) => (
                                <div key={item.title} style={{
                                    background: '#fff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    padding: '20px'
                                }}>
                                    <div style={{
                                        width: '42px',
                                        height: '42px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: '#111827',
                                        color: '#fff',
                                        borderRadius: '8px',
                                        marginBottom: '16px'
                                    }}>
                                        {item.icon}
                                    </div>
                                    <h3 style={{ margin: '0 0 8px', fontSize: '18px', color: '#111827' }}>
                                        {item.title}
                                    </h3>
                                    <p style={{ margin: '0 0 16px', color: '#6b7280', lineHeight: 1.6, fontSize: '14px' }}>
                                        {item.text}
                                    </p>
                                    <Link to={item.link} style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        color: '#111827',
                                        fontWeight: 800,
                                        textDecoration: 'none',
                                        fontSize: '14px'
                                    }}>
                                        {item.action} <FaArrowRight />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>

                    <aside style={{
                        background: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '24px',
                        position: 'sticky',
                        top: '104px'
                    }}>
                        <h2 style={{ margin: '0 0 20px', fontSize: '22px', color: '#111827' }}>
                            Liên hệ nhanh
                        </h2>

                        <div style={{ display: 'grid', gap: '16px' }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                <FaPhoneAlt style={{ marginTop: '4px', color: '#111827' }} />
                                <div>
                                    <strong style={{ display: 'block', color: '#111827' }}>Hotline</strong>
                                    <span style={{ color: '#4b5563' }}>1900 6868</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                <FaEnvelope style={{ marginTop: '4px', color: '#111827' }} />
                                <div>
                                    <strong style={{ display: 'block', color: '#111827' }}>Email</strong>
                                    <span style={{ color: '#4b5563' }}>support@carsales.local</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                <FaMapMarkerAlt style={{ marginTop: '4px', color: '#111827' }} />
                                <div>
                                    <strong style={{ display: 'block', color: '#111827' }}>Showroom</strong>
                                    <span style={{ color: '#4b5563' }}>Hà Nội, Việt Nam</span>
                                </div>
                            </div>
                        </div>

                        <div style={{
                            borderTop: '1px solid #e5e7eb',
                            marginTop: '24px',
                            paddingTop: '20px',
                            display: 'grid',
                            gap: '10px'
                        }}>
                            <Link to="/products" style={quickLinkStyle}><FaCar /> Xem xe</Link>
                            <Link to="/accessories" style={quickLinkStyle}><FaTools /> Phụ kiện</Link>
                            <Link to="/cart" style={quickLinkStyle}><FaTruck /> Giỏ hàng</Link>
                        </div>
                    </aside>
                </section>

                <section style={{
                    marginTop: '40px',
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '24px'
                }}>
                    <h2 style={{ margin: '0 0 20px', fontSize: '24px', color: '#111827' }}>
                        Câu hỏi thường gặp
                    </h2>
                    <div style={{ display: 'grid', gap: '14px' }}>
                        {faqs.map((faq) => (
                            <div key={faq.question} style={{
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                padding: '18px',
                                background: '#fbfbfc'
                            }}>
                                <h3 style={{ margin: '0 0 8px', fontSize: '16px', color: '#111827' }}>
                                    {faq.question}
                                </h3>
                                <p style={{ margin: 0, color: '#4b5563', lineHeight: 1.6 }}>
                                    {faq.answer}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}

const quickLinkStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 14px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    textDecoration: 'none',
    color: '#111827',
    fontWeight: 700,
    background: '#fff'
};
