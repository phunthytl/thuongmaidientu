import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/DanhSach.css';

export default function Oto() {
    const navigate = useNavigate();
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const res = await api.get('/oto?size=10'); // Limit size for page
                if (res.data?.data?.content) {
                    setInventory(res.data.data.content);
                }
            } catch (err) {
                console.error('Failed to fetch cars', err);
            } finally {
                setLoading(false);
            }
        };
        fetchInventory();
    }, []);

    const handleDelete = async (id, name) => {
        if (window.confirm(`Xác nhận xóa mẫu xe phân phối: ${name} (Mã số: OTO-${id})? Hành động này không thể hoàn tác.`)) {
            try {
                await api.delete(`/oto/${id}`);
                setInventory(prev => prev.filter(item => item.id !== id && item.idOto !== id));
            } catch (err) {
                console.error('Failed to delete car', err);
                alert(err.response?.data?.message || 'Có lỗi xảy ra khi xóa xe');
            }
        }
    };

    const formatPrice = (price) => {
        if (price == null) return 'Liên hệ';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const statusFormat = (stt) => {
        const raw = stt || 'UNKNOWN';
        return raw.replace(/_/g, ' ');
    };

    return (
        <div className="products-container">
            <header className="products-header">
                <div className="title-group">
                    <h2 className="products-subtitle">Phân Hệ Kho</h2>
                    <h1 className="products-title">Sản Phẩm: Ô Tô</h1>
                </div>
                <div className="action-group">
                    <button className="btn-add-product" onClick={() => navigate('/admin/products/add-car')}>Thêm Mới Mẫu Xe</button>
                </div>
            </header>

            <div className="products-table-wrapper">
                <div className="table-header">
                    <div className="col-id">Mã Xe</div>
                    <div className="col-name">Tên Xe (Hãng)</div>
                    <div className="col-amount">Tồn Kho</div>
                    <div className="col-price">Định Giá</div>
                    <div className="col-status">Trạng Thái</div>
                    <div className="col-actions">Thao Tác</div>
                </div>

                <div className="table-body">
                    {loading ? (
                        <div className="table-loading">Đang kết nối kho dữ liệu...</div>
                    ) : inventory.length === 0 ? (
                        <div className="table-empty">Kho xe hiện đang trống.</div>
                    ) : (
                        inventory.map((item) => (
                            <div key={item.id} className="table-row">
                                <div className="col-id">OTO-{item.id || 'N/A'}</div>
                                <div className="col-name">
                                    {item.tenXe || 'Không tên'}
                                    {item.hangXe && <span className="brand-badge">{item.hangXe}</span>}
                                </div>
                                <div className="col-amount">{item.soLuong || 0} chiếc</div>
                                <div className="col-price">{formatPrice(item.gia)}</div>
                                <div className="col-status">
                                    <span className={`status-badge status-${(item.trangThai || '').toLowerCase()}`}>
                                        {statusFormat(item.trangThai)}
                                    </span>
                                </div>
                                <div className="col-actions">
                                    <button className="btn-action view" onClick={() => navigate(`/admin/products/oto/${item.id || item.idOto}`)}>Hồ Sơ</button>
                                    <button className="btn-action delete" onClick={() => handleDelete(item.id || item.idOto, item.tenXe)}>Xóa</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
