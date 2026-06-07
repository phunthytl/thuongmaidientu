import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Field } from '../components/Field';
import { ProductCard } from '../components/ProductCard';
import { Screen } from '../components/Screen';
import { productApi } from '../api/productApi';
import { useFavoriteStore } from '../store/favoriteStore';
import { colors } from '../styles/theme';

export function ProductListScreen({ navigation, route }) {
  const [type, setType] = useState(route.params?.type || 'OTO');
  const [keyword, setKeyword] = useState('');
  const [giaMax, setGiaMax] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toggle, isFavorite } = useFavoriteStore();

  useEffect(() => {
    if (route.params?.type) setType(route.params.type);
  }, [route.params?.type]);

  const load = async () => {
    setLoading(true);
    const params = {
      page: 0,
      size: 20,
      sort: 'ngayTao,desc',
      keyword: keyword || undefined,
      giaMax: giaMax || undefined
    };
    const page = type === 'OTO' ? await productApi.cars(params) : await productApi.accessories(params);
    setItems(productApi.pageContent(page));
    setLoading(false);
  };

  useFocusEffect(useCallback(() => { load().catch(() => setLoading(false)); }, [type]));

  return (
    <Screen>
      <View style={styles.segment}>
        <Pressable style={[styles.segmentItem, type === 'OTO' && styles.active]} onPress={() => setType('OTO')}>
          <Text style={[styles.segmentText, type === 'OTO' && styles.activeText]}>Ô tô</Text>
        </Pressable>
        <Pressable style={[styles.segmentItem, type === 'PHU_KIEN' && styles.active]} onPress={() => setType('PHU_KIEN')}>
          <Text style={[styles.segmentText, type === 'PHU_KIEN' && styles.activeText]}>Phụ kiện</Text>
        </Pressable>
      </View>
      <Field label="Tìm kiếm" value={keyword} onChangeText={setKeyword} placeholder="Tên xe hoặc phụ kiện" />
      <Field label="Giá tối đa" value={giaMax} onChangeText={setGiaMax} keyboardType="numeric" placeholder="Ví dụ: 1000000000" />
      <Pressable style={styles.search} onPress={load}>
        <Text style={styles.searchText}>Lọc sản phẩm</Text>
      </Pressable>
      {loading ? <ActivityIndicator color={colors.primary} /> : null}
      <View style={styles.grid}>
        {items.map((item) => (
          <ProductCard
            key={`${type}-${item.id}`}
            item={item}
            type={type}
            favorite={isFavorite(type, item.id)}
            onFavorite={() => toggle({ ...item, loaiSanPham: type })}
            onPress={() => navigation.navigate('ProductDetail', { id: item.id, type })}
          />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  segment: {
    flexDirection: 'row',
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    padding: 4
  },
  segmentItem: {
    flex: 1,
    height: 42,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  active: {
    backgroundColor: colors.surface
  },
  segmentText: {
    color: colors.muted,
    fontWeight: '700'
  },
  activeText: {
    color: colors.primary
  },
  search: {
    minHeight: 44,
    borderRadius: 8,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center'
  },
  searchText: {
    color: '#fff',
    fontWeight: '800'
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  }
});
