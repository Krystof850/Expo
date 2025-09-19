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
import { Asset } from 'expo-asset';
import * as Haptics from 'expo-haptics';

// Celebrating Person with Crown Illustration
const CelebratingPersonIllustration = () => (
  <Svg width="200" height="200" viewBox="0 0 200 200">
    {/* Golden crown */}
    <G>
      <Path
        d="M85 70 L90 55 L95 70 L100 55 L105 70 L110 55 L115 70 L118 75 L82 75 Z"
        fill="rgba(251, 191, 36, 0.9)"
        stroke="rgba(245, 158, 11, 1)"
        strokeWidth="2"
      />
      {/* Crown jewels */}
      <Circle cx="90" cy="65" r="2" fill="rgba(34, 211, 238, 1)" />
      <Circle cx="100" cy="60" r="2" fill="rgba(220, 38, 38, 1)" />
      <Circle cx="110" cy="65" r="2" fill="rgba(34, 197, 94, 1)" />
    </G>
    
    {/* Person's head */}
    <Circle cx="100" cy="85" r="12" fill="rgba(255, 255, 255, 0.9)" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="1" />
    
    {/* Person's body */}
    <Rect x="93" y="95" width="14" height="25" rx="3" fill="rgba(59, 130, 246, 1)" />
    
    {/* Arms raised high above head */}
    <G>
      {/* Left arm raised */}
      <Path d="M93 100 L80 85 L75 80" stroke="rgba(59, 130, 246, 1)" strokeWidth="4" strokeLinecap="round" />
      {/* Right arm raised */}
      <Path d="M107 100 L120 85 L125 80" stroke="rgba(59, 130, 246, 1)" strokeWidth="4" strokeLinecap="round" />
    </G>
    
    {/* Legs in excited stance */}
    <G>
      {/* Left leg */}
      <Path d="M96 120 L90 135 L85 140" stroke="rgba(59, 130, 246, 1)" strokeWidth="4" strokeLinecap="round" />
      {/* Right leg */}
      <Path d="M104 120 L110 135 L115 140" stroke="rgba(59, 130, 246, 1)" strokeWidth="4" strokeLinecap="round" />
    </G>
    
    {/* Celebration sparkles */}
    <G opacity="0.8">
      <Path d="M65 60 L70 65 L65 70 L60 65 Z" fill="rgba(251, 191, 36, 1)" />
      <Path d="M135 55 L140 60 L135 65 L130 60 Z" fill="rgba(251, 191, 36, 1)" />
      <Path d="M50 90 L55 95 L50 100 L45 95 Z" fill="rgba(34, 211, 238, 1)" />
      <Path d="M150 85 L155 90 L150 95 L145 90 Z" fill="rgba(34, 211, 238, 1)" />
      <Path d="M70 120 L75 125 L70 130 L65 125 Z" fill="rgba(34, 197, 94, 1)" />
      <Path d="M130 115 L135 120 L130 125 L125 120 Z" fill="rgba(34, 197, 94, 1)" />
    </G>
    
    {/* Victory glow around person */}
    <G opacity="0.4">
      <Circle cx="100" cy="110" r="35" fill="none" stroke="rgba(251, 191, 36, 0.6)" strokeWidth="2" strokeDasharray="4,4" />
    </G>
  </Svg>
);

export default function LevelScreen() {
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

  const handleContinue = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Preload benefits chart image for instant loading
    try {
      const benefitsChart = require('@/attached_assets/ChatGPT Image Sep 13, 2025, 03_26_59 PM_1757748428786.png');
      await Asset.fromModule(benefitsChart).downloadAsync();
      console.log('✅ Benefits chart preloaded');
    } catch (error) {
      console.log('⚠️ Benefits chart preload failed:', error);
    }
    
    // Run content exit animation
    animationRef.current?.runExitAnimation(() => {
      // Continue to benefits page
      router.push('/(onboarding)/benefits');
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
              <CelebratingPersonIllustration />
            </View>
          </AnimatedContent>

          {/* Text content */}
          <AnimatedContent delay={200}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>Level up your life</Text>
              
              <Text style={styles.description}>
                Ending procrastination transforms your mind and life. With Unloop, you become unstoppable!
              </Text>
            </View>
          </AnimatedContent>
        </View>
      </AnimatedQuestionPage>
      
      {/* Next button - OUTSIDE of animation wrapper */}
      <View style={[styles.nextContainer, { paddingBottom: insets.bottom + SPACING.page }]}>
        <NextButton
          title="Start My Journey"
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