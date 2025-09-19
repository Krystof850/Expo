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

// Simple Checklist Illustration Component
const SimpleChecklistIllustration = () => (
  <Svg width="200" height="200" viewBox="0 0 200 200">
    {/* Checklist background */}
    <Rect x="50" y="40" width="100" height="130" rx="8" fill="rgba(255, 255, 255, 0.9)" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="2" />
    
    {/* Checklist title line */}
    <Rect x="60" y="55" width="50" height="4" rx="2" fill="rgba(59, 130, 246, 0.6)" />
    
    {/* Checklist items */}
    <G>
      {/* Item 1 - Completed */}
      <Rect x="60" y="75" width="12" height="12" rx="2" fill="rgba(34, 197, 94, 0.2)" stroke="rgba(34, 197, 94, 1)" strokeWidth="1" />
      <Path d="M63 81 L66 84 L72 78" stroke="rgba(34, 197, 94, 1)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <Rect x="80" y="79" width="55" height="3" rx="1" fill="rgba(156, 163, 175, 0.6)" />
      
      {/* Item 2 - Completed */}
      <Rect x="60" y="95" width="12" height="12" rx="2" fill="rgba(34, 197, 94, 0.2)" stroke="rgba(34, 197, 94, 1)" strokeWidth="1" />
      <Path d="M63 101 L66 104 L72 98" stroke="rgba(34, 197, 94, 1)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <Rect x="80" y="99" width="45" height="3" rx="1" fill="rgba(156, 163, 175, 0.6)" />
      
      {/* Item 3 - Completed */}
      <Rect x="60" y="115" width="12" height="12" rx="2" fill="rgba(34, 197, 94, 0.2)" stroke="rgba(34, 197, 94, 1)" strokeWidth="1" />
      <Path d="M63 121 L66 124 L72 118" stroke="rgba(34, 197, 94, 1)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <Rect x="80" y="119" width="40" height="3" rx="1" fill="rgba(156, 163, 175, 0.6)" />
      
      {/* Item 4 - Current */}
      <Rect x="60" y="135" width="12" height="12" rx="2" fill="rgba(251, 191, 36, 0.2)" stroke="rgba(251, 191, 36, 1)" strokeWidth="2" />
      <Circle cx="66" cy="141" r="2" fill="rgba(251, 191, 36, 1)" />
      <Rect x="80" y="139" width="50" height="3" rx="1" fill="rgba(156, 163, 175, 0.6)" />
      
      {/* Item 5 - Pending */}
      <Rect x="60" y="155" width="12" height="12" rx="2" fill="rgba(255, 255, 255, 0.8)" stroke="rgba(156, 163, 175, 0.5)" strokeWidth="1" />
      <Rect x="80" y="159" width="35" height="3" rx="1" fill="rgba(156, 163, 175, 0.4)" />
    </G>
    
    {/* Progress indicator */}
    <G opacity="0.8">
      <Circle cx="100" cy="25" r="15" fill="none" stroke="rgba(34, 197, 94, 0.3)" strokeWidth="3" />
      <Path d="M85 25 A15 15 0 0 1 115 25" stroke="rgba(34, 197, 94, 1)" strokeWidth="3" fill="none" strokeLinecap="round" />
      <Text x="100" y="30" fontSize="10" fill="rgba(34, 197, 94, 1)" textAnchor="middle" fontWeight="bold">60%</Text>
    </G>
  </Svg>
);

export default function BeatScreen() {
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
      // Continue to track page
      router.push('/(onboarding)/track');
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
              <SimpleChecklistIllustration />
            </View>
          </AnimatedContent>

          {/* Text content */}
          <AnimatedContent delay={200}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>Beat distractions</Text>
              
              <Text style={styles.description}>
                Unloop breaks big tasks into small steps. Less wasted time, more progress every day.
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