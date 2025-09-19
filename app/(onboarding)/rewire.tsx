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

// Modern Brain Illustration Component
const ModernBrainIllustration = () => (
  <Svg width="200" height="200" viewBox="0 0 200 200">
    {/* Main brain shape - more anatomically correct */}
    <Path
      d="M100 50C85 50 70 55 60 65C55 60 45 58 40 62C35 55 25 52 20 60C15 65 20 75 25 80C20 85 15 95 25 100C30 110 40 115 50 110C55 120 70 125 85 120C100 130 115 125 130 120C145 125 160 120 165 110C175 115 185 110 190 100C200 95 195 85 190 80C195 75 200 65 195 60C190 52 180 55 175 62C170 58 160 60 155 65C145 55 130 50 115 50C110 50 105 50 100 50Z"
      fill="rgba(255, 255, 255, 0.1)"
      stroke="rgba(255, 255, 255, 0.7)"
      strokeWidth="3"
    />
    
    {/* Brain hemispheres division */}
    <Path
      d="M100 50 C100 70 100 90 100 120"
      stroke="rgba(255, 255, 255, 0.3)"
      strokeWidth="2"
      strokeDasharray="4,4"
    />
    
    {/* Left hemisphere details */}
    <G opacity="0.6">
      <Path
        d="M60 70 C70 65 80 70 85 80"
        stroke="rgba(59, 130, 246, 0.8)"
        strokeWidth="2"
        fill="none"
      />
      <Path
        d="M50 85 C60 80 70 85 75 95"
        stroke="rgba(59, 130, 246, 0.8)"
        strokeWidth="2"
        fill="none"
      />
      <Path
        d="M40 100 C50 95 60 100 65 110"
        stroke="rgba(59, 130, 246, 0.8)"
        strokeWidth="2"
        fill="none"
      />
    </G>
    
    {/* Right hemisphere details */}
    <G opacity="0.6">
      <Path
        d="M140 70 C130 65 120 70 115 80"
        stroke="rgba(34, 211, 238, 0.8)"
        strokeWidth="2"
        fill="none"
      />
      <Path
        d="M150 85 C140 80 130 85 125 95"
        stroke="rgba(34, 211, 238, 0.8)"
        strokeWidth="2"
        fill="none"
      />
      <Path
        d="M160 100 C150 95 140 100 135 110"
        stroke="rgba(34, 211, 238, 0.8)"
        strokeWidth="2"
        fill="none"
      />
    </G>
    
    {/* Neural networks - glowing connections */}
    <G opacity="0.8">
      {/* Main neural pathways */}
      <Path
        d="M70 75 Q85 70 100 80 Q115 70 130 75"
        stroke="rgba(251, 191, 36, 0.9)"
        strokeWidth="3"
        fill="none"
      />
      <Path
        d="M60 90 Q80 85 100 95 Q120 85 140 90"
        stroke="rgba(251, 191, 36, 0.9)"
        strokeWidth="3"
        fill="none"
      />
      <Path
        d="M55 105 Q75 100 100 110 Q125 100 145 105"
        stroke="rgba(251, 191, 36, 0.9)"
        strokeWidth="3"
        fill="none"
      />
    </G>
    
    {/* Synaptic nodes */}
    <G>
      <Circle cx="70" cy="75" r="4" fill="rgba(251, 191, 36, 1)" opacity="0.9" />
      <Circle cx="100" cy="80" r="4" fill="rgba(251, 191, 36, 1)" opacity="0.9" />
      <Circle cx="130" cy="75" r="4" fill="rgba(251, 191, 36, 1)" opacity="0.9" />
      <Circle cx="60" cy="90" r="4" fill="rgba(251, 191, 36, 1)" opacity="0.9" />
      <Circle cx="100" cy="95" r="4" fill="rgba(251, 191, 36, 1)" opacity="0.9" />
      <Circle cx="140" cy="90" r="4" fill="rgba(251, 191, 36, 1)" opacity="0.9" />
      <Circle cx="55" cy="105" r="4" fill="rgba(251, 191, 36, 1)" opacity="0.9" />
      <Circle cx="100" cy="110" r="4" fill="rgba(251, 191, 36, 1)" opacity="0.9" />
      <Circle cx="145" cy="105" r="4" fill="rgba(251, 191, 36, 1)" opacity="0.9" />
    </G>
    
    {/* Electrical impulses - small sparks */}
    <G opacity="0.7">
      {/* Sparks around synapses */}
      <Circle cx="67" cy="72" r="1.5" fill="rgba(255, 255, 255, 0.9)" />
      <Circle cx="73" cy="78" r="1.5" fill="rgba(255, 255, 255, 0.9)" />
      <Circle cx="97" cy="77" r="1.5" fill="rgba(255, 255, 255, 0.9)" />
      <Circle cx="103" cy="83" r="1.5" fill="rgba(255, 255, 255, 0.9)" />
      <Circle cx="127" cy="72" r="1.5" fill="rgba(255, 255, 255, 0.9)" />
      <Circle cx="133" cy="78" r="1.5" fill="rgba(255, 255, 255, 0.9)" />
    </G>
    
    {/* Energy waves emanating from brain */}
    <G opacity="0.4">
      <Circle cx="100" cy="85" r="70" fill="none" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="1" strokeDasharray="2,4" />
      <Circle cx="100" cy="85" r="90" fill="none" stroke="rgba(34, 211, 238, 0.3)" strokeWidth="1" strokeDasharray="2,4" />
      <Circle cx="100" cy="85" r="110" fill="none" stroke="rgba(34, 211, 238, 0.2)" strokeWidth="1" strokeDasharray="2,4" />
    </G>
    
    {/* Thought bubbles - creative ideas */}
    <G opacity="0.6">
      <Circle cx="45" cy="45" r="6" fill="rgba(255, 255, 255, 0.3)" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" />
      <Circle cx="50" cy="35" r="4" fill="rgba(255, 255, 255, 0.3)" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" />
      <Circle cx="55" cy="28" r="2" fill="rgba(255, 255, 255, 0.3)" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" />
      
      <Circle cx="155" cy="45" r="6" fill="rgba(255, 255, 255, 0.3)" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" />
      <Circle cx="150" cy="35" r="4" fill="rgba(255, 255, 255, 0.3)" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" />
      <Circle cx="145" cy="28" r="2" fill="rgba(255, 255, 255, 0.3)" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" />
    </G>
    
    {/* Central focus point - consciousness */}
    <Circle cx="100" cy="85" r="8" fill="rgba(251, 191, 36, 0.3)" stroke="rgba(251, 191, 36, 0.8)" strokeWidth="2" />
    <Circle cx="100" cy="85" r="4" fill="rgba(251, 191, 36, 0.8)" />
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
              <ModernBrainIllustration />
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