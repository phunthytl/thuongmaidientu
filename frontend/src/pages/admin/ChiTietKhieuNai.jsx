import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import '../../assets/css/ChiTiet.css';

export default function ChiTietKhieuNai() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [dispute, setDispute] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Reply and status state
    const [replyText, setReplyText] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [processing, setProcessing] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await api.get(`/khieu-nai/${id}`);
                const data = res.data?.data;
                setDispute(data);
                setSelectedStatus(data?.trangThai || 'MOI');
                
                // Get current HR user for NhanVienId
                const userRes = await api.get('/auth/me');
                if (userRes.data?.data) {
                    setCurrentUser(userRes.data.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    const handleUpdateStatus = async () => {
        if (!selectedStatus || selectedStatus === dispute.trangThai) return;
        setProcessing(true);
        try {
            await api.patch(`/khieu-nai/${id}/trang-thai?trangThai=${selectedStatus}`);
            setDispute(prev => ({ ...prev, trangThai: selectedStatus }));
            alert('Cập nhật trạng thái thành công!');
        } catch (err) {
            alert(err.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setProcessing(false);
        }
    };

    const handleReply = async () => {
        if (!replyText.trim()) return alert('Vui lòng nhập nội dung phản hồi');
        if (!currentUser?.id) return alert('Không thể xác thực danh tính nhân sự thực thi');
        
        setProcessing(true);
        try {
            await api.patch(`/khieu-nai/${id}/phan-hoi?phanHoi=${encodeURIComponent(replyText)}&nhanVienId=${currentUser.id}`);
            // Reload details to get the new reply info
            const res = await api.get(`/khieu-nai/${id}`);
            setDispute(res.data?.data);
            setReplyText('');
            alert('Gửi phản hồi tham vấn thành công!');
        } catch (err) {
            alert(err.response?.data?.message || 'Có lỗi xảy ra khi gửi phản hồi');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div className="view-loading">Đang trích xuất hồ sơ tranh chấp...</div>;
    if (!dispute) return <div className="view-empty">Không tìm thấy thông tin khiếu nại này.</div>;

    const statusMap = {
        'MOI': 'Khởi Tạo Mới',
        'DANG_XU_LY': 'Đang Xử Lý',
        'DA_GIAI_QUYET': 'Đã Giải Quyết Xong',
        'TU_CHOI': 'Từ Chối (Hủy)'
    };

    return (
        <div className="view-car-container" style={{maxWidth: '1000px', margin: '0 auto'}}>
            <header className="view-header">
                <div>
                     <button className="btn-back" onClick={() => navigate('/admin/disputes')}>&larr; Khối Khiếu Nại</button>
                     <h1 className="view-title">Mã Phiếu: KN-{dispute.id}</h1>
                </div>
                <div className={`view-status-badge status-${(dispute.trangThai || '').toLowerCase()}`}>
                    {statusMap[dispute.trangThai] || dispute.trangThai}
                </div>
            </header>

            <div className="view-content-wrapper" style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
                {/* Top Panel: Complaint Details */}
                <div className="view-details-panel" style={{width: '100%'}}>
                    <div className="desc-card">
                        <h2 style={{color: '#111', marginBottom: '8px', fontSize: '20px'}}>{dispute.tieuDe}</h2>
                        <ul className="spec-list" style={{display: 'flex', gap: '40px', borderBottom: '1px solid #eee', paddingBottom: '16px', marginBottom: '16px'}}>
                            <li><span className="spec-label">Khách Hàng</span><span className="spec-value" style={{fontWeight: 'bold'}}>{dispute.khachHang?.hoTen || '---'} ({dispute.khachHang?.soDienThoai})</span></li>
                            <li><span className="spec-label">Đơn Hàng Gắn Liền</span><span className="spec-value" style={{fontWeight: 'bold', fontFamily: 'monospace'}}>ORD-{dispute.donHang?.id || 'Không có'}</span></li>
                            <li><span className="spec-label">Ngày Phát Tín</span><span className="spec-value">{new Date(dispute.createdAt || dispute.ngayTao).toLocaleString('vi-VN')}</span></li>
                        </ul>
                        <h3>Nội Dung Trình Bày</h3>
                        <div style={{background: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb', marginTop: '12px'}}>
                             <p style={{whiteSpace: 'pre-wrap', lineHeight: '1.6'}}>{dispute.noiDung}</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Panel: Admin Actions & Reply History */}
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px'}}>
                    <div className="desc-card" style={{borderTop: '3px solid #6366f1'}}>
                        <h3>Tiến Trình Xử Lý</h3>
                        
                        <div style={{marginTop: '16px'}}>
                            <label style={{display: 'block', fontSize: '13px', color: '#666', marginBottom: '8px'}}>Thay đổi Trạng Thái Phiếu</label>
                            <div style={{display: 'flex', gap: '12px'}}>
                                <select 
                                    value={selectedStatus} 
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    style={{padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', flex: 1}}
                                >
                                    <option value="MOI">Mới Cấp Báo</option>
                                    <option value="DANG_XU_LY">Đang Điều Tra Xử Lý</option>
                                    <option value="DA_GIAI_QUYET">Kết Toán Giải Quyết</option>
                                    <option value="TU_CHOI">Từ Chối Đơn Thư</option>
                                </select>
                                <button className="btn-submit" onClick={handleUpdateStatus} disabled={processing} style={{width: 'auto', padding: '0 20px', fontSize: '14px'}}>
                                    Cập Nhật Định Mức
                                </button>
                            </div>
                        </div>

                        {dispute.phanHoi && (
                            <div style={{marginTop: '24px'}}>
                                <h3>Thông Tin Phản Hồi Nội Bộ</h3>
                                <div style={{background: '#f0fdf4', padding: '16px', borderRadius: '8px', border: '1px solid #bbf7d0', marginTop: '12px'}}>
                                    <p style={{whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#166534'}}>{dispute.phanHoi}</p>
                                    <div style={{marginTop: '12px', fontSize: '12px', color: '#15803d', fontWeight: 600}}>
                                        Người trả lời: {dispute.nhanVien?.hoTen || 'Thẩm Định Viên ID: ' + dispute.nhanVien?.id}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="desc-card">
                        <h3>Biên Soạn Phản Hồi Dịch Tiếp</h3>
                        <p style={{fontSize: '13px', color: '#666', marginBottom: '12px'}}>Gửi thông báo trả lời khiếu nại cho khách hàng.</p>
                        <textarea 
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            rows="7" 
                            style={{width: '100%', padding: '16px', borderRadius: '6px', border: '1px solid #d1d5db', resize: 'vertical'}}
                            placeholder="Kính chào quý khách! Hệ thống đã tiếp nhận..."
                        ></textarea>
                        <div style={{marginTop: '16px', display: 'flex', justifyContent: 'flex-end'}}>
                             <button className="btn-submit" onClick={handleReply} disabled={processing || !replyText.trim()} style={{width: 'auto', padding: '0 24px', background: '#000', color: '#fff'}}>
                                 Giao Phổ Trả Lời
                             </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
