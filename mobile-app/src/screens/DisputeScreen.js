import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { disputeApi } from '../api/disputeApi';
import { Button } from '../components/Button';
import { Field } from '../components/Field';
import { Screen } from '../components/Screen';
import { useAuthStore } from '../store/authStore';
import { colors } from '../styles/theme';
import { customerIdOf } from '../utils/format';

export function DisputeScreen({ route, navigation }) {
  const user = useAuthStore((state) => state.user);
  const order = route.params?.order;
  const [tieuDe, setTieuDe] = useState(order?.maDonHang ? `Khiếu nại đơn ${order.maDonHang}` : '');
  const [noiDung, setNoiDung] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!user || user.vaiTro !== 'KHACH_HANG') {
      Alert.alert('Cần đăng nhập', 'Bạn cần đăng nhập để gửi khiếu nại.');
      return;
    }

    if (!tieuDe.trim() || !noiDung.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập tiêu đề và nội dung khiếu nại.');
      return;
    }

    setLoading(true);
    try {
      await disputeApi.create({
        khachHangId: customerIdOf(user),
        donHangId: order?.id,
        tieuDe: tieuDe.trim(),
        noiDung: noiDung.trim()
      });
      Alert.alert('Gửi khiếu nại thành công', 'Bộ phận chăm sóc khách hàng sẽ phản hồi sớm nhất.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Không gửi được', error.response?.data?.message || 'Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      {order ? (
        <View style={styles.box}>
          <Text style={styles.code}>{order.maDonHang}</Text>
          <Text style={styles.muted}>Khiếu nại sẽ được gắn với đơn hàng này.</Text>
        </View>
      ) : null}
      <Field label="Tiêu đề" value={tieuDe} onChangeText={setTieuDe} placeholder="VD: Sản phẩm giao thiếu" />
      <Field label="Nội dung khiếu nại" value={noiDung} onChangeText={setNoiDung} multiline placeholder="Mô tả vấn đề bạn gặp phải..." />
      <Button title="Gửi khiếu nại" icon="alert-circle-outline" onPress={submit} loading={loading} />
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
    gap: 6
  },
  code: {
    color: colors.ink,
    fontWeight: '900'
  },
  muted: {
    color: colors.muted,
    lineHeight: 20
  }
});
