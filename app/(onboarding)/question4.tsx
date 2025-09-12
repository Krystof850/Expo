import React, { useState, useRef } from 'react';
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
import { AnimatedQuestionPage, AnimatedContent, AnimatedQuestionPageRef } from '../../components/AnimatedQuestionPage';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants/theme';

export default function OnboardingQuestion4() {
  const insets = useSafeAreaInsets();
  const [selectedFrequency, setSelectedFrequency] = useState<string>('');
  const animationRef = useRef<AnimatedQuestionPageRef>(null);

  const frequencyOptions = [
    { label: 'Never', value: 'never' },
    { label: '1-3 times', value: '1-3' },
    { label: '4-7 times', value: '4-7' },
    { label: '8+ times', value: '8+' }
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
    
    // Run exit animation before navigation
    animationRef.current?.runExitAnimation(async () => {
      try {
        // Uložit odpověď
        await AsyncStorage.setItem('onboarding_daily_procrastination', selectedFrequency);
        // Přejít na další otázku
        router.push('/(onboarding)/question5');
      } catch (error) {
        console.log('Error saving daily procrastination frequency:', error);
        router.push('/(onboarding)/question5');
      }
    });
  };

  return (
    <View style={styles.container}>
      {/* Header s progress barem - static, no animation */}
      <OnboardingHeader 
        step={4} 
        total={10} 
        questionLabel="Question 4"
      />
      
      {/* Animated page wrapper for smooth transitions */}
      <AnimatedQuestionPage ref={animationRef}>
        {/* Střední obsah - otázka a odpovědi s animací */}
        <View style={styles.content}>
          <AnimatedContent delay={100}>
            <View style={styles.questionSection}>
              <Text style={styles.questionText}>How many times a day do you catch yourself procrastinating on tasks that matter?</Text>
            </View>
          </AnimatedContent>
          
          <AnimatedContent delay={300}>
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
          </AnimatedContent>
        </View>
        
        {/* Next tlačítko dole s animací */}
        <AnimatedContent delay={500}>
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
        </AnimatedContent>
      </AnimatedQuestionPage>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.page,
    marginTop: -64,
  },
  questionSection: {
    width: '100%',
    maxWidth: 384,
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
  },
  answersSection: {
    width: '100%',
    maxWidth: 384,
    gap: 16,
    paddingTop: 16,
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