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
import Svg, { Path, Circle, G, Polygon, Line } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedQuestionPage, AnimatedContent, AnimatedQuestionPageRef } from '../../components/AnimatedQuestionPage';
import { NextButton } from '../../components/Button';
import { SPACING } from '@/constants/theme';
import * as Haptics from 'expo-haptics';

// Caring Hands with Heart Illustration
const CaringHandsIllustration = () => (
  <Svg width="200" height="200" viewBox="0 0 200 200">
    {/* Left hand - line art style */}
    <G>
      {/* Palm */}
      <Path
        d="M50 100 L50 140 C50 145 55 150 60 150 L75 150 C80 150 85 145 85 140 L85 120"
        fill="none"
        stroke="rgba(255, 255, 255, 0.9)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Thumb */}
      <Path
        d="M50 120 C45 120 40 115 40 110 C40 105 45 100 50 100"
        fill="none"
        stroke="rgba(255, 255, 255, 0.9)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Index finger */}
      <Path
        d="M65 120 L65 95 C65 90 70 85 75 85 C80 85 85 90 85 95 L85 120"
        fill="none"
        stroke="rgba(255, 255, 255, 0.9)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Middle finger */}
      <Path
        d="M75 120 L75 90 C75 85 80 80 85 80 C90 80 95 85 95 90 L95 120"
        fill="none"
        stroke="rgba(255, 255, 255, 0.9)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Ring finger */}
      <Path
        d="M85 120 L85 95 C85 90 90 85 95 85 C100 85 105 90 105 95 L105 120"
        fill="none"
        stroke="rgba(255, 255, 255, 0.9)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Pinky */}
      <Path
        d="M95 120 L95 100 C95 95 100 90 105 90 C110 90 115 95 115 100 L115 120"
        fill="none"
        stroke="rgba(255, 255, 255, 0.9)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    
    {/* Right hand - line art style */}
    <G>
      {/* Palm */}
      <Path
        d="M150 100 L150 140 C150 145 145 150 140 150 L125 150 C120 150 115 145 115 140 L115 120"
        fill="none"
        stroke="rgba(255, 255, 255, 0.9)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Thumb */}
      <Path
        d="M150 120 C155 120 160 115 160 110 C160 105 155 100 150 100"
        fill="none"
        stroke="rgba(255, 255, 255, 0.9)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Index finger */}
      <Path
        d="M135 120 L135 95 C135 90 130 85 125 85 C120 85 115 90 115 95 L115 120"
        fill="none"
        stroke="rgba(255, 255, 255, 0.9)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Middle finger */}
      <Path
        d="M125 120 L125 90 C125 85 120 80 115 80 C110 80 105 85 105 90 L105 120"
        fill="none"
        stroke="rgba(255, 255, 255, 0.9)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Ring finger */}
      <Path
        d="M115 120 L115 95 C115 90 110 85 105 85 C100 85 95 90 95 95 L95 120"
        fill="none"
        stroke="rgba(255, 255, 255, 0.9)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Pinky */}
      <Path
        d="M105 120 L105 100 C105 95 100 90 95 90 C90 90 85 95 85 100 L85 120"
        fill="none"
        stroke="rgba(255, 255, 255, 0.9)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    
    {/* Heart in the center */}
    <Path
      d="M100 65 C95 55 85 50 80 55 C75 60 75 65 80 70 L100 90 L120 70 C125 65 125 60 120 55 C115 50 105 55 100 65 Z"
      fill="rgba(239, 68, 68, 0.9)"
      stroke="rgba(220, 38, 38, 0.8)"
      strokeWidth="2"
    />
    
    {/* Heart shine/highlight */}
    <Path
      d="M95 60 C92 58 90 58 88 60 C86 62 86 64 88 66 L95 73 L95 60 Z"
      fill="rgba(252, 165, 165, 0.7)"
    />
    
    {/* Decorative elements around heart - like in reference */}
    <G opacity="0.7">
      {/* Top sparkles */}
      <Line x1="100" y1="40" x2="100" y2="50" stroke="rgba(239, 68, 68, 0.8)" strokeWidth="3" strokeLinecap="round" />
      <Line x1="90" y1="45" x2="90" y2="50" stroke="rgba(239, 68, 68, 0.8)" strokeWidth="2" strokeLinecap="round" />
      <Line x1="110" y1="45" x2="110" y2="50" stroke="rgba(239, 68, 68, 0.8)" strokeWidth="2" strokeLinecap="round" />
      
      {/* Side sparkles */}
      <Line x1="70" y1="60" x2="75" y2="60" stroke="rgba(239, 68, 68, 0.8)" strokeWidth="2" strokeLinecap="round" />
      <Line x1="130" y1="60" x2="125" y2="60" stroke="rgba(239, 68, 68, 0.8)" strokeWidth="2" strokeLinecap="round" />
      
      {/* Bottom sparkles */}
      <Line x1="95" y1="95" x2="95" y2="100" stroke="rgba(239, 68, 68, 0.8)" strokeWidth="2" strokeLinecap="round" />
      <Line x1="105" y1="95" x2="105" y2="100" stroke="rgba(239, 68, 68, 0.8)" strokeWidth="2" strokeLinecap="round" />
    </G>
  </Svg>
);


export default function HopeScreen() {
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
      // Continue to welcome page
      router.push('/(onboarding)/welcome');
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Blue gradient background with blur effects */}
      <LinearGradient
        colors={['#1D4ED8', '#1E40AF', '#000000']} // blue-700 → blue-800 → black
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }} // diagonal gradient from top-left to bottom-right
        style={styles.backgroundContainer}
      >
        <View style={styles.blurOverlay}>
          {/* First blur orb with gradient */}
          <LinearGradient
            colors={['rgba(59, 130, 246, 0.5)', 'transparent']}
            style={styles.blurCircle1}
          />
          {/* Second blur orb with gradient */}
          <LinearGradient
            colors={['rgba(34, 211, 238, 0.4)', 'transparent']}
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
              <CaringHandsIllustration />
            </View>
          </AnimatedContent>

          {/* Text content */}
          <AnimatedContent delay={200}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>But there's hope</Text>
              
              <Text style={styles.description}>
                With Unloop, you can reboot your brain, rebuild discipline, and take back control.
              </Text>
            </View>
          </AnimatedContent>
        </View>
      </AnimatedQuestionPage>
      
      {/* Next button - OUTSIDE of animation wrapper */}
      <View style={[styles.nextContainer, { paddingBottom: insets.bottom + SPACING.page }]}>
        <NextButton
          title="Let's Do It"
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
    color: '#DBEAFE', // text-blue-100 equivalent
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
    color: '#1E40AF', // --vibrant-cta-text (blue)
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