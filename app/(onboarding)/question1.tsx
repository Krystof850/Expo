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

export default function OnboardingQuestion1() {
  const insets = useSafeAreaInsets();
  const [selectedGender, setSelectedGender] = useState<string>('');

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

  const handleGenderSelect = (gender: string) => {
    setSelectedGender(gender);
  };

  const handleNext = async () => {
    if (!selectedGender) return;
    
    try {
      // Uložit odpověď
      await AsyncStorage.setItem('onboarding_gender', selectedGender);
      // Přejít na další otázku
      router.push('/(onboarding)/question2');
    } catch (error) {
      console.log('Error saving gender:', error);
      router.push('/(onboarding)/question2');
    }
  };

  return (
    <View style={styles.container}>
      <OnboardingHeader 
        step={1} 
        total={2} 
        questionLabel="Question 1"
      />
      
      <View style={styles.content}>
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>What is your gender?</Text>
        </View>
        
        <View style={styles.answersContainer}>
          <TouchableOpacity
            style={[
              styles.answerButton,
              selectedGender === 'Male' && styles.answerButtonSelected
            ]}
            onPress={() => handleGenderSelect('Male')}
            activeOpacity={0.8}
          >
            <Text style={styles.answerText}>Male</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.answerButton,
              selectedGender === 'Female' && styles.answerButtonSelected
            ]}
            onPress={() => handleGenderSelect('Female')}
            activeOpacity={0.8}
          >
            <Text style={styles.answerText}>Female</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={[styles.nextContainer, { bottom: insets.bottom + SPACING.page }]}>
        <TouchableOpacity 
          style={[
            styles.nextButton,
            !selectedGender && styles.nextButtonDisabled
          ]}
          onPress={handleNext}
          disabled={!selectedGender}
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