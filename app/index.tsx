import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';

export default function Index() {
  const { user, loading } = useAuth();
  const [hasSeenBothWelcomes, setHasSeenBothWelcomes] = useState<boolean | null>(null);

  useEffect(() => {
    checkWelcomeStatus();
  }, []);

  const checkWelcomeStatus = async () => {
    try {
      const welcomed = await AsyncStorage.getItem('hasSeenBothWelcomes');
      setHasSeenBothWelcomes(welcomed === 'true');
    } catch (error) {
      console.log('Error checking welcome status:', error);
      setHasSeenBothWelcomes(false);
    }
  };

  // Zobrazit loading dokud se nenačte auth stav a welcome status
  if (loading || hasSeenBothWelcomes === null) {
    return null;
  }

  // Pokud uživatel ještě neviděl obě welcome screens
  if (!hasSeenBothWelcomes) {
    return <Redirect href="/welcome" />;
  }

  // Pokud je uživatel přihlášený, přesměruj na protected area
  if (user) {
    return <Redirect href="/(protected)" />;
  }

  // Jinak přesměruj na přihlášení
  return <Redirect href="/(auth)/sign-in" />;
}