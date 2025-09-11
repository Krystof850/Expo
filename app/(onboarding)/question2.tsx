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

export default function OnboardingQuestion2() {
  const insets = useSafeAreaInsets();
  const [selectedAge, setSelectedAge] = useState<string>('');

  const ageOptions = [
    { label: '18-25', value: '18-25' },
    { label: '26-35', value: '26-35' },
    { label: '36-45', value: '36-45' },
    { label: '46-55', value: '46-55' },
    { label: '56+', value: '56+' }
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

  const handleAgeSelect = (age: string) => {
    setSelectedAge(age);
  };

  const handleNext = async () => {
    if (!selectedAge) return;
    
    try {
      // Uložit odpověď
      await AsyncStorage.setItem('onboarding_age', selectedAge);
      // Přejít na další otázku
      router.push('/(onboarding)/question3');
    } catch (error) {
      console.log('Error saving age:', error);
      router.push('/(onboarding)/question3');
    }
  };

  return (
    <View style={styles.container}>
      <OnboardingHeader 
        step={2} 
        total={3} 
        questionLabel="Question 2"
      />
      
      <View style={styles.content}>
        <View style={styles.questionSection}>
          <Text style={styles.questionText}>How old are you?</Text>
        </View>
        
        <View style={styles.answersSection}>
          {ageOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.answerButton,
                selectedAge === option.value && styles.answerButtonSelected
              ]}
              onPress={() => handleAgeSelect(option.value)}
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
            !selectedAge && styles.nextButtonDisabled
          ]}
          onPress={handleNext}
          disabled={!selectedAge}
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