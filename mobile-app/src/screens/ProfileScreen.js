import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Screen } from '../components/Screen';
import { useAuthStore } from '../store/authStore';
import { colors } from '../styles/theme';

export function ProfileScreen({ navigation }) {
  const { user, logout } = useAuthStore();

  if (!user) {
    return (
      <Screen>
        <View style={styles.profile}>
          <Text style={styles.name}>Tài khoản</Text>
          <Text style={styles.muted}>Đăng nhập để xem thông tin cá nhân, địa chỉ giao hàng và lịch sử mua hàng.</Text>
        </View>
        <Button title="Đăng nhập" icon="log-in-outline" onPress={() => navigation.navigate('Login', { redirectTo: 'Main' })} />
        <Button title="Đăng ký" icon="person-add-outline" variant="ghost" onPress={() => navigation.navigate('Register')} />
      </Screen>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigation.navigate('Main', { screen: 'Home' });
  };

  return (
    <Screen>
      <View style={styles.profile}>
        <Text style={styles.name}>{user?.hoTen}</Text>
        <Text style={styles.muted}>{user?.email}</Text>
        <Text style={styles.muted}>{user?.soDienThoai}</Text>
      </View>
      <Button title="Sản phẩm yêu thích" icon="heart-outline" variant="ghost" onPress={() => navigation.navigate('Favorites')} />
      <Button title="Thông báo" icon="notifications-outline" variant="ghost" onPress={() => navigation.navigate('Notifications')} />
      <Button title="Địa chỉ giao hàng" icon="location-outline" variant="ghost" onPress={() => navigation.navigate('Addresses')} />
      <Button title="Đăng xuất" icon="log-out-outline" variant="ghost" onPress={handleLogout} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  profile: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 16,
    gap: 7
  },
  name: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '900'
  },
  muted: {
    color: colors.muted
  }
});
