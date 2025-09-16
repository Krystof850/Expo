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

// Task Breakdown Illustration Component
const TaskBreakdownIllustration = () => (
  <Svg width="200" height="200" viewBox="0 0 200 200">
    {/* Large overwhelming task (breaking apart) */}
    <G opacity="0.5">
      <Rect x="60" y="30" width="80" height="50" rx="5" fill="rgba(239, 68, 68, 0.4)" stroke="rgba(220, 38, 38, 0.6)" strokeWidth="2" strokeDasharray="4,4" />
    </G>
    
    {/* Breakdown arrow */}
    <G opacity="0.8">
      <Line x1="100" y1="85" x2="100" y2="110" stroke="rgba(34, 211, 238, 1)" strokeWidth="3" />
      <Path d="M95 105 L100 110 L105 105" stroke="rgba(34, 211, 238, 1)" strokeWidth="3" fill="none" strokeLinecap="round" />
    </G>
    
    {/* Small manageable steps */}
    <G opacity="0.9">
      {/* Step 1 */}
      <Rect x="30" y="120" width="35" height="20" rx="3" fill="rgba(34, 197, 94, 0.8)" stroke="rgba(22, 163, 74, 1)" strokeWidth="1" />
      
      {/* Step 2 */}
      <Rect x="82" y="120" width="35" height="20" rx="3" fill="rgba(34, 197, 94, 0.8)" stroke="rgba(22, 163, 74, 1)" strokeWidth="1" />
      
      {/* Step 3 */}
      <Rect x="135" y="120" width="35" height="20" rx="3" fill="rgba(34, 197, 94, 0.8)" stroke="rgba(22, 163, 74, 1)" strokeWidth="1" />
    </G>
    
    {/* Progress indicators */}
    <G opacity="0.8">
      {/* Checkmarks for completed steps */}
      <Path d="M35 155 L40 160 L50 150" stroke="rgba(34, 197, 94, 1)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <Path d="M87 155 L92 160 L102 150" stroke="rgba(34, 197, 94, 1)" strokeWidth="2" fill="none" strokeLinecap="round" />
      
      {/* Current step indicator */}
      <Circle cx="152" cy="155" r="4" fill="rgba(251, 191, 36, 1)" />
      <Circle cx="152" cy="155" r="6" fill="none" stroke="rgba(251, 191, 36, 0.6)" strokeWidth="2" />
    </G>
    
    {/* Time saved visualization */}
    <G opacity="0.7">
      {/* Clock showing less time */}
      <Circle cx="50" cy="180" r="12" fill="none" stroke="rgba(34, 211, 238, 0.8)" strokeWidth="2" />
      <Line x1="50" y1="180" x2="50" y2="172" stroke="rgba(34, 211, 238, 1)" strokeWidth="2" />
      <Line x1="50" y1="180" x2="56" y2="180" stroke="rgba(34, 211, 238, 1)" strokeWidth="1" />
      
      {/* Progress meter */}
      <Rect x="120" y="170" width="60" height="8" rx="4" fill="rgba(59, 130, 246, 0.3)" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="1" />
      <Rect x="120" y="170" width="40" height="8" rx="4" fill="rgba(34, 197, 94, 0.8)" />
    </G>
    
    {/* Distraction barriers */}
    <G opacity="0.6">
      {/* Shield protecting the process */}
      <Path
        d="M20 100 Q20 90 30 90 L40 90 Q50 90 50 100 L50 115 Q50 125 40 125 L30 125 Q20 125 20 115 Z"
        fill="rgba(59, 130, 246, 0.2)"
        stroke="rgba(59, 130, 246, 0.6)"
        strokeWidth="2"
      />
      <Path
        d="M170 100 Q170 90 180 90 L190 90 Q200 90 200 100 L200 115 Q200 125 190 125 L180 125 Q170 125 170 115 Z"
        fill="rgba(59, 130, 246, 0.2)"
        stroke="rgba(59, 130, 246, 0.6)"
        strokeWidth="2"
      />
    </G>
    
    {/* Connection lines between steps */}
    <G opacity="0.5">
      <Line x1="65" y1="130" x2="82" y2="130" stroke="rgba(34, 211, 238, 0.6)" strokeWidth="1" strokeDasharray="2,2" />
      <Line x1="117" y1="130" x2="135" y2="130" stroke="rgba(34, 211, 238, 0.6)" strokeWidth="1" strokeDasharray="2,2" />
    </G>
    
    {/* Focus beam */}
    <G opacity="0.4">
      <Path
        d="M100 85 L95 120 L105 120 Z"
        fill="rgba(251, 191, 36, 0.3)"
      />
    </G>
    
    {/* Productivity arrows */}
    <G opacity="0.6">
      <Path d="M25 110 L15 105 L25 100" stroke="rgba(34, 197, 94, 0.8)" strokeWidth="2" fill="none" />
      <Path d="M175 110 L185 105 L175 100" stroke="rgba(34, 197, 94, 0.8)" strokeWidth="2" fill="none" />
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
              <TaskBreakdownIllustration />
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