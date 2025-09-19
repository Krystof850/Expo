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
import * as Haptics from 'expo-haptics';

// Clean Progress Graph with Curve
const CleanProgressGraph = () => (
  <Svg width="200" height="200" viewBox="0 0 200 200">
    {/* Background grid */}
    <G opacity="0.1">
      {/* Horizontal grid lines */}
      <Line x1="30" y1="50" x2="180" y2="50" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
      <Line x1="30" y1="80" x2="180" y2="80" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
      <Line x1="30" y1="110" x2="180" y2="110" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
      <Line x1="30" y1="140" x2="180" y2="140" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
      
      {/* Vertical grid lines */}
      <Line x1="50" y1="40" x2="50" y2="150" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
      <Line x1="80" y1="40" x2="80" y2="150" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
      <Line x1="110" y1="40" x2="110" y2="150" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
      <Line x1="140" y1="40" x2="140" y2="150" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
      <Line x1="170" y1="40" x2="170" y2="150" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
    </G>
    
    {/* Gradient fill under curve */}
    <defs>
      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
        <stop offset="100%" stopColor="rgba(59, 130, 246, 0.05)" />
      </linearGradient>
    </defs>
    
    {/* Fill area under curve */}
    <Path 
      d="M50 140 Q65 130 80 120 Q95 100 110 85 Q125 70 140 60 Q155 55 170 50 L170 150 L50 150 Z" 
      fill="url(#progressGradient)"
    />
    
    {/* Main progress curve */}
    <Path 
      d="M50 140 Q65 130 80 120 Q95 100 110 85 Q125 70 140 60 Q155 55 170 50" 
      stroke="rgba(59, 130, 246, 1)" 
      strokeWidth="3" 
      fill="none" 
      strokeLinecap="round"
    />
    
    {/* Data points */}
    <G>
      <Circle cx="50" cy="140" r="4" fill="rgba(255, 255, 255, 1)" stroke="rgba(59, 130, 246, 1)" strokeWidth="2" />
      <Circle cx="80" cy="120" r="4" fill="rgba(255, 255, 255, 1)" stroke="rgba(59, 130, 246, 1)" strokeWidth="2" />
      <Circle cx="110" cy="85" r="4" fill="rgba(255, 255, 255, 1)" stroke="rgba(59, 130, 246, 1)" strokeWidth="2" />
      <Circle cx="140" cy="60" r="4" fill="rgba(255, 255, 255, 1)" stroke="rgba(59, 130, 246, 1)" strokeWidth="2" />
      <Circle cx="170" cy="50" r="4" fill="rgba(255, 255, 255, 1)" stroke="rgba(147, 197, 253, 1)" strokeWidth="2" />
    </G>
    
    {/* Axis labels */}
    <G opacity="0.6">
      <SvgText x="50" y="165" fontSize="8" fill="rgba(255, 255, 255, 0.7)" textAnchor="middle">W1</SvgText>
      <SvgText x="80" y="165" fontSize="8" fill="rgba(255, 255, 255, 0.7)" textAnchor="middle">W2</SvgText>
      <SvgText x="110" y="165" fontSize="8" fill="rgba(255, 255, 255, 0.7)" textAnchor="middle">W3</SvgText>
      <SvgText x="140" y="165" fontSize="8" fill="rgba(255, 255, 255, 0.7)" textAnchor="middle">W4</SvgText>
      <SvgText x="170" y="165" fontSize="8" fill="rgba(255, 255, 255, 0.7)" textAnchor="middle">W5</SvgText>
    </G>
    
    {/* Y-axis values */}
    <G opacity="0.5">
      <SvgText x="25" y="145" fontSize="7" fill="rgba(255, 255, 255, 0.6)" textAnchor="middle">0</SvgText>
      <SvgText x="25" y="115" fontSize="7" fill="rgba(255, 255, 255, 0.6)" textAnchor="middle">25</SvgText>
      <SvgText x="25" y="85" fontSize="7" fill="rgba(255, 255, 255, 0.6)" textAnchor="middle">50</SvgText>
      <SvgText x="25" y="55" fontSize="7" fill="rgba(255, 255, 255, 0.6)" textAnchor="middle">75</SvgText>
    </G>
    
    {/* Progress indicator */}
    <G opacity="0.8">
      <SvgText x="100" y="25" fontSize="10" fill="rgba(147, 197, 253, 1)" textAnchor="middle" fontWeight="bold">Progress Trend</SvgText>
    </G>
    
    {/* Trend arrow */}
    <G opacity="0.7">
      <Path d="M165 55 L170 45 L175 55" stroke="rgba(147, 197, 253, 1)" strokeWidth="2" fill="none" strokeLinecap="round" />
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
              <CleanProgressGraph />
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