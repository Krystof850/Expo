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

// Human Head Profile with Brain Outline
const HeadProfileIllustration = () => (
  <Svg width="200" height="200" viewBox="0 0 200 200">
    {/* Head outline - side profile */}
    <Path
      d="M50 170C50 170 45 160 45 140C45 120 50 100 60 85C70 70 85 55 105 50C125 45 145 50 160 65C170 75 175 90 175 105C175 115 170 125 165 135C160 145 155 155 150 165C145 170 140 172 135 173C130 174 125 174 120 173C115 172 110 170 105 168C100 166 95 164 90 162C85 160 80 158 75 156C70 154 65 152 60 150C55 148 50 146 50 144V170Z"
      fill="rgba(255, 255, 255, 0.9)"
      stroke="rgba(255, 255, 255, 1)"
      strokeWidth="3"
    />
    
    {/* Eye */}
    <Circle cx="130" cy="90" r="3" fill="rgba(59, 130, 246, 0.8)" />
    
    {/* Nose line */}
    <Path
      d="M150 100C155 105 155 110 150 115"
      stroke="rgba(219, 234, 254, 0.6)"
      strokeWidth="2"
      fill="none"
    />
    
    {/* Mouth line */}
    <Path
      d="M140 130C145 132 150 130 155 128"
      stroke="rgba(219, 234, 254, 0.6)"
      strokeWidth="2"
      fill="none"
    />
    
    {/* Simple brain outline inside head */}
    <Path
      d="M70 80C70 80 65 75 65 70C65 65 70 60 80 58C90 56 100 58 110 60C120 62 130 65 140 70C150 75 155 85 155 95C155 105 150 115 140 120C130 125 120 127 110 125C100 123 90 120 80 115C70 110 65 100 65 90C65 85 68 82 70 80Z"
      fill="none"
      stroke="rgba(59, 130, 246, 0.8)"
      strokeWidth="2"
    />
    
    {/* Brain fold lines - simple curved lines inside */}
    <G opacity="0.6">
      <Path
        d="M80 75C90 73 100 75 110 73C120 75 130 73 135 75"
        stroke="rgba(59, 130, 246, 0.6)"
        strokeWidth="1.5"
        fill="none"
      />
      <Path
        d="M75 90C85 88 95 90 105 88C115 90 125 88 135 90"
        stroke="rgba(34, 211, 238, 0.6)"
        strokeWidth="1.5"
        fill="none"
      />
      <Path
        d="M80 105C90 103 100 105 110 103C120 105 125 103 130 105"
        stroke="rgba(251, 191, 36, 0.6)"
        strokeWidth="1.5"
        fill="none"
      />
    </G>
    
    {/* Small neural activity dots */}
    <G opacity="0.8">
      <Circle cx="90" cy="85" r="1.5" fill="rgba(251, 191, 36, 1)" />
      <Circle cx="110" cy="95" r="1.5" fill="rgba(251, 191, 36, 1)" />
      <Circle cx="125" cy="85" r="1.5" fill="rgba(251, 191, 36, 1)" />
    </G>
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
              <HeadProfileIllustration />
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