import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  BackHandler,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingHeader, OnboardingHeaderRef } from '../../components/OnboardingHeader';
import { AnimatedQuestionPage, AnimatedContent, AnimatedQuestionPageRef } from '../../components/AnimatedQuestionPage';
import { NextButton } from '../../components/Button';
import { TitleText, DescriptionText } from '../../components/Text';
import AppBackground from '../../components/AppBackground';
import { COLORS, SPACING } from '../../constants/theme';

export default function OnboardingQuestion10() {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const animationRef = useRef<AnimatedQuestionPageRef>(null);
  const headerRef = useRef<OnboardingHeaderRef>(null);

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
    
    // Run header exit animation first, then content exit animation
    headerRef.current?.runExitAnimation(() => {
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
    });
  };

  const isFormValid = name.trim().length > 0 && age.trim().length > 0;

  return (
    <AppBackground>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
      {/* Header s progress barem - with exit animation */}
      <OnboardingHeader 
        ref={headerRef}
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
                <TitleText animated={false}>Finally</TitleText>
                <DescriptionText animated={false}>A little more about you</DescriptionText>
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
        <NextButton
          title="Complete Quiz"
          onPress={handleComplete}
          disabled={!isFormValid}
        />
      </View>
    </KeyboardAvoidingView>
    </AppBackground>
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
});