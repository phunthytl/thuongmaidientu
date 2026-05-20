import { useEffect, useState, useRef, useCallback } from 'react';
import {
  FaPlus,
  FaTimes,
  FaTrashAlt,
  FaChevronLeft,
  FaChevronRight,
  FaImage,
} from 'react-icons/fa';
import { api } from '../../services/api';
import './MediaGalleryManager.css';

const LABEL_MAP = {
  OTO: 'ô tô',
  PHU_KIEN: 'phụ kiện',
  DICH_VU: 'dịch vụ',
};

export default function MediaGalleryManager({ loaiDoiTuong, doiTuongId, onChange }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const label = LABEL_MAP[loaiDoiTuong] || 'sản phẩm';
  const lightboxOpen = lightboxIdx !== null;

  const fetchImages = useCallback(async () => {
    if (!loaiDoiTuong || !doiTuongId) return;
    try {
      setLoading(true);
      const res = await api.get(`/media/${loaiDoiTuong}/${doiTuongId}/images`);
      const list = res.data?.data || [];
      setImages(list);
      setError('');
    } catch (err) {
      console.error('Load media error:', err);
      setError('Không tải được danh sách ảnh.');
    } finally {
      setLoading(false);
    }
  }, [loaiDoiTuong, doiTuongId]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // close lightbox with Esc + arrow keys nav
  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e) => {
      if (e.key === 'Escape') setLightboxIdx(null);
      else if (e.key === 'ArrowLeft') setLightboxIdx((i) => (i > 0 ? i - 1 : images.length - 1));
      else if (e.key === 'ArrowRight') setLightboxIdx((i) => (i < images.length - 1 ? i + 1 : 0));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxOpen, images.length]);

  const handleFilePick = () => fileInputRef.current?.click();

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const oversized = files.filter((f) => f.size > 20 * 1024 * 1024);
    if (oversized.length > 0) {
      alert(`Có ${oversized.length} ảnh > 20MB. Hãy nén lại trước khi upload.`);
      e.target.value = '';
      return;
    }

    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('loaiDoiTuong', loaiDoiTuong);
      formData.append('doiTuongId', doiTuongId);
      files.forEach((f) => formData.append('files', f));

      await api.post('/media/upload-multiple', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await fetchImages();
      onChange?.();
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Upload thất bại. Thử lại.');
    } finally {
      setUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleDelete = async (mediaId) => {
    if (!window.confirm('Xóa ảnh này khỏi sản phẩm? Hành động không thể hoàn tác.')) return;
    setDeletingId(mediaId);
    try {
      await api.delete(`/media/${mediaId}`);
      await fetchImages();
      onChange?.();
    } catch (err) {
      console.error('Delete error:', err);
      alert(err.response?.data?.message || 'Xóa ảnh thất bại.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mgm-container">
      <div className="mgm-header">
        <div>
          <h3 className="mgm-title">Quản lý hình ảnh</h3>
          <span className="mgm-subtitle">
            {images.length} ảnh — của {label}
          </span>
        </div>
        <button
          type="button"
          className="mgm-add-btn"
          onClick={handleFilePick}
          disabled={uploading}
        >
          <FaPlus />
          {uploading ? 'Đang tải lên...' : 'Thêm ảnh'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleUpload}
        />
      </div>

      {error && <div className="mgm-error">{error}</div>}

      {loading ? (
        <div className="mgm-empty">Đang tải ảnh...</div>
      ) : images.length === 0 ? (
        <div className="mgm-empty">
          <FaImage className="mgm-empty-icon" />
          <p>Chưa có ảnh nào. Nhấn "Thêm ảnh" để upload ảnh đầu tiên.</p>
        </div>
      ) : (
        <div className="mgm-grid">
          {images.map((img, idx) => (
            <div
              key={img.id}
              className={`mgm-thumb ${idx === 0 ? 'is-main' : ''}`}
              onClick={() => setLightboxIdx(idx)}
            >
              <img src={img.url} alt={img.moTa || `Ảnh ${idx + 1}`} loading="lazy" />
              {idx === 0 && <span className="mgm-main-badge">Ảnh chính</span>}
              <button
                type="button"
                className="mgm-delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(img.id);
                }}
                disabled={deletingId === img.id}
                title="Xóa ảnh"
              >
                {deletingId === img.id ? '...' : <FaTrashAlt />}
              </button>
            </div>
          ))}

          {/* Add tile at the end */}
          <button
            type="button"
            className="mgm-thumb mgm-thumb-add"
            onClick={handleFilePick}
            disabled={uploading}
          >
            <FaPlus />
            <span>{uploading ? 'Đang tải...' : 'Thêm ảnh'}</span>
          </button>
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && images[lightboxIdx] && (
        <div className="mgm-lightbox" onClick={() => setLightboxIdx(null)}>
          <button
            type="button"
            className="mgm-lightbox-close"
            onClick={() => setLightboxIdx(null)}
            aria-label="Đóng"
          >
            <FaTimes />
          </button>

          {images.length > 1 && (
            <button
              type="button"
              className="mgm-lightbox-nav mgm-prev"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIdx((i) => (i > 0 ? i - 1 : images.length - 1));
              }}
              aria-label="Ảnh trước"
            >
              <FaChevronLeft />
            </button>
          )}

          <img
            className="mgm-lightbox-img"
            src={images[lightboxIdx].url}
            alt={images[lightboxIdx].moTa || `Ảnh ${lightboxIdx + 1}`}
            onClick={(e) => e.stopPropagation()}
          />

          {images.length > 1 && (
            <button
              type="button"
              className="mgm-lightbox-nav mgm-next"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIdx((i) => (i < images.length - 1 ? i + 1 : 0));
              }}
              aria-label="Ảnh kế"
            >
              <FaChevronRight />
            </button>
          )}

          <div className="mgm-lightbox-counter">
            {lightboxIdx + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}
