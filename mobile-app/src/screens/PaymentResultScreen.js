import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../components/Screen';
import { colors } from '../styles/theme';

const getWebParams = () => {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return {};
  return Object.fromEntries(new URLSearchParams(window.location.search).entries());
};

export function PaymentResultScreen({ route, navigation }) {
  const [countdown, setCountdown] = useState(5);
  const params = useMemo(() => ({ ...getWebParams(), ...(route.params || {}) }), [route.params]);
  const success = params.success === true || params.success === 'true';

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((value) => {
        if (value <= 1) {
          clearInterval(timer);
          navigation.replace('Main', { screen: 'Orders' });
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigation]);

  return (
    <Screen style={styles.wrap}>
      <View style={[styles.iconWrap, success ? styles.success : styles.failed]}>
        <Ionicons name={success ? 'checkmark-circle' : 'close-circle'} size={58} color="#fff" />
      </View>
      <Text style={styles.title}>{success ? 'Thanh toán thành công' : 'Thanh toán không thành công'}</Text>
      <Text style={styles.body}>
        {params.message || (success ? 'VNPay đã xác nhận giao dịch của bạn.' : 'Giao dịch chưa được xác nhận.')}
      </Text>

      <View style={styles.info}>
        <Row label="Mã đơn hàng" value={params.maDonHang || '---'} />
        <Row label="Mã giao dịch" value={params.maGiaoDich || '---'} />
        <Row label="Mã phản hồi" value={params.responseCode || '---'} />
      </View>

      <Text style={styles.countdown}>Tự động chuyển về đơn hàng sau {countdown}s</Text>

      <View style={styles.actions}>
        <Pressable style={styles.primary} onPress={() => navigation.replace('Main', { screen: 'Orders' })}>
          <Text style={styles.primaryText}>Xem đơn hàng</Text>
        </Pressable>
        <Pressable style={styles.secondary} onPress={() => navigation.replace('Main', { screen: 'Home' })}>
          <Text style={styles.secondaryText}>Về trang chủ</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconWrap: {
    width: 86,
    height: 86,
    borderRadius: 43,
    alignItems: 'center',
    justifyContent: 'center'
  },
  success: {
    backgroundColor: colors.success
  },
  failed: {
    backgroundColor: colors.danger
  },
  title: {
    color: colors.ink,
    fontSize: 23,
    fontWeight: '900',
    textAlign: 'center'
  },
  body: {
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 21
  },
  info: {
    alignSelf: 'stretch',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    padding: 12,
    gap: 10
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12
  },
  label: {
    color: colors.muted
  },
  value: {
    color: colors.ink,
    fontWeight: '800',
    flex: 1,
    textAlign: 'right'
  },
  countdown: {
    color: colors.muted,
    fontWeight: '700'
  },
  actions: {
    alignSelf: 'stretch',
    gap: 10
  },
  primary: {
    minHeight: 48,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  primaryText: {
    color: '#fff',
    fontWeight: '900'
  },
  secondary: {
    minHeight: 48,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center'
  },
  secondaryText: {
    color: colors.primary,
    fontWeight: '900'
  }
});
