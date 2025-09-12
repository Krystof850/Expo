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

export default function OnboardingQuestion5() {
  const insets = useSafeAreaInsets();
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
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

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNext = async () => {
    if (!selectedAnswer) return;
    
    // Run header exit animation first, then content exit animation
    headerRef.current?.runExitAnimation(() => {
      animationRef.current?.runExitAnimation(async () => {
        try {
          // Uložit odpověď
          await AsyncStorage.setItem('onboarding_task_difficulty', selectedAnswer);
          // Přejít na další otázku
          router.push('/(onboarding)/question6');
        } catch (error) {
          console.log('Error saving task difficulty answer:', error);
          router.push('/(onboarding)/question6');
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
        step={5} 
        total={10} 
        questionLabel="Question 5"
      />
      
      {/* Animated page wrapper for smooth transitions */}
      <AnimatedQuestionPage ref={animationRef}>
        {/* Střední obsah - otázka a odpovědi s animací */}
        <View style={styles.content}>
          <AnimatedContent delay={100}>
            <View style={styles.questionSection}>
              <TitleText animated={false}>Do you find it harder now to finish simple tasks that used to feel easy?</TitleText>
              <DescriptionText animated={false} style={styles.subtextStyle}>
                This helps us to understand your situation
              </DescriptionText>
            </View>
          </AnimatedContent>
          
          <AnimatedContent delay={300}>
            <View style={styles.fullBleed}>
              <View style={styles.answersSection}>
                <SelectButton
                  title="Yes"
                selected={selectedAnswer === 'Yes'}
                onPress={() => handleAnswerSelect('Yes')}
              />

              <SelectButton
                title="No"
                selected={selectedAnswer === 'No'}
                onPress={() => handleAnswerSelect('No')}
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
          disabled={!selectedAnswer}
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
    paddingTop: 40, // Reduced from 60 - moves main content higher up the page
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