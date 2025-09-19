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

// Simple Brain Illustration Component - Based on reference image
const SimpleBrainIllustration = () => (
  <Svg width="200" height="200" viewBox="0 0 200 200">
    {/* Main brain outline - simple and recognizable */}
    <Path
      d="M100 60C85 60 70 65 60 75C55 70 45 68 40 72C35 65 25 62 20 70C18 75 22 80 25 85C22 90 18 95 22 100C25 105 30 110 40 105C45 115 55 120 70 115C80 125 90 130 100 125C110 130 120 125 130 115C145 120 155 115 160 105C170 110 175 105 178 100C182 95 178 90 175 85C178 80 182 75 180 70C175 62 165 65 160 72C155 68 145 70 140 75C130 65 115 60 100 60Z"
      fill="rgba(255, 255, 255, 0.9)"
      stroke="rgba(255, 255, 255, 1)"
      strokeWidth="4"
    />
    
    {/* Central division line - clear hemisphere separation */}
    <Path
      d="M100 60C100 80 100 100 100 125"
      stroke="rgba(59, 130, 246, 0.8)"
      strokeWidth="3"
    />
    
    {/* Left hemisphere brain folds - simple curved lines */}
    <G>
      <Path
        d="M60 80C70 75 80 80 85 90"
        stroke="rgba(59, 130, 246, 0.8)"
        strokeWidth="3"
        fill="none"
      />
      <Path
        d="M50 95C60 90 70 95 75 105"
        stroke="rgba(59, 130, 246, 0.8)"
        strokeWidth="3"
        fill="none"
      />
      <Path
        d="M65 100C75 95 85 100 90 110"
        stroke="rgba(59, 130, 246, 0.8)"
        strokeWidth="3"
        fill="none"
      />
    </G>
    
    {/* Right hemisphere brain folds - mirror of left */}
    <G>
      <Path
        d="M140 80C130 75 120 80 115 90"
        stroke="rgba(34, 211, 238, 0.8)"
        strokeWidth="3"
        fill="none"
      />
      <Path
        d="M150 95C140 90 130 95 125 105"
        stroke="rgba(34, 211, 238, 0.8)"
        strokeWidth="3"
        fill="none"
      />
      <Path
        d="M135 100C125 95 115 100 110 110"
        stroke="rgba(34, 211, 238, 0.8)"
        strokeWidth="3"
        fill="none"
      />
    </G>
    
    {/* Simple neural activity indicators */}
    <G opacity="0.8">
      <Circle cx="75" cy="85" r="3" fill="rgba(251, 191, 36, 1)" />
      <Circle cx="85" cy="100" r="3" fill="rgba(251, 191, 36, 1)" />
      <Circle cx="125" cy="85" r="3" fill="rgba(251, 191, 36, 1)" />
      <Circle cx="115" cy="100" r="3" fill="rgba(251, 191, 36, 1)" />
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
              <SimpleBrainIllustration />
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