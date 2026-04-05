import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import '../../assets/css/ThemMoi.css'; 

export default function ThemOto() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tenXe: '', hangXe: '', dongXe: '', namSanXuat: '', moTa: '',
    mauSac: '', dongCo: '', hopSo: '', nhienLieu: '',
    soKm: '', gia: '', soLuong: ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
        setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        namSanXuat: parseInt(formData.namSanXuat) || 0,
        soKm: parseInt(formData.soKm) || 0,
        gia: parseInt(formData.gia) || 0,
        soLuong: parseInt(formData.soLuong) || 0
      };
      
      const res = await api.post('/oto', payload);
      const data = res.data?.data;
      const createdId = data?.idOto || data?.id;

      if (createdId && selectedFiles.length > 0) {
          const mediaForm = new FormData();
          mediaForm.append('loaiDoiTuong', 'OTO');
          mediaForm.append('doiTuongId', createdId);
          selectedFiles.forEach((file) => {
              mediaForm.append('files', file);
          });
          
          await api.post('/media/upload-multiple', mediaForm, {
              headers: { 'Content-Type': 'multipart/form-data' }
          });
      }

      navigate('/admin/products');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tạo ô tô');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-car-container">
      <header className="add-car-header">
        <div className="title-group">
          <h2 className="add-car-subtitle">Trình Tạo Mới</h2>
          <h1 className="add-car-title">Nhập Thông Tin Ô Tô</h1>
        </div>
        <div className="action-group">
          <button type="button" className="btn-cancel" onClick={() => navigate('/admin/products')}>Hủy Bỏ</button>
        </div>
      </header>
      
      {error && <div className="add-car-error">{error}</div>}

      <form className="add-car-form" onSubmit={handleSubmit}>
        <div className="form-grid">
           {/* Thong tin co ban */}
           <div className="form-section">
              <h3 className="section-heading">Định Danh Xe</h3>
              
              <div className="form-group row-group">
                 <div className="col">
                   <label>Tên Thương Mại (Mẫu Xe) *</label>
                   <input required type="text" name="tenXe" value={formData.tenXe} onChange={handleChange} placeholder="Ví dụ: Mercedes-Benz S450 Luxury..." />
                 </div>
              </div>

               <div className="form-group row-group">
                 <div className="col">
                   <label>Hãng Sản Xuất</label>
                   <input type="text" name="hangXe" value={formData.hangXe} onChange={handleChange} placeholder="Mercedes" />
                 </div>
                 <div className="col">
                   <label>Dòng Xe (Class/Series)</label>
                   <input type="text" name="dongXe" value={formData.dongXe} onChange={handleChange} placeholder="S-Class" />
                 </div>
              </div>

               <div className="form-group row-group">
                 <div className="col">
                   <label>Số Khung (Odo) km</label>
                   <input type="number" name="soKm" value={formData.soKm} onChange={handleChange} placeholder="0" />
                 </div>
                 <div className="col">
                   <label>Năm Lắp Ráp</label>
                   <input type="number" name="namSanXuat" value={formData.namSanXuat} onChange={handleChange} placeholder="2023" />
                 </div>
              </div>
           </div>

           {/* Thong so ky thuat */}
           <div className="form-section">
              <h3 className="section-heading">Hệ Thống Cơ Khí & Vận Hành</h3>
              
              <div className="form-group row-group">
                 <div className="col">
                   <label>Động Cơ</label>
                   <input type="text" name="dongCo" value={formData.dongCo} onChange={handleChange} placeholder="V6 3.0L Bi-Turbo" />
                 </div>
                 <div className="col">
                   <label>Hộp Số</label>
                   <input type="text" name="hopSo" value={formData.hopSo} onChange={handleChange} placeholder="Tự động 9 cấp (9G-TRONIC)" />
                 </div>
              </div>

               <div className="form-group row-group">
                 <div className="col">
                   <label>Nhiên Liệu</label>
                   <input type="text" name="nhienLieu" value={formData.nhienLieu} onChange={handleChange} placeholder="Xăng" />
                 </div>
                 <div className="col">
                   <label>Màu Ngoại Thất</label>
                   <input type="text" name="mauSac" value={formData.mauSac} onChange={handleChange} placeholder="Đen Obsidian" />
                 </div>
              </div>

              <div className="form-group row-group">
                 <div className="col">
                   <label>Định Giá Trưng Bày (VNĐ) *</label>
                   <input required type="number" name="gia" value={formData.gia} onChange={handleChange} placeholder="5500000000" />
                 </div>
                 <div className="col">
                   <label>Tồn Kho Khởi Điểm *</label>
                   <input required type="number" name="soLuong" value={formData.soLuong} onChange={handleChange} placeholder="3" />
                 </div>
              </div>
           </div>

           {/* Hinh Anh */}
           <div className="form-section full-width">
              <h3 className="section-heading">Thư Viện Trực Quan</h3>
              <div className="form-group">
                 <label htmlFor="mediaFiles" className="media-upload-label">
                     + Nhấn để chọn tối đa 10 ảnh (PNG, JPG, WEBP)
                 </label>
                 <input 
                     type="file" 
                     id="mediaFiles" 
                     multiple 
                     accept="image/*" 
                     onChange={handleFileChange} 
                     style={{display: 'none'}} 
                 />
                 
                 {selectedFiles.length > 0 && (
                     <div className="selected-files-preview">
                         Đã chọn {selectedFiles.length} tệp đính kèm.
                     </div>
                 )}
              </div>
           </div>

           {/* Mo ta */}
           <div className="form-section full-width">
              <h3 className="section-heading">Thông Tin Giới Thiệu</h3>
              <div className="form-group">
                 <textarea name="moTa" value={formData.moTa} onChange={handleChange} rows="4" placeholder="Mô tả các công nghệ nổi bật, trang bị tiện nghi..."></textarea>
              </div>
           </div>
        </div>

        <div className="form-actions">
           <button type="submit" className="btn-submit" disabled={loading}>
             {loading ? 'Hệ thống đang xử lý...' : 'Xác Nhận Đưa Lên Chợ Xe'}
           </button>
        </div>
      </form>
    </div>
  );
}
