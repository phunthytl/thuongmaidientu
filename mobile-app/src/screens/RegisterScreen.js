import { useState } from 'react';
import { Alert } from 'react-native';
import { Button } from '../components/Button';
import { Field } from '../components/Field';
import { Screen } from '../components/Screen';
import { useAuthStore } from '../store/authStore';

export function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({ hoTen: '', email: '', soDienThoai: '', matKhau: '' });
  const { register, loading } = useAuthStore();

  const set = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async () => {
    try {
      await register(form);
      Alert.alert('Đăng ký thành công', 'Bạn có thể đăng nhập bằng tài khoản vừa tạo.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Không đăng ký được', error.response?.data?.message || 'Vui lòng kiểm tra thông tin.');
    }
  };

  return (
    <Screen>
      <Field label="Họ tên" value={form.hoTen} onChangeText={set('hoTen')} />
      <Field label="Email" value={form.email} onChangeText={set('email')} keyboardType="email-address" />
      <Field label="Số điện thoại" value={form.soDienThoai} onChangeText={set('soDienThoai')} keyboardType="phone-pad" />
      <Field label="Mật khẩu" value={form.matKhau} onChangeText={set('matKhau')} secureTextEntry />
      <Button title="Tạo tài khoản" icon="person-add-outline" onPress={submit} loading={loading} />
    </Screen>
  );
}
