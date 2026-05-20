import { StyleSheet, View } from 'react-native';
import { EmptyState } from '../components/EmptyState';
import { ProductCard } from '../components/ProductCard';
import { Screen } from '../components/Screen';
import { useFavoriteStore } from '../store/favoriteStore';

export function FavoritesScreen({ navigation }) {
  const { favorites, toggle, isFavorite } = useFavoriteStore();

  if (favorites.length === 0) {
    return (
      <Screen>
        <EmptyState icon="heart-outline" title="Chưa lưu sản phẩm" body="Bấm biểu tượng trái tim ở sản phẩm bạn quan tâm." />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.grid}>
        {favorites.map((item) => (
          <ProductCard
            key={item.key}
            item={item}
            type={item.loaiSanPham}
            favorite={isFavorite(item.loaiSanPham, item.id)}
            onFavorite={() => toggle(item)}
            onPress={() => navigation.navigate('ProductDetail', { id: item.id, type: item.loaiSanPham })}
          />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  }
});
