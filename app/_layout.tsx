import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from '@expo-google-fonts/poppins';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import { ActivityIndicator, View, Platform, LogBox, Text as RNText } from 'react-native';
import 'react-native-reanimated';

// OFICIÁLNÍ SUPERWALL IMPORTS podle example aplikace
import {
  SuperwallLoaded,
  SuperwallLoading,
  SuperwallProvider,
} from 'expo-superwall';

// Úplně potlač všechny yellow boxy a warnings
LogBox.ignoreAllLogs();

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '../src/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
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

  // OFICIÁLNÍ ZPŮSOB: API klíč z environment podle example aplikace
  const superwallApiKey = Constants.expoConfig?.extra?.SUPERWALL_API_KEY || process.env.EXPO_PUBLIC_SUPERWALL_API_KEY;
  console.log('[Superwall] Key prefix:', (superwallApiKey ?? '').slice(0,8));

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

  // OFICIÁLNÍ ZPŮSOB: Error handling pro chybějící API klíč
  if (!superwallApiKey) {
    console.error('[Superwall] CRITICAL: SUPERWALL_API_KEY is missing!');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
        <RNText style={{ fontSize: 18, color: '#dc2626', textAlign: 'center', paddingHorizontal: 20 }}>
          Superwall API Key Missing{"\n"}Please configure SUPERWALL_API_KEY
        </RNText>
      </View>
    );
  }

  return (
    <SuperwallProvider
      apiKeys={{ 
        ios: superwallApiKey,
        android: superwallApiKey // Use same key for both platforms
      }}
    >
        <SuperwallLoading>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
            <ActivityIndicator size="large" color="#2563eb" />
          </View>
        </SuperwallLoading>
        <SuperwallLoaded>
          <AuthProvider>
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
                  <Stack.Screen 
                    name="(onboarding)" 
                    options={{ 
                      headerShown: false, 
                      gestureEnabled: false, 
                      fullScreenGestureEnabled: false 
                    }} 
                  />
                  <Stack.Screen 
                    name="(tabs)" 
                    options={{ 
                      headerShown: false, 
                      gestureEnabled: false, 
                      fullScreenGestureEnabled: false 
                    }} 
                  />
                  <Stack.Screen 
                    name="(auth)" 
                    options={{ 
                      headerShown: false, 
                      gestureEnabled: false, 
                      fullScreenGestureEnabled: false 
                    }} 
                  />
                  <Stack.Screen 
                    name="(protected)" 
                    options={{ 
                      headerShown: false, 
                      gestureEnabled: false, 
                      fullScreenGestureEnabled: false 
                    }} 
                  />
                  {/* Hidden debug screen - pouze v dev módu */}
                  {__DEV__ && (
                    <Stack.Screen 
                      name="subscription-debug" 
                      options={{ 
                        headerShown: true, 
                        title: 'Subscription Debug'
                      }} 
                    />
                  )}
                  <Stack.Screen name="+not-found" />
                </Stack>
                <StatusBar style="auto" />
              </ThemeProvider>
            </ErrorProvider>
          </AuthProvider>
        </SuperwallLoaded>
      </SuperwallProvider>
  );

}