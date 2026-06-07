import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, shadow } from '../styles/theme';
import { money, productImage, productName } from '../utils/format';

export function ProductCard({ item, type, onPress, onFavorite, favorite }) {
  const image = productImage(item);
  return (
    <Pressable style={styles.card} onPress={onPress}>
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Ionicons name="car-sport-outline" size={30} color={colors.muted} />
        </View>
      )}
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text numberOfLines={2} style={styles.name}>
            {productName(item)}
          </Text>
          <Pressable onPress={onFavorite} hitSlop={10}>
            <Ionicons
              name={favorite ? 'heart' : 'heart-outline'}
              size={22}
              color={favorite ? colors.danger : colors.muted}
            />
          </Pressable>
        </View>
        <Text style={styles.meta}>{type === 'OTO' ? item.hangXe : item.loaiPhuKien}</Text>
        <Text style={styles.price}>{money(item.gia)}</Text>
        <View style={styles.footer}>
          <Ionicons name="star" size={14} color={colors.warning} />
          <Text style={styles.rating}>{item.diemDanhGiaTrungBinh?.toFixed?.(1) || '0.0'}</Text>
          <Text style={styles.stock}>Còn {item.soLuong ?? 0}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow
  },
  image: {
    width: '100%',
    aspectRatio: 1.35,
    backgroundColor: '#eef2f3'
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  body: {
    padding: 10,
    gap: 6
  },
  titleRow: {
    minHeight: 42,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start'
  },
  name: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: colors.ink
  },
  meta: {
    color: colors.muted,
    fontSize: 12
  },
  price: {
    color: colors.accent,
    fontWeight: '800',
    fontSize: 15
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  rating: {
    color: colors.ink,
    fontSize: 12
  },
  stock: {
    marginLeft: 'auto',
    color: colors.success,
    fontSize: 12,
    fontWeight: '600'
  }
});
