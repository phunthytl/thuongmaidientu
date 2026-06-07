import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Field } from '../components/Field';
import { Button } from '../components/Button';
import { serviceApi } from '../api/serviceApi';
import { customerApi } from '../api/customerApi';
import { useAuthStore } from '../store/authStore';
import { money } from '../utils/format';
import { colors } from '../styles/theme';

const pad = (n) => String(n).padStart(2, '0');

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

// Ngày hợp lệ: đúng định dạng YYYY-MM-DD và trong khoảng [hôm nay, +1 năm]
const isValidDate = (v) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const sel = new Date(`${v}T00:00:00`);
  if (Number.isNaN(sel.getTime())) return false;
  const today = new Date(`${todayStr()}T00:00:00`);
  const max = new Date(today);
  max.setFullYear(max.getFullYear() + 1);
  return sel >= today && sel <= max;
};

export function ServiceBookingScreen({ route, navigation }) {
  const service = route.params?.service;
  const user = useAuthStore((s) => s.user);

  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState(null);
  const [form, setForm] = useState({
    hoTen: '',
    soDienThoai: '',
    email: '',
    ngayHen: '',
    gioHen: '',
    ghiChu: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Tự điền thông tin từ tài khoản
  useEffect(() => {
    if (user) {
      setForm((p) => ({
        ...p,
        hoTen: user.hoTen || '',
        soDienThoai: user.soDienThoai || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  // Lấy danh sách chi nhánh đang hoạt động
  useEffect(() => {
    customerApi
      .warehouses()
      .then((list) => {
        const arr = Array.isArray(list) ? list : [];
        setBranches(arr);
        if (arr.length > 0) setBranchId(arr[0].id);
      })
      .catch(() => setBranches([]));
  }, []);

  const submit = async () => {
    if (!branchId) {
      Alert.alert('Thiếu chi nhánh', 'Vui lòng chọn chi nhánh thực hiện.');
      return;
    }
    if (!form.hoTen.trim() || !form.soDienThoai.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập họ tên và số điện thoại.');
      return;
    }
    if (!isValidDate(form.ngayHen)) {
      Alert.alert('Ngày không hợp lệ', 'Nhập ngày dạng YYYY-MM-DD, trong vòng 1 năm tới.');
      return;
    }
    if (!/^\d{2}:\d{2}$/.test(form.gioHen)) {
      Alert.alert('Giờ không hợp lệ', 'Nhập giờ dạng HH:mm, ví dụ 14:30.');
      return;
    }

    setSubmitting(true);
    try {
      await serviceApi.book({
        ...form,
        loaiLich: 'DICH_VU',
        chiNhanhId: branchId,
        otoId: null,
        dichVuId: service.id
      });
      Alert.alert('Thành công', 'Đặt lịch dịch vụ thành công! Chúng tôi sẽ liên hệ sớm nhất.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (err) {
      Alert.alert('Lỗi', err.response?.data?.message || err.message || 'Đặt lịch thất bại.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!service) {
    return (
      <Screen>
        <Text style={styles.muted}>Không tìm thấy thông tin dịch vụ.</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.summary}>
        <Text style={styles.name}>{service.tenDichVu}</Text>
        <Text style={styles.price}>{money(service.gia)}</Text>
        {service.thoiGianUocTinh ? <Text style={styles.muted}>⏱ {service.thoiGianUocTinh}</Text> : null}
      </View>

      <Text style={styles.label}>Chi nhánh thực hiện *</Text>
      <View style={styles.branchList}>
        {branches.length === 0 ? <Text style={styles.muted}>Đang tải chi nhánh...</Text> : null}
        {branches.map((b) => {
          const active = branchId === b.id;
          return (
            <Pressable
              key={b.id}
              style={[styles.branch, active && styles.branchActive]}
              onPress={() => setBranchId(b.id)}
            >
              <View style={[styles.radio, active && styles.radioOn]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.branchName}>{b.tenKho}</Text>
                <Text style={styles.muted}>
                  {[b.tinhThanhName, b.diaChiChiTiet].filter(Boolean).join(' - ')}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <Field label="Họ và tên *" value={form.hoTen} onChangeText={(v) => setForm({ ...form, hoTen: v })} />
      <Field
        label="Số điện thoại *"
        value={form.soDienThoai}
        onChangeText={(v) => setForm({ ...form, soDienThoai: v })}
        keyboardType="phone-pad"
      />
      <Field
        label="Email"
        value={form.email}
        onChangeText={(v) => setForm({ ...form, email: v })}
        keyboardType="email-address"
      />
      <Field
        label="Ngày hẹn (YYYY-MM-DD) *"
        value={form.ngayHen}
        onChangeText={(v) => setForm({ ...form, ngayHen: v })}
        placeholder={todayStr()}
      />
      <Field
        label="Giờ hẹn (HH:mm) *"
        value={form.gioHen}
        onChangeText={(v) => setForm({ ...form, gioHen: v })}
        placeholder="14:30"
      />
      <Field
        label="Ghi chú"
        value={form.ghiChu}
        onChangeText={(v) => setForm({ ...form, ghiChu: v })}
        multiline
      />

      <Button title="Xác nhận đặt lịch" icon="calendar-outline" onPress={submit} loading={submitting} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  summary: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 4
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.ink
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary
  },
  label: {
    color: colors.ink,
    fontWeight: '700'
  },
  branchList: {
    gap: 10
  },
  branch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface
  },
  branchActive: {
    borderColor: colors.primary,
    backgroundColor: '#f0fdfa'
  },
  branchName: {
    fontWeight: '700',
    color: colors.ink
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.line
  },
  radioOn: {
    borderColor: colors.primary,
    backgroundColor: colors.primary
  },
  muted: {
    color: colors.muted,
    fontSize: 13
  }
});
