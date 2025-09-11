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
            <Text style={styles.questionLabel}>Question 1</Text>
            <Text style={styles.questionText}>What is your gender?</Text>
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
                Male
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
                Female
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
    paddingHorizontal: 32,
    paddingTop: 120,
    paddingBottom: 60,
  },
  questionContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  questionLabel: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  answersContainer: {
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  answerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 50,
    alignItems: 'center',
  },
  answerButtonSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderColor: 'rgba(255, 255, 255, 0.5)',
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
    marginTop: 60,
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