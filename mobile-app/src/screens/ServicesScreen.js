import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../components/Screen';
import { EmptyState } from '../components/EmptyState';
import { serviceApi } from '../api/serviceApi';
import { money } from '../utils/format';
import { colors, shadow } from '../styles/theme';

export function ServicesScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const page = await serviceApi.list();
      // chỉ hiện dịch vụ đang bật (trangThai = true)
      const list = serviceApi.content(page).filter((s) => s.trangThai !== false);
      setItems(list);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { load().catch(() => setLoading(false)); }, []));

  return (
    <Screen>
      <Text style={styles.heading}>Dịch vụ</Text>
      <Text style={styles.sub}>Chọn gói dịch vụ và đặt lịch hẹn</Text>

      {loading ? <ActivityIndicator color={colors.primary} /> : null}

      {!loading && items.length === 0 ? (
        <EmptyState icon="construct-outline" title="Chưa có dịch vụ" body="Hiện chưa có gói dịch vụ nào." />
      ) : null}

      {items.map((item) => (
        <Pressable
          key={item.id}
          style={styles.card}
          onPress={() => navigation.navigate('ServiceBooking', { service: item })}
        >
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={styles.name}>{item.tenDichVu}</Text>
            {item.thoiGianUocTinh ? (
              <Text style={styles.meta}>⏱ {item.thoiGianUocTinh}</Text>
            ) : null}
            {item.moTa ? (
              <Text style={styles.desc} numberOfLines={2}>{item.moTa}</Text>
            ) : null}
          </View>
          <View style={styles.right}>
            <Text style={styles.price}>{money(item.gia)}</Text>
            <Text style={styles.book}>Đặt lịch →</Text>
          </View>
        </Pressable>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.ink
  },
  sub: {
    color: colors.muted,
    marginTop: -8
  },
  card: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink
  },
  meta: {
    color: colors.muted,
    fontSize: 13
  },
  desc: {
    color: colors.muted,
    fontSize: 13
  },
  right: {
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary
  },
  book: {
    color: colors.accent,
    fontWeight: '700',
    fontSize: 13
  }
});
