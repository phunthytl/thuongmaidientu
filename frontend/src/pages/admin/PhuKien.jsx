import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import '../../assets/css/DanhSach.css';

export default function PhuKien() {
    const navigate = useNavigate();
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const res = await api.get('/phu-kien?size=15'); // Fetch phu kien
                if (res.data?.data?.content) {
                    setInventory(res.data.data.content);
                }
            } catch (err) {
                console.error('Failed to fetch accessories', err);
            } finally {
                setLoading(false);
            }
        };
        fetchInventory();
    }, []);

    const handleDelete = async (id, name) => {
        if (window.confirm(`Xác nhận xóa phụ kiện: ${name} (Mã số: PK-${id})? Hành động này không thể hoàn tác.`)) {
            try {
                await api.delete(`/phu-kien/${id}`);
                setInventory(prev => prev.filter(item => item.id !== id));
            } catch (err) {
                console.error('Failed to delete phụ kiện', err);
                alert(err.response?.data?.message || 'Có lỗi xảy ra khi xóa');
            }
        }
    };

    const formatPrice = (price) => {
        if (price == null) return 'Liên hệ';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    return (
        <div className="products-container">
            <header className="products-header">
                <div className="title-group">
                    <h2 className="products-subtitle">Phân Hệ Kho</h2>
                    <h1 className="products-title">Sản Phẩm: Phụ Kiện</h1>
                </div>
                <div className="action-group">
                    <button className="btn-add-product" onClick={() => navigate('/admin/products/accessories/new')}>Thêm Phụ Kiện Mới</button>
                </div>
            </header>

            <div className="products-table-wrapper">
                <div className="table-header">
                    <div className="col-id">Mã PK</div>
                    <div className="col-name">Tên Phụ Kiện</div>
                    <div className="col-brand">Hãng Sản Xuất</div>
                    <div className="col-amount">Tồn Kho</div>
                    <div className="col-price">Định Giá</div>
                    <div className="col-actions">Thao Tác</div>
                </div>

                <div className="table-body">
                    {loading ? (
                        <div className="table-loading">Đang kết nối kho dữ liệu...</div>
                    ) : inventory.length === 0 ? (
                        <div className="table-empty">Kho phụ kiện hiện đang trống.</div>
                    ) : (
                        inventory.map((item) => (
                            <div key={item.id} className="table-row">
                                <div className="col-id">PK-{item.id || 'N/A'}</div>
                                <div className="col-name">
                                    {item.tenPhuKien || 'Không tên'}
                                    {item.loaiPhuKien && <span className="brand-badge">{item.loaiPhuKien}</span>}
                                </div>
                                <div className="col-brand">{item.hangSanXuat || '---'}</div>
                                <div className="col-amount">{item.soLuong || 0} hộp</div>
                                <div className="col-price">{formatPrice(item.gia)}</div>
                                <div className="col-actions">
                                    <button className="btn-action view" onClick={() => navigate(`/admin/products/accessories/${item.id}`)}>Hồ Sơ</button>
                                    <button className="btn-action delete" onClick={() => handleDelete(item.id, item.tenPhuKien)}>Xóa</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
