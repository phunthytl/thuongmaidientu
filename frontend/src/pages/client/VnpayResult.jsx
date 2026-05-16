import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaClipboardList, FaHome } from 'react-icons/fa';
import Navbar from '../../components/layout/Navbar';
import '../../assets/css/Home.css';

export default function VnpayResult() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const result = useMemo(() => {
        const success = searchParams.get('success') === 'true';
        return {
            success,
            maDonHang: searchParams.get('maDonHang'),
            maGiaoDich: searchParams.get('maGiaoDich'),
            responseCode: searchParams.get('responseCode'),
            message: searchParams.get('message') || (success ? 'Thanh toan thanh cong' : 'Thanh toan khong thanh cong')
        };
    }, [searchParams]);

    return (
        <div className="home-container" style={{ background: '#f9fafb', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ maxWidth: '720px', margin: '64px auto', padding: '0 20px' }}>
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '40px', textAlign: 'center' }}>
                    <div style={{ fontSize: '56px', color: result.success ? '#16a34a' : '#dc2626', marginBottom: '16px' }}>
                        {result.success ? <FaCheckCircle /> : <FaTimesCircle />}
                    </div>
                    <h1 style={{ margin: '0 0 12px 0', fontSize: '28px', color: '#111827' }}>
                        {result.success ? 'Thanh toan VNPay thanh cong' : 'Thanh toan VNPay khong thanh cong'}
                    </h1>
                    <p style={{ margin: '0 auto 24px auto', maxWidth: '520px', color: '#4b5563', lineHeight: 1.6 }}>
                        {result.message}
                    </p>

                    <div style={{ background: '#f9fafb', border: '1px solid #eef2f7', borderRadius: '8px', padding: '16px', marginBottom: '28px', textAlign: 'left' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', gap: '16px' }}>
                            <span style={{ color: '#6b7280' }}>Ma don hang</span>
                            <strong>{result.maDonHang || '---'}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', gap: '16px' }}>
                            <span style={{ color: '#6b7280' }}>Ma giao dich</span>
                            <strong>{result.maGiaoDich || '---'}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                            <span style={{ color: '#6b7280' }}>Ma phan hoi VNPay</span>
                            <strong>{result.responseCode || '---'}</strong>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => navigate('/my-orders')}
                            style={{ padding: '12px 18px', borderRadius: '8px', border: 'none', background: '#111827', color: '#fff', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            <FaClipboardList /> Xem don hang
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            style={{ padding: '12px 18px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#fff', color: '#374151', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            <FaHome /> Ve trang chu
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
