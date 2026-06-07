import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { Field } from '../components/Field';
import { Screen } from '../components/Screen';
import { customerApi } from '../api/customerApi';
import { useAuthStore } from '../store/authStore';
import { colors } from '../styles/theme';
import { customerIdOf } from '../utils/format';

const blank = {
  tenNguoiNhan: '',
  soDienThoai: '',
  tinhThanhId: '201',
  tinhThanhTen: 'Hà Nội',
  xaPhuongId: '1001',
  xaPhuongTen: 'Phường Yên Sở',
  diaChiChiTiet: '',
  ghnDistrictId: '1490',
  ghnWardCode: '1A0814',
  isDefault: true
};

export function AddressScreen() {
  const user = useAuthStore((state) => state.user);
  const khachHangId = customerIdOf(user);
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => customerApi.addresses(khachHangId).then((data) => setAddresses(data || []));
  const set = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }));

  useFocusEffect(useCallback(() => { load(); }, [khachHangId]));

  const edit = (item) => {
    setEditingId(item.id);
    setForm({
      tenNguoiNhan: item.tenNguoiNhan || '',
      soDienThoai: item.soDienThoai || '',
      tinhThanhId: String(item.tinhThanhId || '201'),
      tinhThanhTen: item.tinhThanhTen || 'Hà Nội',
      xaPhuongId: String(item.xaPhuongId || '1001'),
      xaPhuongTen: item.xaPhuongTen || 'Phường Yên Sở',
      diaChiChiTiet: item.diaChiChiTiet || '',
      ghnDistrictId: String(item.ghnDistrictId || '1490'),
      ghnWardCode: item.ghnWardCode || '1A0814',
      isDefault: item.isDefault ?? true
    });
  };

  const submit = async () => {
    setSaving(true);
    const payload = {
      ...form,
      tinhThanhId: Number(form.tinhThanhId),
      xaPhuongId: Number(form.xaPhuongId),
      ghnDistrictId: Number(form.ghnDistrictId)
    };
    try {
      if (editingId) {
        await customerApi.updateAddress(khachHangId, editingId, payload);
      } else {
        await customerApi.createAddress(khachHangId, payload);
      }
      setEditingId(null);
      setForm(blank);
      await load();
    } catch (error) {
      Alert.alert('Không lưu được địa chỉ', error.response?.data?.message || 'Vui lòng kiểm tra thông tin.');
    } finally {
      setSaving(false);
    }
  };

  const remove = (id) => {
    Alert.alert('Xóa địa chỉ', 'Bạn muốn xóa địa chỉ này?', [
      { text: 'Hủy' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          await customerApi.deleteAddress(khachHangId, id);
          await load();
        }
      }
    ]);
  };

  return (
    <Screen>
      <Text style={styles.section}>{editingId ? 'Sửa địa chỉ' : 'Thêm địa chỉ'}</Text>
      <Field label="Người nhận" value={form.tenNguoiNhan} onChangeText={set('tenNguoiNhan')} />
      <Field label="Số điện thoại" value={form.soDienThoai} onChangeText={set('soDienThoai')} keyboardType="phone-pad" />
      <Field label="Tỉnh/thành" value={form.tinhThanhTen} onChangeText={set('tinhThanhTen')} />
      <Field label="Xã/phường" value={form.xaPhuongTen} onChangeText={set('xaPhuongTen')} />
      <Field label="Địa chỉ chi tiết" value={form.diaChiChiTiet} onChangeText={set('diaChiChiTiet')} multiline />
      <Button title={editingId ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ'} icon="save-outline" onPress={submit} loading={saving} />
      <Text style={styles.section}>Địa chỉ đã lưu</Text>
      {addresses.length === 0 ? (
        <EmptyState icon="location-outline" title="Chưa có địa chỉ" />
      ) : (
        addresses.map((item) => (
          <View key={item.id} style={styles.item}>
            <Text style={styles.name}>{item.tenNguoiNhan} - {item.soDienThoai}</Text>
            <Text style={styles.body}>{item.diaChiChiTiet}</Text>
            <View style={styles.actions}>
              <Pressable onPress={() => edit(item)}>
                <Text style={styles.action}>Sửa</Text>
              </Pressable>
              <Pressable onPress={() => remove(item.id)}>
                <Text style={[styles.action, styles.delete]}>Xóa</Text>
              </Pressable>
            </View>
          </View>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: '900'
  },
  item: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
    gap: 8
  },
  name: {
    color: colors.ink,
    fontWeight: '900'
  },
  body: {
    color: colors.muted,
    lineHeight: 20
  },
  actions: {
    flexDirection: 'row',
    gap: 18
  },
  action: {
    color: colors.primary,
    fontWeight: '800'
  },
  delete: {
    color: colors.danger
  }
});
