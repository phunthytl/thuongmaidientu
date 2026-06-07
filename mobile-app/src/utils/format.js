import { Platform } from 'react-native';

const IMAGE_BASE_URL =
  process.env.EXPO_PUBLIC_IMAGE_BASE_URL ||
  (Platform.OS === 'web' ? 'http://localhost:3000' : 'http://10.0.2.2:3000');

const resolveImageUrl = (url) => {
  if (!url || typeof url !== 'string') return null;

  const value = url.trim();
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;

  return `${IMAGE_BASE_URL}${value.startsWith('/') ? value : `/${value}`}`;
};

export const money = (value) => {
  const number = Number(value || 0);
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(number);
};

export const productName = (item) => item?.tenXe || item?.tenPhuKien || item?.tenDichVu || item?.tenSanPham || 'Sản phẩm';

export const productImage = (item) => {
  if (Array.isArray(item?.hinhAnhs) && item.hinhAnhs.length > 0) {
    return resolveImageUrl(item.hinhAnhs[0]);
  }
  return resolveImageUrl(item?.displayImage || item?.hinhAnh);
};

export const customerIdOf = (user) => user?.khachHangId || user?.id;

export const statusLabel = (status) => {
  const labels = {
    CHO_XAC_NHAN: 'Chờ xác nhận',
    DA_XAC_NHAN: 'Đã xác nhận',
    DANG_XU_LY: 'Đang xử lý',
    DANG_GIAO: 'Đang giao',
    HOAN_THANH: 'Hoàn thành',
    DA_HUY: 'Đã hủy'
  };
  return labels[status] || status || 'Không rõ';
};
