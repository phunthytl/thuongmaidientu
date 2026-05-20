import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { ProductCard } from '../components/ProductCard';
import { Screen } from '../components/Screen';
import { productApi } from '../api/productApi';
import { useFavoriteStore } from '../store/favoriteStore';
import { colors } from '../styles/theme';

export function HomeScreen({ navigation }) {
  const [cars, setCars] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toggle, isFavorite } = useFavoriteStore();

  const load = async () => {
    setLoading(true);
    const [carPage, accessoryPage] = await Promise.all([
      productApi.featuredCars(6),
      productApi.accessories({ page: 0, size: 6, sort: 'ngayTao,desc' })
    ]);
    setCars(productApi.pageContent(carPage));
    setAccessories(productApi.pageContent(accessoryPage));
    setLoading(false);
  };

  useFocusEffect(useCallback(() => { load().catch(() => setLoading(false)); }, []));

  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>CarShop</Text>
          <Text style={styles.sub}>Xe và phụ kiện đã sẵn sàng trong kho.</Text>
        </View>
        <View style={styles.actions}>
          <Pressable onPress={() => navigation.navigate('Notifications')}>
            <Ionicons name="notifications-outline" size={24} color={colors.ink} />
          </Pressable>
          <Pressable onPress={() => navigation.navigate('Favorites')}>
            <Ionicons name="heart-outline" size={24} color={colors.ink} />
          </Pressable>
        </View>
      </View>
      <View style={styles.quick}>
        <Pressable style={styles.quickItem} onPress={() => navigation.navigate('Products', { type: 'OTO' })}>
          <Ionicons name="car-sport-outline" size={24} color={colors.primary} />
          <Text style={styles.quickText}>Ô tô</Text>
        </Pressable>
        <Pressable style={styles.quickItem} onPress={() => navigation.navigate('Products', { type: 'PHU_KIEN' })}>
          <Ionicons name="construct-outline" size={24} color={colors.primary} />
          <Text style={styles.quickText}>Phụ kiện</Text>
        </Pressable>
        <Pressable style={styles.quickItem} onPress={() => navigation.navigate('Orders')}>
          <Ionicons name="receipt-outline" size={24} color={colors.primary} />
          <Text style={styles.quickText}>Đơn hàng</Text>
        </Pressable>
      </View>
      {loading ? <ActivityIndicator color={colors.primary} /> : null}
      <Section title="Xe nổi bật" />
      <View style={styles.grid}>
        {cars.map((item) => (
          <ProductCard
            key={`car-${item.id}`}
            item={item}
            type="OTO"
            favorite={isFavorite('OTO', item.id)}
            onFavorite={() => toggle({ ...item, loaiSanPham: 'OTO' })}
            onPress={() => navigation.navigate('ProductDetail', { id: item.id, type: 'OTO' })}
          />
        ))}
      </View>
      <Section title="Phụ kiện mới" />
      <View style={styles.grid}>
        {accessories.map((item) => (
          <ProductCard
            key={`pk-${item.id}`}
            item={item}
            type="PHU_KIEN"
            favorite={isFavorite('PHU_KIEN', item.id)}
            onFavorite={() => toggle({ ...item, loaiSanPham: 'PHU_KIEN' })}
            onPress={() => navigation.navigate('ProductDetail', { id: item.id, type: 'PHU_KIEN' })}
          />
        ))}
      </View>
    </Screen>
  );
}

function Section({ title }) {
  return <Text style={styles.section}>{title}</Text>;
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: colors.ink
  },
  sub: {
    color: colors.muted,
    marginTop: 4
  },
  actions: {
    flexDirection: 'row',
    gap: 14
  },
  quick: {
    flexDirection: 'row',
    gap: 10
  },
  quickItem: {
    flex: 1,
    minHeight: 74,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
  },
  quickText: {
    color: colors.ink,
    fontWeight: '700'
  },
  section: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900'
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  }
});
