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

export default function OnboardingQuestion1() {
  const insets = useSafeAreaInsets();
  const [selectedGender, setSelectedGender] = useState<string>('');

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
      {/* Header s progress barem */}
      <OnboardingHeader 
        step={1} 
        total={10} 
        questionLabel="Question 1"
      />
      
      {/* Střední obsah - otázka a odpovědi */}
      <View style={styles.content}>
        <View style={styles.questionSection}>
          <Text style={styles.questionText}>What is your gender?</Text>
        </View>
        
        <View style={styles.answersSection}>
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
      
      {/* Next tlačítko dole */}
      <View style={[styles.nextContainer, { paddingBottom: insets.bottom + SPACING.page }]}>
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
    backgroundColor: COLORS.answerButton, // bg-sky-400/20
    borderWidth: 2,
    borderColor: COLORS.answerButtonBorder, // border-sky-400/50
    paddingVertical: 16, // py-4
    paddingHorizontal: 32, // px-8
    borderRadius: 50, // rounded-full
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