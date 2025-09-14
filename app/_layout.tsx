import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from '@expo-google-fonts/poppins';
import { Stack, Redirect, router, usePathname } from 'expo-router';
import { StatusBar } from 'react-native';
import Constants from 'expo-constants';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '../src/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    // Poppins font family pro nový design
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });

  useEffect(() => {
    if (loaded) {
      // FORCE REDIRECT TO ROOT - aby se vždy spustil flow z index.tsx
      enforceRootNavigation();
    }
  }, [loaded]);

  const enforceRootNavigation = async () => {
    try {
      const pathname = window?.location?.pathname || '/';
      const onboardingCompleted = await AsyncStorage.getItem('onboarding_complete');
      
      console.log('🔧 Layout: Checking flow...', { pathname, onboardingCompleted });
      
      // Povolené routes pro nekompletní flow
      const allowedRoutes = [
        '/'
      ];
      const isOnboardingRoute = pathname.startsWith('/(onboarding)') || pathname.includes('/question');
      const isAllowedRoute = allowedRoutes.includes(pathname) || isOnboardingRoute;
      
      // Pokud flow není dokončený a user není na povolené route
      const flowIncomplete = !onboardingCompleted || onboardingCompleted !== 'true';
      
      if (flowIncomplete && !isAllowedRoute) {
        console.log('🚫 Layout: Flow incomplete, user on forbidden route, redirecting to /');
        setTimeout(() => router.replace('/'), 100);
      } else {
        console.log('✅ Layout: Route allowed or flow complete');
      }
    } catch (error) {
      console.log('⚠️ Layout: Error, redirecting to root:', error);
      setTimeout(() => router.replace('/'), 100);
    }
  };

  if (!loaded) {
    return null;
  }

  // Základní app wrapper bez Superwall (pro Expo Go kompatibilitu)
  const AppContent = () => (
    <SafeAreaProvider>
      <StatusBar translucent={false} backgroundColor="transparent" barStyle="light-content" />
      <AuthProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
              animationDuration: 300,
              fullScreenGestureEnabled: true,
              gestureDirection: 'horizontal',
            }}
          >
            <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(protected)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );

  return <AppContent />;
}