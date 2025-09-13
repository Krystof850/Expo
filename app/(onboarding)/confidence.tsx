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
import Svg, { Path, Circle, G, Polygon } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedQuestionPage, AnimatedContent, AnimatedQuestionPageRef } from '../../components/AnimatedQuestionPage';
import { NextButton } from '../../components/Button';
import { SPACING } from '@/constants/theme';
import * as Haptics from 'expo-haptics';

// Broken Confidence Illustration Component
const BrokenConfidenceIllustration = () => (
  <Svg width="200" height="200" viewBox="0 0 200 200">
    {/* Main person silhouette */}
    <Path
      d="M100 40C110 40 120 50 120 60C120 70 110 80 100 80C90 80 80 70 80 60C80 50 90 40 100 40Z"
      fill="rgba(255, 255, 255, 0.8)"
      stroke="rgba(255, 255, 255, 0.6)"
      strokeWidth="2"
    />
    
    {/* Body */}
    <Path
      d="M85 80 L115 80 L115 140 L105 140 L105 160 L95 160 L95 140 L85 140 Z"
      fill="rgba(255, 255, 255, 0.8)"
      stroke="rgba(255, 255, 255, 0.6)"
      strokeWidth="2"
    />
    
    {/* Arms (drooping down showing defeat) */}
    <Path
      d="M85 90 L70 110 L65 125"
      stroke="rgba(255, 255, 255, 0.8)"
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
    />
    <Path
      d="M115 90 L130 110 L135 125"
      stroke="rgba(255, 255, 255, 0.8)"
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
    />
    
    {/* Cracks in the person showing broken confidence */}
    <G>
      <Path
        d="M95 65 L105 75 M90 85 L110 95 M88 110 L112 120"
        stroke="rgba(220, 38, 38, 0.8)"
        strokeWidth="2"
        fill="none"
      />
    </G>
    
    {/* Broken pieces falling away */}
    <G opacity="0.7">
      <Polygon
        points="50,90 55,85 60,95 55,100"
        fill="rgba(239, 68, 68, 0.6)"
      />
      <Polygon
        points="140,105 145,100 150,110 145,115"
        fill="rgba(239, 68, 68, 0.6)"
      />
      <Polygon
        points="75,130 80,125 85,135 80,140"
        fill="rgba(239, 68, 68, 0.6)"
      />
      <Polygon
        points="120,135 125,130 130,140 125,145"
        fill="rgba(239, 68, 68, 0.6)"
      />
    </G>
    
    {/* Dark cloud above representing negative thoughts */}
    <Path
      d="M70 20C65 20 60 25 60 30C55 30 50 35 50 40C50 45 55 50 60 50L120 50C125 50 130 45 130 40C130 35 125 30 120 30C120 25 115 20 110 20C105 20 100 25 100 30C95 25 90 20 85 20C80 20 75 20 70 20Z"
      fill="rgba(220, 38, 38, 0.5)"
      stroke="rgba(220, 38, 38, 0.3)"
      strokeWidth="1"
    />
    
    {/* Rain drops from the cloud (guilt and negative feelings) */}
    <G opacity="0.6">
      <Circle cx="75" cy="55" r="1.5" fill="rgba(239, 68, 68, 0.7)" />
      <Circle cx="85" cy="62" r="1" fill="rgba(239, 68, 68, 0.7)" />
      <Circle cx="95" cy="58" r="1.5" fill="rgba(239, 68, 68, 0.7)" />
      <Circle cx="105" cy="65" r="1" fill="rgba(239, 68, 68, 0.7)" />
      <Circle cx="115" cy="60" r="1.5" fill="rgba(239, 68, 68, 0.7)" />
    </G>
    
    {/* Weak foundation showing instability */}
    <Path
      d="M70 160 L130 160 L128 170 L72 170 Z"
      fill="rgba(255, 255, 255, 0.4)"
      stroke="rgba(255, 255, 255, 0.3)"
      strokeWidth="1"
      strokeDasharray="3,3"
    />
  </Svg>
);

export default function ConfidenceScreen() {
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
    // Run content exit animation
    animationRef.current?.runExitAnimation(() => {
      // Continue to future page
      router.push('/(onboarding)/future');
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Red gradient background with blur effects */}
      <LinearGradient
        colors={['#991B1B', '#7F1D1D', '#000000']} // red-800 → red-900 → black
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }} // diagonal gradient from top-left to bottom-right
        style={styles.backgroundContainer}
      >
        <View style={styles.blurOverlay}>
          {/* First blur orb with gradient */}
          <LinearGradient
            colors={['rgba(239, 68, 68, 0.5)', 'transparent']}
            style={styles.blurCircle1}
          />
          {/* Second blur orb with gradient */}
          <LinearGradient
            colors={['rgba(249, 115, 22, 0.4)', 'transparent']}
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
              <BrokenConfidenceIllustration />
            </View>
          </AnimatedContent>

          {/* Text content */}
          <AnimatedContent delay={200}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>It destroys your confidence</Text>
              
              <Text style={styles.description}>
                Procrastination cycles make you guilty and weak. Even small tasks feel impossible, and frustration grows.
              </Text>
            </View>
          </AnimatedContent>
        </View>
      </AnimatedQuestionPage>
      
      {/* Next button - OUTSIDE of animation wrapper */}
      <View style={[styles.nextContainer, { paddingBottom: insets.bottom + SPACING.page }]}>
        <NextButton
          title="I Understand"
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
    color: '#FECACA', // text-red-100 equivalent
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
    color: '#7F1D1D', // --vibrant-cta-text (dark red)
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