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

export default function OnboardingQuestion9() {
  const insets = useSafeAreaInsets();
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');

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

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNext = async () => {
    if (!selectedAnswer) return;
    
    try {
      // Uložit odpověď
      await AsyncStorage.setItem('onboarding_life_improvement', selectedAnswer);
      // Označit onboarding jako dokončený
      await AsyncStorage.setItem('onboarding_complete', 'true');
      // Přejít na auth
      router.replace('/(auth)/sign-in');
    } catch (error) {
      console.log('Error completing onboarding:', error);
      // I při chybě pokračovat
      router.replace('/(auth)/sign-in');
    }
  };

  return (
    <View style={styles.container}>
      <OnboardingHeader 
        step={9} 
        total={9} 
        questionLabel="Question 9"
      />
      
      <View style={styles.content}>
        <View style={styles.questionSection}>
          <Text style={styles.questionText}>Do you believe beating procrastination would make your life better and happier?</Text>
        </View>
        
        <View style={styles.answersSection}>
          <TouchableOpacity
            style={[
              styles.answerButton,
              selectedAnswer === 'Yes' && styles.answerButtonSelected
            ]}
            onPress={() => handleAnswerSelect('Yes')}
            activeOpacity={0.8}
          >
            <Text style={styles.answerText}>Yes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.answerButton,
              selectedAnswer === 'No' && styles.answerButtonSelected
            ]}
            onPress={() => handleAnswerSelect('No')}
            activeOpacity={0.8}
          >
            <Text style={styles.answerText}>No</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={[styles.nextContainer, { paddingBottom: insets.bottom + SPACING.page }]}>
        <TouchableOpacity 
          style={[
            styles.nextButton,
            !selectedAnswer && styles.nextButtonDisabled
          ]}
          onPress={handleNext}
          disabled={!selectedAnswer}
        >
          <Text style={styles.nextButtonText}>Complete</Text>
        </TouchableOpacity>
      </View>
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