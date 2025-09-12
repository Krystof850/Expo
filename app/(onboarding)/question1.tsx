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

export default function OnboardingQuestion1() {
  const insets = useSafeAreaInsets();
  const [selectedGender, setSelectedGender] = useState<string>('');
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

  const handleGenderSelect = (gender: string) => {
    setSelectedGender(gender);
  };

  const handleNext = async () => {
    if (!selectedGender) return;
    
    // Run header exit animation first, then content exit animation
    headerRef.current?.runExitAnimation(() => {
      animationRef.current?.runExitAnimation(async () => {
        try {
          // Uložit odpověď
          await AsyncStorage.setItem('onboarding_gender', selectedGender);
          // Přejít na další otázku
          router.push('/(onboarding)/question2');
        } catch (error) {
          console.log('Error saving gender:', error);
          router.push('/(onboarding)/question2');
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
        step={1} 
        total={10} 
        questionLabel="Question 1"
      />
      
      {/* Animated content wrapper for smooth transitions */}
      <AnimatedQuestionPage ref={animationRef}>
        <View style={styles.content}>
          <AnimatedContent delay={100}>
            <View style={styles.questionSection}>
              <TitleText animated={false}>What is your gender?</TitleText>
              <DescriptionText animated={false} style={styles.subtextStyle}>
                This helps us to understand your situation
              </DescriptionText>
            </View>
          </AnimatedContent>
          
          <AnimatedContent delay={300}>
            <View style={styles.fullBleed}>
              <View style={styles.answersSection}>
                <SelectButton
                  title="Male"
                  selected={selectedGender === 'Male'}
                  onPress={() => handleGenderSelect('Male')}
                />

                <SelectButton
                  title="Female"
                  selected={selectedGender === 'Female'}
                  onPress={() => handleGenderSelect('Female')}
                />
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
          disabled={!selectedGender}
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
    justifyContent: 'center',
    paddingHorizontal: SPACING.page,
  },
  questionSection: {
    width: '100%',
    maxWidth: 384, // max-w-sm (384px)
    alignItems: 'flex-start',
    marginBottom: 32, // space-y-8 = 32px
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
    gap: 16, // space-y-4
    paddingTop: 16, // pt-4
  },
  nextContainer: {
    paddingHorizontal: SPACING.page,
    zIndex: 10,
  },
});