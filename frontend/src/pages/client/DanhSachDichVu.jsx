import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaWrench, FaClock, FaArrowRight, FaStar } from 'react-icons/fa';
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
            const activeServices = data.filter(service => service.trangThai === true);

            const servicesWithImages = await Promise.all(
                activeServices.map(async (service) => {
                    try {
                        const mediaRes = await api.get(`/media/DICH_VU/${service.id}/images`);
                        return {
                            ...service,
                            displayImage: mediaRes.data?.data?.[0]?.url || ''
                        };
                    } catch {
                        return {
                            ...service,
                            displayImage: ''
                        };
                    }
                })
            );

            setServices(servicesWithImages);
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        if (!price) return 'Lien he';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    return (
        <div className="home-container">
            <Navbar />

            <section style={{
                position: 'relative',
                color: '#fff',
                padding: '70px 20px 75px',
                textAlign: 'center',
                overflow: 'hidden',
                background:
                    'radial-gradient(ellipse at top left, rgba(197,160,89,0.18) 0%, transparent 50%),' +
                    'radial-gradient(ellipse at bottom right, rgba(197,160,89,0.10) 0%, transparent 50%),' +
                    'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
            }}>
                {/* Decorative grid pattern */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage:
                        'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),' +
                        'linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                    pointerEvents: 'none',
                }} />

                {/* Top thin gold divider */}
                <div style={{
                    position: 'absolute', top: 0, left: '50%',
                    transform: 'translateX(-50%)',
                    width: '180px', height: '2px',
                    background: 'linear-gradient(90deg, transparent, #c5a059, transparent)',
                }} />

                <div style={{ position: 'relative', zIndex: 2, maxWidth: '900px', margin: '0 auto' }}>
                    {/* Badge */}
                    <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        padding: '6px 14px',
                        border: '1px solid rgba(197,160,89,0.4)',
                        borderRadius: '100px',
                        background: 'rgba(197,160,89,0.08)',
                        color: '#c5a059',
                        fontSize: '12px', fontWeight: 700,
                        letterSpacing: '2px', textTransform: 'uppercase',
                        fontFamily: 'Manrope, sans-serif',
                        marginBottom: '24px',
                    }}>
                        <FaStar style={{ fontSize: '11px' }} /> Premium Services
                    </span>

                    {/* Heading */}
                    <h1 style={{
                        fontSize: 'clamp(36px, 6vw, 60px)',
                        fontFamily: 'Lora, serif',
                        fontWeight: 600,
                        lineHeight: 1.15,
                        letterSpacing: '-1px',
                        marginBottom: '20px',
                    }}>
                        Dịch Vụ Hậu Mãi{' '}
                        <span style={{
                            color: '#c5a059',
                            fontStyle: 'italic',
                            textShadow: '0 0 30px rgba(197,160,89,0.4)',
                        }}>
                            Đẳng Cấp
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p style={{
                        color: '#d1d5db',
                        fontSize: '17px',
                        lineHeight: 1.7,
                        maxWidth: '640px',
                        margin: '0 auto',
                        fontFamily: 'Manrope, sans-serif',
                    }}>
                        Bảo dưỡng, sửa chữa và chăm sóc xe chuyên nghiệp với hệ thống
                        trang thiết bị hiện đại — đảm bảo xe của bạn luôn vận hành ở trạng thái tốt nhất.
                    </p>
                </div>
            </section>

            <div style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 20px' }}>
                {loading ? (
                    <div className="loading-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
                        {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton-card" style={{ height: '250px', background: '#e5e7eb', borderRadius: '8px' }}></div>)}
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' }}>
                        {services.map(service => (
                            <div key={service.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '24px', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease', backgroundColor: '#fff' }} className="service-card">
                                <div style={{ width: '100%', height: '220px', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#f3f4f6', marginBottom: '20px' }}>
                                    {service.displayImage ? (
                                        <img
                                            src={service.displayImage}
                                            alt={service.tenDichVu}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                        />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', fontSize: '48px' }}>
                                            <FaWrench />
                                        </div>
                                    )}
                                </div>

                                <h3 style={{ fontSize: '20px', margin: '0 0 12px 0', color: '#111' }}>{service.tenDichVu}</h3>

                                <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {service.moTa || 'Dich vu cham soc xe chuyen nghiep, giup xe van hanh on dinh va sach dep hon.'}
                                </p>

                                <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', marginBottom: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                                        <span style={{ color: '#6b7280' }}><FaClock style={{ marginRight: '6px' }} /> Thoi gian</span>
                                        <span style={{ fontWeight: 600 }}>{service.thoiGianUocTinh || 'Lien he'}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', alignItems: 'center' }}>
                                        <span style={{ color: '#6b7280' }}>Gia du kien</span>
                                        <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#ef4444' }}>{formatPrice(service.gia)}</span>
                                    </div>
                                </div>

                                <Link to={`/services/${service.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', border: '1px solid #111', color: '#111', textDecoration: 'none', borderRadius: '4px', fontWeight: 600, transition: 'all 0.2s' }}>
                                    Xem Chi Tiet <FaArrowRight />
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .service-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 25px rgba(0,0,0,0.05);
                    border-color: #d1d5db;
                }
                .service-card:hover a {
                    background-color: #111;
                    color: #fff !important;
                }
            ` }} />
        </div>
    );
}
