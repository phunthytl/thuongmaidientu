import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import '../../assets/css/ThemMoi.css'; 

export default function ThemDichVu() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tenDichVu: '', thoiGianUocTinh: '',
    gia: '', moTa: ''
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
        gia: parseInt(formData.gia) || 0
      };
      
      const res = await api.post('/dich-vu', payload);
      const data = res.data?.data;
      const createdId = data?.idDichVu || data?.id;

      if (createdId && selectedFiles.length > 0) {
          const mediaForm = new FormData();
          mediaForm.append('loaiDoiTuong', 'DICH_VU');
          mediaForm.append('doiTuongId', createdId);
          selectedFiles.forEach((file) => {
              mediaForm.append('files', file);
          });
          
          await api.post('/media/upload-multiple', mediaForm, {
              headers: { 'Content-Type': 'multipart/form-data' }
          });
      }

      navigate('/admin/services');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tạo dịch vụ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-car-container">
      <header className="add-car-header">
        <div className="title-group">
          <h2 className="add-car-subtitle">Trình Tạo Mới</h2>
          <h1 className="add-car-title">Thiết Lập Gói Dịch Vụ</h1>
        </div>
        <div className="action-group">
          <button type="button" className="btn-cancel" onClick={() => navigate('/admin/services')}>Quay Về Danh Sách</button>
        </div>
      </header>
      
      {error && <div className="add-car-error">{error}</div>}

      <form className="add-car-form" onSubmit={handleSubmit}>
        <div className="form-grid">
           {/* Thong tin chung */}
           <div className="form-section">
              <h3 className="section-heading">Thông Tin Gói Cước</h3>
              
              <div className="form-group row-group">
                 <div className="col">
                   <label>Tên Gói Dịch Vụ / Sửa Chữa *</label>
                   <input required type="text" name="tenDichVu" value={formData.tenDichVu} onChange={handleChange} placeholder="Ví dụ: Bảo dưỡng mốc 10.000km..." />
                 </div>
              </div>

               <div className="form-group row-group">
                 <div className="col">
                   <label>Thời Gian Ước Tính Định Mức</label>
                   <input type="text" name="thoiGianUocTinh" value={formData.thoiGianUocTinh} onChange={handleChange} placeholder="Ví dụ: 30 phút, 2 giờ,..." />
                 </div>
              </div>
           </div>

           {/* Dinh gia */}
           <div className="form-section">
              <h3 className="section-heading">Chi Phí Hoạt Động</h3>
              
              <div className="form-group row-group">
                 <div className="col">
                   <label>Định Giá Trọn Gói (VNĐ) *</label>
                   <input required type="number" name="gia" value={formData.gia} onChange={handleChange} placeholder="Ví dụ: 350000" />
                 </div>
              </div>
           </div>

           {/* Hinh Anh */}
           <div className="form-section full-width">
              <h3 className="section-heading">Khoa Học Đa Phương Tiện</h3>
              <div className="form-group">
                 <label htmlFor="mediaFiles" className="media-upload-label">
                     + Nhấn để chọn tệp tài liệu số liệu đính kèm (Ảnh bìa gói DV)
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
                         Đã đính kèm {selectedFiles.length} tệp phương tiện phục vụ trực quan.
                     </div>
                 )}
              </div>
           </div>

           {/* Mo ta */}
           <div className="form-section full-width">
              <h3 className="section-heading">Mổ Xẻ Chuyên Môn</h3>
              <div className="form-group">
                 <textarea name="moTa" value={formData.moTa} onChange={handleChange} rows="4" placeholder="Diễn giải chi tiết các quy trình, bộ công cụ sử dụng cho Dịch Vụ này..."></textarea>
              </div>
           </div>
        </div>

        <div className="form-actions">
           <button type="submit" className="btn-submit" disabled={loading}>
             {loading ? 'Đang Khởi Tạo...' : 'Định Hình Dịch Vụ'}
           </button>
        </div>
      </form>
    </div>
  );
}
