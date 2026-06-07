import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { productApi } from '../api/productApi';
import { customerApi } from '../api/customerApi';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { Field } from '../components/Field';
import { Screen } from '../components/Screen';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useFavoriteStore } from '../store/favoriteStore';
import { colors } from '../styles/theme';
import { money, productImage, productName } from '../utils/format';

const errorMessageOf = (error) => {
  const data = error.response?.data;
  if (data?.message) return data.message;
  if (Array.isArray(data?.errors) && data.errors.length > 0) return data.errors.join('\n');
  return error.message || 'Vui lòng thử lại.';
};

const nextDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
};

export function ProductDetailScreen({ route, navigation }) {
  const { id, type } = route.params;
  const productType = String(type || '').toUpperCase();
  const productId = Number(id);
  const user = useAuthStore((state) => state.user);
  const add = useCartStore((state) => state.add);
  const { toggle, isFavorite } = useFavoriteStore();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [notice, setNotice] = useState(null);
  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    hoTen: user?.hoTen || '',
    soDienThoai: user?.soDienThoai || '',
    email: user?.email || '',
    ngayHen: nextDate(),
    gioHen: '09:00',
    ghiChu: ''
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const detailRequest = productType === 'OTO'
        ? productApi.car(productId)
        : productType === 'DICH_VU'
          ? productApi.service(productId)
          : productApi.accessory(productId);
      const requests = [
        detailRequest,
        productApi.reviews(productType, productId)
      ];
      if (productType === 'DICH_VU') {
        requests.push(productApi.mediaImages('DICH_VU', productId).catch(() => []));
        requests.push(customerApi.warehouses().catch(() => []));
      }

      const [detail, reviewPage, images = [], branchItems = []] = await Promise.all(requests);
      setProduct(productType === 'DICH_VU' ? { ...detail, displayImage: images?.[0]?.url } : detail);
      setReviews(productApi.pageContent(reviewPage));
      if (productType === 'DICH_VU') {
        setBranches(branchItems);
        setBranchId((current) => current || branchItems?.[0]?.id || null);
      }
      setLoading(false);
    };
    load().catch(() => setLoading(false));
  }, [productId, productType]);

  const addToCart = async () => {
    setNotice(null);

    if (!user || user.vaiTro !== 'KHACH_HANG') {
      Alert.alert('Không thêm được', 'Bạn cần đăng nhập bằng tài khoản khách hàng để thêm sản phẩm vào giỏ.');
      setNotice({
        type: 'error',
        title: 'Không thêm được',
        body: 'Bạn cần đăng nhập bằng tài khoản khách hàng để thêm sản phẩm vào giỏ.'
      });
      return;
    }

    if (productType === 'OTO') {
      Alert.alert('Không thêm được', 'Ô tô hiện chỉ hỗ trợ đặt lịch lái thử, không thêm vào giỏ hàng.');
      setNotice({
        type: 'error',
        title: 'Không thêm được',
        body: 'Ô tô hiện chỉ hỗ trợ đặt lịch lái thử, không thêm vào giỏ hàng.'
      });
      return;
    }

    if (!['PHU_KIEN', 'DICH_VU'].includes(productType) || !Number.isFinite(productId) || productId <= 0) {
      Alert.alert('Không thêm được', 'Thông tin sản phẩm không hợp lệ.');
      setNotice({
        type: 'error',
        title: 'Không thêm được',
        body: 'Thông tin sản phẩm không hợp lệ.'
      });
      return;
    }

    setAdding(true);
    try {
      await add(user, {
        loaiSanPham: productType,
        sanPhamId: productId,
        soLuong: 1
      });
      setNotice({
        type: 'success',
        title: 'Thêm hàng thành công',
        body: 'Sản phẩm đã được thêm vào giỏ hàng.'
      });
    } catch (error) {
      const message = errorMessageOf(error);
      Alert.alert('Không thêm được', message);
      setNotice({
        type: 'error',
        title: 'Không thêm được',
        body: message
      });
    } finally {
      setAdding(false);
    }
  };

  const setBookingField = (name) => (value) => {
    setBookingForm((current) => ({ ...current, [name]: value }));
  };

  const bookService = async () => {
    setNotice(null);

    if (!user || user.vaiTro !== 'KHACH_HANG') {
      Alert.alert('Không đặt lịch được', 'Bạn cần đăng nhập bằng tài khoản khách hàng để đặt lịch dịch vụ.');
      return;
    }

    if (!branchId) {
      Alert.alert('Thiếu chi nhánh', 'Vui lòng chọn chi nhánh thực hiện dịch vụ.');
      return;
    }

    if (!bookingForm.hoTen || !bookingForm.soDienThoai || !bookingForm.ngayHen || !bookingForm.gioHen) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập họ tên, số điện thoại, ngày hẹn và giờ hẹn.');
      return;
    }

    setAdding(true);
    try {
      await productApi.bookService({
        loaiLich: 'DICH_VU',
        dichVuId: productId,
        chiNhanhId: branchId,
        hoTen: bookingForm.hoTen,
        soDienThoai: bookingForm.soDienThoai,
        email: bookingForm.email || undefined,
        ngayHen: bookingForm.ngayHen,
        gioHen: bookingForm.gioHen,
        ghiChu: bookingForm.ghiChu || undefined
      });
      setNotice({
        type: 'success',
        title: 'Đặt lịch thành công',
        body: 'Lịch dịch vụ của bạn đã được ghi nhận. Nhân viên sẽ liên hệ xác nhận.'
      });
    } catch (error) {
      const message = errorMessageOf(error);
      Alert.alert('Không đặt lịch được', message);
      setNotice({
        type: 'error',
        title: 'Không đặt lịch được',
        body: message
      });
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator color={colors.primary} />
      </Screen>
    );
  }

  if (!product) {
    return <EmptyState title="Không tìm thấy sản phẩm" />;
  }

  const image = productImage(product);
  const specs = productType === 'OTO'
    ? [
        ['Hãng', product.hangXe],
        ['Dòng xe', product.dongXe],
        ['Năm', product.namSanXuat],
        ['Màu', product.mauSac],
        ['Động cơ', product.dongCo],
        ['Hộp số', product.hopSo],
        ['Nhiên liệu', product.nhienLieu]
      ]
    : productType === 'DICH_VU'
      ? [
          ['Loại', 'Dịch vụ'],
          ['Thời gian', product.thoiGianUocTinh],
          ['Trạng thái', product.trangThai === false ? 'Tạm ngưng' : 'Đang nhận lịch']
        ]
      : [
        ['Loại', product.loaiPhuKien],
        ['Hãng SX', product.hangSanXuat],
        ['Trọng lượng', product.trongLuong ? `${product.trongLuong} g` : null]
      ];

  return (
    <Screen>
      {image ? <Image source={{ uri: image }} style={styles.hero} /> : <View style={[styles.hero, styles.placeholder]} />}
      <View style={styles.titleRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{productName(product)}</Text>
          <Text style={styles.price}>{money(product.gia)}</Text>
        </View>
        <Pressable onPress={() => toggle({ ...product, loaiSanPham: productType })}>
          <Ionicons name={isFavorite(productType, productId) ? 'heart' : 'heart-outline'} size={28} color={colors.danger} />
        </Pressable>
      </View>
      {productType === 'DICH_VU' ? (
        <View style={styles.bookingBox}>
          <Text style={styles.section}>Đặt lịch dịch vụ</Text>
          <Text style={styles.description}>Chọn chi nhánh, ngày giờ và thông tin liên hệ để nhân viên xác nhận lịch.</Text>
          <Text style={styles.bookingLabel}>Chi nhánh</Text>
          <View style={styles.branchList}>
            {branches.map((branch) => (
              <Pressable
                key={branch.id}
                style={[styles.branchItem, branchId === branch.id && styles.branchActive]}
                onPress={() => setBranchId(branch.id)}
              >
                <Ionicons
                  name={branchId === branch.id ? 'radio-button-on' : 'radio-button-off'}
                  size={20}
                  color={branchId === branch.id ? colors.primary : colors.muted}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.branchName}>{branch.tenKho}</Text>
                  <Text style={styles.branchAddress}>{[branch.tinhThanhName, branch.diaChiChiTiet].filter(Boolean).join(' - ')}</Text>
                </View>
              </Pressable>
            ))}
          </View>
          <Field label="Họ tên" value={bookingForm.hoTen} onChangeText={setBookingField('hoTen')} />
          <Field label="Số điện thoại" value={bookingForm.soDienThoai} onChangeText={setBookingField('soDienThoai')} keyboardType="phone-pad" />
          <Field label="Email" value={bookingForm.email} onChangeText={setBookingField('email')} keyboardType="email-address" />
          <Field label="Ngày hẹn" value={bookingForm.ngayHen} onChangeText={setBookingField('ngayHen')} placeholder="YYYY-MM-DD" />
          <Field label="Giờ hẹn" value={bookingForm.gioHen} onChangeText={setBookingField('gioHen')} placeholder="HH:mm" />
          <Field label="Ghi chú" value={bookingForm.ghiChu} onChangeText={setBookingField('ghiChu')} multiline />
          <Button title="Đặt lịch dịch vụ" icon="calendar-outline" onPress={bookService} loading={adding} />
        </View>
      ) : (
        <>
          <Text style={styles.stock}>Tồn kho: {product.soLuong ?? 0}</Text>
          <Button title="Thêm vào giỏ" icon="cart-outline" onPress={addToCart} loading={adding} />
        </>
      )}
      {notice ? (
        <View style={[styles.notice, notice.type === 'error' ? styles.noticeError : styles.noticeSuccess]}>
          <Ionicons
            name={notice.type === 'error' ? 'alert-circle-outline' : 'checkmark-circle-outline'}
            size={20}
            color={notice.type === 'error' ? colors.danger : colors.success}
          />
          <View style={styles.noticeContent}>
            <Text style={[styles.noticeTitle, notice.type === 'error' ? styles.noticeTitleError : styles.noticeTitleSuccess]}>
              {notice.title}
            </Text>
            <Text style={styles.noticeBody}>{notice.body}</Text>
          </View>
          {notice.type === 'success' ? (
            <Pressable onPress={() => navigation.navigate('Main', { screen: 'Cart' })}>
              <Text style={styles.noticeAction}>Xem giỏ</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
      <Text style={styles.section}>Thông số</Text>
      <View style={styles.specs}>
        {specs.filter(([, value]) => value).map(([label, value]) => (
          <View key={label} style={styles.specRow}>
            <Text style={styles.specLabel}>{label}</Text>
            <Text style={styles.specValue}>{value}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.section}>Mô tả</Text>
      <Text style={styles.description}>{product.moTa || 'Chưa có mô tả.'}</Text>
      <View style={styles.reviewHeader}>
        <Text style={styles.section}>Đánh giá</Text>
        <Pressable onPress={() => navigation.navigate('Review', { product, type: productType })}>
          <Text style={styles.reviewAction}>Viết đánh giá</Text>
        </Pressable>
      </View>
      {reviews.length === 0 ? (
        <Text style={styles.description}>Chưa có đánh giá.</Text>
      ) : (
        reviews.map((review) => (
          <View key={review.id} style={styles.review}>
            <Text style={styles.reviewName}>{review.tenKhachHang || 'Khách hàng'} - {review.diemDanhGia}/5</Text>
            <Text style={styles.description}>{review.noiDung}</Text>
          </View>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    width: '100%',
    aspectRatio: 1.45,
    borderRadius: 8,
    backgroundColor: '#e8edf0'
  },
  placeholder: {
    borderWidth: 1,
    borderColor: colors.line
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12
  },
  name: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '900'
  },
  price: {
    color: colors.accent,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 6
  },
  stock: {
    color: colors.success,
    fontWeight: '700'
  },
  bookingBox: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
    gap: 10
  },
  bookingLabel: {
    color: colors.ink,
    fontWeight: '800'
  },
  branchList: {
    gap: 8
  },
  branchItem: {
    minHeight: 58,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  branchActive: {
    borderColor: colors.primary,
    backgroundColor: '#f0fdfa'
  },
  branchName: {
    color: colors.ink,
    fontWeight: '800'
  },
  branchAddress: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2
  },
  notice: {
    minHeight: 48,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  noticeSuccess: {
    backgroundColor: '#ecfdf5',
    borderColor: '#bbf7d0'
  },
  noticeError: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca'
  },
  noticeContent: {
    flex: 1,
    gap: 2
  },
  noticeTitle: {
    fontWeight: '900'
  },
  noticeTitleSuccess: {
    color: colors.success
  },
  noticeTitleError: {
    color: colors.danger
  },
  noticeBody: {
    color: colors.muted,
    lineHeight: 18
  },
  noticeAction: {
    color: colors.primary,
    fontWeight: '900'
  },
  section: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: '900'
  },
  specs: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8
  },
  specRow: {
    minHeight: 42,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.line
  },
  specLabel: {
    width: 110,
    color: colors.muted
  },
  specValue: {
    flex: 1,
    color: colors.ink,
    fontWeight: '700'
  },
  description: {
    color: colors.muted,
    lineHeight: 21
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  reviewAction: {
    color: colors.primary,
    fontWeight: '800'
  },
  review: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
    gap: 6
  },
  reviewName: {
    color: colors.ink,
    fontWeight: '800'
  }
});
