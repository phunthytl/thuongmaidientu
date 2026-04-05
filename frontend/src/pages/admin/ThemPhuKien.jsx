import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import '../../assets/css/ThemMoi.css'; 

export default function ThemPhuKien() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tenPhuKien: '', loaiPhuKien: '', hangSanXuat: '',
    gia: '', soLuong: '', moTa: ''
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
        gia: parseInt(formData.gia) || 0,
        soLuong: parseInt(formData.soLuong) || 0
      };
      
      const res = await api.post('/phu-kien', payload);
      const data = res.data?.data;
      const createdId = data?.idPhuKien || data?.id;

      if (createdId && selectedFiles.length > 0) {
          const mediaForm = new FormData();
          mediaForm.append('loaiDoiTuong', 'PHU_KIEN');
          mediaForm.append('doiTuongId', createdId);
          selectedFiles.forEach((file) => {
              mediaForm.append('files', file);
          });
          
          await api.post('/media/upload-multiple', mediaForm, {
              headers: { 'Content-Type': 'multipart/form-data' }
          });
      }

      navigate('/admin/products/accessories');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tạo phụ kiện');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-car-container">
      <header className="add-car-header">
        <div className="title-group">
          <h2 className="add-car-subtitle">Trình Tạo Mới</h2>
          <h1 className="add-car-title">Nhập Lô Phụ Kiện</h1>
        </div>
        <div className="action-group">
          <button type="button" className="btn-cancel" onClick={() => navigate('/admin/products/accessories')}>Hủy Bỏ / Quay Về</button>
        </div>
      </header>
      
      {error && <div className="add-car-error">{error}</div>}

      <form className="add-car-form" onSubmit={handleSubmit}>
        <div className="form-grid">
           {/* Thong tin co ban */}
           <div className="form-section">
              <h3 className="section-heading">Chi Tiết Phân Loại</h3>
              
              <div className="form-group row-group">
                 <div className="col">
                   <label>Tên Phụ Kiện / Vật Tư *</label>
                   <input required type="text" name="tenPhuKien" value={formData.tenPhuKien} onChange={handleChange} placeholder="Ví dụ: Thảm lót sàn cao cấp..." />
                 </div>
              </div>

               <div className="form-group row-group">
                 <div className="col">
                   <label>Loại Phụ Kiện</label>
                   <input type="text" name="loaiPhuKien" value={formData.loaiPhuKien} onChange={handleChange} placeholder="Nội thất" />
                 </div>
                 <div className="col">
                   <label>Hãng Sản Xuất</label>
                   <input type="text" name="hangSanXuat" value={formData.hangSanXuat} onChange={handleChange} placeholder="OEM / WeatherTech" />
                 </div>
              </div>
           </div>

           {/* Dinh gia va Ton kho */}
           <div className="form-section">
              <h3 className="section-heading">Định Giá & Số Lượng</h3>
              
              <div className="form-group row-group">
                 <div className="col">
                   <label>Định Giá Bán Ra (VNĐ) *</label>
                   <input required type="number" name="gia" value={formData.gia} onChange={handleChange} placeholder="Ví dụ: 1200000" />
                 </div>
                 <div className="col">
                   <label>Số Lượng Tồn Kho Ban Đầu *</label>
                   <input required type="number" name="soLuong" value={formData.soLuong} onChange={handleChange} placeholder="50" />
                 </div>
              </div>
           </div>

           {/* Hinh Anh */}
           <div className="form-section full-width">
              <h3 className="section-heading">Khoa Học Đa Phương Tiện</h3>
              <div className="form-group">
                 <label htmlFor="mediaFiles" className="media-upload-label">
                     + Nhấn để chọn tối đa 5 ảnh (PNG, JPG, WEBP)
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
              <h3 className="section-heading">Thông Số Bổ Sung</h3>
              <div className="form-group">
                 <textarea name="moTa" value={formData.moTa} onChange={handleChange} rows="4" placeholder="Nhập chất liệu, xuất xứ, hạn bảo hành..."></textarea>
              </div>
           </div>
        </div>

        <div className="form-actions">
           <button type="submit" className="btn-submit" disabled={loading}>
             {loading ? 'Đang Khởi Tạo...' : 'Đưa Phụ Kiện Vào Kho'}
           </button>
        </div>
      </form>
    </div>
  );
}
