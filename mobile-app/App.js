import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useAuthStore } from './src/store/authStore';
import { useFavoriteStore } from './src/store/favoriteStore';
import { colors } from './src/styles/theme';

const linking = {
  prefixes: ['http://localhost:8081', 'http://localhost:8082', 'carshop://'],
  config: {
    screens: {
      Login: 'login',
      Register: 'register',
      PaymentResult: 'payment-result',
      Main: {
        screens: {
          Home: '',
          Products: 'products',
          Cart: 'cart',
          Orders: 'orders',
          Profile: 'profile'
        }
      },
      ProductDetail: 'products/:type/:id',
      Checkout: 'checkout',
      OrderDetail: 'orders/:id'
    }
  }
};

export default function App() {
  const { bootstrap, bootstrapping } = useAuthStore();
  const loadFavorites = useFavoriteStore((state) => state.load);

  useEffect(() => {
    bootstrap();
    loadFavorites();
  }, []);

  if (bootstrapping) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        <View style={styles.appFrame}>
          <NavigationContainer linking={linking}>
            <StatusBar style="dark" />
            <AppNavigator />
          </NavigationContainer>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Platform.OS === 'web' ? '#dfe5ec' : colors.bg,
    alignItems: Platform.OS === 'web' ? 'center' : 'stretch',
    justifyContent: Platform.OS === 'web' ? 'center' : 'flex-start'
  },
  appFrame: {
    flex: 1,
    width: Platform.OS === 'web' ? '100%' : undefined,
    maxWidth: Platform.OS === 'web' ? 430 : undefined,
    minHeight: Platform.OS === 'web' ? '100vh' : undefined,
    maxHeight: Platform.OS === 'web' ? '100vh' : undefined,
    backgroundColor: colors.bg,
    overflow: Platform.OS === 'web' ? 'hidden' : 'visible',
    shadowColor: '#000',
    shadowOpacity: Platform.OS === 'web' ? 0.18 : 0,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 }
  }
});
