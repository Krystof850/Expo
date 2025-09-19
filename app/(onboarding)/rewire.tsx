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
import Svg, { Path, Circle, G, Line } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedQuestionPage, AnimatedContent, AnimatedQuestionPageRef } from '../../components/AnimatedQuestionPage';
import { NextButton } from '../../components/Button';
import { SPACING } from '@/constants/theme';
import * as Haptics from 'expo-haptics';

// Circular Arrow Flow - Rewiring Process
const CircularArrowFlowIllustration = () => (
  <Svg width="280" height="280" viewBox="0 0 200 200">
    {/* Outer circular path */}
    <Circle cx="100" cy="100" r="60" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="2" strokeDasharray="5,5" />
    
    {/* Main circular arrows flowing around */}
    <G>
      {/* First arrow - top to right */}
      <Path
        d="M100 40 A60 60 0 0 1 160 100"
        fill="none"
        stroke="rgba(59, 130, 246, 1)"
        strokeWidth="8"
        strokeLinecap="round"
      />
      {/* Arrow head for first arrow */}
      <Path
        d="M155 95 L165 100 L155 105 L160 100 Z"
        fill="rgba(59, 130, 246, 1)"
      />
      
      {/* Second arrow - bottom to left */}
      <Path
        d="M100 160 A60 60 0 0 1 40 100"
        fill="none"
        stroke="rgba(255, 255, 255, 1)"
        strokeWidth="8"
        strokeLinecap="round"
      />
      {/* Arrow head for second arrow */}
      <Path
        d="M45 105 L35 100 L45 95 L40 100 Z"
        fill="rgba(255, 255, 255, 1)"
      />
    </G>
    
    {/* Center core - represents the mind */}
    <Circle cx="100" cy="100" r="25" fill="rgba(59, 130, 246, 0.3)" stroke="rgba(59, 130, 246, 1)" strokeWidth="3" />
    
    {/* Inner energy dots */}
    <G opacity="0.8">
      <Circle cx="100" cy="85" r="2" fill="rgba(251, 191, 36, 1)" />
      <Circle cx="115" cy="100" r="1.5" fill="rgba(251, 191, 36, 1)" />
      <Circle cx="100" cy="115" r="2" fill="rgba(251, 191, 36, 1)" />
      <Circle cx="85" cy="100" r="1.5" fill="rgba(251, 191, 36, 1)" />
    </G>
    
    {/* Flowing energy particles around the arrows */}
    <G opacity="0.6">
      {/* Small energy dots following the flow */}
      <Circle cx="130" cy="60" r="1.5" fill="rgba(34, 211, 238, 1)" />
      <Circle cx="150" cy="80" r="1" fill="rgba(34, 211, 238, 1)" />
      <Circle cx="70" cy="140" r="1.5" fill="rgba(34, 211, 238, 1)" />
      <Circle cx="50" cy="120" r="1" fill="rgba(34, 211, 238, 1)" />
      
      {/* More energy particles */}
      <Circle cx="120" cy="50" r="1" fill="rgba(251, 191, 36, 0.8)" />
      <Circle cx="80" cy="150" r="1" fill="rgba(251, 191, 36, 0.8)" />
      <Circle cx="170" cy="110" r="1" fill="rgba(251, 191, 36, 0.8)" />
      <Circle cx="30" cy="90" r="1" fill="rgba(251, 191, 36, 0.8)" />
    </G>
    
    {/* Subtle glow effect around center */}
    <Circle cx="100" cy="100" r="35" fill="none" stroke="rgba(59, 130, 246, 0.1)" strokeWidth="10" />
  </Svg>
);

export default function RewireScreen() {
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
      // Continue to quit page
      router.push('/(onboarding)/quit');
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
              <CircularArrowFlowIllustration />
            </View>
          </AnimatedContent>

          {/* Text content */}
          <AnimatedContent delay={200}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>Rewire your brain</Text>
              
              <Text style={styles.description}>
                You will reprogram your brain. Focus and discipline will become your default mode.
              </Text>
            </View>
          </AnimatedContent>
        </View>
      </AnimatedQuestionPage>
      
      {/* Next button - OUTSIDE of animation wrapper */}
      <View style={[styles.nextContainer, { paddingBottom: insets.bottom + SPACING.page }]}>
        <NextButton
          title="Continue"
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