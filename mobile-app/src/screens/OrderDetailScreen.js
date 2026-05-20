import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../components/Screen';
import { orderApi } from '../api/orderApi';
import { colors } from '../styles/theme';
import { money, statusLabel } from '../utils/format';

export function OrderDetailScreen({ route }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi.detail(route.params.id).then(setOrder).finally(() => setLoading(false));
  }, [route.params.id]);

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
        </View>
      ))}
      <View style={styles.box}>
        <Text style={styles.name}>Tổng tiền: {money(order.tongTien)}</Text>
        <Text style={styles.muted}>Phí vận chuyển: {money(order.phiVanChuyen)}</Text>
        {order.maDonHangGhn ? <Text style={styles.muted}>Mã GHN: {order.maDonHangGhn}</Text> : null}
      </View>
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
  }
});
