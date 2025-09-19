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
import Svg, { Path, Circle, G, Rect, Line } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { AnimatedQuestionPage, AnimatedContent, AnimatedQuestionPageRef } from '../../components/AnimatedQuestionPage';
import { NextButton } from '../../components/Button';
import { SPACING } from '@/constants/theme';
import * as Haptics from 'expo-haptics';

// Crossed Phone Illustration Component
const CrossedPhoneIllustration = () => (
  <Svg width="200" height="200" viewBox="0 0 200 200">
    {/* Phone outer body */}
    <Rect
      x="70"
      y="40"
      width="60"
      height="120"
      rx="12"
      ry="12"
      fill="rgba(255, 255, 255, 0.9)"
      stroke="rgba(255, 255, 255, 0.6)"
      strokeWidth="3"
    />
    
    {/* Phone screen */}
    <Rect
      x="75"
      y="50"
      width="50"
      height="90"
      rx="6"
      ry="6"
      fill="rgba(30, 30, 30, 0.8)"
    />
    
    {/* Screen reflection/shine */}
    <Rect
      x="77"
      y="52"
      width="20"
      height="30"
      rx="3"
      ry="3"
      fill="rgba(255, 255, 255, 0.3)"
    />
    
    {/* Home button */}
    <Circle
      cx="100"
      cy="150"
      r="4"
      fill="rgba(200, 200, 200, 0.8)"
      stroke="rgba(150, 150, 150, 0.6)"
      strokeWidth="1"
    />
    
    {/* Speaker */}
    <Rect
      x="85"
      y="45"
      width="30"
      height="2"
      rx="1"
      ry="1"
      fill="rgba(150, 150, 150, 0.8)"
    />
    
    {/* Red cross/X over phone */}
    <G>
      {/* First diagonal line */}
      <Line
        x1="50"
        y1="20"
        x2="150"
        y2="180"
        stroke="rgba(239, 68, 68, 0.9)"
        strokeWidth="8"
        strokeLinecap="round"
      />
      
      {/* Second diagonal line */}
      <Line
        x1="150"
        y1="20"
        x2="50"
        y2="180"
        stroke="rgba(239, 68, 68, 0.9)"
        strokeWidth="8"
        strokeLinecap="round"
      />
    </G>
    
    {/* Additional visual elements - small circles around */}
    <G opacity="0.4">
      <Circle cx="40" cy="60" r="2" fill="rgba(239, 68, 68, 0.6)" />
      <Circle cx="160" cy="40" r="1.5" fill="rgba(239, 68, 68, 0.6)" />
      <Circle cx="170" cy="160" r="2" fill="rgba(239, 68, 68, 0.6)" />
      <Circle cx="30" cy="140" r="1.5" fill="rgba(239, 68, 68, 0.6)" />
    </G>
  </Svg>
);

export default function TrapScreen() {
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

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Run content exit animation
    animationRef.current?.runExitAnimation(() => {
      router.back();
    });
  };

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Run content exit animation
    animationRef.current?.runExitAnimation(() => {
      // Continue to time page
      router.push('/(onboarding)/time');
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
      
      {/* Simple header without progress bar */}
      <View style={[styles.simpleHeader, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      {/* Animated content wrapper */}
      <AnimatedQuestionPage ref={animationRef}>
        <View style={styles.content}>
          {/* Illustration space */}
          <AnimatedContent delay={100}>
            <View style={styles.illustrationContainer}>
              <CrossedPhoneIllustration />
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
    paddingHorizontal: SPACING.small,
    gap: 24,
  },
  title: {
    fontSize: 36, // text-4xl equivalent
    fontWeight: '800', // font-extrabold
    color: '#FFFFFF', // --main-text
    textAlign: 'center',
    lineHeight: 42,
    maxWidth: 380, // Wider boundary to prevent word breaking
    textShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
  },
  description: {
    fontSize: 20, // text-xl
    fontWeight: '600', // font-semibold
    color: '#FECACA', // text-red-100 equivalent
    textAlign: 'center',
    lineHeight: 28,
    maxWidth: 400, // Wider boundary to prevent word breaking
    textShadow: '0 2px 6px rgba(0, 0, 0, 0.4)',
  },
  nextContainer: {
    paddingHorizontal: SPACING.page,
    zIndex: 10,
  },
  continueButton: {
    backgroundColor: '#FFFFFF', // --vibrant-cta
    // Use proper shadow properties for React Native
    boxShadow: '0 8px 24px rgba(255, 255, 255, 0.3)',
    elevation: 8,
  },
  continueButtonText: {
    color: '#7F1D1D', // --vibrant-cta-text (dark red)
    fontSize: 20,
    fontWeight: '700',
  },
  simpleHeader: {
    paddingHorizontal: SPACING.page,
    paddingBottom: SPACING.small,
    zIndex: 10,
  },
  backButton: {
    padding: 8,
  },
});