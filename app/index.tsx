import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
// Debug routing logic with console logs

export default function Index() {
  const { user, loading } = useAuth();
  const [appStep, setAppStep] = useState<'loading' | 'onboarding' | 'auth' | 'protected'>('loading');

  useEffect(() => {
    determineAppStep();
  }, []);

  const determineAppStep = async () => {
    try {
      console.log('📥 FORCE RESET: Clearing old flow data...');
      
      // VYMAZAT VŠECHNA STARÁ DATA - každý user začíná od začátku
      await AsyncStorage.multiRemove([
        'onboarding_complete',
        'onboarding_gender',
        'onboarding_scroll_distract',
        'onboarding_stuck_cycle',
        'onboarding_daily_procrastination',
        'onboarding_task_difficulty',
        'onboarding_delay_frequency',
        'onboarding_main_trigger',
        'onboarding_self_worth',
        'onboarding_life_improvement'
      ]);
      
      console.log('✅ All flow data cleared - starting fresh!');
      console.log('🌟 EVERY USER MUST START FROM ONBOARDING');
      
      // KAŽDÝ uživatel VZDY začíná od onboarding
      setAppStep('onboarding');
      
    } catch (error) {
      console.log('Error clearing app data:', error);
      // Při chybě začni od onboarding
      setAppStep('onboarding');
    }
  };

  // Zobrazit loading dokud se neurčí krok
  if (loading || appStep === 'loading') {
    return null;
  }

  // PEVNÝ FLOW - každý musí projít vše po pořadě
  switch (appStep) {
    case 'onboarding':
      return <Redirect href="/(onboarding)/question1" />;
    
    case 'auth':
      return <Redirect href="/(auth)/sign-in" />;
    
    case 'protected':
      return <Redirect href="/(protected)" />;
    
    default:
      // Fallback na začátek
      return <Redirect href="/(onboarding)/question1" />;
  }
}