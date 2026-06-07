import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Screen } from '../components/Screen';
import { orderApi } from '../api/orderApi';
import { colors } from '../styles/theme';
import { money, statusLabel } from '../utils/format';

const completedStatuses = new Set(['HOAN_THANH', 'DA_HOAN_THANH']);

const productIdOfOrderItem = (item) =>
  item.sanPhamId ?? item.phuKienId ?? item.otoId ?? item.dichVuId;

const canComplain = (order) => {
  if (!order) return false;
  if (['CHO_XAC_NHAN', 'DA_HUY'].includes(order.trangThai)) return false;
  if (order.trangThai === 'HOAN_THANH') {
    const sourceDate = order.ngayCapNhat || order.ngayTao;
    if (!sourceDate) return true;
    const days = (Date.now() - new Date(sourceDate).getTime()) / (1000 * 60 * 60 * 24);
    return days <= 7;
  }
  return ['DA_XAC_NHAN', 'DANG_XU_LY', 'DANG_GIAO'].includes(order.trangThai);
};

export function OrderDetailScreen({ route, navigation }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(useCallback(() => {
    let active = true;
    setLoading(true);
    orderApi.detail(route.params.id)
      .then((data) => {
        if (active) setOrder(data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [route.params.id]));

  const openReview = (item) => {
    if (!completedStatuses.has(order.trangThai)) {
      Alert.alert('Chưa thể đánh giá', 'Bạn chỉ có thể đánh giá sau khi đơn hàng đã hoàn thành.');
      return;
    }
    if (item.daDanhGia) {
      Alert.alert('Đã đánh giá', 'Bạn đã đánh giá sản phẩm này rồi.');
      return;
    }

    navigation.navigate('Review', {
      product: {
        id: productIdOfOrderItem(item),
        tenSanPham: item.tenSanPham
      },
      type: item.loaiSanPham,
      reviewContext: { chiTietDonHangId: item.id }
    });
  };

  const openDispute = () => {
    if (!canComplain(order)) {
      Alert.alert('Chưa thể khiếu nại', 'Trạng thái đơn hàng hiện không cho phép khiếu nại.');
      return;
    }
    navigation.navigate('Dispute', { order });
  };

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator color={colors.primary} />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.box}>
        <Text style={styles.code}>{order.maDonHang}</Text>
        <Text style={styles.status}>{statusLabel(order.trangThai)}</Text>
        <Text style={styles.muted}>{order.diaChiGiaoHang?.diaChiChiTiet}</Text>
      </View>
      {(order.chiTietDonHangs || []).map((item) => (
        <View key={item.id} style={styles.item}>
          <Text style={styles.name}>{item.tenSanPham}</Text>
          <Text style={styles.muted}>Số lượng: {item.soLuong}</Text>
          <Text style={styles.price}>{money(item.thanhTien)}</Text>
          {completedStatuses.has(order.trangThai) ? (
            item.daDanhGia ? (
              <Text style={styles.reviewed}>Đã đánh giá</Text>
            ) : (
              <Button title="Đánh giá" icon="star-outline" variant="ghost" onPress={() => openReview(item)} />
            )
          ) : null}
        </View>
      ))}
      <View style={styles.box}>
        <Text style={styles.name}>Tổng tiền: {money(order.tongTien)}</Text>
        <Text style={styles.muted}>Phí vận chuyển: {money(order.phiVanChuyen)}</Text>
        {order.maDonHangGhn ? <Text style={styles.muted}>Mã GHN: {order.maDonHangGhn}</Text> : null}
      </View>
      {canComplain(order) ? (
        <Button title="Khiếu nại đơn này" icon="alert-circle-outline" variant="ghost" onPress={openDispute} />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    gap: 8
  },
  item: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
    gap: 6
  },
  code: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900'
  },
  status: {
    color: colors.primary,
    fontWeight: '800'
  },
  muted: {
    color: colors.muted
  },
  name: {
    color: colors.ink,
    fontWeight: '800'
  },
  price: {
    color: colors.accent,
    fontWeight: '900'
  },
  reviewed: {
    color: colors.success,
    fontWeight: '800'
  }
});
