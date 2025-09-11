import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OnboardingQuestion2() {
  const [selectedAge, setSelectedAge] = useState<string>('');

  const handleAgeSelect = (age: string) => {
    setSelectedAge(age);
  };

  const handleNext = async () => {
    if (!selectedAge) return;
    
    try {
      await AsyncStorage.setItem('onboarding_age', selectedAge);
      // Mark onboarding as completed
      await AsyncStorage.setItem('onboarding_complete', 'true');
      router.push('/(auth)/sign-in');
    } catch (error) {
      console.log('Error saving age:', error);
      // Mark onboarding as completed even on error
      await AsyncStorage.setItem('onboarding_complete', 'true');
      router.push('/(auth)/sign-in');
    }
  };

  const ageOptions = [
    { label: '1. 18-25', value: '18-25' },
    { label: '2. 26-35', value: '26-35' },
    { label: '3. 36-45', value: '36-45' },
    { label: '4. 46-55', value: '46-55' },
    { label: '5. 56+', value: '56+' }
  ];

  return (
    <View style={styles.container}>
      {/* Hlavní obsah */}
      <View style={styles.content}>
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>Question 2: How old are you?</Text>
          </View>

          <View style={styles.answersContainer}>
            {ageOptions.map((ageOption) => (
              <TouchableOpacity
                key={ageOption.value}
                style={[
                  styles.answerButton,
                  selectedAge === ageOption.value && styles.answerButtonSelected
                ]}
                onPress={() => handleAgeSelect(ageOption.value)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.answerText,
                  selectedAge === ageOption.value && styles.answerTextSelected
                ]}>
                  {ageOption.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.nextContainer}>
            <TouchableOpacity
              style={[
                styles.nextButton,
                !selectedAge && styles.nextButtonDisabled
              ]}
              onPress={handleNext}
              disabled={!selectedAge}
              activeOpacity={0.9}
            >
              <Text style={[
                styles.nextButtonText,
                !selectedAge && styles.nextButtonTextDisabled
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
    fontSize: 16,
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