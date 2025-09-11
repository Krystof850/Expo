import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
// Debug routing logic with console logs

export default function Index() {
  const { user, loading } = useAuth();
  const [appStep, setAppStep] = useState<'loading' | 'welcome' | 'onboarding' | 'auth' | 'protected'>('loading');

  useEffect(() => {
    determineAppStep();
  }, []);

  const determineAppStep = async () => {
    try {
      console.log('📥 FORCE RESET: Clearing old flow data...');
      
      // VYMAZAT VŠECHNA STARÁ DATA - každý user začíná od začátku
      await AsyncStorage.multiRemove([
        'hasSeenAllWelcomes',
        'hasSeenSecondWelcome', 
        'onboarding_complete',
        'onboarding_gender',
        'onboarding_age'
      ]);
      
      console.log('✅ All flow data cleared - starting fresh!');
      console.log('🌟 EVERY USER MUST START FROM WELCOME');
      
      // KAŽDÝ uživatel VZDY začíná od welcome
      setAppStep('welcome');
      
    } catch (error) {
      console.log('Error clearing app data:', error);
      // Při chybě začni od welcome
      setAppStep('welcome');
    }
  };

  // Zobrazit loading dokud se neurčí krok
  if (loading || appStep === 'loading') {
    return null;
  }

  // PEVNÝ FLOW - každý musí projít vše po pořadě
  switch (appStep) {
    case 'welcome':
      return <Redirect href="/welcome" />;
    
    case 'onboarding':
      return <Redirect href="/(onboarding)/question1" />;
    
    case 'auth':
      return <Redirect href="/(auth)/sign-in" />;
    
    case 'protected':
      return <Redirect href="/(protected)" />;
    
    default:
      // Fallback na začátek
      return <Redirect href="/welcome" />;
  }
}