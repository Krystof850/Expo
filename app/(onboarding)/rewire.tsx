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

// 3D Brain Illustration - Realistic with depth and shadows
const Brain3DIllustration = () => (
  <Svg width="200" height="200" viewBox="0 0 200 200">
    <Defs>
      {/* 3D Brain gradient - main volume */}
      <LinearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="rgba(255, 255, 255, 1)" />
        <Stop offset="30%" stopColor="rgba(240, 248, 255, 0.95)" />
        <Stop offset="70%" stopColor="rgba(219, 234, 254, 0.8)" />
        <Stop offset="100%" stopColor="rgba(147, 197, 253, 0.6)" />
      </LinearGradient>
      
      {/* Shadow gradient */}
      <RadialGradient id="shadowGradient" cx="50%" cy="80%" r="60%">
        <Stop offset="0%" stopColor="rgba(0, 0, 0, 0.4)" />
        <Stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
      </RadialGradient>
      
      {/* Highlight gradient for top lighting */}
      <LinearGradient id="highlightGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <Stop offset="0%" stopColor="rgba(255, 255, 255, 0.9)" />
        <Stop offset="50%" stopColor="rgba(255, 255, 255, 0.3)" />
        <Stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
      </LinearGradient>
      
      {/* Fold shadow gradient */}
      <LinearGradient id="foldShadow" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="rgba(59, 130, 246, 0.6)" />
        <Stop offset="100%" stopColor="rgba(34, 211, 238, 0.4)" />
      </LinearGradient>
    </Defs>
    
    {/* Drop shadow underneath brain */}
    <Ellipse cx="105" cy="160" rx="65" ry="15" fill="url(#shadowGradient)" />
    
    {/* Main brain shape with 3D gradient */}
    <Path
      d="M100 35C75 35 55 45 45 65C40 60 30 60 25 70C20 80 25 90 35 95C30 105 35 120 50 130C65 140 85 145 100 145C115 145 135 140 150 130C165 120 170 105 165 95C175 90 180 80 175 70C170 60 160 60 155 65C145 45 125 35 100 35Z"
      fill="url(#brainGradient)"
      stroke="rgba(255, 255, 255, 0.8)"
      strokeWidth="2"
    />
    
    {/* Top highlight for 3D effect */}
    <Path
      d="M100 35C85 35 70 40 60 50C65 42 80 38 100 38C120 38 135 42 140 50C130 40 115 35 100 35Z"
      fill="url(#highlightGradient)"
      opacity="0.6"
    />
    
    {/* Brain hemispheres - left side darker for depth */}
    <Path
      d="M100 35C100 55 100 75 100 95C100 110 100 125 100 145"
      stroke="rgba(99, 102, 241, 0.4)"
      strokeWidth="1"
      strokeDasharray="3,3"
    />
    
    {/* 3D Brain folds with depth shadows */}
    <G>
      {/* Upper brain folds - with shadow underneath */}
      <Path
        d="M70 65C80 62 90 67 100 62C110 67 120 62 130 65"
        stroke="rgba(59, 130, 246, 0.3)"
        strokeWidth="4"
        fill="none"
      />
      <Path
        d="M70 65C80 60 90 65 100 60C110 65 120 60 130 65"
        stroke="rgba(255, 255, 255, 0.9)"
        strokeWidth="2"
        fill="none"
      />
      
      {/* Middle folds with 3D depth */}
      <Path
        d="M60 85C75 82 90 87 100 82C110 87 125 82 140 85"
        stroke="rgba(34, 211, 238, 0.3)"
        strokeWidth="4"
        fill="none"
      />
      <Path
        d="M60 85C75 80 90 85 100 80C110 85 125 80 140 85"
        stroke="rgba(255, 255, 255, 0.8)"
        strokeWidth="2"
        fill="none"
      />
      
      {/* Lower folds */}
      <Path
        d="M65 105C80 102 95 107 100 102C105 107 120 102 135 105"
        stroke="rgba(251, 191, 36, 0.3)"
        strokeWidth="4"
        fill="none"
      />
      <Path
        d="M65 105C80 100 95 105 100 100C105 105 120 100 135 105"
        stroke="rgba(255, 255, 255, 0.7)"
        strokeWidth="2"
        fill="none"
      />
      
      {/* Bottom detail folds */}
      <Path
        d="M75 120C85 117 95 122 105 117C115 122 125 117 125 120"
        stroke="rgba(147, 197, 253, 0.4)"
        strokeWidth="3"
        fill="none"
      />
      <Path
        d="M75 120C85 115 95 120 105 115C115 120 125 115 125 120"
        stroke="rgba(255, 255, 255, 0.6)"
        strokeWidth="1"
        fill="none"
      />
    </G>
    
    {/* 3D Neural activity points with glow */}
    <G>
      {/* Glowing base circles */}
      <Circle cx="75" cy="75" r="6" fill="rgba(251, 191, 36, 0.3)" />
      <Circle cx="85" cy="95" r="6" fill="rgba(251, 191, 36, 0.3)" />
      <Circle cx="125" cy="75" r="6" fill="rgba(251, 191, 36, 0.3)" />
      <Circle cx="115" cy="95" r="6" fill="rgba(251, 191, 36, 0.3)" />
      
      {/* 3D highlight neurons */}
      <Circle cx="75" cy="75" r="3" fill="rgba(255, 215, 0, 0.9)" />
      <Circle cx="85" cy="95" r="3" fill="rgba(255, 215, 0, 0.9)" />
      <Circle cx="125" cy="75" r="3" fill="rgba(255, 215, 0, 0.9)" />
      <Circle cx="115" cy="95" r="3" fill="rgba(255, 215, 0, 0.9)" />
      
      {/* Top highlights on neurons */}
      <Circle cx="74" cy="73" r="1" fill="rgba(255, 255, 255, 0.9)" />
      <Circle cx="84" cy="93" r="1" fill="rgba(255, 255, 255, 0.9)" />
      <Circle cx="124" cy="73" r="1" fill="rgba(255, 255, 255, 0.9)" />
      <Circle cx="114" cy="93" r="1" fill="rgba(255, 255, 255, 0.9)" />
    </G>
    
    {/* Subtle 3D edge highlight */}
    <Path
      d="M100 35C125 35 145 45 155 65C160 60 170 60 175 70C180 80 175 90 165 95C170 105 165 120 150 130C135 140 115 145 100 145"
      fill="none"
      stroke="rgba(255, 255, 255, 0.4)"
      strokeWidth="1"
      opacity="0.6"
    />
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
              <Brain3DIllustration />
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