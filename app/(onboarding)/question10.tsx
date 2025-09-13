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
import * as Haptics from 'expo-haptics';

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
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
                <TitleText animated={false}>Finally, a little more about you</TitleText>
              </View>
            </AnimatedContent>
            
            <AnimatedContent delay={300}>
              <View style={styles.fullBleed}>
                <View style={styles.inputsSection}>
                  <TextInput
                    style={styles.input}
                    placeholder="Name"
                    placeholderTextColor={COLORS.descriptionText}
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    maxLength={50}
                  />
                  
                  <TextInput
                    style={styles.input}
                    placeholder="Age"
                    placeholderTextColor={COLORS.descriptionText}
                    value={age}
                    onChangeText={setAge}
                    keyboardType="numeric"
                    maxLength={3}
                  />
                </View>
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
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: SPACING.page,
    paddingTop: 8, // Consistent with other questions
    paddingBottom: 120, // Space for Next button to prevent overlap
  },
  questionSection: {
    width: '100%',
    maxWidth: 384, // max-w-sm (384px)
    alignItems: 'flex-start',
    marginBottom: 28, // Consistent spacing with other questions
  },
  fullBleed: {
    marginHorizontal: -SPACING.page, // Cancel parent padding to achieve full screen width
    alignSelf: 'stretch',
  },
  inputsSection: {
    width: '80%',
    alignSelf: 'center',
    gap: 12, // Same gap as answer cards
  },
  input: {
    backgroundColor: COLORS.selectButton.background, // Same as SelectButton
    borderWidth: 2,
    borderColor: COLORS.selectButton.border, // Same as SelectButton
    borderRadius: 50, // Same rounded style as SelectButton
    paddingVertical: 16, // Same as SPACING.button
    paddingHorizontal: 32, // Same as SelectButton padding
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.mainText,
    textAlign: 'center', // Center text like SelectButton
    width: '100%', // Full width like SelectButton
  },
  nextContainer: {
    paddingHorizontal: SPACING.page,
    zIndex: 10,
  },
});