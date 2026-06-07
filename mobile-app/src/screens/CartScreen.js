import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { Screen } from '../components/Screen';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { colors } from '../styles/theme';
import { money, productImage } from '../utils/format';

export function CartScreen({ navigation }) {
  const user = useAuthStore((state) => state.user);
  const { cart, load, update, remove } = useCartStore();
  const items = cart?.chiTietGioHangs || [];

  useFocusEffect(useCallback(() => { load(user); }, [user]));

  if (items.length === 0) {
    return (
      <Screen>
        <EmptyState icon="cart-outline" title="Giỏ hàng đang trống" body="Thêm sản phẩm để bắt đầu đặt hàng." />
      </Screen>
    );
  }

  return (
    <Screen>
      {items.map((item) => (
        <View key={item.id} style={styles.item}>
          {productImage(item) ? <Image source={{ uri: productImage(item) }} style={styles.image} /> : <View style={styles.image} />}
          <View style={styles.info}>
            <Text style={styles.name}>{item.tenSanPham}</Text>
            <Text style={styles.price}>{money(item.thanhTien)}</Text>
            <View style={styles.qty}>
              <Pressable onPress={() => update(item.id, Math.max(1, item.soLuong - 1))}>
                <Ionicons name="remove-circle-outline" size={26} color={colors.primary} />
              </Pressable>
              <Text style={styles.qtyText}>{item.soLuong}</Text>
              <Pressable onPress={() => update(item.id, item.soLuong + 1)}>
                <Ionicons name="add-circle-outline" size={26} color={colors.primary} />
              </Pressable>
              <Pressable style={{ marginLeft: 'auto' }} onPress={() => remove(item.id)}>
                <Ionicons name="trash-outline" size={23} color={colors.danger} />
              </Pressable>
            </View>
          </View>
        </View>
      ))}
      <View style={styles.total}>
        <Text style={styles.totalLabel}>Tổng tiền</Text>
        <Text style={styles.totalValue}>{money(cart?.tongTien)}</Text>
      </View>
      <Button title="Thanh toán" icon="card-outline" onPress={() => navigation.navigate('Checkout')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 10
  },
  image: {
    width: 92,
    height: 72,
    borderRadius: 6,
    backgroundColor: '#edf1f3'
  },
  info: {
    flex: 1,
    gap: 8
  },
  name: {
    color: colors.ink,
    fontWeight: '800'
  },
  price: {
    color: colors.accent,
    fontWeight: '900'
  },
  qty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  qtyText: {
    minWidth: 24,
    textAlign: 'center',
    color: colors.ink,
    fontWeight: '800'
  },
  total: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14
  },
  totalLabel: {
    color: colors.muted,
    fontWeight: '700'
  },
  totalValue: {
    color: colors.accent,
    fontWeight: '900',
    fontSize: 18
  }
});
