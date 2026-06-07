import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CartScreen } from '../screens/CartScreen';
import { CheckoutScreen } from '../screens/CheckoutScreen';
import { AddressScreen } from '../screens/AddressScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { OrderDetailScreen } from '../screens/OrderDetailScreen';
import { OrdersScreen } from '../screens/OrdersScreen';
import { ProductDetailScreen } from '../screens/ProductDetailScreen';
import { ProductListScreen } from '../screens/ProductListScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { ReviewScreen } from '../screens/ReviewScreen';
import { ServicesScreen } from '../screens/ServicesScreen';
import { ServiceBookingScreen } from '../screens/ServiceBookingScreen';
import { PaymentResultScreen } from '../screens/PaymentResultScreen';
import { useAuthStore } from '../store/authStore';
import { colors } from '../styles/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Home: 'home-outline',
            Products: 'search-outline',
            Cart: 'cart-outline',
            Orders: 'receipt-outline',
            Profile: 'person-outline'
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Trang chủ' }} />
      <Tab.Screen name="Products" component={ProductListScreen} options={{ title: 'Sản phẩm' }} />
      <Tab.Screen name="Cart" component={CartScreen} options={{ title: 'Giỏ hàng' }} />
      <Tab.Screen name="Orders" component={OrdersScreen} options={{ title: 'Đơn hàng' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Tài khoản' }} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const user = useAuthStore((state) => state.user);
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.ink,
        headerTitleStyle: { fontWeight: '800' },
        contentStyle: { backgroundColor: colors.bg }
      }}
    >
      {!user ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Đăng nhập' }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Đăng ký' }} />
          <Stack.Screen name="PaymentResult" component={PaymentResultScreen} options={{ title: 'Kết quả thanh toán' }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Main" component={Tabs} options={{ headerShown: false }} />
          <Stack.Screen name="PaymentResult" component={PaymentResultScreen} options={{ title: 'Kết quả thanh toán' }} />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Chi tiết sản phẩm' }} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Thanh toán' }} />
          <Stack.Screen name="OrderDetail" component={OrderDetailScreen} options={{ title: 'Chi tiết đơn hàng' }} />
          <Stack.Screen name="Review" component={ReviewScreen} options={{ title: 'Đánh giá' }} />
          <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Yêu thích' }} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Thông báo' }} />
          <Stack.Screen name="Addresses" component={AddressScreen} options={{ title: 'Địa chỉ giao hàng' }} />
          <Stack.Screen name="Services" component={ServicesScreen} options={{ title: 'Dịch vụ' }} />
          <Stack.Screen name="ServiceBooking" component={ServiceBookingScreen} options={{ title: 'Đặt lịch dịch vụ' }} />
        </>
      )}
    </Stack.Navigator>
  );
}
