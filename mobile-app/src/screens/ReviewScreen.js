import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Field } from '../components/Field';
import { Screen } from '../components/Screen';
import { productApi } from '../api/productApi';
import { useAuthStore } from '../store/authStore';
import { colors } from '../styles/theme';
import { customerIdOf, productName } from '../utils/format';

export function ReviewScreen({ route, navigation }) {
  const { product, type } = route.params;
  const user = useAuthStore((state) => state.user);
  const [rating, setRating] = useState(5);
  const [noiDung, setNoiDung] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      await productApi.createReview({
        khachHangId: customerIdOf(user),
        loaiSanPham: type,
        otoId: type === 'OTO' ? product.id : undefined,
        phuKienId: type === 'PHU_KIEN' ? product.id : undefined,
        diemDanhGia: rating,
        noiDung
      });
      Alert.alert('Cảm ơn bạn', 'Đánh giá đã được ghi nhận.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Không gửi được', error.response?.data?.message || 'Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Text style={styles.title}>{productName(product)}</Text>
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((value) => (
          <Pressable key={value} onPress={() => setRating(value)}>
            <Text style={[styles.star, value <= rating && styles.starActive]}>★</Text>
          </Pressable>
        ))}
      </View>
      <Field label="Nhận xét" value={noiDung} onChangeText={setNoiDung} multiline />
      <Button title="Gửi đánh giá" icon="star-outline" onPress={submit} loading={loading} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '900'
  },
  stars: {
    flexDirection: 'row',
    gap: 8
  },
  star: {
    color: colors.line,
    fontSize: 38
  },
  starActive: {
    color: colors.warning
  }
});
