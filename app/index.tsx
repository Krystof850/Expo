import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
// TEMPORARY reset completed - cleaned app data

export default function Index() {
  const { user, loading } = useAuth();
  const [hasSeenAllWelcomes, setHasSeenAllWelcomes] = useState<boolean | null>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    checkAppStatus();
  }, []);

  const checkAppStatus = async () => {
    try {
      const welcomed = await AsyncStorage.getItem('hasSeenAllWelcomes');
      const onboardingCompleted = await AsyncStorage.getItem('onboarding_complete');
      setHasSeenAllWelcomes(welcomed === 'true');
      setHasCompletedOnboarding(onboardingCompleted === 'true');
    } catch (error) {
      console.log('Error checking app status:', error);
      setHasSeenAllWelcomes(false);
      setHasCompletedOnboarding(false);
    }
  };

  // Zobrazit loading dokud se nenačte auth stav a status
  if (loading || hasSeenAllWelcomes === null || hasCompletedOnboarding === null) {
    return null;
  }

  // Pokud uživatel ještě neviděl všechny welcome screens
  if (!hasSeenAllWelcomes) {
    return <Redirect href="/welcome" />;
  }

  // Pokud uživatel neviděl onboarding, přesměruj tam
  if (!hasCompletedOnboarding) {
    return <Redirect href="/(onboarding)/question1" />;
  }

  // Pokud je uživatel přihlášený, přesměruj na protected area
  if (user) {
    return <Redirect href="/(protected)" />;
  }

  // Jinak přesměruj na přihlášení
  return <Redirect href="/(auth)/sign-in" />;
}