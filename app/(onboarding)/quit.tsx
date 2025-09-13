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

// One Button Click Solution Illustration Component
const OneClickIllustration = () => (
  <Svg width="200" height="200" viewBox="0 0 200 200">
    {/* Central button */}
    <Circle
      cx="100"
      cy="100"
      r="35"
      fill="rgba(34, 211, 238, 0.8)"
      stroke="rgba(6, 182, 212, 1)"
      strokeWidth="3"
    />
    
    {/* Button shine effect */}
    <Circle
      cx="100"
      cy="100"
      r="25"
      fill="rgba(255, 255, 255, 0.3)"
    />
    
    {/* Click indicator */}
    <Circle
      cx="100"
      cy="100"
      r="15"
      fill="rgba(59, 130, 246, 1)"
    />
    
    {/* Finger/cursor icon on button */}
    <Path
      d="M95 95 L95 85 C95 83 97 81 99 81 C101 81 103 83 103 85 L103 90 L105 90 C107 90 109 92 109 94 L109 105 C109 107 107 109 105 109 L95 109 Z"
      fill="rgba(255, 255, 255, 0.9)"
    />
    
    {/* Temptations/distractions around the button (fading away) */}
    <G opacity="0.6">
      {/* Social media icon (fading) */}
      <Rect x="40" y="40" width="20" height="20" rx="3" fill="rgba(239, 68, 68, 0.4)" stroke="rgba(220, 38, 38, 0.6)" strokeWidth="1" strokeDasharray="2,2" />
      <Circle cx="50" cy="50" r="3" fill="rgba(220, 38, 38, 0.4)" />
      
      {/* Gaming controller (fading) */}
      <Rect x="140" y="45" width="25" height="15" rx="7" fill="rgba(239, 68, 68, 0.4)" stroke="rgba(220, 38, 38, 0.6)" strokeWidth="1" strokeDasharray="2,2" />
      <Circle cx="150" cy="50" r="2" fill="rgba(220, 38, 38, 0.4)" />
      <Circle cx="155" cy="55" r="2" fill="rgba(220, 38, 38, 0.4)" />
      
      {/* Video/entertainment (fading) */}
      <Rect x="45" y="140" width="22" height="16" rx="2" fill="rgba(239, 68, 68, 0.4)" stroke="rgba(220, 38, 38, 0.6)" strokeWidth="1" strokeDasharray="2,2" />
      <Polygon points="52,145 52,151 58,148" fill="rgba(220, 38, 38, 0.4)" />
      
      {/* Shopping (fading) */}
      <Path
        d="M140 140 L145 140 L147 150 L138 150 Z"
        fill="rgba(239, 68, 68, 0.4)"
        stroke="rgba(220, 38, 38, 0.6)"
        strokeWidth="1"
        strokeDasharray="2,2"
      />
      <Path
        d="M140 140 L140 135 L145 135 L145 140"
        stroke="rgba(220, 38, 38, 0.6)"
        strokeWidth="1"
        fill="none"
      />
    </G>
    
    {/* Energy waves emanating from button click */}
    <G opacity="0.7">
      <Circle cx="100" cy="100" r="50" fill="none" stroke="rgba(34, 211, 238, 0.6)" strokeWidth="2" strokeDasharray="4,4" />
      <Circle cx="100" cy="100" r="70" fill="none" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="1" strokeDasharray="4,4" />
      <Circle cx="100" cy="100" r="90" fill="none" stroke="rgba(34, 211, 238, 0.2)" strokeWidth="1" strokeDasharray="4,4" />
    </G>
    
    {/* "Poof" effects around disappearing temptations */}
    <G opacity="0.5">
      {/* Poof cloud 1 */}
      <Circle cx="35" cy="35" r="8" fill="rgba(156, 163, 175, 0.4)" />
      <Circle cx="40" cy="32" r="6" fill="rgba(156, 163, 175, 0.4)" />
      <Circle cx="42" cy="38" r="5" fill="rgba(156, 163, 175, 0.4)" />
      
      {/* Poof cloud 2 */}
      <Circle cx="170" cy="40" r="7" fill="rgba(156, 163, 175, 0.4)" />
      <Circle cx="175" cy="37" r="5" fill="rgba(156, 163, 175, 0.4)" />
      <Circle cx="172" cy="43" r="4" fill="rgba(156, 163, 175, 0.4)" />
      
      {/* Poof cloud 3 */}
      <Circle cx="40" cy="165" r="6" fill="rgba(156, 163, 175, 0.4)" />
      <Circle cx="45" cy="162" r="4" fill="rgba(156, 163, 175, 0.4)" />
      <Circle cx="43" cy="168" r="3" fill="rgba(156, 163, 175, 0.4)" />
      
      {/* Poof cloud 4 */}
      <Circle cx="165" cy="160" r="7" fill="rgba(156, 163, 175, 0.4)" />
      <Circle cx="170" cy="157" r="5" fill="rgba(156, 163, 175, 0.4)" />
      <Circle cx="168" cy="163" r="4" fill="rgba(156, 163, 175, 0.4)" />
    </G>
    
    {/* Success indicators */}
    <G opacity="0.8">
      {/* Checkmarks appearing */}
      <Path
        d="M20 100 L25 105 L35 95"
        stroke="rgba(34, 197, 94, 0.8)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M165 100 L170 105 L180 95"
        stroke="rgba(34, 197, 94, 0.8)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </G>
    
    {/* Instant effect text */}
    <G opacity="0.6">
      <Circle cx="100" cy="160" r="25" fill="rgba(251, 191, 36, 0.2)" />
      <Text x="100" y="165" fontSize="10" fill="rgba(251, 191, 36, 1)" textAnchor="middle" fontWeight="bold">INSTANT</Text>
    </G>
    
    {/* Click motion lines */}
    <G opacity="0.5">
      <Line x1="85" y1="85" x2="80" y2="80" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="2" strokeLinecap="round" />
      <Line x1="115" y1="85" x2="120" y2="80" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="2" strokeLinecap="round" />
      <Line x1="85" y1="115" x2="80" y2="120" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="2" strokeLinecap="round" />
      <Line x1="115" y1="115" x2="120" y2="120" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="2" strokeLinecap="round" />
    </G>
  </Svg>
);

export default function QuitScreen() {
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
    // Run content exit animation
    animationRef.current?.runExitAnimation(() => {
      router.back();
    });
  };

  const handleContinue = () => {
    // Run content exit animation
    animationRef.current?.runExitAnimation(() => {
      // Continue to beat page
      router.push('/(onboarding)/beat');
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
              <OneClickIllustration />
            </View>
          </AnimatedContent>

          {/* Text content */}
          <AnimatedContent delay={200}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>Quit by a click</Text>
              
              <Text style={styles.description}>
                Whenever temptation hits, tap one button. The urge to procrastinate disappears instantly.
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