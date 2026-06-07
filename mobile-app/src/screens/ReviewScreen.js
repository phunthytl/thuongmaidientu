import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { Field } from '../components/Field';
import { Screen } from '../components/Screen';
import { productApi } from '../api/productApi';
import { orderApi } from '../api/orderApi';
import { useAuthStore } from '../store/authStore';
import { colors } from '../styles/theme';
import { customerIdOf, productName } from '../utils/format';

const completedStatuses = new Set(['HOAN_THANH', 'DA_HOAN_THANH']);

const productIdOfOrderItem = (item, type) => {
  if (type === 'OTO') return item.otoId ?? item.sanPhamId;
  if (type === 'DICH_VU') return item.dichVuId ?? item.sanPhamId;
  return item.phuKienId ?? item.sanPhamId;
};

export function ReviewScreen({ route, navigation }) {
  const { product, type, reviewContext: initialReviewContext } = route.params;
  const user = useAuthStore((state) => state.user);
  const [rating, setRating] = useState(5);
  const [noiDung, setNoiDung] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(!initialReviewContext);
  const [reviewContext, setReviewContext] = useState(initialReviewContext || null);
  const [blockedReason, setBlockedReason] = useState('');

  useEffect(() => {
    const checkEligibility = async () => {
      if (initialReviewContext) return;
      if (!user || user.vaiTro !== 'KHACH_HANG') {
        setBlockedReason('Bạn cần đăng nhập bằng tài khoản khách hàng để đánh giá.');
        setChecking(false);
        return;
      }

      try {
        if (type === 'PHU_KIEN') {
          const page = await orderApi.listByCustomer(customerIdOf(user), { page: 0, size: 50, sort: 'ngayTao,desc' });
          const orders = page?.content || page || [];
          for (const order of orders) {
            if (!completedStatuses.has(order.trangThai)) continue;
            const detail = (order.chiTietDonHangs || []).find((item) =>
              String(item.loaiSanPham || '').toUpperCase() === type &&
              Number(productIdOfOrderItem(item, type)) === Number(product.id)
            );
            if (detail) {
              if (detail.daDanhGia) {
                setBlockedReason('Bạn đã đánh giá sản phẩm này rồi.');
              } else {
                setReviewContext({ chiTietDonHangId: detail.id });
              }
              setChecking(false);
              return;
            }
          }
        } else {
          const bookings = await productApi.myBookings();
          const targetType = type === 'OTO' ? 'LAI_THU' : 'DICH_VU';
          const booking = (bookings || []).find((item) => {
            const itemProductId = type === 'OTO' ? item.otoId : item.dichVuId;
            return item.loaiLich === targetType &&
              item.trangThai === 'DA_HOAN_THANH' &&
              Number(itemProductId) === Number(product.id);
          });
          if (booking) {
            if (booking.daDanhGia) {
              setBlockedReason('Bạn đã đánh giá sản phẩm này rồi.');
            } else {
              setReviewContext({ lichHenId: booking.id });
            }
            setChecking(false);
            return;
          }
        }
        setBlockedReason('Bạn chỉ có thể viết đánh giá sau khi đã nhận hàng hoặc hoàn thành lịch hẹn.');
      } catch (error) {
        setBlockedReason(error.response?.data?.message || 'Không kiểm tra được điều kiện đánh giá.');
      } finally {
        setChecking(false);
      }
    };

    checkEligibility();
  }, [initialReviewContext, product.id, type, user]);

  const submit = async () => {
    if (!user || user.vaiTro !== 'KHACH_HANG') {
      Alert.alert('Cần đăng nhập', 'Bạn cần đăng nhập bằng tài khoản khách hàng để đánh giá.');
      return;
    }

    if (!reviewContext) {
      Alert.alert('Chưa đủ điều kiện', blockedReason || 'Bạn chỉ có thể viết đánh giá sau khi đã nhận hàng.');
      return;
    }

    setLoading(true);
    try {
      await productApi.createReview({
        khachHangId: customerIdOf(user),
        loaiSanPham: type,
        otoId: type === 'OTO' ? product.id : undefined,
        phuKienId: type === 'PHU_KIEN' ? product.id : undefined,
        dichVuId: type === 'DICH_VU' ? product.id : undefined,
        diemDanhGia: rating,
        noiDung,
        lichHenId: reviewContext.lichHenId || undefined,
        chiTietDonHangId: reviewContext.chiTietDonHangId || undefined
      });
      Alert.alert('Cảm ơn bạn', 'Đánh giá đã được ghi nhận.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Không gửi được', error.response?.data?.message || 'Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <Screen>
        <ActivityIndicator color={colors.primary} />
      </Screen>
    );
  }

  if (blockedReason) {
    return (
      <Screen>
        <EmptyState icon="lock-closed-outline" title="Chưa thể đánh giá" body={blockedReason} />
        {!user ? (
          <Button title="Đăng nhập" icon="log-in-outline" onPress={() => navigation.navigate('Login', { redirectTo: 'Main' })} />
        ) : null}
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.title}>{productName(product)}</Text>
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((value) => (
          <Pressable key={value} onPress={() => setRating(value)}>
            <Text style={[styles.star, value <= rating && styles.starActive]}>★</Text>
          </Pressable>
        ))}
      </View>
      <Field label="Nhận xét" value={noiDung} onChangeText={setNoiDung} multiline />
      <Button title="Gửi đánh giá" icon="star-outline" onPress={submit} loading={loading} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '900'
  },
  stars: {
    flexDirection: 'row',
    gap: 8
  },
  star: {
    color: colors.line,
    fontSize: 38
  },
  starActive: {
    color: colors.warning
  }
});
