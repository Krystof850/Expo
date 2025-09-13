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
import Svg, { Path, Circle, G, Polygon, Line, Rect, Text as SvgText } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedQuestionPage, AnimatedContent, AnimatedQuestionPageRef } from '../../components/AnimatedQuestionPage';
import { NextButton } from '../../components/Button';
import { SPACING } from '@/constants/theme';

// Progress Tracking Illustration Component
const ProgressTrackingIllustration = () => (
  <Svg width="200" height="200" viewBox="0 0 200 200">
    {/* Progress chart background */}
    <Rect x="30" y="40" width="140" height="100" rx="5" fill="rgba(59, 130, 246, 0.1)" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1" />
    
    {/* Chart grid lines */}
    <G opacity="0.3">
      <Line x1="30" y1="60" x2="170" y2="60" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="0.5" />
      <Line x1="30" y1="80" x2="170" y2="80" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="0.5" />
      <Line x1="30" y1="100" x2="170" y2="100" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="0.5" />
      <Line x1="30" y1="120" x2="170" y2="120" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="0.5" />
      
      <Line x1="50" y1="40" x2="50" y2="140" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="0.5" />
      <Line x1="90" y1="40" x2="90" y2="140" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="0.5" />
      <Line x1="130" y1="40" x2="130" y2="140" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="0.5" />
    </G>
    
    {/* Progress bars showing growth */}
    <G opacity="0.9">
      {/* Week 1 */}
      <Rect x="45" y="120" width="10" height="20" fill="rgba(34, 197, 94, 0.8)" />
      <SvgText x="50" y="155" fontSize="8" fill="rgba(59, 130, 246, 0.8)" textAnchor="middle">W1</SvgText>
      
      {/* Week 2 */}
      <Rect x="85" y="100" width="10" height="40" fill="rgba(34, 197, 94, 0.8)" />
      <SvgText x="90" y="155" fontSize="8" fill="rgba(59, 130, 246, 0.8)" textAnchor="middle">W2</SvgText>
      
      {/* Week 3 */}
      <Rect x="125" y="80" width="10" height="60" fill="rgba(34, 197, 94, 0.8)" />
      <SvgText x="130" y="155" fontSize="8" fill="rgba(59, 130, 246, 0.8)" textAnchor="middle">W3</SvgText>
      
      {/* Week 4 */}
      <Rect x="155" y="60" width="10" height="80" fill="rgba(34, 211, 238, 1)" />
      <SvgText x="160" y="155" fontSize="8" fill="rgba(59, 130, 246, 0.8)" textAnchor="middle">W4</SvgText>
    </G>
    
    {/* Streak counter */}
    <G opacity="0.9">
      <Rect x="20" y="20" width="60" height="15" rx="7" fill="rgba(251, 191, 36, 0.2)" stroke="rgba(251, 191, 36, 0.8)" strokeWidth="1" />
      <SvgText x="50" y="30" fontSize="10" fill="rgba(251, 191, 36, 1)" textAnchor="middle" fontWeight="bold">🔥 28 Days</SvgText>
    </G>
    
    {/* Completed tasks visualization */}
    <G opacity="0.8">
      {/* Task checkmarks */}
      <Circle cx="190" cy="50" r="8" fill="rgba(34, 197, 94, 0.2)" stroke="rgba(34, 197, 94, 1)" strokeWidth="2" />
      <Path d="M186 50 L189 53 L194 47" stroke="rgba(34, 197, 94, 1)" strokeWidth="2" fill="none" strokeLinecap="round" />
      
      <Circle cx="190" cy="70" r="8" fill="rgba(34, 197, 94, 0.2)" stroke="rgba(34, 197, 94, 1)" strokeWidth="2" />
      <Path d="M186 70 L189 73 L194 67" stroke="rgba(34, 197, 94, 1)" strokeWidth="2" fill="none" strokeLinecap="round" />
      
      <Circle cx="190" cy="90" r="8" fill="rgba(34, 197, 94, 0.2)" stroke="rgba(34, 197, 94, 1)" strokeWidth="2" />
      <Path d="M186 90 L189 93 L194 87" stroke="rgba(34, 197, 94, 1)" strokeWidth="2" fill="none" strokeLinecap="round" />
      
      {/* Current task */}
      <Circle cx="190" cy="110" r="8" fill="rgba(251, 191, 36, 0.2)" stroke="rgba(251, 191, 36, 1)" strokeWidth="2" />
      <Circle cx="190" cy="110" r="3" fill="rgba(251, 191, 36, 1)" />
    </G>
    
    {/* Habit formation visualization */}
    <G opacity="0.7">
      {/* Chain links representing habit */}
      <Circle cx="30" cy="170" r="6" fill="none" stroke="rgba(34, 211, 238, 0.8)" strokeWidth="3" />
      <Circle cx="45" cy="170" r="6" fill="none" stroke="rgba(34, 211, 238, 0.8)" strokeWidth="3" />
      <Circle cx="60" cy="170" r="6" fill="none" stroke="rgba(34, 211, 238, 0.8)" strokeWidth="3" />
      <Circle cx="75" cy="170" r="6" fill="none" stroke="rgba(34, 211, 238, 0.8)" strokeWidth="3" />
      <Circle cx="90" cy="170" r="6" fill="none" stroke="rgba(34, 211, 238, 0.8)" strokeWidth="3" />
      
      <SvgText x="60" y="190" fontSize="8" fill="rgba(34, 211, 238, 1)" textAnchor="middle">Lifelong Habits</SvgText>
    </G>
    
    {/* Achievement badges */}
    <G opacity="0.8">
      {/* First badge - 7 days */}
      <Polygon
        points="15,60 20,55 25,60 25,70 20,75 15,70"
        fill="rgba(34, 197, 94, 0.8)"
        stroke="rgba(22, 163, 74, 1)"
        strokeWidth="1"
      />
      <SvgText x="20" y="65" fontSize="6" fill="rgba(255, 255, 255, 1)" textAnchor="middle" fontWeight="bold">7</SvgText>
      
      {/* Second badge - 14 days */}
      <Polygon
        points="15,85 20,80 25,85 25,95 20,100 15,95"
        fill="rgba(251, 191, 36, 0.8)"
        stroke="rgba(245, 158, 11, 1)"
        strokeWidth="1"
      />
      <SvgText x="20" y="90" fontSize="6" fill="rgba(255, 255, 255, 1)" textAnchor="middle" fontWeight="bold">14</SvgText>
      
      {/* Third badge - 21 days */}
      <Polygon
        points="15,110 20,105 25,110 25,120 20,125 15,120"
        fill="rgba(168, 85, 247, 0.8)"
        stroke="rgba(147, 51, 234, 1)"
        strokeWidth="1"
      />
      <SvgText x="20" y="115" fontSize="6" fill="rgba(255, 255, 255, 1)" textAnchor="middle" fontWeight="bold">21</SvgText>
    </G>
    
    {/* Progress trend line */}
    <G opacity="0.8">
      <Path
        d="M50 125 Q70 115 90 105 Q110 85 130 75 Q140 65 160 65"
        stroke="rgba(34, 211, 238, 1)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Data points */}
      <Circle cx="50" cy="125" r="2" fill="rgba(34, 211, 238, 1)" />
      <Circle cx="90" cy="105" r="2" fill="rgba(34, 211, 238, 1)" />
      <Circle cx="130" cy="75" r="2" fill="rgba(34, 211, 238, 1)" />
      <Circle cx="160" cy="65" r="2" fill="rgba(34, 211, 238, 1)" />
    </G>
    
    {/* Victory celebration elements */}
    <G opacity="0.6">
      {/* Confetti */}
      <Rect x="100" y="25" width="3" height="3" fill="rgba(251, 191, 36, 0.8)" transform="rotate(45 101.5 26.5)" />
      <Rect x="120" y="30" width="3" height="3" fill="rgba(34, 197, 94, 0.8)" transform="rotate(45 121.5 31.5)" />
      <Rect x="140" y="28" width="3" height="3" fill="rgba(239, 68, 68, 0.8)" transform="rotate(45 141.5 29.5)" />
      <Rect x="110" y="35" width="3" height="3" fill="rgba(34, 211, 238, 0.8)" transform="rotate(45 111.5 36.5)" />
    </G>
  </Svg>
);

export default function TrackScreen() {
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
      // Continue to level page
      router.push('/(onboarding)/level');
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
              <ProgressTrackingIllustration />
            </View>
          </AnimatedContent>

          {/* Text content */}
          <AnimatedContent delay={200}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>Track your wins</Text>
              
              <Text style={styles.description}>
                See your streaks and progress grow. Every task completed builds lifelong habits.
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