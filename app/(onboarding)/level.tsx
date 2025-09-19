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

// Celebrating Person with Realistic Crown Illustration
const CelebratingPersonWithRealisticCrown = () => (
  <Svg width="280" height="280" viewBox="0 0 200 200">
    {/* Realistic golden crown */}
    <G>
      {/* Crown base band */}
      <Rect x="85" y="78" width="30" height="6" rx="3" fill="rgba(251, 191, 36, 1)" stroke="rgba(245, 158, 11, 1)" strokeWidth="1" />
      
      {/* Crown spikes with realistic proportions */}
      {/* Left spike */}
      <Path
        d="M87 78 L89 65 L91 78 Z"
        fill="rgba(251, 191, 36, 1)"
        stroke="rgba(245, 158, 11, 1)"
        strokeWidth="1"
      />
      
      {/* Center tall spike */}
      <Path
        d="M96 78 L100 58 L104 78 Z"
        fill="rgba(251, 191, 36, 1)"
        stroke="rgba(245, 158, 11, 1)"
        strokeWidth="1"
      />
      
      {/* Right spike */}
      <Path
        d="M109 78 L111 65 L113 78 Z"
        fill="rgba(251, 191, 36, 1)"
        stroke="rgba(245, 158, 11, 1)"
        strokeWidth="1"
      />
      
      {/* Crown decorative elements */}
      <Circle cx="89" cy="70" r="1.5" fill="rgba(220, 38, 38, 1)" />
      <Circle cx="100" cy="66" r="2" fill="rgba(34, 197, 94, 1)" />
      <Circle cx="111" cy="70" r="1.5" fill="rgba(34, 211, 238, 1)" />
      
      {/* Crown highlights for realism */}
      <Path d="M100 58 L101 60 L99 60 Z" fill="rgba(254, 240, 138, 1)" />
      <Line x1="89" y1="65" x2="90" y2="67" stroke="rgba(254, 240, 138, 0.8)" strokeWidth="1" />
      <Line x1="111" y1="65" x2="110" y2="67" stroke="rgba(254, 240, 138, 0.8)" strokeWidth="1" />
    </G>
    
    {/* Person's head - larger */}
    <Circle cx="100" cy="92" r="14" fill="rgba(255, 255, 255, 1)" stroke="rgba(59, 130, 246, 1)" strokeWidth="2" />
    
    {/* Person's body - larger */}
    <Rect x="90" y="104" width="20" height="30" rx="3" fill="rgba(59, 130, 246, 1)" />
    
    {/* Arms raised high above head - larger */}
    <G>
      {/* Left arm raised */}
      <Path d="M90 108 L75 90 L70 85" stroke="rgba(59, 130, 246, 1)" strokeWidth="4" strokeLinecap="round" />
      {/* Right arm raised */}
      <Path d="M110 108 L125 90 L130 85" stroke="rgba(59, 130, 246, 1)" strokeWidth="4" strokeLinecap="round" />
    </G>
    
    {/* Legs in simple stance - larger */}
    <G>
      {/* Left leg */}
      <Path d="M95 134 L88 148 L83 155" stroke="rgba(59, 130, 246, 1)" strokeWidth="4" strokeLinecap="round" />
      {/* Right leg */}
      <Path d="M105 134 L112 148 L117 155" stroke="rgba(59, 130, 246, 1)" strokeWidth="4" strokeLinecap="round" />
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
              <CelebratingPersonWithRealisticCrown />
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