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

// Victory Celebration with Radiating Energy
const VictoryCelebrationIllustration = () => (
  <Svg width="280" height="280" viewBox="0 0 200 200">
    {/* Radiating success rays from center */}
    <G opacity="0.6">
      <Line x1="100" y1="20" x2="100" y2="35" stroke="rgba(251, 191, 36, 0.8)" strokeWidth="2" strokeLinecap="round" />
      <Line x1="135" y1="35" x2="125" y2="45" stroke="rgba(251, 191, 36, 0.8)" strokeWidth="2" strokeLinecap="round" />
      <Line x1="155" y1="70" x2="140" y2="75" stroke="rgba(251, 191, 36, 0.8)" strokeWidth="2" strokeLinecap="round" />
      <Line x1="155" y1="130" x2="140" y2="125" stroke="rgba(251, 191, 36, 0.8)" strokeWidth="2" strokeLinecap="round" />
      <Line x1="135" y1="165" x2="125" y2="155" stroke="rgba(251, 191, 36, 0.8)" strokeWidth="2" strokeLinecap="round" />
      <Line x1="65" y1="165" x2="75" y2="155" stroke="rgba(251, 191, 36, 0.8)" strokeWidth="2" strokeLinecap="round" />
      <Line x1="45" y1="130" x2="60" y2="125" stroke="rgba(251, 191, 36, 0.8)" strokeWidth="2" strokeLinecap="round" />
      <Line x1="45" y1="70" x2="60" y2="75" stroke="rgba(251, 191, 36, 0.8)" strokeWidth="2" strokeLinecap="round" />
      <Line x1="65" y1="35" x2="75" y2="45" stroke="rgba(251, 191, 36, 0.8)" strokeWidth="2" strokeLinecap="round" />
    </G>
    
    {/* Victory crown - modern design */}
    <G>
      {/* Crown base with gradient effect */}
      <Rect x="82" y="76" width="36" height="8" rx="4" fill="rgba(251, 191, 36, 1)" stroke="rgba(245, 158, 11, 1)" strokeWidth="1" />
      
      {/* Modern crown peaks */}
      <Path d="M84 76 L88 58 L92 76 Z" fill="rgba(251, 191, 36, 1)" stroke="rgba(245, 158, 11, 1)" strokeWidth="1" />
      <Path d="M96 76 L100 50 L104 76 Z" fill="rgba(251, 191, 36, 1)" stroke="rgba(245, 158, 11, 1)" strokeWidth="1" />
      <Path d="M108 76 L112 58 L116 76 Z" fill="rgba(251, 191, 36, 1)" stroke="rgba(245, 158, 11, 1)" strokeWidth="1" />
      
      {/* Crown gems with glow */}
      <Circle cx="88" cy="67" r="2" fill="rgba(239, 68, 68, 1)" opacity="0.9" />
      <Circle cx="100" cy="59" r="2.5" fill="rgba(34, 197, 94, 1)" opacity="0.9" />
      <Circle cx="112" cy="67" r="2" fill="rgba(59, 130, 246, 1)" opacity="0.9" />
      
      {/* Crown shine effects */}
      <Path d="M100 50 L101 52 L99 52 Z" fill="rgba(254, 240, 138, 1)" />
      <Line x1="88" y1="58" x2="89" y2="60" stroke="rgba(254, 240, 138, 0.9)" strokeWidth="1.5" />
      <Line x1="112" y1="58" x2="111" y2="60" stroke="rgba(254, 240, 138, 0.9)" strokeWidth="1.5" />
    </G>
    
    {/* Person's head with subtle gradient */}
    <Circle cx="100" cy="94" r="16" fill="rgba(255, 255, 255, 1)" stroke="rgba(59, 130, 246, 1)" strokeWidth="2" />
    
    {/* Cheerful face */}
    <G>
      {/* Eyes */}
      <Circle cx="94" cy="90" r="1.5" fill="rgba(59, 130, 246, 1)" />
      <Circle cx="106" cy="90" r="1.5" fill="rgba(59, 130, 246, 1)" />
      {/* Happy smile */}
      <Path d="M92 98 Q100 104 108 98" stroke="rgba(59, 130, 246, 1)" strokeWidth="2" fill="none" strokeLinecap="round" />
    </G>
    
    {/* Person's body with victory pose */}
    <Rect x="88" y="108" width="24" height="32" rx="4" fill="rgba(59, 130, 246, 1)" />
    
    {/* Dynamic victory arms */}
    <G>
      {/* Left arm raised triumphantly */}
      <Path d="M88 115 L68 95 L60 88" stroke="rgba(59, 130, 246, 1)" strokeWidth="5" strokeLinecap="round" />
      {/* Right arm raised triumphantly */}
      <Path d="M112 115 L132 95 L140 88" stroke="rgba(59, 130, 246, 1)" strokeWidth="5" strokeLinecap="round" />
      
      {/* Victory fists */}
      <Circle cx="60" cy="88" r="4" fill="rgba(255, 255, 255, 1)" stroke="rgba(59, 130, 246, 1)" strokeWidth="2" />
      <Circle cx="140" cy="88" r="4" fill="rgba(255, 255, 255, 1)" stroke="rgba(59, 130, 246, 1)" strokeWidth="2" />
    </G>
    
    {/* Confident stance legs */}
    <G>
      {/* Left leg */}
      <Path d="M94 140 L85 155 L80 165" stroke="rgba(59, 130, 246, 1)" strokeWidth="5" strokeLinecap="round" />
      {/* Right leg */}
      <Path d="M106 140 L115 155 L120 165" stroke="rgba(59, 130, 246, 1)" strokeWidth="5" strokeLinecap="round" />
    </G>
    
    {/* Success sparkles around the figure */}
    <G opacity="0.8">
      <Circle cx="130" cy="110" r="1.5" fill="rgba(251, 191, 36, 1)" />
      <Circle cx="70" cy="120" r="1" fill="rgba(251, 191, 36, 1)" />
      <Circle cx="140" cy="140" r="1" fill="rgba(251, 191, 36, 1)" />
      <Circle cx="60" cy="140" r="1.5" fill="rgba(251, 191, 36, 1)" />
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
              <VictoryCelebrationIllustration />
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
    marginTop: 60,
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