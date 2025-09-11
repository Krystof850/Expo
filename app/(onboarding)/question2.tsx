import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
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

  // Blokování hardware back button
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true; // Blokuje hardware back
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
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
      // Označit onboarding jako dokončený
      await AsyncStorage.setItem('onboarding_completed', 'true');
      // Přejít na auth
      router.replace('/(auth)/sign-in');
    } catch (error) {
      console.log('Error saving age:', error);
      // I při chybě pokračovat
      router.replace('/(auth)/sign-in');
    }
  };

  return (
    <View style={styles.container}>
      <OnboardingHeader 
        step={2} 
        total={2} 
        questionLabel="Question 2"
      />
      
      <View style={styles.content}>
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>How old are you?</Text>
        </View>
        
        <View style={styles.answersContainer}>
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
      
      <View style={[styles.nextContainer, { bottom: insets.bottom + SPACING.page }]}>
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
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.page,
    marginTop: -64, // Offset to center content properly
  },
  questionContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  questionText: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.mainText,
    textAlign: 'center',
    lineHeight: 32,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  answersContainer: {
    gap: SPACING.small,
    paddingHorizontal: 0,
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
    backgroundColor: COLORS.answerButtonHover,
    borderColor: COLORS.primaryAction,
  },
  answerText: {
    ...TYPOGRAPHY.answerText,
  },
  nextContainer: {
    position: 'absolute',
    left: SPACING.page,
    right: SPACING.page,
  },
  nextButton: {
    backgroundColor: COLORS.mainText,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 50,
    alignItems: 'center',
    shadowColor: 'rgba(255, 255, 255, 0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 8,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    ...TYPOGRAPHY.nextButton,
  },
});