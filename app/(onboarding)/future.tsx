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

// Broken Dreams and Lost Opportunities Illustration
const BrokenDreamsIllustration = () => (
  <Svg width="200" height="200" viewBox="0 0 200 200">
    {/* Dream cloud (fading away) */}
    <Path
      d="M50 60C45 60 40 65 40 70C35 70 30 75 30 80C30 85 35 90 40 90L140 90C145 90 150 85 150 80C150 75 145 70 140 70C140 65 135 60 130 60C125 60 120 65 120 70C115 65 110 60 105 60C100 60 95 65 95 70C90 65 85 60 80 60C75 60 70 60 65 60C60 60 55 60 50 60Z"
      fill="rgba(255, 255, 255, 0.4)"
      stroke="rgba(255, 255, 255, 0.2)"
      strokeWidth="1"
      strokeDasharray="4,4"
    />
    
    {/* Broken ladder to success */}
    <G>
      {/* Left side of ladder */}
      <Line x1="60" y1="160" x2="65" y2="100" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="4" />
      {/* Right side of ladder */}
      <Line x1="80" y1="160" x2="85" y2="100" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="4" />
      
      {/* Broken rungs */}
      <Line x1="62" y1="150" x2="75" y2="149" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="3" />
      <Line x1="63" y1="135" x2="72" y2="134" stroke="rgba(239, 68, 68, 0.8)" strokeWidth="3" strokeDasharray="2,2" />
      <Line x1="64" y1="120" x2="70" y2="119" stroke="rgba(239, 68, 68, 0.8)" strokeWidth="3" strokeDasharray="2,2" />
      <Line x1="65" y1="105" x2="83" y2="104" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="3" />
    </G>
    
    {/* Falling broken pieces (lost opportunities) */}
    <G opacity="0.6">
      <Polygon
        points="100,95 110,90 115,100 105,105"
        fill="rgba(239, 68, 68, 0.7)"
      />
      <Polygon
        points="125,110 135,105 140,115 130,120"
        fill="rgba(239, 68, 68, 0.7)"
      />
      <Polygon
        points="90,125 100,120 105,130 95,135"
        fill="rgba(239, 68, 68, 0.7)"
      />
      <Polygon
        points="140,140 150,135 155,145 145,150"
        fill="rgba(239, 68, 68, 0.7)"
      />
    </G>
    
    {/* Door of opportunity (closing/closed) */}
    <Path
      d="M120 100 L160 100 L160 160 L120 160 Z"
      fill="rgba(255, 255, 255, 0.3)"
      stroke="rgba(255, 255, 255, 0.5)"
      strokeWidth="2"
    />
    
    {/* Door handle */}
    <Circle cx="150" cy="130" r="3" fill="rgba(239, 68, 68, 0.8)" />
    
    {/* "CLOSED" sign on door */}
    <Path
      d="M125 115 L155 115 L155 125 L125 125 Z"
      fill="rgba(220, 38, 38, 0.8)"
    />
    
    {/* X mark on closed sign */}
    <G>
      <Line x1="130" y1="118" x2="150" y2="122" stroke="rgba(255, 255, 255, 0.9)" strokeWidth="2" />
      <Line x1="150" y1="118" x2="130" y2="122" stroke="rgba(255, 255, 255, 0.9)" strokeWidth="2" />
    </G>
    
    {/* Time passing (clock showing late hour) */}
    <Circle
      cx="170"
      cy="50"
      r="25"
      fill="rgba(255, 255, 255, 0.2)"
      stroke="rgba(239, 68, 68, 0.6)"
      strokeWidth="2"
    />
    
    {/* Clock hands pointing to "too late" */}
    <Line x1="170" y1="50" x2="170" y2="30" stroke="rgba(239, 68, 68, 0.8)" strokeWidth="2" />
    <Line x1="170" y1="50" x2="185" y2="50" stroke="rgba(239, 68, 68, 0.8)" strokeWidth="2" />
    
    {/* Scattered dreams (stars fading) */}
    <G opacity="0.3">
      <Path d="M30 30 L32 35 L37 35 L33 38 L35 43 L30 40 L25 43 L27 38 L23 35 L28 35 Z" fill="rgba(255, 255, 255, 0.4)" />
      <Path d="M170 20 L172 25 L177 25 L173 28 L175 33 L170 30 L165 33 L167 28 L163 25 L168 25 Z" fill="rgba(255, 255, 255, 0.4)" />
      <Path d="M20 100 L22 105 L27 105 L23 108 L25 113 L20 110 L15 113 L17 108 L13 105 L18 105 Z" fill="rgba(255, 255, 255, 0.4)" />
    </G>
  </Svg>
);

export default function FutureScreen() {
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
      // Continue to hope page
      router.push('/(onboarding)/hope');
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
              <BrokenDreamsIllustration />
            </View>
          </AnimatedContent>

          {/* Text content */}
          <AnimatedContent delay={200}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>It steals your future</Text>
              
              <Text style={styles.description}>
                Dreams get postponed, opportunities lost. Procrastination silently kills the life you deserve.
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