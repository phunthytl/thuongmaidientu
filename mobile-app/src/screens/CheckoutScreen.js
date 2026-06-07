import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { Alert, Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { customerApi } from '../api/customerApi';
import { orderApi } from '../api/orderApi';
import { paymentApi } from '../api/paymentApi';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { Field } from '../components/Field';
import { Screen } from '../components/Screen';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useNotificationStore } from '../store/notificationStore';
import { colors } from '../styles/theme';
import { customerIdOf, money } from '../utils/format';

const defaultAddress = {
  tenNguoiNhan: '',
  soDienThoai: '',
  tinhThanhId: '202',
  tinhThanhTen: 'TP.HCM',
  quanHuyenId: '1454',
  quanHuyenTen: 'Quận 12',
  xaPhuongId: '21211',
  xaPhuongTen: 'Phường Trung Mỹ Tây',
  diaChiChiTiet: '',
  ghnDistrictId: '1454',
  ghnWardCode: '21211',
  isDefault: true
};

const errorMessageOf = (error) =>
  error.response?.data?.message || error.message || 'Vui lòng thử lại.';

const getPaymentReturnUrl = () => {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return `${window.location.origin}/payment-result`;
  }
  return 'carshop://payment-result';
};

export function CheckoutScreen({ navigation }) {
  const user = useAuthStore((state) => state.user);
  const { cart, clear } = useCartStore();
  const addNotification = useNotificationStore((state) => state.add);
  const [addresses, setAddresses] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [addressId, setAddressId] = useState(null);
  const [warehouseId, setWarehouseId] = useState(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState(defaultAddress);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  const khachHangId = customerIdOf(user);
  const items = cart?.chiTietGioHangs || [];
  const canUseVnpay = useMemo(
    () => items.length > 0 && items.every((item) => item.loaiSanPham === 'PHU_KIEN'),
    [items]
  );

  const loadCheckoutData = useCallback(async () => {
    if (!user) return;
    const [addr, kho] = await Promise.all([
      customerApi.addresses(khachHangId),
      customerApi.warehouses()
    ]);
    const addressList = addr || [];
    setAddresses(addressList);
    setWarehouses(kho || []);
    setAddressId(addressList[0]?.id || null);
    setIsAddingAddress(addressList.length === 0);
    setWarehouseId((kho || [])[0]?.id || null);
    setNewAddress((prev) => ({
      ...prev,
      tenNguoiNhan: prev.tenNguoiNhan || user?.hoTen || '',
      soDienThoai: prev.soDienThoai || user?.soDienThoai || ''
    }));
  }, [khachHangId, user, user?.hoTen, user?.soDienThoai]);

  useFocusEffect(useCallback(() => {
    loadCheckoutData().catch(() => {
      setAddresses([]);
      setIsAddingAddress(true);
    });
  }, [loadCheckoutData]));

  const setAddressField = (key) => (value) => {
    setNewAddress((prev) => ({ ...prev, [key]: value }));
  };

  const selectedAddress = addresses.find((item) => item.id === addressId);

  const createAddressIfNeeded = async () => {
    if (!isAddingAddress && addressId) return addressId;

    if (!newAddress.tenNguoiNhan.trim() || !newAddress.soDienThoai.trim() || !newAddress.diaChiChiTiet.trim()) {
      throw new Error('Vui lòng nhập đầy đủ người nhận, số điện thoại và địa chỉ chi tiết.');
    }

    const payload = {
      ...newAddress,
      tinhThanhId: Number(newAddress.tinhThanhId),
      quanHuyenId: Number(newAddress.quanHuyenId),
      xaPhuongId: Number(newAddress.xaPhuongId),
      ghnDistrictId: Number(newAddress.ghnDistrictId),
      isDefault: addresses.length === 0
    };
    const created = await customerApi.createAddress(khachHangId, payload);
    setAddresses((prev) => [created, ...prev]);
    setAddressId(created.id);
    setIsAddingAddress(false);
    return created.id;
  };

  const openPaymentUrl = async (url) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.location.href = url;
      return;
    }
    await Linking.openURL(url);
  };

  const submit = async () => {
    if (!user) {
      navigation.navigate('Login', { redirectTo: 'Checkout' });
      return;
    }
    setErrorText('');
    setLoading(true);
    try {
      const finalAddressId = await createAddressIfNeeded();

      if (paymentMethod === 'VNPAY' && !canUseVnpay) {
        throw new Error('VNPay hiện chỉ áp dụng cho đơn hàng phụ kiện.');
      }
      if (paymentMethod === 'VNPAY') {
        const configured = await paymentApi.isVnpayConfigured();
        if (!configured) throw new Error('VNPay chưa được cấu hình trên backend.');
      }

      const chiTietDonHangs = items.map((item) => ({
        loaiSanPham: item.loaiSanPham,
        otoId: item.loaiSanPham === 'OTO' ? item.sanPhamId : undefined,
        phuKienId: item.loaiSanPham === 'PHU_KIEN' ? item.sanPhamId : undefined,
        dichVuId: item.loaiSanPham === 'DICH_VU' ? item.sanPhamId : undefined,
        soLuong: item.soLuong,
        khoHangId: item.khoHangId || warehouseId
      }));

      const orders = await orderApi.create({
        khachHangId,
        diaChiGiaoHangId: finalAddressId,
        khoHangId: warehouseId,
        ghiChu: note,
        chiTietDonHangs
      });
      const createdOrders = Array.isArray(orders) ? orders : [orders];

      if (paymentMethod === 'VNPAY') {
        const orderToPay = createdOrders.find((order) =>
          order?.chiTietDonHangs?.every((item) => item.loaiSanPham === 'PHU_KIEN')
        ) || createdOrders[0];
        const payment = await paymentApi.createVnpayPayment(orderToPay.id, {
          clientReturnUrl: getPaymentReturnUrl()
        });
        await clear(user);
        addNotification({
          title: 'Đang chuyển sang VNPay',
          body: `Đơn ${payment.maDonHang} đang chờ xác nhận thanh toán.`
        });
        await openPaymentUrl(payment.paymentUrl);
        return;
      }

      await clear(user);
      addNotification({
        title: 'Đã tạo đơn hàng',
        body: `Hệ thống đã ghi nhận ${createdOrders.length} đơn hàng mới.`
      });
      Alert.alert('Đặt hàng thành công', 'Bạn có thể theo dõi đơn trong mục Đơn hàng.');
      navigation.navigate('Main', { screen: 'Orders' });
    } catch (error) {
      const message = errorMessageOf(error);
      setErrorText(message);
      Alert.alert('Không xác nhận được thanh toán', message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Screen>
        <EmptyState icon="log-in-outline" title="Đăng nhập để thanh toán" body="Bạn có thể xem sản phẩm và thêm phụ kiện vào giỏ trước. Khi thanh toán, hãy đăng nhập để tạo đơn hàng." />
        <Button title="Đăng nhập" icon="log-in-outline" onPress={() => navigation.navigate('Login', { redirectTo: 'Checkout' })} />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.sectionHeader}>
        <Text style={styles.section}>Địa chỉ giao hàng</Text>
        {addresses.length > 0 ? (
          <Pressable onPress={() => setIsAddingAddress((value) => !value)}>
            <Text style={styles.link}>{isAddingAddress ? 'Chọn đã lưu' : 'Thêm mới'}</Text>
          </Pressable>
        ) : null}
      </View>

      {!isAddingAddress && addresses.map((item) => (
        <Choice key={item.id} active={addressId === item.id} onPress={() => setAddressId(item.id)}>
          <Text style={styles.choiceTitle}>{item.tenNguoiNhan} - {item.soDienThoai}</Text>
          <Text style={styles.choiceBody}>
            {[item.diaChiChiTiet, item.xaPhuongTen, item.quanHuyenTen, item.tinhThanhTen].filter(Boolean).join(', ')}
          </Text>
        </Choice>
      ))}

      {isAddingAddress ? (
        <View style={styles.formBox}>
          <Field label="Người nhận" value={newAddress.tenNguoiNhan} onChangeText={setAddressField('tenNguoiNhan')} />
          <Field label="Số điện thoại" value={newAddress.soDienThoai} onChangeText={setAddressField('soDienThoai')} keyboardType="phone-pad" />
          <Field label="Tỉnh/thành" value={newAddress.tinhThanhTen} onChangeText={setAddressField('tinhThanhTen')} />
          <Field label="Quận/huyện" value={newAddress.quanHuyenTen} onChangeText={setAddressField('quanHuyenTen')} />
          <Field label="Xã/phường" value={newAddress.xaPhuongTen} onChangeText={setAddressField('xaPhuongTen')} />
          <Field label="Địa chỉ chi tiết" value={newAddress.diaChiChiTiet} onChangeText={setAddressField('diaChiChiTiet')} multiline />
          <Text style={styles.hint}>
            Mã GHN đang dùng mặc định theo khu vực TP.HCM. Bạn có thể sửa chi tiết hơn ở mục Tài khoản &gt; Địa chỉ giao hàng.
          </Text>
        </View>
      ) : selectedAddress ? (
        <Text style={styles.hint}>Đang giao đến: {selectedAddress.diaChiChiTiet}</Text>
      ) : null}

      <Text style={styles.section}>Kho xuất hàng</Text>
      {warehouses.map((item) => (
        <Choice key={item.id} active={warehouseId === item.id} onPress={() => setWarehouseId(item.id)}>
          <Text style={styles.choiceTitle}>{item.tenKho}</Text>
          <Text style={styles.choiceBody}>{item.diaChiChiTiet}</Text>
        </Choice>
      ))}

      <Text style={styles.section}>Phương thức thanh toán</Text>
      <PaymentChoice
        active={paymentMethod === 'COD'}
        icon="cash-outline"
        title="Thanh toán khi nhận hàng"
        body="Xác nhận đơn hàng, thanh toán khi nhận sản phẩm."
        onPress={() => setPaymentMethod('COD')}
      />
      <PaymentChoice
        active={paymentMethod === 'VNPAY'}
        disabled={!canUseVnpay}
        icon="card-outline"
        title="Thanh toán qua VNPay"
        body={canUseVnpay ? 'Chuyển sang cổng VNPay để xác nhận giao dịch.' : 'Chỉ áp dụng cho đơn phụ kiện.'}
        onPress={() => canUseVnpay && setPaymentMethod('VNPAY')}
      />

      <Field label="Ghi chú" value={note} onChangeText={setNote} multiline />
      <View style={styles.total}>
        <Text style={styles.choiceTitle}>Tổng thanh toán tạm tính</Text>
        <Text style={styles.amount}>{money(cart?.tongTien)}</Text>
      </View>
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
      <Button
        title={paymentMethod === 'VNPAY' ? 'Xác nhận và thanh toán VNPay' : 'Xác nhận đặt hàng'}
        icon={paymentMethod === 'VNPAY' ? 'card-outline' : 'checkmark-circle-outline'}
        onPress={submit}
        loading={loading}
      />
    </Screen>
  );
}

function Choice({ active, onPress, children }) {
  return (
    <Pressable onPress={onPress} style={[styles.choice, active && styles.choiceActive]}>
      {children}
    </Pressable>
  );
}

function PaymentChoice({ active, disabled, icon, title, body, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.choice, active && styles.choiceActive, disabled && styles.disabled]}>
      <View style={styles.paymentRow}>
        <Ionicons name={icon} size={24} color={disabled ? colors.muted : colors.primary} />
        <View style={{ flex: 1 }}>
          <Text style={styles.choiceTitle}>{title}</Text>
          <Text style={styles.choiceBody}>{body}</Text>
        </View>
        <Ionicons name={active ? 'radio-button-on' : 'radio-button-off'} size={22} color={active ? colors.primary : colors.muted} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  section: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: '900'
  },
  link: {
    color: colors.primary,
    fontWeight: '900'
  },
  choice: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
    gap: 5
  },
  choiceActive: {
    borderColor: colors.primary,
    backgroundColor: '#ecfdf5'
  },
  formBox: {
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12
  },
  disabled: {
    opacity: 0.55
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  choiceTitle: {
    color: colors.ink,
    fontWeight: '800'
  },
  choiceBody: {
    color: colors.muted,
    lineHeight: 20
  },
  hint: {
    color: colors.muted,
    lineHeight: 20
  },
  total: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    gap: 6
  },
  amount: {
    color: colors.accent,
    fontSize: 22,
    fontWeight: '900'
  },
  error: {
    color: colors.danger,
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    lineHeight: 20,
    fontWeight: '700'
  }
});
