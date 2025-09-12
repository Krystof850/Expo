import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  BackHandler,
  Platform,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingHeader, OnboardingHeaderRef } from '../../components/OnboardingHeader';
import { AnimatedQuestionPage, AnimatedContent, AnimatedQuestionPageRef } from '../../components/AnimatedQuestionPage';
import { SelectButton, NextButton } from '../../components/Button';
import { TitleText, DescriptionText } from '../../components/Text';
import AppBackground from '../../components/AppBackground';
import { SPACING } from '../../constants/theme';

export default function OnboardingQuestion7() {
  const insets = useSafeAreaInsets();
  const [selectedTrigger, setSelectedTrigger] = useState<string>('');
  const animationRef = useRef<AnimatedQuestionPageRef>(null);
  const headerRef = useRef<OnboardingHeaderRef>(null);

  const triggerOptions = [
    { label: "Don't know where to start", value: 'no_start_place' },
    { label: "Don't have the energy", value: 'no_energy' },
    { label: "Don't know how to start", value: 'no_know_how' },
    { label: 'Other reasons', value: 'other' }
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

  const handleTriggerSelect = (trigger: string) => {
    setSelectedTrigger(trigger);
  };

  const handleNext = async () => {
    if (!selectedTrigger) return;
    
    // Run header exit animation first, then content exit animation
    headerRef.current?.runExitAnimation(() => {
      animationRef.current?.runExitAnimation(async () => {
        try {
          // Uložit odpověď
          await AsyncStorage.setItem('onboarding_main_trigger', selectedTrigger);
          // Přejít na další otázku
          router.push('/(onboarding)/question8');
        } catch (error) {
          console.log('Error saving main trigger answer:', error);
          router.push('/(onboarding)/question8');
        }
      });
    });
  };

  return (
    <AppBackground>
      <View style={styles.container}>
      {/* Header s progress barem - with exit animation */}
      <OnboardingHeader 
        ref={headerRef}
        step={7} 
        total={10} 
        questionLabel="Question 7"
      />
      
      {/* Animated page wrapper for smooth transitions */}
      <AnimatedQuestionPage ref={animationRef}>
        {/* Střední obsah - otázka a odpovědi s animací */}
        <View style={styles.content}>
          <AnimatedContent delay={100}>
            <View style={styles.questionSection}>
              <TitleText animated={false}>What do you think is your main trigger to start procrastinating?</TitleText>
              <DescriptionText animated={false} style={styles.subtextStyle}>
                This helps us to understand your situation
              </DescriptionText>
            </View>
          </AnimatedContent>
          
          <AnimatedContent delay={300}>
            <View style={styles.fullBleed}>
              <View style={styles.answersSection}>
                {triggerOptions.map((option) => (
                <SelectButton
                  key={option.value}
                  title={option.label}
                  selected={selectedTrigger === option.value}
                  onPress={() => handleTriggerSelect(option.value)}
                  />
                ))}
              </View>
            </View>
          </AnimatedContent>
        </View>
        
      </AnimatedQuestionPage>
      
      {/* Next button - OUTSIDE of animation wrapper */}
      <View style={[styles.nextContainer, { paddingBottom: insets.bottom + SPACING.page }]}>
        <NextButton
          title="Next"
          onPress={handleNext}
          disabled={!selectedTrigger}
        />
      </View>
    </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: SPACING.page,
    paddingTop: 60, // Fixed positioning from top for consistent layout
  },
  questionSection: {
    width: '100%',
    maxWidth: 384,
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  subtextStyle: {
    marginTop: 8, // Professional spacing below main question
    textAlign: 'left' as const,
    // Override description text styling to be basic
    textShadowColor: 'transparent',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
    shadowOpacity: 0,
    elevation: 0,
  },
  fullBleed: {
    marginHorizontal: -SPACING.page, // Cancel parent padding to achieve full screen width
    alignSelf: 'stretch',
  },
  answersSection: {
    width: '80%',
    alignSelf: 'center',
    gap: 16,
    paddingTop: 8, // Reduced from 16 - less space between subtext and first answer card
  },
  nextContainer: {
    paddingHorizontal: SPACING.page,
    zIndex: 10,
  },
});