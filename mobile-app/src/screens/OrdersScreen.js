import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { Screen } from '../components/Screen';
import { orderApi } from '../api/orderApi';
import { useAuthStore } from '../store/authStore';
import { colors } from '../styles/theme';
import { customerIdOf, money, statusLabel } from '../utils/format';

export function OrdersScreen({ navigation }) {
  const user = useAuthStore((state) => state.user);
  const [orders, setOrders] = useState([]);

  useFocusEffect(useCallback(() => {
    if (!user) {
      setOrders([]);
      return;
    }
    orderApi.listByCustomer(customerIdOf(user)).then((page) => setOrders(page.content || []));
  }, [user]));

  if (!user) {
    return (
      <Screen>
        <EmptyState icon="receipt-outline" title="Đăng nhập để xem đơn hàng" body="Lịch sử đơn hàng sẽ hiển thị sau khi bạn đăng nhập." />
        <Button title="Đăng nhập" icon="log-in-outline" onPress={() => navigation.navigate('Login', { redirectTo: 'Main' })} />
      </Screen>
    );
  }

  if (orders.length === 0) {
    return (
      <Screen>
        <EmptyState icon="receipt-outline" title="Chưa có đơn hàng" body="Đơn hàng mới sẽ xuất hiện ở đây." />
      </Screen>
    );
  }

  return (
    <Screen>
      {orders.map((item) => (
        <Pressable key={item.id} style={styles.order} onPress={() => navigation.navigate('OrderDetail', { id: item.id })}>
          <View style={styles.row}>
            <Text style={styles.code}>{item.maDonHang}</Text>
            <Text style={styles.status}>{statusLabel(item.trangThai)}</Text>
          </View>
          <Text style={styles.muted}>{item.ngayTao?.slice?.(0, 10)}</Text>
          <Text style={styles.total}>{money(item.tongTien)}</Text>
        </Pressable>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  order: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    gap: 8
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10
  },
  code: {
    color: colors.ink,
    fontWeight: '900'
  },
  status: {
    color: colors.primary,
    fontWeight: '800'
  },
  muted: {
    color: colors.muted
  },
  total: {
    color: colors.accent,
    fontWeight: '900',
    fontSize: 17
  }
});
