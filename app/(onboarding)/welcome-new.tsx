import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  BackHandler,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatedQuestionPage, AnimatedContent, AnimatedQuestionPageRef } from '../../components/AnimatedQuestionPage';
import { NextButton } from '../../components/Button';
import { TitleText } from '../../components/Text';
import AppBackground from '../../components/AppBackground';
import { SPACING } from '../../constants/theme';
import * as Haptics from 'expo-haptics';
import TypeWriterEffect from 'react-native-typewriter-effect';

export default function WelcomeNewScreen() {
  const insets = useSafeAreaInsets();
  const animationRef = useRef<AnimatedQuestionPageRef>(null);

  // Block hardware back button on Android only
  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS !== 'android') {
        return; // BackHandler only works on Android
      }
      
      const onBackPress = () => {
        return true; // Block hardware back
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription?.remove();
    }, [])
  );

  const handleStartQuiz = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Run content exit animation
    animationRef.current?.runExitAnimation(() => {
      router.push('/(onboarding)/question1');
    });
  };

  return (
    <AppBackground>
      <View style={styles.container}>
        {/* Animated content wrapper for smooth transitions */}
        <AnimatedQuestionPage ref={animationRef}>
          <View style={styles.content}>
            <AnimatedContent delay={100}>
              <View style={styles.welcomeSection}>
                <TitleText animated={false} style={styles.title}>
                  Welcome!
                </TitleText>
              </View>
            </AnimatedContent>
            
            <View style={styles.textSection}>
              <TypeWriterEffect
                content="Let's start by finding out if you have a problem with procrastination."
                maxDelay={50}
                minDelay={30}
                style={styles.typingText}
                onEnd={() => console.log('Typing animation completed')}
              />
            </View>
          </View>
        </AnimatedQuestionPage>
        
        {/* Start Quiz button - OUTSIDE of animation wrapper */}
        <View style={[styles.nextContainer, { paddingBottom: insets.bottom + SPACING.page }]}>
          <NextButton
            title="Start Quiz >"
            onPress={handleStartQuiz}
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
    paddingTop: 8,
    paddingBottom: 120, // Space for Next button to prevent overlap
  },
  welcomeSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 48, // Increased spacing for better visual balance
  },
  title: {
    textAlign: 'center',
  },
  textSection: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: SPACING.small,
  },
  typingText: {
    fontSize: 20, // text-xl
    fontWeight: '600', // font-semibold  
    color: '#DBEAFE', // text-blue-100 equivalent (matching quiz questions)
    textAlign: 'center',
    lineHeight: 28,
    maxWidth: 400, // Wider boundary to prevent word breaking
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  nextContainer: {
    paddingHorizontal: SPACING.page,
    zIndex: 10,
  },
});