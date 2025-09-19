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
import Svg, { Path, Circle, G, Polygon, Line } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedQuestionPage, AnimatedContent, AnimatedQuestionPageRef } from '../../components/AnimatedQuestionPage';
import { NextButton } from '../../components/Button';
import { SPACING } from '@/constants/theme';
import * as Haptics from 'expo-haptics';

// Caring Hands with Heart Illustration
const CaringHandsIllustration = () => (
  <Svg width="200" height="200" viewBox="0 0 200 200">
    {/* Left hand */}
    <Path
      d="M50 120 C45 115 45 110 50 105 C55 100 65 95 75 100 C80 95 85 95 90 100 C95 105 95 110 100 115 L100 140 C100 150 95 160 85 165 C75 170 65 165 55 160 C50 155 45 145 45 135 L45 125 C45 122 47 120 50 120 Z"
      fill="rgba(255, 255, 255, 0.9)"
      stroke="rgba(255, 255, 255, 0.7)"
      strokeWidth="3"
    />
    
    {/* Right hand */}
    <Path
      d="M150 120 C155 115 155 110 150 105 C145 100 135 95 125 100 C120 95 115 95 110 100 C105 105 105 110 100 115 L100 140 C100 150 105 160 115 165 C125 170 135 165 145 160 C150 155 155 145 155 135 L155 125 C155 122 153 120 150 120 Z"
      fill="rgba(255, 255, 255, 0.9)"
      stroke="rgba(255, 255, 255, 0.7)"
      strokeWidth="3"
    />
    
    {/* Heart in the center */}
    <Path
      d="M100 95 C95 85 85 80 80 85 C75 90 75 95 80 100 L100 120 L120 100 C125 95 125 90 120 85 C115 80 105 85 100 95 Z"
      fill="rgba(239, 68, 68, 0.9)"
      stroke="rgba(220, 38, 38, 0.8)"
      strokeWidth="2"
    />
    
    {/* Heart shine/highlight */}
    <Path
      d="M95 90 C92 88 90 88 88 90 C86 92 86 94 88 96 L95 103 L95 90 Z"
      fill="rgba(252, 165, 165, 0.7)"
    />
    
    {/* Hand details - left thumb */}
    <Path
      d="M50 115 C45 115 40 120 40 125 C40 130 45 135 50 135 C55 135 60 130 60 125 C60 120 55 115 50 115 Z"
      fill="rgba(240, 240, 240, 0.8)"
      stroke="rgba(200, 200, 200, 0.6)"
      strokeWidth="2"
    />
    
    {/* Hand details - right thumb */}
    <Path
      d="M150 115 C155 115 160 120 160 125 C160 130 155 135 150 135 C145 135 140 130 140 125 C140 120 145 115 150 115 Z"
      fill="rgba(240, 240, 240, 0.8)"
      stroke="rgba(200, 200, 200, 0.6)"
      strokeWidth="2"
    />
    
    {/* Gentle glow around hands */}
    <Circle
      cx="100"
      cy="130"
      r="80"
      fill="rgba(59, 130, 246, 0.1)"
      opacity="0.6"
    />
    
    {/* Small hearts floating around */}
    <G opacity="0.5">
      <Path
        d="M150 70 C148 65 145 63 142 65 C139 67 139 70 142 73 L150 80 L158 73 C161 70 161 67 158 65 C155 63 152 65 150 70 Z"
        fill="rgba(239, 68, 68, 0.6)"
      />
      
      <Path
        d="M60 75 C58 70 55 68 52 70 C49 72 49 75 52 78 L60 85 L68 78 C71 75 71 72 68 70 C65 68 62 70 60 75 Z"
        fill="rgba(239, 68, 68, 0.6)"
      />
      
      <Path
        d="M170 140 C168 135 165 133 162 135 C159 137 159 140 162 143 L170 150 L178 143 C181 140 181 137 178 135 C175 133 172 135 170 140 Z"
        fill="rgba(239, 68, 68, 0.6)"
      />
      
      <Path
        d="M30 150 C28 145 25 143 22 145 C19 147 19 150 22 153 L30 160 L38 153 C41 150 41 147 38 145 C35 143 32 145 30 150 Z"
        fill="rgba(239, 68, 68, 0.6)"
      />
    </G>
    
    {/* Sparkles of hope */}
    <G opacity="0.7">
      <Circle cx="70" cy="50" r="2" fill="rgba(255, 255, 255, 0.8)" />
      <Circle cx="130" cy="45" r="1.5" fill="rgba(255, 255, 255, 0.8)" />
      <Circle cx="40" cy="80" r="2" fill="rgba(255, 255, 255, 0.8)" />
      <Circle cx="160" cy="90" r="1.5" fill="rgba(255, 255, 255, 0.8)" />
      <Circle cx="180" cy="120" r="2" fill="rgba(255, 255, 255, 0.8)" />
      <Circle cx="20" cy="120" r="1.5" fill="rgba(255, 255, 255, 0.8)" />
    </G>
  </Svg>
);


export default function HopeScreen() {
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
      // Continue to welcome page
      router.push('/(onboarding)/welcome');
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
              <CaringHandsIllustration />
            </View>
          </AnimatedContent>

          {/* Text content */}
          <AnimatedContent delay={200}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>But there's hope</Text>
              
              <Text style={styles.description}>
                With Unloop, you can reboot your brain, rebuild discipline, and take back control.
              </Text>
            </View>
          </AnimatedContent>
        </View>
      </AnimatedQuestionPage>
      
      {/* Next button - OUTSIDE of animation wrapper */}
      <View style={[styles.nextContainer, { paddingBottom: insets.bottom + SPACING.page }]}>
        <NextButton
          title="Let's Do It"
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