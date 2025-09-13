import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  BackHandler,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, G, Rect, Line } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedQuestionPage, AnimatedContent, AnimatedQuestionPageRef } from '../../components/AnimatedQuestionPage';
import { NextButton } from '../../components/Button';
import { SPACING } from '@/constants/theme';
import * as Haptics from 'expo-haptics';

// Hourglass with Clock Illustration Component
const HourglassClockIllustration = () => (
  <Svg width="200" height="200" viewBox="0 0 200 200">
    {/* Hourglass outline */}
    <Path
      d="M70 30 L130 30 L130 50 L110 70 L130 90 L130 170 L70 170 L70 90 L90 70 L70 50 Z"
      fill="rgba(255, 255, 255, 0.9)"
      stroke="rgba(255, 255, 255, 0.6)"
      strokeWidth="3"
    />
    
    {/* Sand in top chamber */}
    <Path
      d="M75 35 L125 35 L125 45 L105 65 L95 65 L75 45 Z"
      fill="rgba(220, 38, 38, 0.7)"
    />
    
    {/* Sand in bottom chamber */}
    <Path
      d="M75 165 L125 165 L125 155 L100 130 L75 155 Z"
      fill="rgba(220, 38, 38, 0.6)"
    />
    
    {/* Falling sand stream */}
    <Rect
      x="98"
      y="70"
      width="4"
      height="60"
      fill="rgba(220, 38, 38, 0.5)"
    />
    
    {/* Clock face around hourglass */}
    <Circle
      cx="100"
      cy="100"
      r="90"
      fill="none"
      stroke="rgba(239, 68, 68, 0.4)"
      strokeWidth="2"
      strokeDasharray="5,5"
    />
    
    {/* Clock hour markers */}
    <G>
      {/* 12 o'clock */}
      <Line x1="100" y1="15" x2="100" y2="25" stroke="rgba(239, 68, 68, 0.8)" strokeWidth="3" />
      {/* 3 o'clock */}
      <Line x1="185" y1="100" x2="175" y2="100" stroke="rgba(239, 68, 68, 0.8)" strokeWidth="3" />
      {/* 6 o'clock */}
      <Line x1="100" y1="185" x2="100" y2="175" stroke="rgba(239, 68, 68, 0.8)" strokeWidth="3" />
      {/* 9 o'clock */}
      <Line x1="15" y1="100" x2="25" y2="100" stroke="rgba(239, 68, 68, 0.8)" strokeWidth="3" />
    </G>
    
    {/* Clock hands pointing to different times (showing time passing) */}
    <G opacity="0.6">
      {/* Hour hand */}
      <Line x1="100" y1="100" x2="100" y2="60" stroke="rgba(239, 68, 68, 1)" strokeWidth="4" strokeLinecap="round" />
      {/* Minute hand */}
      <Line x1="100" y1="100" x2="130" y2="70" stroke="rgba(239, 68, 68, 1)" strokeWidth="3" strokeLinecap="round" />
    </G>
    
    {/* Center dot */}
    <Circle cx="100" cy="100" r="4" fill="rgba(239, 68, 68, 1)" />
    
    {/* Scattered time particles */}
    <G opacity="0.4">
      <Circle cx="40" cy="60" r="2" fill="rgba(239, 68, 68, 0.6)" />
      <Circle cx="160" cy="40" r="1.5" fill="rgba(239, 68, 68, 0.6)" />
      <Circle cx="170" cy="160" r="2" fill="rgba(239, 68, 68, 0.6)" />
      <Circle cx="30" cy="140" r="1.5" fill="rgba(239, 68, 68, 0.6)" />
    </G>
  </Svg>
);

export default function TimeScreen() {
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
      // Continue to confidence page
      router.push('/(onboarding)/confidence');
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
              <HourglassClockIllustration />
            </View>
          </AnimatedContent>

          {/* Text content */}
          <AnimatedContent delay={200}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>It kills your time</Text>
              
              <Text style={styles.description}>
                Hours disappear through scrolling, playing games, or other task avoidance. At the end, you've done nothing meaningful.
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