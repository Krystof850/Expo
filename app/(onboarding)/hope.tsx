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

// Success and Victory Illustration Component
const SuccessVictoryIllustration = () => (
  <Svg width="200" height="200" viewBox="0 0 200 200">
    {/* Mountain peaks (representing achievement) */}
    <Path
      d="M20 150 L60 80 L100 100 L140 60 L180 150 Z"
      fill="rgba(255, 255, 255, 0.7)"
      stroke="rgba(255, 255, 255, 0.9)"
      strokeWidth="2"
    />
    
    {/* Person at the top of mountain with arms raised */}
    <G>
      {/* Head */}
      <Circle
        cx="140"
        cy="65"
        r="6"
        fill="rgba(59, 130, 246, 1)"
      />
      
      {/* Body */}
      <Path
        d="M136 71 L144 71 L144 85 L136 85 Z"
        fill="rgba(59, 130, 246, 1)"
      />
      
      {/* Arms raised in victory */}
      <Path
        d="M136 75 L125 65"
        stroke="rgba(59, 130, 246, 1)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <Path
        d="M144 75 L155 65"
        stroke="rgba(59, 130, 246, 1)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      
      {/* Legs */}
      <Path
        d="M138 85 L135 95"
        stroke="rgba(59, 130, 246, 1)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <Path
        d="M142 85 L145 95"
        stroke="rgba(59, 130, 246, 1)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </G>
    
    {/* Trophy on peak */}
    <G>
      {/* Trophy base */}
      <Path
        d="M130 95 L150 95 L148 105 L132 105 Z"
        fill="rgba(251, 191, 36, 0.9)"
        stroke="rgba(245, 158, 11, 1)"
        strokeWidth="1"
      />
      
      {/* Trophy cup */}
      <Path
        d="M132 85 L148 85 L148 95 L132 95 Z"
        fill="rgba(251, 191, 36, 0.9)"
        stroke="rgba(245, 158, 11, 1)"
        strokeWidth="1"
      />
      
      {/* Trophy handles */}
      <Path
        d="M148 87 C152 87 152 93 148 93"
        stroke="rgba(245, 158, 11, 1)"
        strokeWidth="2"
        fill="none"
      />
      <Path
        d="M132 87 C128 87 128 93 132 93"
        stroke="rgba(245, 158, 11, 1)"
        strokeWidth="2"
        fill="none"
      />
    </G>
    
    {/* Victory stars around the scene */}
    <G opacity="0.8">
      <VictoryStar
        cx={100}
        cy={30}
        r1={4}
        r2={8}
        fill="rgba(34, 211, 238, 0.8)"
      />
      <VictoryStar
        cx={160}
        cy={40}
        r1={3}
        r2={6}
        fill="rgba(34, 211, 238, 0.7)"
      />
      <VictoryStar
        cx={50}
        cy={50}
        r1={3}
        r2={6}
        fill="rgba(34, 211, 238, 0.7)"
      />
      <VictoryStar
        cx={170}
        cy={80}
        r1={2}
        r2={4}
        fill="rgba(34, 211, 238, 0.6)"
      />
      <VictoryStar
        cx={30}
        cy={90}
        r1={2}
        r2={4}
        fill="rgba(34, 211, 238, 0.6)"
      />
    </G>
    
    {/* Broken chains at the bottom (freedom from procrastination) */}
    <G opacity="0.6">
      {/* Left broken chain */}
      <Circle
        cx="70"
        cy="170"
        r="6"
        fill="none"
        stroke="rgba(156, 163, 175, 0.8)"
        strokeWidth="3"
        strokeDasharray="6,6"
      />
      <Circle
        cx="85"
        cy="175"
        r="6"
        fill="none"
        stroke="rgba(156, 163, 175, 0.8)"
        strokeWidth="3"
        strokeDasharray="6,6"
      />
      
      {/* Right broken chain */}
      <Circle
        cx="115"
        cy="175"
        r="6"
        fill="none"
        stroke="rgba(156, 163, 175, 0.8)"
        strokeWidth="3"
        strokeDasharray="6,6"
      />
      <Circle
        cx="130"
        cy="170"
        r="6"
        fill="none"
        stroke="rgba(156, 163, 175, 0.8)"
        strokeWidth="3"
        strokeDasharray="6,6"
      />
    </G>
    
    {/* Rising sun/light behind mountains */}
    <Circle
      cx="100"
      cy="120"
      r="30"
      fill="rgba(251, 191, 36, 0.3)"
      opacity="0.7"
    />
    
    {/* Light rays */}
    <G opacity="0.4">
      <Line x1="100" y1="90" x2="100" y2="70" stroke="rgba(251, 191, 36, 0.8)" strokeWidth="2" />
      <Line x1="120" y1="100" x2="135" y2="85" stroke="rgba(251, 191, 36, 0.8)" strokeWidth="2" />
      <Line x1="130" y1="120" x2="150" y2="120" stroke="rgba(251, 191, 36, 0.8)" strokeWidth="2" />
      <Line x1="80" y1="100" x2="65" y2="85" stroke="rgba(251, 191, 36, 0.8)" strokeWidth="2" />
      <Line x1="70" y1="120" x2="50" y2="120" stroke="rgba(251, 191, 36, 0.8)" strokeWidth="2" />
    </G>
    
    {/* Flag of victory */}
    <G>
      {/* Flag pole */}
      <Line x1="165" y1="45" x2="165" y2="75" stroke="rgba(59, 130, 246, 1)" strokeWidth="2" />
      {/* Flag */}
      <Polygon
        points="165,45 180,50 180,60 165,55"
        fill="rgba(34, 211, 238, 0.8)"
        stroke="rgba(6, 182, 212, 1)"
        strokeWidth="1"
      />
    </G>
  </Svg>
);

const VictoryStar = ({ cx, cy, r1, r2, fill }: { cx: number; cy: number; r1: number; r2: number; fill: string }) => {
  const points = [];
  for (let i = 0; i < 10; i++) {
    const angle = (i * Math.PI) / 5;
    const radius = i % 2 === 0 ? r2 : r1;
    const x = cx + radius * Math.cos(angle - Math.PI / 2);
    const y = cy + radius * Math.sin(angle - Math.PI / 2);
    points.push(`${x},${y}`);
  }
  return <Polygon points={points.join(' ')} fill={fill} />;
};

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
              <SuccessVictoryIllustration />
            </View>
          </AnimatedContent>

          {/* Text content */}
          <AnimatedContent delay={200}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>But there's hope</Text>
              
              <Text style={styles.description}>
                With PROCRAP, you can reboot your brain, rebuild discipline, and take back control.
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