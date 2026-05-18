import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaClipboardList, FaHome } from 'react-icons/fa';
import Navbar from '../../components/layout/Navbar';
import '../../assets/css/Home.css';

export default function VnpayResult() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5);

    const result = useMemo(() => {
        const success = searchParams.get('success') === 'true';
        return {
            success,
            maDonHang: searchParams.get('maDonHang'),
            maGiaoDich: searchParams.get('maGiaoDich'),
            responseCode: searchParams.get('responseCode'),
            message: searchParams.get('message') || (success ? 'Thanh toán thành công' : 'Thanh toán không thành công')
        };
    }, [searchParams]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate('/my-orders');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    return (
        <div className="home-container" style={{ background: '#f9fafb', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ maxWidth: '720px', margin: '64px auto', padding: '0 20px' }}>
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '40px', textAlign: 'center' }}>
                    <div style={{ fontSize: '56px', color: result.success ? '#16a34a' : '#dc2626', marginBottom: '16px' }}>
                        {result.success ? <FaCheckCircle /> : <FaTimesCircle />}
                    </div>
                    <h1 style={{ margin: '0 0 12px 0', fontSize: '28px', color: '#111827' }}>
                        {result.success ? 'Thanh toán VNPay thành công' : 'Thanh toán VNPay không thành công'}
                    </h1>
                    <p style={{ margin: '0 auto 24px auto', maxWidth: '520px', color: '#4b5563', lineHeight: 1.6 }}>
                        {result.message}
                    </p>

                    <div style={{ background: '#f9fafb', border: '1px solid #eef2f7', borderRadius: '8px', padding: '16px', marginBottom: '28px', textAlign: 'left' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', gap: '16px' }}>
                            <span style={{ color: '#6b7280' }}>Mã đơn hàng</span>
                            <strong>{result.maDonHang || '---'}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', gap: '16px' }}>
                            <span style={{ color: '#6b7280' }}>Mã giao dịch</span>
                            <strong>{result.maGiaoDich || '---'}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                            <span style={{ color: '#6b7280' }}>Mã phản hồi VNPay</span>
                            <strong>{result.responseCode || '---'}</strong>
                        </div>
                    </div>

                    <div style={{ marginBottom: '24px', fontSize: '15px', color: '#4b5563', backgroundColor: '#f3f4f6', padding: '10px 16px', borderRadius: '8px', display: 'inline-block' }}>
                        Tự động chuyển hướng về <strong>Lịch sử đơn hàng</strong> sau <strong style={{ color: '#ef4444', fontSize: '16px' }}>{countdown}</strong> giây...
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => navigate('/my-orders')}
                            style={{ padding: '12px 18px', borderRadius: '8px', border: 'none', background: '#111827', color: '#fff', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            <FaClipboardList /> Xem đơn hàng
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            style={{ padding: '12px 18px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#fff', color: '#374151', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            <FaHome /> Về trang chủ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
