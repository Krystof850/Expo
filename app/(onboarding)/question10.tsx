import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingHeader } from '../../components/OnboardingHeader';
import { AnimatedQuestionPage, AnimatedContent, AnimatedQuestionPageRef } from '../../components/AnimatedQuestionPage';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants/theme';

export default function OnboardingQuestion10() {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const animationRef = useRef<AnimatedQuestionPageRef>(null);

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

  const handleComplete = async () => {
    if (!name.trim() || !age.trim()) return;
    
    // Run exit animation before navigation
    animationRef.current?.runExitAnimation(async () => {
      try {
        // Uložit odpovědi
        await AsyncStorage.setItem('onboarding_name', name.trim());
        await AsyncStorage.setItem('onboarding_age', age.trim());
        // Přejít na waiting screen
        router.push('/(onboarding)/waiting');
      } catch (error) {
        console.log('Error saving name and age:', error);
        router.push('/(onboarding)/waiting');
      }
    });
  };

  const isFormValid = name.trim().length > 0 && age.trim().length > 0;

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {/* Header s progress barem - static, no animation */}
      <OnboardingHeader 
        step={10} 
        total={10} 
        questionLabel="Question 10"
      />
      
      {/* Animated page wrapper for smooth transitions */}
      <AnimatedQuestionPage ref={animationRef}>
        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <AnimatedContent delay={100}>
              <View style={styles.questionSection}>
                <Text style={styles.titleText}>Finally</Text>
                <Text style={styles.subtitleText}>A little more about you</Text>
              </View>
            </AnimatedContent>
            
            <AnimatedContent delay={300}>
              <View style={styles.inputsSection}>
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  placeholderTextColor={COLORS.questionLabel}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  maxLength={50}
                />
                
                <TextInput
                  style={styles.input}
                  placeholder="Age"
                  placeholderTextColor={COLORS.questionLabel}
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                  maxLength={3}
                />
              </View>
            </AnimatedContent>
          </View>
        </ScrollView>
        
      </AnimatedQuestionPage>
      
      {/* Next button - OUTSIDE of animation wrapper */}
      <View style={[styles.nextContainer, { paddingBottom: insets.bottom + SPACING.page }]}>
        <TouchableOpacity 
          style={[
            styles.nextButton,
            !isFormValid && styles.nextButtonDisabled
          ]}
          onPress={handleComplete}
          disabled={!isFormValid}
        >
          <Text style={styles.nextButtonText}>Complete Quiz</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  content: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: SPACING.page,
    paddingTop: 40,
    paddingBottom: 20,
  },
  questionSection: {
    width: '100%',
    maxWidth: 384,
    alignItems: 'center',
    marginBottom: 32,
  },
  titleText: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.mainText,
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitleText: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.questionLabel,
    textAlign: 'center',
    lineHeight: 22,
  },
  inputsSection: {
    width: '100%',
    maxWidth: 384,
    gap: 16,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 24,
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.mainText,
    textAlign: 'left',
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