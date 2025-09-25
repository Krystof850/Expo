import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  BackHandler,
  Platform,
} from 'react-native';
import { router, Redirect } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { AnimatedQuestionPage, AnimatedContent, AnimatedQuestionPageRef } from '../../components/AnimatedQuestionPage';
import { NextButton } from '../../components/Button';
import { TitleText } from '../../components/Text';
import AppBackground from '../../components/AppBackground';
import { SPACING } from '../../constants/theme';
import * as Haptics from 'expo-haptics';
import TypeWriterEffect from 'react-native-typewriter-effect';
import { useAuth } from '../../src/context/AuthContext';
import { markFirstTimeComplete } from '../../src/utils/firstTimeUser';

export default function WelcomeFirstTimeScreen() {
  const { user, loading } = useAuth();
  const insets = useSafeAreaInsets();
  const animationRef = useRef<AnimatedQuestionPageRef>(null);

  // Mark first time as complete when this screen loads
  useEffect(() => {
    markFirstTimeComplete();
  }, []);

  // Block hardware back button on Android only - MUST be called before conditional returns
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

  // Conditional renders AFTER all hooks are called
  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  if (loading) {
    return null; // Show nothing while loading
  }

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
            {/* Logo section - fixed at top with safe area */}
            <View style={[styles.logoSection, { paddingTop: insets.top + 20 }]}>
              <Image
                source={require('../../assets/images/unloop-logo-new.png')}
                style={styles.logo}
                contentFit="contain"
              />
            </View>
            
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
        
        {/* Button - OUTSIDE of animation wrapper - Only Start Quiz button for first-time users */}
        <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + SPACING.page }]}>
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
  },
  logoSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  logo: {
    width: 180,
    height: 180,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 48,
  },
  textSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    flex: 0,
  },
  typingText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#DBEAFE',
    textAlign: 'center',
    lineHeight: 26,
    minHeight: 60, // Reserve space for the typing effect
  },
  buttonContainer: {
    paddingHorizontal: SPACING.page,
    paddingTop: 20,
  },
});