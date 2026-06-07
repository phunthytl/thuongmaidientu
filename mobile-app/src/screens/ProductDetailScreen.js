import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { productApi } from '../api/productApi';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
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

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [detail, reviewPage] = await Promise.all([
        productType === 'OTO' ? productApi.car(productId) : productApi.accessory(productId),
        productApi.reviews(productType, productId)
      ]);
      setProduct(detail);
      setReviews(productApi.pageContent(reviewPage));
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
      <Text style={styles.stock}>Tồn kho: {product.soLuong ?? 0}</Text>
      <Button title="Thêm vào giỏ" icon="cart-outline" onPress={addToCart} loading={adding} />
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
