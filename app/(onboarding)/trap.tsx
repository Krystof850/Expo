import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  BackHandler,
  Platform,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, G } from 'react-native-svg';
import { OnboardingHeader, OnboardingHeaderRef } from '../../components/OnboardingHeader';
import { AnimatedQuestionPage, AnimatedContent, AnimatedQuestionPageRef } from '../../components/AnimatedQuestionPage';
import { NextButton } from '../../components/Button';
import { SPACING } from '@/constants/theme';

// Simple Brain with Chain Illustration Component
const BrainChainIllustration = () => (
  <Svg width="200" height="200" viewBox="0 0 200 200">
    {/* Brain outline */}
    <Path
      d="M100 40C85 40 70 45 60 55C55 50 45 48 40 52C35 40 25 35 20 45C15 40 5 45 8 55C5 65 10 75 15 80C10 90 15 100 25 105C30 115 40 120 50 115C60 125 75 130 90 125C105 130 120 125 130 115C140 120 150 115 155 105C165 100 170 90 165 80C170 75 175 65 172 55C175 45 165 40 160 45C155 35 145 40 140 52C135 48 125 50 120 55C110 45 105 40 100 40Z"
      fill="rgba(255, 255, 255, 0.9)"
      stroke="rgba(255, 255, 255, 0.6)"
      strokeWidth="2"
    />
    
    {/* Brain details */}
    <Path
      d="M85 70C90 65 95 70 100 65C105 70 110 65 115 70"
      stroke="rgba(220, 38, 38, 0.6)"
      strokeWidth="2"
      fill="none"
    />
    <Path
      d="M75 85C85 80 95 85 105 80C115 85 125 80 135 85"
      stroke="rgba(220, 38, 38, 0.6)"
      strokeWidth="2"
      fill="none"
    />
    
    {/* Chain links around brain */}
    <G>
      {/* Chain link 1 */}
      <Circle
        cx="70"
        cy="60"
        r="8"
        fill="none"
        stroke="rgba(239, 68, 68, 0.8)"
        strokeWidth="4"
      />
      <Circle
        cx="85"
        cy="55"
        r="8"
        fill="none"
        stroke="rgba(239, 68, 68, 0.8)"
        strokeWidth="4"
      />
      
      {/* Chain link 2 */}
      <Circle
        cx="130"
        cy="60"
        r="8"
        fill="none"
        stroke="rgba(239, 68, 68, 0.8)"
        strokeWidth="4"
      />
      <Circle
        cx="115"
        cy="55"
        r="8"
        fill="none"
        stroke="rgba(239, 68, 68, 0.8)"
        strokeWidth="4"
      />
      
      {/* Chain link 3 */}
      <Circle
        cx="60"
        cy="100"
        r="8"
        fill="none"
        stroke="rgba(239, 68, 68, 0.8)"
        strokeWidth="4"
      />
      <Circle
        cx="75"
        cy="105"
        r="8"
        fill="none"
        stroke="rgba(239, 68, 68, 0.8)"
        strokeWidth="4"
      />
      
      {/* Chain link 4 */}
      <Circle
        cx="125"
        cy="105"
        r="8"
        fill="none"
        stroke="rgba(239, 68, 68, 0.8)"
        strokeWidth="4"
      />
      <Circle
        cx="140"
        cy="100"
        r="8"
        fill="none"
        stroke="rgba(239, 68, 68, 0.8)"
        strokeWidth="4"
      />
    </G>
  </Svg>
);

export default function TrapScreen() {
  const insets = useSafeAreaInsets();
  const animationRef = useRef<AnimatedQuestionPageRef>(null);
  const headerRef = useRef<OnboardingHeaderRef>(null);

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

  const handleBack = () => {
    // Run header exit animation first, then content exit animation
    headerRef.current?.runExitAnimation(() => {
      animationRef.current?.runExitAnimation(() => {
        router.back();
      });
    });
  };

  const handleContinue = () => {
    // Run header exit animation first, then content exit animation
    headerRef.current?.runExitAnimation(() => {
      animationRef.current?.runExitAnimation(() => {
        // Continue to goals page
        router.push('/(onboarding)/goals');
      });
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Red gradient background with blur effects */}
      <LinearGradient
        colors={['#991B1B', '#7F1D1D', '#000000']} // red-800 → red-900 → black
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }} // diagonal gradient from top-left to bottom-right
        style={styles.backgroundContainer}
      >
        <View style={styles.blurOverlay}>
          {/* First blur orb with gradient */}
          <LinearGradient
            colors={['rgba(239, 68, 68, 0.5)', 'transparent']}
            style={styles.blurCircle1}
          />
          {/* Second blur orb with gradient */}
          <LinearGradient
            colors={['rgba(249, 115, 22, 0.4)', 'transparent']}
            style={styles.blurCircle2}
          />
        </View>
      </LinearGradient>
      
      {/* Header with progress bar */}
      <OnboardingHeader 
        ref={headerRef}
        step={12} 
        total={15} 
        questionLabel="Understanding"
        onBackPress={handleBack}
      />
      
      {/* Animated content wrapper */}
      <AnimatedQuestionPage ref={animationRef}>
        <View style={styles.content}>
          {/* Illustration space */}
          <AnimatedContent delay={100}>
            <View style={styles.illustrationContainer}>
              <BrainChainIllustration />
            </View>
          </AnimatedContent>

          {/* Text content */}
          <AnimatedContent delay={200}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>Procrastination is a trap</Text>
              
              <Text style={styles.description}>
                Every delay gives your brain cheap dopamine. It trains you to run from hard work instead of facing it.
              </Text>
            </View>
          </AnimatedContent>
        </View>
      </AnimatedQuestionPage>
      
      {/* Next button - OUTSIDE of animation wrapper */}
      <View style={[styles.nextContainer, { paddingBottom: insets.bottom + SPACING.page }]}>
        <NextButton
          title="I Understand"
          onPress={handleContinue}
          style={styles.continueButton}
          textStyle={styles.continueButtonText}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
  blurCircle1: {
    position: 'absolute',
    top: -150,
    left: -150,
    width: 600,
    height: 600,
    borderRadius: 300,
    opacity: 0.8, // Additional opacity for blur effect
  },
  blurCircle2: {
    position: 'absolute',
    bottom: -175,
    right: -175,
    width: 700,
    height: 700,
    borderRadius: 350,
    opacity: 0.7, // Additional opacity for blur effect
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.page,
    paddingTop: 40,
    paddingBottom: 120, // Space for Next button
    zIndex: 10,
  },
  illustrationContainer: {
    height: '33%', // Upper third of the screen
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.page,
    gap: 24,
  },
  title: {
    fontSize: 36, // text-4xl equivalent
    fontWeight: '800', // font-extrabold
    color: '#FFFFFF', // --main-text
    textAlign: 'center',
    lineHeight: 42,
    // Use proper textShadow property instead of SHADOWS.text
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  description: {
    fontSize: 20, // text-xl
    fontWeight: '600', // font-semibold
    color: '#FECACA', // text-red-100 equivalent
    textAlign: 'center',
    lineHeight: 28,
    maxWidth: 320, // max-w-md equivalent
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  nextContainer: {
    paddingHorizontal: SPACING.page,
    zIndex: 10,
  },
  continueButton: {
    backgroundColor: '#FFFFFF', // --vibrant-cta
    // Use proper shadow properties for React Native
    shadowColor: 'rgba(255, 255, 255, 0.3)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
  },
  continueButtonText: {
    color: '#7F1D1D', // --vibrant-cta-text (dark red)
    fontSize: 20,
    fontWeight: '700',
  },
});