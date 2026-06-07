import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Field } from '../components/Field';
import { Screen } from '../components/Screen';
import { useAuthStore } from '../store/authStore';
import { colors } from '../styles/theme';

export function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const { login, loading } = useAuthStore();

  const submit = async () => {
    try {
      await login(email.trim(), matKhau);
    } catch (error) {
      Alert.alert('Không đăng nhập được', error.response?.data?.message || 'Kiểm tra lại email và mật khẩu.');
    }
  };

  return (
    <Screen style={styles.wrap}>
      <View>
        <Text style={styles.brand}>CarShop</Text>
        <Text style={styles.sub}>Mua xe, phụ kiện và theo dõi đơn hàng trên điện thoại.</Text>
      </View>
      <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <Field label="Mật khẩu" value={matKhau} onChangeText={setMatKhau} secureTextEntry />
      <Button title="Đăng nhập" icon="log-in-outline" onPress={submit} loading={loading} />
      <Pressable onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Chưa có tài khoản? Đăng ký</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: {
    justifyContent: 'center'
  },
  brand: {
    color: colors.ink,
    fontSize: 34,
    fontWeight: '900'
  },
  sub: {
    marginTop: 8,
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22
  },
  link: {
    textAlign: 'center',
    color: colors.primary,
    fontWeight: '700'
  }
});
