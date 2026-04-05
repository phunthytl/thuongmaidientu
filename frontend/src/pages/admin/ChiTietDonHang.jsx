import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import '../../assets/css/ChiTiet.css';

export default function ChiTietDonHang() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [status, setStatus] = useState('');

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await api.get(`/don-hang/${id}`);
                const data = res.data?.data;
                setOrder(data);
                setStatus(data?.trangThai || 'CHO_XAC_NHAN');
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    const handleUpdateStatus = async () => {
        if (!status || status === order.trangThai) return;
        setProcessing(true);
        try {
            await api.patch(`/don-hang/${id}/trang-thai?trangThai=${status}`);
            setOrder(prev => ({ ...prev, trangThai: status }));
            alert('Cập nhật trạng thái vận đơn thành công!');
        } catch (err) {
            alert(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật!');
        } finally {
            setProcessing(false);
        }
    };

    const formatPrice = (price) => {
        if (!price) return '0 đ';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    if (loading) return <div className="view-loading">Đang tải hồ sơ giao dịch...</div>;
    if (!order) return <div className="view-empty">Không tìm thấy mã đơn hàng này.</div>;

    const getProductName = (item) => {
        switch (item.loaiSanPham) {
            case 'OTO': return item.oto?.tenXe || 'Ô Tô (Chưa định danh)';
            case 'PHU_KIEN': return item.phuKien?.tenPhuKien || 'Phụ Kiện (Chưa định danh)';
            case 'DICH_VU': return item.dichVu?.tenDichVu || 'Dịch Vụ (Chưa định danh)';
            default: return 'Sản phẩm chưa phân loại';
        }
    };

    const getProductCode = (item) => {
        switch (item.loaiSanPham) {
            case 'OTO': return item.oto?.id ? `OTO-${item.oto.id}` : '';
            case 'PHU_KIEN': return item.phuKien?.id ? `PK-${item.phuKien.id}` : '';
            case 'DICH_VU': return item.dichVu?.id ? `DV-${item.dichVu.id}` : '';
            default: return 'N/A';
        }
    };

    const statusMap = {
        'CHO_XAC_NHAN': 'Chờ Xác Nhận',
        'DA_XAC_NHAN': 'Đã Xác Nhận',
        'DANG_XU_LY': 'Đang Xử Lý',
        'DANG_GIAO': 'Đang Giao Hàng',
        'HOAN_THANH': 'Đã Hoàn Thành',
        'DA_HUY': 'Đã Hủy'
    };

    const dateStr = order.createdAt || order.ngayTao || order.thoiGianCapNhat;
    const formattedDate = dateStr ? new Date(dateStr).toLocaleString('vi-VN') : '---';

    return (
        <div className="view-car-container" style={{maxWidth: '1000px', margin: '0 auto'}}>
            <header className="view-header">
                <div>
                     <button className="btn-back" onClick={() => navigate('/admin/orders')}>&larr; Quản Lý Giao Dịch</button>
                     <h1 className="view-title">Mã Hóa Đơn: {order.maDonHang || `ORD-${order.id}`}</h1>
                </div>
                <div className={`view-status-badge status-${(order.trangThai || '').toLowerCase()}`}>
                    {statusMap[order.trangThai] || order.trangThai}
                </div>
            </header>

            <div className="view-content-wrapper" style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
                
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px'}}>
                    {/* Customer Info */}
                    <div className="desc-card">
                        <h3>Thông Tin Nhận Hàng</h3>
                        <ul className="spec-list" style={{marginTop: '12px'}}>
                            <li>
                                <span className="spec-label">Khách Hàng</span>
                                <span className="spec-value">{order.tenKhachHang || order.khachHang?.hoTen || order.nguoiDung?.hoTen || 'Khách Vãng Lai'}</span>
                            </li>
                            <li>
                                <span className="spec-label">Số Điện Thoại</span>
                                <span className="spec-value" style={{fontWeight: 'bold'}}>{order.soDienThoaiKhachHang || order.khachHang?.soDienThoai || order.nguoiDung?.soDienThoai || order.soDienThoaiGiaoHang || '---'}</span>
                            </li>
                            <li>
                                <span className="spec-label">Email Điển Tử</span>
                                <span className="spec-value">{order.emailKhachHang || order.khachHang?.email || order.nguoiDung?.email || '---'}</span>
                            </li>
                            <li>
                                <span className="spec-label">Ngày Phát Sinh Đơn</span>
                                <span className="spec-value">{formattedDate}</span>
                            </li>
                        </ul>
                        <div style={{marginTop: '16px'}}>
                            <div style={{fontSize: '13px', color: '#666', marginBottom: '4px'}}>Địa chỉ Vận Chuyển:</div>
                            <div style={{fontWeight: 600, background: '#f9fafb', padding: '12px', borderRadius: '6px', border: '1px solid #eee'}}>
                                {order.diaChiGiaoHang || 'Chưa cung cấp địa chỉ'}
                            </div>
                        </div>
                    </div>

                    {/* Status Management */}
                    <div className="desc-card" style={{borderTop: '3px solid #10b981'}}>
                        <h3>Quản Trị Vận Đơn</h3>
                        <div style={{marginTop: '16px'}}>
                            <label style={{display: 'block', fontSize: '13px', color: '#666', marginBottom: '8px'}}>Cập Nhật Trạng Thái Giao Dịch</label>
                            <div style={{display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
                                <select 
                                    value={status} 
                                    onChange={(e) => setStatus(e.target.value)}
                                    style={{padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', flex: 1, minWidth: '200px'}}
                                >
                                    <option value="CHO_XAC_NHAN">Chờ Xác Nhận (Mới)</option>
                                    <option value="DA_XAC_NHAN">Duyệt - Chờ Lấy Hàng</option>
                                    <option value="DANG_XU_LY">Đang Xử Lý Nội Bộ</option>
                                    <option value="DANG_GIAO">Đang Luân Chuyển Hàng</option>
                                    <option value="HOAN_THANH">Chót - Giao Thành Công</option>
                                    <option value="DA_HUY">Hủy Bỏ Đơn Tuyến</option>
                                </select>
                                <button className="btn-submit" onClick={handleUpdateStatus} disabled={processing} style={{width: 'auto', padding: '0 20px', fontSize: '14px', background: '#059669', color: '#fff'}}>
                                    Lưu Vết Trạng Thái
                                </button>
                            </div>
                        </div>

                        {order.ghiChu && (
                            <div style={{marginTop: '24px'}}>
                                <h3>Lời Nhắn Từ Khách Hàng</h3>
                                <div style={{background: '#fefce8', padding: '16px', borderRadius: '8px', border: '1px solid #fef08a', marginTop: '12px'}}>
                                    <p style={{whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#a16207'}}>{order.ghiChu}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Items Info */}
                <div className="desc-card">
                    <h3>Bảng Chẩn Kê Cấu Thành Giá (Giỏ Hàng)</h3>
                    
                    <div style={{marginTop: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden'}}>
                        <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>
                            <thead style={{background: '#f9fafb', fontSize: '13px'}}>
                                <tr>
                                    <th style={{padding: '12px 16px', borderBottom: '1px solid #e5e7eb', fontWeight: 600}}>Hạng Mục Sản Phẩm</th>
                                    <th style={{padding: '12px 16px', borderBottom: '1px solid #e5e7eb', fontWeight: 600}}>Đơn Giá Phân Phối</th>
                                    <th style={{padding: '12px 16px', borderBottom: '1px solid #e5e7eb', fontWeight: 600}}>Hệ Số Tỉ Lượng</th>
                                    <th style={{padding: '12px 16px', borderBottom: '1px solid #e5e7eb', fontWeight: 600, textAlign: 'right'}}>Thành Tiền Quy Đổi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(order.chiTietDonHangs || order.items || []).length > 0 ? (
                                    (order.chiTietDonHangs || order.items).map((item, index) => (
                                        <tr key={index}>
                                            <td style={{padding: '14px 16px', borderBottom: '1px solid #f3f4f6'}}>
                                                <div style={{fontWeight: 600, fontSize: '14px'}}>{getProductName(item)}</div>
                                                <div style={{fontSize: '12px', color: '#888', marginTop: '4px'}}>
                                                    Phân loại: {item.loaiSanPham || 'Không xác định'} {getProductCode(item) ? `(Mã: ${getProductCode(item)})` : ''}
                                                </div>
                                            </td>
                                            <td style={{padding: '14px 16px', borderBottom: '1px solid #f3f4f6'}}>{formatPrice(item.donGia)}</td>
                                            <td style={{padding: '14px 16px', borderBottom: '1px solid #f3f4f6', fontWeight: 600}}>&times; {item.soLuong || 1}</td>
                                            <td style={{padding: '14px 16px', borderBottom: '1px solid #f3f4f6', textAlign: 'right', fontWeight: 'bold'}}>{formatPrice(item.thanhTien)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" style={{padding: '24px', textAlign: 'center', color: '#888'}}>Không thể trích xuất chi tiết giỏ hàng. Đây có thể là đơn hàng Legacy (Phiên bản hệ thống cũ).</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        
                        <div style={{padding: '20px', background: '#fff', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', borderTop: '1px solid #e5e7eb'}}>
                            <div style={{fontSize: '15px', color: '#666', marginRight: '24px'}}>GIÁ TRỊ TỔNG HỢP SAU KHI QUA CỔNG: </div>
                            <div style={{fontSize: '24px', fontWeight: 'bold', color: '#111'}}>{formatPrice(order.tongTien || order.tongGiaTri)}</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
