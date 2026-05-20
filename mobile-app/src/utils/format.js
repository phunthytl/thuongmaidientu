export const money = (value) => {
  const number = Number(value || 0);
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(number);
};

export const productName = (item) => item?.tenXe || item?.tenPhuKien || item?.tenSanPham || 'Sản phẩm';

export const productImage = (item) => {
  if (Array.isArray(item?.hinhAnhs) && item.hinhAnhs.length > 0) return item.hinhAnhs[0];
  return item?.hinhAnh || null;
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
