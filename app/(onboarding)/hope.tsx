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

// Dawn of Hope Illustration
const DawnOfHopeIllustration = () => (
  <Svg width="200" height="200" viewBox="0 0 200 200">
    {/* Dark horizon/ground */}
    <Path
      d="M0 160 L200 160 L200 200 L0 200 Z"
      fill="rgba(0, 0, 0, 0.3)"
    />
    
    {/* Rolling hills silhouette */}
    <Path
      d="M0 160 C50 140 100 150 150 130 C170 125 190 135 200 130 L200 200 L0 200 Z"
      fill="rgba(0, 0, 0, 0.2)"
    />
    
    {/* Rising sun */}
    <Circle
      cx="100"
      cy="140"
      r="25"
      fill="rgba(251, 191, 36, 0.9)"
      stroke="rgba(245, 158, 11, 0.8)"
      strokeWidth="2"
    />
    
    {/* Sun's inner glow */}
    <Circle
      cx="100"
      cy="140"
      r="15"
      fill="rgba(254, 240, 138, 0.7)"
    />
    
    {/* Sun rays */}
    <G opacity="0.8">
      {/* Main rays */}
      <Line x1="100" y1="100" x2="100" y2="80" stroke="rgba(251, 191, 36, 0.9)" strokeWidth="3" strokeLinecap="round" />
      <Line x1="130" y1="110" x2="145" y2="95" stroke="rgba(251, 191, 36, 0.9)" strokeWidth="3" strokeLinecap="round" />
      <Line x1="145" y1="140" x2="165" y2="140" stroke="rgba(251, 191, 36, 0.9)" strokeWidth="3" strokeLinecap="round" />
      <Line x1="130" y1="170" x2="145" y2="185" stroke="rgba(251, 191, 36, 0.9)" strokeWidth="3" strokeLinecap="round" />
      <Line x1="70" y1="170" x2="55" y2="185" stroke="rgba(251, 191, 36, 0.9)" strokeWidth="3" strokeLinecap="round" />
      <Line x1="55" y1="140" x2="35" y2="140" stroke="rgba(251, 191, 36, 0.9)" strokeWidth="3" strokeLinecap="round" />
      <Line x1="70" y1="110" x2="55" y2="95" stroke="rgba(251, 191, 36, 0.9)" strokeWidth="3" strokeLinecap="round" />
      
      {/* Secondary rays */}
      <Line x1="115" y1="105" x2="125" y2="90" stroke="rgba(251, 191, 36, 0.7)" strokeWidth="2" strokeLinecap="round" />
      <Line x1="85" y1="105" x2="75" y2="90" stroke="rgba(251, 191, 36, 0.7)" strokeWidth="2" strokeLinecap="round" />
      <Line x1="140" y1="125" x2="155" y2="115" stroke="rgba(251, 191, 36, 0.7)" strokeWidth="2" strokeLinecap="round" />
      <Line x1="60" y1="125" x2="45" y2="115" stroke="rgba(251, 191, 36, 0.7)" strokeWidth="2" strokeLinecap="round" />
    </G>
    
    {/* Gentle clouds being illuminated */}
    <G opacity="0.6">
      {/* Left cloud */}
      <Path
        d="M30 100 C20 100 15 90 25 85 C30 80 40 85 45 90 C50 85 60 90 55 100 Z"
        fill="rgba(255, 255, 255, 0.4)"
        stroke="rgba(255, 255, 255, 0.3)"
        strokeWidth="1"
      />
      
      {/* Right cloud */}
      <Path
        d="M140 95 C130 95 125 85 135 80 C140 75 150 80 155 85 C160 80 170 85 165 95 Z"
        fill="rgba(255, 255, 255, 0.4)"
        stroke="rgba(255, 255, 255, 0.3)"
        strokeWidth="1"
      />
      
      {/* Higher cloud */}
      <Path
        d="M80 70 C70 70 65 60 75 55 C80 50 90 55 95 60 C100 55 110 60 105 70 Z"
        fill="rgba(255, 255, 255, 0.3)"
        stroke="rgba(255, 255, 255, 0.2)"
        strokeWidth="1"
      />
    </G>
    
    {/* Growing plant/sprout from ground - symbol of hope */}
    <G>
      {/* Stem */}
      <Path
        d="M85 160 C85 150 90 140 95 130 C100 135 105 145 105 160"
        fill="none"
        stroke="rgba(34, 197, 94, 0.8)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      
      {/* Left leaf */}
      <Path
        d="M90 145 C85 142 80 145 85 150 C88 148 90 147 90 145"
        fill="rgba(34, 197, 94, 0.7)"
        stroke="rgba(22, 163, 74, 0.8)"
        strokeWidth="1"
      />
      
      {/* Right leaf */}
      <Path
        d="M100 140 C105 137 110 140 105 145 C102 143 100 142 100 140"
        fill="rgba(34, 197, 94, 0.7)"
        stroke="rgba(22, 163, 74, 0.8)"
        strokeWidth="1"
      />
      
      {/* Small flower bud */}
      <Circle
        cx="95"
        cy="130"
        r="3"
        fill="rgba(239, 68, 68, 0.8)"
        stroke="rgba(220, 38, 38, 0.7)"
        strokeWidth="1"
      />
    </G>
    
    {/* Birds flying upward toward the light */}
    <G opacity="0.7">
      {/* First bird */}
      <Path
        d="M120 120 C118 118 122 118 120 120 C122 118 118 118 120 120"
        fill="none"
        stroke="rgba(255, 255, 255, 0.8)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      {/* Second bird */}
      <Path
        d="M130 110 C128 108 132 108 130 110 C132 108 128 108 130 110"
        fill="none"
        stroke="rgba(255, 255, 255, 0.8)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      {/* Third bird */}
      <Path
        d="M140 100 C138 98 142 98 140 100 C142 98 138 98 140 100"
        fill="none"
        stroke="rgba(255, 255, 255, 0.8)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </G>
    
    {/* Soft light emanating upward */}
    <G opacity="0.3">
      <Path
        d="M100 140 L90 50 L100 55 L110 50 Z"
        fill="rgba(251, 191, 36, 0.2)"
      />
      <Path
        d="M100 140 L80 40 L100 50 L120 40 Z"
        fill="rgba(251, 191, 36, 0.1)"
      />
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
              <DawnOfHopeIllustration />
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