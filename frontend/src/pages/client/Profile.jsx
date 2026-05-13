import { useState, useEffect } from 'react';
import { FaUserCircle, FaMapMarkerAlt, FaPlus, FaTrash, FaStar, FaPhoneAlt } from 'react-icons/fa';
import Navbar from '../../components/layout/Navbar';
import { useAuthStore } from '../../stores/authStore';
import { api } from '../../services/api';
import axios from 'axios';
import '../../assets/css/Home.css';

export default function Profile() {
    const { user } = useAuthStore();
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useState({
        tenNguoiNhan: '',
        soDienThoai: '',
        tinhThanhId: '',
        tinhThanhTen: '',
        xaPhuongId: '', // We use this for District ID for legacy mapping
        xaPhuongTen: '', // District Name + Ward Name
        diaChiChiTiet: '',
        ghnDistrictId: '',
        ghnWardCode: '',
        isDefault: false
    });

    const [activeTab, setActiveTab] = useState('address'); // 'address', 'profile', 'password'

    // Profile Update State
    const [profileForm, setProfileForm] = useState({
        hoTen: user?.hoTen || '',
        soDienThoai: user?.soDienThoai || ''
    });
    const [passwordForm, setPasswordForm] = useState({
        matKhauCu: '',
        matKhauMoi: '',
        xacNhanMatKhau: ''
    });

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    useEffect(() => {
        if (user && user.id) {
            fetchAddresses();
            fetchProvinces();
            setProfileForm({
                hoTen: user.hoTen || '',
                soDienThoai: user.soDienThoai || ''
            });
        }
    }, [user]);

    const fetchAddresses = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/khach-hang/${user.id}/dia-chi`);
            setAddresses(res.data || []);
        } catch (error) {
            console.error('Lỗi tải danh sách địa chỉ:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProvinces = async () => {
        try {
            const res = await axios.get('https://provinces.open-api.vn/api/p/');
            setProvinces(res.data || []);
        } catch (error) {
            console.error('Lỗi tải tỉnh thành:', error);
        }
    };

    const fetchDistricts = async (provinceId) => {
        try {
            const res = await axios.get(`https://provinces.open-api.vn/api/p/${provinceId}?depth=2`);
            setDistricts(res.data.districts || []);
        } catch (error) {
            console.error('Lỗi tải quận huyện:', error);
        }
    };

    const fetchWards = async (districtId) => {
        try {
            const res = await axios.get(`https://provinces.open-api.vn/api/d/${districtId}?depth=2`);
            setWards(res.data.wards || []);
        } catch (error) {
            console.error('Lỗi tải phường xã:', error);
        }
    };

    const handleProvinceChange = (e) => {
        const pId = e.target.value;
        const pName = e.target.options[e.target.selectedIndex].text;
        setForm({ ...form, tinhThanhId: pId, tinhThanhTen: pName, xaPhuongId: '', ghnDistrictId: '', ghnWardCode: '' });
        fetchDistricts(pId);
        setDistricts([]);
        setWards([]);
    };

    const handleDistrictChange = (e) => {
        const dId = e.target.value;
        setForm({ ...form, ghnDistrictId: dId, xaPhuongId: dId, ghnWardCode: '' });
        fetchWards(dId);
        setWards([]);
    };

    const handleWardChange = (e) => {
        const wCode = e.target.value;
        const wName = e.target.options[e.target.selectedIndex].text;
        const dName = districts.find(d => d.code.toString() === form.ghnDistrictId.toString())?.name || '';

        setForm({
            ...form,
            ghnWardCode: wCode,
            xaPhuongTen: `${wName}, ${dName}`
        });
    };

    const handleSaveAddress = async () => {
        if (!form.tenNguoiNhan || !form.soDienThoai || !form.ghnWardCode || !form.diaChiChiTiet) {
            alert('Vui lòng điền đủ thông tin!');
            return;
        }

        try {
            await api.post(`/khach-hang/${user.id}/dia-chi`, form);
            setIsModalOpen(false);
            fetchAddresses();
            setForm({
                tenNguoiNhan: '',
                soDienThoai: '',
                tinhThanhId: '',
                tinhThanhTen: '',
                xaPhuongId: '',
                xaPhuongTen: '',
                diaChiChiTiet: '',
                ghnDistrictId: '',
                ghnWardCode: '',
                isDefault: false
            });
        } catch (error) {
            console.error('Lỗi lưu địa chỉ:', error);
            alert('Có lỗi xảy ra khi lưu địa chỉ');
        }
    };

    const handleDeleteAddress = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return;
        try {
            await api.delete(`/khach-hang/${user.id}/dia-chi/${id}`);
            fetchAddresses();
        } catch (error) {
            console.error('Lỗi xóa địa chỉ:', error);
            alert('Không thể xóa địa chỉ này');
        }
    };

    const handleSetDefault = async (addr) => {
        if (addr.isDefault) return;
        try {
            await api.put(`/khach-hang/${user.id}/dia-chi/${addr.id}`, { ...addr, isDefault: true });
            fetchAddresses();
        } catch (error) {
            console.error('Lỗi cập nhật địa chỉ mặc định:', error);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/nguoi-dung/${user.id}`, profileForm);
            alert('Cập nhật thông tin thành công! Vui lòng đăng nhập lại để làm mới hệ thống.');
            // Ideally we'd update user in authStore, but a re-login or checkAuth() is best.
        } catch (error) {
            console.error('Lỗi cập nhật thông tin:', error);
            alert(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin');
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordForm.matKhauMoi !== passwordForm.xacNhanMatKhau) {
            alert('Mật khẩu xác nhận không khớp!');
            return;
        }
        try {
            await api.put(`/nguoi-dung/${user.id}/mat-khau`, {
                matKhauCu: passwordForm.matKhauCu,
                matKhauMoi: passwordForm.matKhauMoi
            });
            alert('Đổi mật khẩu thành công!');
            setPasswordForm({ matKhauCu: '', matKhauMoi: '', xacNhanMatKhau: '' });
        } catch (error) {
            console.error('Lỗi đổi mật khẩu:', error);
            alert(error.response?.data?.message || 'Mật khẩu cũ không chính xác hoặc có lỗi xảy ra');
        }
    };

    return (
        <div className="home-container">
            <Navbar />

            <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px', display: 'flex', gap: '40px', alignItems: 'flex-start' }}>

                {/* Left Sidebar: Profile Info */}
                <div style={{ width: '300px', flexShrink: 0, backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb', padding: '24px', textAlign: 'center' }}>
                    <FaUserCircle style={{ fontSize: '80px', color: '#d1d5db', marginBottom: '16px' }} />
                    <h2 style={{ margin: '0 0 8px 0', fontSize: '20px' }}>{user?.hoTen}</h2>
                    <p style={{ color: '#666', fontSize: '14px', margin: '0 0 4px 0' }}>{user?.email}</p>
                    <p style={{ color: '#666', fontSize: '14px', margin: '0 0 24px 0' }}>{user?.soDienThoai || 'Chưa cập nhật SĐT'}</p>

                    <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '24px', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
                            <span style={{ color: '#4b5563' }}>Hạng thành viên</span>
                            <strong style={{ color: '#f59e0b' }}>{user?.hangThanhVien || 'ĐỒNG'}</strong>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '14px' }}>
                            <span style={{ color: '#4b5563' }}>Điểm tích lũy</span>
                            <strong>{user?.diemTichLuy || 0} điểm</strong>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <button
                            onClick={() => setActiveTab('address')}
                            style={{ width: '100%', padding: '12px', background: activeTab === 'address' ? '#111' : 'transparent', color: activeTab === 'address' ? '#fff' : '#4b5563', border: activeTab === 'address' ? 'none' : '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
                        >
                            Sổ Địa Chỉ
                        </button>
                        <button
                            onClick={() => setActiveTab('profile')}
                            style={{ width: '100%', padding: '12px', background: activeTab === 'profile' ? '#111' : 'transparent', color: activeTab === 'profile' ? '#fff' : '#4b5563', border: activeTab === 'profile' ? 'none' : '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
                        >
                            Cập Nhật Thông Tin
                        </button>
                        <button
                            onClick={() => setActiveTab('password')}
                            style={{ width: '100%', padding: '12px', background: activeTab === 'password' ? '#111' : 'transparent', color: activeTab === 'password' ? '#fff' : '#4b5563', border: activeTab === 'password' ? 'none' : '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
                        >
                            Đổi Mật Khẩu
                        </button>
                    </div>
                </div>

                {/* Right Content */}
                <div style={{ flex: 1 }}>
                    {activeTab === 'address' && (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px' }}>
                                <h1 style={{ margin: 0, fontSize: '24px', fontFamily: 'Lora, serif' }}>Sổ Địa Chỉ</h1>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    style={{ background: '#111', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}
                                >
                                    <FaPlus /> Thêm địa chỉ mới
                                </button>
                            </div>

                            {loading ? (
                                <div>Đang tải danh sách địa chỉ...</div>
                            ) : addresses.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f9fafb', borderRadius: '8px', color: '#666' }}>
                                    Bạn chưa có địa chỉ nào trong sổ địa chỉ.
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {addresses.map(addr => (
                                        <div key={addr.id} style={{ border: '1px solid', borderColor: addr.isDefault ? '#3b82f6' : '#e5e7eb', borderRadius: '8px', padding: '20px', position: 'relative', backgroundColor: addr.isDefault ? '#eff6ff' : '#fff' }}>
                                            {addr.isDefault && (
                                                <span style={{ position: 'absolute', top: '20px', right: '20px', background: '#3b82f6', color: '#fff', fontSize: '12px', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>
                                                    Mặc định
                                                </span>
                                            )}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                                <strong style={{ fontSize: '16px' }}>{addr.tenNguoiNhan}</strong>
                                                <span style={{ color: '#d1d5db' }}>|</span>
                                                <span style={{ color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}><FaPhoneAlt size={12} /> {addr.soDienThoai}</span>
                                            </div>
                                            <div style={{ color: '#4b5563', lineHeight: 1.5, display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                                <FaMapMarkerAlt style={{ marginTop: '4px', color: '#9ca3af', flexShrink: 0 }} />
                                                <div>
                                                    <div>{addr.diaChiChiTiet}</div>
                                                    <div>{addr.xaPhuongTen}, {addr.tinhThanhTen}</div>
                                                </div>
                                            </div>

                                            <div style={{ marginTop: '16px', display: 'flex', gap: '16px', fontSize: '14px' }}>
                                                {!addr.isDefault && (
                                                    <button
                                                        onClick={() => handleSetDefault(addr)}
                                                        style={{ background: 'none', border: '1px solid #d1d5db', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', color: '#4b5563' }}
                                                    >
                                                        Thiết lập mặc định
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteAddress(addr.id)}
                                                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                                >
                                                    <FaTrash /> Xóa
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'profile' && (
                        <>
                            <div style={{ marginBottom: '24px', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px' }}>
                                <h1 style={{ margin: 0, fontSize: '24px', fontFamily: 'Lora, serif' }}>Cập Nhật Thông Tin</h1>
                                <p style={{ color: '#6b7280', margin: '8px 0 0 0' }}>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
                            </div>
                            <form onSubmit={handleUpdateProfile} style={{ maxWidth: '500px' }}>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Họ và tên</label>
                                    <input
                                        type="text"
                                        value={profileForm.hoTen}
                                        onChange={(e) => setProfileForm({ ...profileForm, hoTen: e.target.value })}
                                        style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #d1d5db' }}
                                        required
                                    />
                                </div>
                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Số điện thoại</label>
                                    <input
                                        type="text"
                                        value={profileForm.soDienThoai}
                                        onChange={(e) => setProfileForm({ ...profileForm, soDienThoai: e.target.value })}
                                        style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #d1d5db' }}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn-primary" style={{ padding: '12px 24px' }}>Lưu Thay Đổi</button>
                            </form>
                        </>
                    )}

                    {activeTab === 'password' && (
                        <>
                            <div style={{ marginBottom: '24px', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px' }}>
                                <h1 style={{ margin: 0, fontSize: '24px', fontFamily: 'Lora, serif' }}>Đổi Mật Khẩu</h1>
                                <p style={{ color: '#6b7280', margin: '8px 0 0 0' }}>Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</p>
                            </div>
                            <form onSubmit={handleChangePassword} style={{ maxWidth: '500px' }}>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Mật khẩu hiện tại</label>
                                    <input
                                        type="password"
                                        value={passwordForm.matKhauCu}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, matKhauCu: e.target.value })}
                                        style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #d1d5db' }}
                                        required
                                    />
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Mật khẩu mới</label>
                                    <input
                                        type="password"
                                        value={passwordForm.matKhauMoi}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, matKhauMoi: e.target.value })}
                                        style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #d1d5db' }}
                                        required
                                    />
                                </div>
                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Xác nhận mật khẩu mới</label>
                                    <input
                                        type="password"
                                        value={passwordForm.xacNhanMatKhau}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, xacNhanMatKhau: e.target.value })}
                                        style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #d1d5db' }}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn-primary" style={{ padding: '12px 24px' }}>Xác Nhận Đổi Mật Khẩu</button>
                            </form>
                        </>
                    )}
                </div>
            </div>

            {/* Add Address Modal */}
            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: '#fff', padding: '32px', borderRadius: '8px', width: '100%', maxWidth: '600px' }}>
                        <h2 style={{ marginTop: 0, marginBottom: '24px' }}>Thêm địa chỉ mới</h2>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Tên người nhận</label>
                                <input
                                    type="text"
                                    value={form.tenNguoiNhan}
                                    onChange={(e) => setForm({ ...form, tenNguoiNhan: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d1d5db' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Số điện thoại</label>
                                <input
                                    type="text"
                                    value={form.soDienThoai}
                                    onChange={(e) => setForm({ ...form, soDienThoai: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d1d5db' }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Tỉnh/Thành phố</label>
                                <select
                                    value={form.tinhThanhId}
                                    onChange={handleProvinceChange}
                                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d1d5db' }}
                                >
                                    <option value="">Chọn Tỉnh</option>
                                    {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Quận/Huyện</label>
                                <select
                                    value={form.ghnDistrictId}
                                    onChange={handleDistrictChange}
                                    disabled={!form.tinhThanhId}
                                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d1d5db' }}
                                >
                                    <option value="">Chọn Quận</option>
                                    {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Phường/Xã</label>
                                <select
                                    value={form.ghnWardCode}
                                    onChange={handleWardChange}
                                    disabled={!form.ghnDistrictId}
                                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d1d5db' }}
                                >
                                    <option value="">Chọn Phường</option>
                                    {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Địa chỉ chi tiết (Số nhà, tên đường)</label>
                            <input
                                type="text"
                                value={form.diaChiChiTiet}
                                onChange={(e) => setForm({ ...form, diaChiChiTiet: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d1d5db' }}
                            />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                            <input
                                type="checkbox"
                                id="isDefault"
                                checked={form.isDefault}
                                onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                                style={{ width: '16px', height: '16px' }}
                            />
                            <label htmlFor="isDefault" style={{ fontSize: '14px' }}>Đặt làm địa chỉ mặc định</label>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                style={{ padding: '10px 20px', background: '#f3f4f6', color: '#4b5563', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
                            >
                                Hủy Bỏ
                            </button>
                            <button
                                onClick={handleSaveAddress}
                                style={{ padding: '10px 20px', background: '#111', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
                            >
                                Lưu Địa Chỉ
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
