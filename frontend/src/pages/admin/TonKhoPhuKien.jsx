import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { inventoryService } from '../../services/inventoryService';
import { FaWarehouse, FaCogs, FaSave, FaSearch, FaHistory } from 'react-icons/fa';

export default function TonKhoPhuKien() {
    const [accessories, setAccessories] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [selectedAcc, setSelectedAcc] = useState(null);
    const [stocks, setStocks] = useState([]); // Tồn kho của phụ kiện đang chọn tại các kho
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [accRes, khoRes] = await Promise.all([
                api.get('/phu-kien?size=100'),
                api.get('/kho-hang')
            ]);
            setAccessories(accRes.data?.data?.content || []);
            setWarehouses(khoRes.data?.data?.content || []);
        } catch (err) {
            console.error('Lỗi tải dữ liệu:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAcc = async (acc) => {
        setSelectedAcc(acc);
        try {
            const res = await inventoryService.getStockByPhuKien(acc.id);
            // res ở đây đã là response.data (ApiResponse), nên lấy res.data để được Array
            setStocks(res.data || []);
        } catch (err) {
            console.error('Lỗi tải tồn kho:', err);
        }
    };

    const handleUpdateStock = (khoHangId, newSoLuong) => {
        // Đảm bảo soLuong luôn là số
        const val = parseInt(newSoLuong);
        setStocks(prev => prev.map(s => s.khoHangId === khoHangId ? { ...s, soLuong: isNaN(val) ? 0 : val } : s));
    };

    const saveAllChanges = async () => {
        if (!selectedAcc || stocks.length === 0) return;
        setSaving(true);
        try {
            for (const s of stocks) {
                const payload = {
                    phuKienId: selectedAcc.id,
                    khoHangId: s.khoHangId,
                    soLuong: s.soLuong
                };
                console.log('Sending payload:', payload);
                await inventoryService.upsertStock(payload);
            }
            alert('Cập nhật tồn kho thành công!');
        } catch (err) {
            console.error('Save error:', err);
            alert('Lỗi cập nhật: ' + (err.response?.data?.message || err.message));
        } finally {
            setSaving(false);
        }
    };

    const filteredAcc = accessories.filter(a => 
        a.tenPhuKien.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.hangSanXuat?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ padding: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111', margin: 0 }}>Quản lý Tồn kho Phụ kiện</h1>
                    <p style={{ color: '#6b7280', margin: '4px 0 0' }}>Cập nhật số lượng phụ kiện tại các chi nhánh kho</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '24px', alignItems: 'start' }}>
                {/* Danh sách phụ kiện bên trái */}
                <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ position: 'relative', marginBottom: '16px' }}>
                        <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm phụ kiện..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '10px', border: '1px solid #e5e7eb', outline: 'none', fontSize: '14px' }}
                        />
                    </div>
                    
                    <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>Đang tải...</div>
                        ) : filteredAcc.map(acc => (
                            <div 
                                key={acc.id} 
                                onClick={() => handleSelectAcc(acc)}
                                style={{ 
                                    padding: '12px', 
                                    borderRadius: '10px', 
                                    cursor: 'pointer', 
                                    marginBottom: '8px',
                                    transition: 'all 0.2s',
                                    border: selectedAcc?.id === acc.id ? '2px solid #111' : '1px solid transparent',
                                    background: selectedAcc?.id === acc.id ? '#f8fafc' : 'transparent'
                                }}
                            >
                                <div style={{ fontWeight: 700, fontSize: '14px', color: '#111' }}>{acc.tenPhuKien}</div>
                                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{acc.hangSanXuat} — {acc.loaiPhuKien}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bảng tồn kho bên phải */}
                <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', minHeight: '400px' }}>
                    {!selectedAcc ? (
                        <div style={{ height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                            <FaCogs size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                            <p style={{ fontSize: '16px' }}>Chọn một phụ kiện bên trái để quản lý tồn kho</p>
                        </div>
                    ) : (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid #f3f4f6', paddingBottom: '20px' }}>
                                <div>
                                    <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800 }}>{selectedAcc.tenPhuKien}</h2>
                                    <p style={{ margin: '4px 0 0', color: '#6b7280' }}>Phân phối tồn kho tại {warehouses.length} chi nhánh</p>
                                </div>
                                <button 
                                    onClick={saveAllChanges}
                                    disabled={saving}
                                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px', backgroundColor: '#111', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', opacity: saving ? 0.7 : 1 }}
                                >
                                    <FaSave /> {saving ? 'Đang lưu...' : 'Lưu tất cả thay đổi'}
                                </button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {stocks.map(stock => (
                                    <div key={stock.khoHangId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', background: '#f9fafb' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div style={{ width: '40px', height: '40px', background: '#fff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111', border: '1px solid #e5e7eb' }}>
                                                <FaWarehouse />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 700, color: '#111' }}>{stock.tenKho}</div>
                                                <div style={{ fontSize: '13px', color: '#6b7280' }}>{stock.diaChiChiTiet}, {stock.tinhThanhTen}</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ fontSize: '14px', fontWeight: 600, color: '#4b5563' }}>Số lượng tồn:</div>
                                            <input 
                                                type="number" 
                                                min="0"
                                                value={stock.soLuong}
                                                onChange={e => handleUpdateStock(stock.khoHangId, e.target.value)}
                                                style={{ width: '100px', padding: '10px', borderRadius: '8px', border: '2px solid #e5e7eb', textAlign: 'center', fontWeight: 'bold', outline: 'none', transition: 'border-color 0.2s' }}
                                                onFocus={e => e.target.style.borderColor = '#111'}
                                                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
