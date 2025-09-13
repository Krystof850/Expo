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

// Life Transformation Illustration Component
const LifeTransformationIllustration = () => (
  <Svg width="200" height="200" viewBox="0 0 200 200">
    {/* Transformation steps/levels */}
    <G opacity="0.9">
      {/* Level 1 - Starting point */}
      <Rect x="20" y="160" width="30" height="20" fill="rgba(239, 68, 68, 0.3)" stroke="rgba(220, 38, 38, 0.6)" strokeWidth="1" />
      <Text x="35" y="172" fontSize="8" fill="rgba(220, 38, 38, 0.8)" textAnchor="middle" fontWeight="bold">Level 1</Text>
      
      {/* Level 2 - Improvement */}
      <Rect x="60" y="140" width="30" height="40" fill="rgba(251, 191, 36, 0.6)" stroke="rgba(245, 158, 11, 0.8)" strokeWidth="1" />
      <Text x="75" y="162" fontSize="8" fill="rgba(245, 158, 11, 1)" textAnchor="middle" fontWeight="bold">Level 2</Text>
      
      {/* Level 3 - Success */}
      <Rect x="100" y="120" width="30" height="60" fill="rgba(34, 197, 94, 0.7)" stroke="rgba(22, 163, 74, 1)" strokeWidth="1" />
      <Text x="115" y="152" fontSize="8" fill="rgba(22, 163, 74, 1)" textAnchor="middle" fontWeight="bold">Level 3</Text>
      
      {/* Level 4 - Mastery */}
      <Rect x="140" y="100" width="30" height="80" fill="rgba(34, 211, 238, 0.8)" stroke="rgba(6, 182, 212, 1)" strokeWidth="2" />
      <Text x="155" y="142" fontSize="8" fill="rgba(6, 182, 212, 1)" textAnchor="middle" fontWeight="bold">Level 4</Text>
    </G>
    
    {/* Person ascending the levels */}
    <G>
      {/* Person at current level */}
      <Circle cx="155" cy="95" r="4" fill="rgba(59, 130, 246, 1)" />
      <Path d="M152 99 L158 99 L158 110 L152 110 Z" fill="rgba(59, 130, 246, 1)" />
      {/* Arms raised in victory */}
      <Path d="M152 102 L147 97" stroke="rgba(59, 130, 246, 1)" strokeWidth="2" strokeLinecap="round" />
      <Path d="M158 102 L163 97" stroke="rgba(59, 130, 246, 1)" strokeWidth="2" strokeLinecap="round" />
      {/* Legs */}
      <Path d="M154 110 L152 118" stroke="rgba(59, 130, 246, 1)" strokeWidth="2" strokeLinecap="round" />
      <Path d="M156 110 L158 118" stroke="rgba(59, 130, 246, 1)" strokeWidth="2" strokeLinecap="round" />
    </G>
    
    {/* Energy aura around the person */}
    <G opacity="0.6">
      <Circle cx="155" cy="100" r="12" fill="none" stroke="rgba(251, 191, 36, 0.6)" strokeWidth="1" strokeDasharray="2,2" />
      <Circle cx="155" cy="100" r="18" fill="none" stroke="rgba(251, 191, 36, 0.4)" strokeWidth="1" strokeDasharray="2,2" />
    </G>
    
    {/* Mind transformation */}
    <G opacity="0.8">
      {/* Brain icon showing transformation */}
      <Path
        d="M140 60C145 60 150 55 155 55C160 55 165 60 170 60C170 65 165 70 160 70L140 70C135 70 130 65 130 60C130 55 135 50 140 50C140 55 140 60 140 60Z"
        fill="rgba(34, 211, 238, 0.3)"
        stroke="rgba(34, 211, 238, 0.8)"
        strokeWidth="2"
      />
      
      {/* Neural connections */}
      <Circle cx="145" cy="60" r="2" fill="rgba(251, 191, 36, 1)" />
      <Circle cx="155" cy="62" r="2" fill="rgba(251, 191, 36, 1)" />
      <Circle cx="165" cy="58" r="2" fill="rgba(251, 191, 36, 1)" />
      
      <Text x="155" y="80" fontSize="8" fill="rgba(34, 211, 238, 1)" textAnchor="middle" fontWeight="bold">Unstoppable Mind</Text>
    </G>
    
    {/* Achievement crown */}
    <G opacity="0.9">
      <Path
        d="M148 85 L152 75 L155 85 L158 75 L162 85 L160 88 L150 88 Z"
        fill="rgba(251, 191, 36, 0.8)"
        stroke="rgba(245, 158, 11, 1)"
        strokeWidth="1"
      />
      <Circle cx="155" cy="82" r="2" fill="rgba(245, 158, 11, 1)" />
    </G>
    
    {/* Transformation effects */}
    <G opacity="0.5">
      {/* Sparkles of transformation */}
      <Path d="M30 80 L32 85 L37 85 L33 88 L35 93 L30 90 L25 93 L27 88 L23 85 L28 85 Z" fill="rgba(251, 191, 36, 0.6)" />
      <Path d="M180 70 L182 75 L187 75 L183 78 L185 83 L180 80 L175 83 L177 78 L173 75 L178 75 Z" fill="rgba(34, 211, 238, 0.6)" />
      <Path d="M40 50 L42 55 L47 55 L43 58 L45 63 L40 60 L35 63 L37 58 L33 55 L38 55 Z" fill="rgba(34, 197, 94, 0.6)" />
    </G>
    
    {/* Progress arrows */}
    <G opacity="0.7">
      <Path d="M50 150 L60 145 L50 140" stroke="rgba(34, 211, 238, 0.8)" strokeWidth="2" fill="none" />
      <Path d="M90 130 L100 125 L90 120" stroke="rgba(34, 211, 238, 0.8)" strokeWidth="2" fill="none" />
      <Path d="M130 110 L140 105 L130 100" stroke="rgba(34, 211, 238, 0.8)" strokeWidth="2" fill="none" />
    </G>
    
    {/* Life areas improving */}
    <G opacity="0.7">
      {/* Career */}
      <Rect x="180" y="120" width="15" height="20" fill="rgba(34, 197, 94, 0.6)" />
      <Text x="187" y="130" fontSize="6" fill="rgba(22, 163, 74, 1)" textAnchor="middle" fontWeight="bold">Career</Text>
      <Text x="187" y="138" fontSize="5" fill="rgba(22, 163, 74, 0.8)" textAnchor="middle">↗</Text>
      
      {/* Health */}
      <Rect x="180" y="95" width="15" height="20" fill="rgba(34, 197, 94, 0.6)" />
      <Text x="187" y="105" fontSize="6" fill="rgba(22, 163, 74, 1)" textAnchor="middle" fontWeight="bold">Health</Text>
      <Text x="187" y="113" fontSize="5" fill="rgba(22, 163, 74, 0.8)" textAnchor="middle">↗</Text>
      
      {/* Relationships */}
      <Rect x="180" y="70" width="15" height="20" fill="rgba(34, 197, 94, 0.6)" />
      <Text x="187" y="78" fontSize="5" fill="rgba(22, 163, 74, 1)" textAnchor="middle" fontWeight="bold">Relations</Text>
      <Text x="187" y="88" fontSize="5" fill="rgba(22, 163, 74, 0.8)" textAnchor="middle">↗</Text>
    </G>
    
    {/* Motivation waves */}
    <G opacity="0.4">
      <Path
        d="M20 100 Q50 90 80 100 Q110 110 140 100 Q170 90 200 100"
        stroke="rgba(34, 211, 238, 0.6)"
        strokeWidth="2"
        fill="none"
      />
      <Path
        d="M20 110 Q50 100 80 110 Q110 120 140 110 Q170 100 200 110"
        stroke="rgba(34, 211, 238, 0.4)"
        strokeWidth="1"
        fill="none"
      />
    </G>
    
    {/* Success metrics */}
    <G opacity="0.6">
      {/* Confidence meter */}
      <Rect x="10" y="30" width="40" height="8" rx="4" fill="rgba(59, 130, 246, 0.2)" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="1" />
      <Rect x="10" y="30" width="35" height="8" rx="4" fill="rgba(34, 197, 94, 0.8)" />
      <Text x="30" y="25" fontSize="8" fill="rgba(34, 197, 94, 1)" textAnchor="middle">Confidence</Text>
      
      {/* Productivity meter */}
      <Rect x="10" y="50" width="40" height="8" rx="4" fill="rgba(59, 130, 246, 0.2)" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="1" />
      <Rect x="10" y="50" width="38" height="8" rx="4" fill="rgba(34, 211, 238, 0.8)" />
      <Text x="30" y="45" fontSize="8" fill="rgba(34, 211, 238, 1)" textAnchor="middle">Productivity</Text>
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
    // Run content exit animation
    animationRef.current?.runExitAnimation(() => {
      router.back();
    });
  };

  const handleContinue = async () => {
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
              <LifeTransformationIllustration />
            </View>
          </AnimatedContent>

          {/* Text content */}
          <AnimatedContent delay={200}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>Level up your life</Text>
              
              <Text style={styles.description}>
                Ending procrastination transforms your mind and life. With PROCRAP, you become unstoppable!
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