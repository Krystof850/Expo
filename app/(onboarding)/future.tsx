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
import Svg, { Path, Circle, G, Polygon, Line, Rect } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedQuestionPage, AnimatedContent, AnimatedQuestionPageRef } from '../../components/AnimatedQuestionPage';
import { NextButton } from '../../components/Button';
import { SPACING } from '@/constants/theme';
import * as Haptics from 'expo-haptics';

// Crossed Trophy Illustration
const CrossedTrophyIllustration = () => (
  <Svg width="200" height="200" viewBox="0 0 200 200">
    {/* Trophy base/pedestal */}
    <Rect
      x="70"
      y="150"
      width="60"
      height="15"
      rx="6"
      ry="6"
      fill="rgba(255, 255, 255, 0.9)"
      stroke="rgba(255, 255, 255, 0.6)"
      strokeWidth="2"
    />
    
    {/* Trophy middle base */}
    <Rect
      x="80"
      y="140"
      width="40"
      height="15"
      rx="4"
      ry="4"
      fill="rgba(255, 255, 255, 0.9)"
      stroke="rgba(255, 255, 255, 0.6)"
      strokeWidth="2"
    />
    
    {/* Trophy stem/neck */}
    <Rect
      x="90"
      y="110"
      width="20"
      height="30"
      fill="rgba(255, 255, 255, 0.9)"
      stroke="rgba(255, 255, 255, 0.6)"
      strokeWidth="2"
    />
    
    {/* Main trophy cup - realistic bowl shape */}
    <Path
      d="M65 50 C65 45 70 40 75 40 L125 40 C130 40 135 45 135 50 L135 85 C135 95 125 105 115 105 L85 105 C75 105 65 95 65 85 Z"
      fill="rgba(255, 255, 255, 0.9)"
      stroke="rgba(255, 255, 255, 0.6)"
      strokeWidth="3"
    />
    
    {/* Trophy rim/lip */}
    <Rect
      x="65"
      y="45"
      width="70"
      height="8"
      rx="4"
      ry="4"
      fill="rgba(255, 255, 255, 0.95)"
      stroke="rgba(255, 255, 255, 0.7)"
      strokeWidth="2"
    />
    
    {/* Left handle */}
    <Path
      d="M65 60 C50 60 40 70 40 80 C40 90 50 100 65 100"
      fill="none"
      stroke="rgba(255, 255, 255, 0.8)"
      strokeWidth="4"
      strokeLinecap="round"
    />
    
    {/* Right handle */}
    <Path
      d="M135 60 C150 60 160 70 160 80 C160 90 150 100 135 100"
      fill="none"
      stroke="rgba(255, 255, 255, 0.8)"
      strokeWidth="4"
      strokeLinecap="round"
    />
    
    {/* Trophy inner shadow/depth */}
    <Path
      d="M70 50 C70 47 72 45 75 45 L125 45 C128 45 130 47 130 50 L130 80 C130 88 123 95 115 95 L85 95 C77 95 70 88 70 80 Z"
      fill="rgba(200, 200, 200, 0.3)"
    />
    
    {/* Decorative band around cup */}
    <Rect
      x="70"
      y="70"
      width="60"
      height="4"
      fill="rgba(220, 220, 220, 0.5)"
    />
    
    {/* Red cross/X over trophy */}
    <G>
      {/* First diagonal line */}
      <Line
        x1="30"
        y1="20"
        x2="170"
        y2="180"
        stroke="rgba(239, 68, 68, 0.9)"
        strokeWidth="8"
        strokeLinecap="round"
      />
      
      {/* Second diagonal line */}
      <Line
        x1="170"
        y1="20"
        x2="30"
        y2="180"
        stroke="rgba(239, 68, 68, 0.9)"
        strokeWidth="8"
        strokeLinecap="round"
      />
    </G>
    
    {/* Additional visual elements - small circles around */}
    <G opacity="0.4">
      <Circle cx="25" cy="60" r="2" fill="rgba(239, 68, 68, 0.6)" />
      <Circle cx="175" cy="40" r="1.5" fill="rgba(239, 68, 68, 0.6)" />
      <Circle cx="185" cy="160" r="2" fill="rgba(239, 68, 68, 0.6)" />
      <Circle cx="15" cy="140" r="1.5" fill="rgba(239, 68, 68, 0.6)" />
    </G>
  </Svg>
);

export default function FutureScreen() {
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
      // Continue to hope page
      router.push('/(onboarding)/hope');
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
              <CrossedTrophyIllustration />
            </View>
          </AnimatedContent>

          {/* Text content */}
          <AnimatedContent delay={200}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>It steals your future</Text>
              
              <Text style={styles.description}>
                Dreams get postponed, opportunities lost. Procrastination silently kills the life you deserve.
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