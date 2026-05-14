import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaWrench, FaClock, FaCheckCircle, FaArrowRight, FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import Navbar from '../../components/layout/Navbar';
import { api } from '../../services/api';
import '../../assets/css/Home.css';

export default function DanhSachDichVu() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const res = await api.get('/dich-vu?size=20&sort=ngayTao,desc');
            const data = res.data?.data?.content || [];
            
            // Lọc ra các dịch vụ đang hoạt động
            const activeServices = data.filter(s => s.trangThai === true);
            setServices(activeServices);
        } catch (error) {
            console.error('Error fetching services:', error);
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

            {/* Banner */}
            <div style={{backgroundColor: '#111', color: '#fff', padding: '60px 20px', textAlign: 'center'}}>
                <h1 style={{fontSize: '36px', fontFamily: 'Lora, serif', marginBottom: '16px'}}>Dịch Vụ Hậu Mãi Đẳng Cấp</h1>
                <p style={{color: '#9ca3af', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6}}>
                    Bảo dưỡng, sửa chữa và chăm sóc xe chuyên nghiệp với hệ thống trang thiết bị hiện đại và đội ngũ kỹ thuật viên dày dạn kinh nghiệm.
                </p>
            </div>

            <div style={{maxWidth: '1200px', margin: '60px auto', padding: '0 20px'}}>
                {loading ? (
                    <div className="loading-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px'}}>
                        {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton-card" style={{height: '250px', background: '#e5e7eb', borderRadius: '8px'}}></div>)}
                    </div>
                ) : (
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px'}}>
                        {services.map(service => (
                            <div key={service.id} style={{border: '1px solid #e5e7eb', borderRadius: '8px', padding: '24px', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease', cursor: 'pointer', backgroundColor: '#fff'}} className="service-card">
                                <div style={{width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '20px'}}>
                                    <FaWrench />
                                </div>
                                
                                <h3 style={{fontSize: '20px', margin: '0 0 12px 0', color: '#111'}}>{service.tenDichVu}</h3>
                                
                                <p style={{color: '#6b7280', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                                    {service.moTa || 'Dịch vụ chăm sóc xe hơi chuyên nghiệp, mang lại sự an tâm tuyệt đối cho khách hàng trên mọi hành trình.'}
                                </p>

                                <div style={{padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', marginBottom: '20px'}}>
                                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px'}}>
                                        <span style={{color: '#6b7280'}}><FaClock style={{marginRight: '6px'}}/> Thời gian</span>
                                        <span style={{fontWeight: 600}}>{service.thoiGianUocTinh || 'Liên hệ'}</span>
                                    </div>
                                    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '14px', alignItems: 'center'}}>
                                        <span style={{color: '#6b7280'}}>Giá dự kiến</span>
                                        <span style={{fontWeight: 'bold', fontSize: '16px', color: '#ef4444'}}>{formatPrice(service.gia)}</span>
                                    </div>
                                </div>

                                <Link to={`/services/${service.id}`} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', border: '1px solid #111', color: '#111', textDecoration: 'none', borderRadius: '4px', fontWeight: 600, transition: 'all 0.2s'}}>
                                    Xem Chi Tiết <FaArrowRight />
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                .service-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 25px rgba(0,0,0,0.05);
                    border-color: #d1d5db;
                }
                .service-card:hover a {
                    background-color: #111;
                    color: #fff !important;
                }
            `}} />

            {/* Footer */}
            <footer className="footer" style={{marginTop: 'auto'}}>
                <div className="footer-top">
                    <div className="footer-brand">
                        <div className="nav-logo">
                            <FaWrench className="logo-icon" />
                            <span className="logo-text">CarSales</span>
                        </div>
                        <p>Hệ thống phân phối và cung cấp dịch vụ xe hơi cao cấp hàng đầu Việt Nam.</p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2024 CarSales. Bảo lưu mọi quyền.</p>
                </div>
            </footer>
        </div>
    );
}
