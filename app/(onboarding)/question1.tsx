import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OnboardingQuestion1() {
  const [selectedGender, setSelectedGender] = useState<string>('');

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
      {/* Hlavní obsah */}
      <View style={styles.content}>
          {/* Otázka */}
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>Question 1: What is your gender?</Text>
          </View>

          {/* Odpovědi */}
          <View style={styles.answersContainer}>
            <TouchableOpacity
              style={[
                styles.answerButton,
                selectedGender === 'Male' && styles.answerButtonSelected
              ]}
              onPress={() => handleGenderSelect('Male')}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.answerText,
                selectedGender === 'Male' && styles.answerTextSelected
              ]}>
                1. Male
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.answerButton,
                selectedGender === 'Female' && styles.answerButtonSelected
              ]}
              onPress={() => handleGenderSelect('Female')}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.answerText,
                selectedGender === 'Female' && styles.answerTextSelected
              ]}>
                2. Female
              </Text>
            </TouchableOpacity>
          </View>

          {/* Next tlačítko */}
          <View style={styles.nextContainer}>
            <TouchableOpacity
              style={[
                styles.nextButton,
                !selectedGender && styles.nextButtonDisabled
              ]}
              onPress={handleNext}
              disabled={!selectedGender}
              activeOpacity={0.9}
            >
              <Text style={[
                styles.nextButtonText,
                !selectedGender && styles.nextButtonTextDisabled
              ]}>
                Next
              </Text>
            </TouchableOpacity>
          </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 100,
    paddingBottom: 50,
  },
  questionContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  questionText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 40,
    letterSpacing: -0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  answersContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 32,
    paddingHorizontal: 32,
  },
  answerButton: {
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(56, 189, 248, 0.5)',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 50,
    alignItems: 'center',
  },
  answerButtonSelected: {
    backgroundColor: 'rgba(56, 189, 248, 0.4)',
    borderColor: 'rgba(56, 189, 248, 0.8)',
  },
  answerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  answerTextSelected: {
    color: '#ffffff',
    fontWeight: '700',
  },
  nextContainer: {
    marginTop: 40,
  },
  nextButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    shadowOpacity: 0,
    elevation: 0,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E40AF',
  },
  nextButtonTextDisabled: {
    color: 'rgba(30, 64, 175, 0.5)',
  },
});