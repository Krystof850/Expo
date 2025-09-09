import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SuperwallProvider, SuperwallLoading, SuperwallLoaded } from 'expo-superwall';
import Constants from 'expo-constants';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '../src/context/AuthContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Získej Superwall API klíč z konfigurace
  const extra = (Constants.expoConfig?.extra || {}) as Record<string, string>;
  const superwallApiKey = extra.SUPERWALL_API_KEY || process.env.SUPERWALL_API_KEY;

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <SuperwallProvider 
      apiKeys={{ 
        ios: superwallApiKey || '', 
        android: superwallApiKey || '' 
      }}
    >
      <SuperwallLoading>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      </SuperwallLoading>
      <SuperwallLoaded>
        <AuthProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(protected)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </AuthProvider>
      </SuperwallLoaded>
    </SuperwallProvider>
  );
}
