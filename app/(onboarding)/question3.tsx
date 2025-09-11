import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
  Platform,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingHeader } from '../../components/OnboardingHeader';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants/theme';

export default function OnboardingQuestion3() {
  const insets = useSafeAreaInsets();
  const [selectedFrequency, setSelectedFrequency] = useState<string>('');

  const frequencyOptions = [
    { label: 'Never', value: 'never' },
    { label: 'Rarely', value: 'rarely' },
    { label: 'Sometimes', value: 'sometimes' },
    { label: 'Often', value: 'often' },
    { label: 'Almost always', value: 'almost_always' }
  ];

  // Blokování hardware back button pouze na Androidu
  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS !== 'android') {
        return; // BackHandler funguje pouze na Androidu
      }
      
      const onBackPress = () => {
        return true; // Blokuje hardware back
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription?.remove();
    }, [])
  );

  const handleFrequencySelect = (frequency: string) => {
    setSelectedFrequency(frequency);
  };

  const handleNext = async () => {
    if (!selectedFrequency) return;
    
    try {
      // Uložit odpověď
      await AsyncStorage.setItem('onboarding_procrastination', selectedFrequency);
      // Označit onboarding jako dokončený
      await AsyncStorage.setItem('onboarding_completed', 'true');
      // Přejít na auth
      router.replace('/(auth)/sign-in');
    } catch (error) {
      console.log('Error saving procrastination frequency:', error);
      // I při chybě pokračovat
      router.replace('/(auth)/sign-in');
    }
  };

  return (
    <View style={styles.container}>
      <OnboardingHeader 
        step={3} 
        total={3} 
        questionLabel="Question 3"
      />
      
      <View style={styles.content}>
        <View style={styles.questionSection}>
          <Text style={styles.questionText}>How often do you procrastinate on important tasks?</Text>
        </View>
        
        <View style={styles.answersSection}>
          {frequencyOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.answerButton,
                selectedFrequency === option.value && styles.answerButtonSelected
              ]}
              onPress={() => handleFrequencySelect(option.value)}
              activeOpacity={0.8}
            >
              <Text style={styles.answerText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={[styles.nextContainer, { paddingBottom: insets.bottom + SPACING.page }]}>
        <TouchableOpacity 
          style={[
            styles.nextButton,
            !selectedFrequency && styles.nextButtonDisabled
          ]}
          onPress={handleNext}
          disabled={!selectedFrequency}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between', // justify-between z HTML
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.page,
    marginTop: -64, // -mt-16 z HTML
  },
  questionSection: {
    width: '100%',
    maxWidth: 384, // max-w-sm (384px)
    alignItems: 'center',
    marginBottom: 32, // space-y-8 = 32px
  },
  questionText: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.mainText,
    textAlign: 'center',
    lineHeight: 32,
    letterSpacing: -0.5,
    // Removed textShadow for better web compatibility
  },
  answersSection: {
    width: '100%',
    maxWidth: 384, // max-w-sm
    gap: 16, // space-y-4
    paddingTop: 16, // pt-4
  },
  answerButton: {
    backgroundColor: COLORS.answerButton,
    borderWidth: 2,
    borderColor: COLORS.answerButtonBorder,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 50,
    alignItems: 'center',
  },
  answerButtonSelected: {
    backgroundColor: COLORS.answerButtonSelected,
    borderColor: COLORS.answerButtonBorder,
  },
  answerText: {
    ...TYPOGRAPHY.answerText,
  },
  nextContainer: {
    paddingHorizontal: SPACING.page,
    zIndex: 10,
  },
  nextButton: {
    backgroundColor: COLORS.nextButton,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    ...TYPOGRAPHY.nextButton,
  },
});