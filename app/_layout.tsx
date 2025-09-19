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
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import { ActivityIndicator, View, Platform } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '../src/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import ConditionalSuperwallProvider from '../src/components/ConditionalSuperwallProvider';
import SuperwallIntegration from '../src/components/SuperwallIntegration';
import { ErrorProvider } from '../src/components/UserFriendlyErrorHandler';

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
      const onboardingCompleted = await AsyncStorage.getItem('onboarding_complete');
      console.log('🔧 Layout: Checking onboarding flow...', { onboardingCompleted });
      // Note: Route checking will be handled by the AuthProvider and individual screens
      // This prevents render-time side effects causing React errors
    } catch (error) {
      console.log('⚠️ Layout: Error checking onboarding:', error);
    }
  };

  if (!loaded) {
    return null;
  }

  return (
    <ConditionalSuperwallProvider>
      <AuthProvider>
        <SuperwallIntegration>
          <ErrorProvider>
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
            <StatusBar style="auto" />
          </ThemeProvider>
        </ErrorProvider>
        </SuperwallIntegration>
      </AuthProvider>
    </ConditionalSuperwallProvider>
  );

}