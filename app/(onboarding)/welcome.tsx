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

// Science-backed System Illustration Component
const ScienceSystemIllustration = () => (
  <Svg width="200" height="200" viewBox="0 0 200 200">
    {/* Central brain */}
    <Path
      d="M100 50C115 50 130 55 140 65C145 60 155 58 160 62C165 50 175 45 180 55C185 50 195 55 192 65C195 75 190 85 185 90C190 100 185 110 175 115C170 125 160 130 150 125C140 135 125 140 110 135C95 140 80 135 70 125C60 130 50 125 45 115C35 110 30 100 35 90C30 85 25 75 28 65C25 55 35 50 40 55C45 45 55 50 60 62C65 58 75 60 80 65C90 55 95 50 100 50Z"
      fill="rgba(59, 130, 246, 0.8)"
      stroke="rgba(37, 99, 235, 1)"
      strokeWidth="2"
    />
    
    {/* Brain circuit patterns */}
    <G opacity="0.7">
      <Path
        d="M85 80C90 75 95 80 100 75C105 80 110 75 115 80"
        stroke="rgba(34, 211, 238, 0.9)"
        strokeWidth="2"
        fill="none"
      />
      <Path
        d="M75 95C85 90 95 95 105 90C115 95 125 90 135 95"
        stroke="rgba(34, 211, 238, 0.9)"
        strokeWidth="2"
        fill="none"
      />
    </G>
    
    {/* Science symbols around brain */}
    <G opacity="0.8">
      {/* DNA helix */}
      <Path
        d="M40 40 Q45 35 50 40 Q55 45 60 40 Q65 35 70 40"
        stroke="rgba(251, 191, 36, 0.8)"
        strokeWidth="2"
        fill="none"
      />
      <Path
        d="M40 45 Q45 40 50 45 Q55 50 60 45 Q65 40 70 45"
        stroke="rgba(251, 191, 36, 0.8)"
        strokeWidth="2"
        fill="none"
      />
      
      {/* Atom structure */}
      <Circle cx="150" cy="45" r="8" fill="none" stroke="rgba(34, 211, 238, 0.8)" strokeWidth="2" />
      <Circle cx="150" cy="45" r="15" fill="none" stroke="rgba(34, 211, 238, 0.6)" strokeWidth="1" transform="rotate(45 150 45)" />
      <Circle cx="150" cy="45" r="15" fill="none" stroke="rgba(34, 211, 238, 0.6)" strokeWidth="1" transform="rotate(-45 150 45)" />
      <Circle cx="150" cy="45" r="2" fill="rgba(34, 211, 238, 1)" />
      
      {/* Formula symbols */}
      <Text x="30" y="160" fontSize="14" fill="rgba(251, 191, 36, 0.8)" fontFamily="monospace">E=mc²</Text>
      <Text x="160" y="165" fontSize="12" fill="rgba(34, 211, 238, 0.8)" fontFamily="monospace">f(x)</Text>
    </G>
    
    {/* Data flow connections */}
    <G opacity="0.6">
      <Line x1="70" y1="40" x2="85" y2="65" stroke="rgba(59, 130, 246, 0.7)" strokeWidth="2" strokeDasharray="3,3" />
      <Line x1="130" y1="40" x2="115" y2="65" stroke="rgba(59, 130, 246, 0.7)" strokeWidth="2" strokeDasharray="3,3" />
      <Line x1="40" y1="160" x2="75" y2="125" stroke="rgba(59, 130, 246, 0.7)" strokeWidth="2" strokeDasharray="3,3" />
      <Line x1="160" y1="165" x2="125" y2="125" stroke="rgba(59, 130, 246, 0.7)" strokeWidth="2" strokeDasharray="3,3" />
    </G>
    
    {/* System gears */}
    <G opacity="0.7">
      {/* Gear 1 */}
      <Circle cx="50" cy="100" r="12" fill="none" stroke="rgba(251, 191, 36, 0.7)" strokeWidth="2" />
      <Polygon
        points="50,88 52,90 50,92 48,90"
        fill="rgba(251, 191, 36, 0.7)"
      />
      <Polygon
        points="62,100 60,102 58,100 60,98"
        fill="rgba(251, 191, 36, 0.7)"
      />
      <Polygon
        points="50,112 48,110 50,108 52,110"
        fill="rgba(251, 191, 36, 0.7)"
      />
      <Polygon
        points="38,100 40,98 42,100 40,102"
        fill="rgba(251, 191, 36, 0.7)"
      />
      
      {/* Gear 2 */}
      <Circle cx="150" cy="120" r="10" fill="none" stroke="rgba(251, 191, 36, 0.7)" strokeWidth="2" />
      <Polygon
        points="150,110 151,111 150,112 149,111"
        fill="rgba(251, 191, 36, 0.7)"
      />
      <Polygon
        points="160,120 159,121 158,120 159,119"
        fill="rgba(251, 191, 36, 0.7)"
      />
      <Polygon
        points="150,130 149,129 150,128 151,129"
        fill="rgba(251, 191, 36, 0.7)"
      />
      <Polygon
        points="140,120 141,119 142,120 141,121"
        fill="rgba(251, 191, 36, 0.7)"
      />
    </G>
    
    {/* Research data points */}
    <G opacity="0.5">
      <Circle cx="80" cy="160" r="2" fill="rgba(34, 211, 238, 0.8)" />
      <Circle cx="120" cy="170" r="2" fill="rgba(34, 211, 238, 0.8)" />
      <Circle cx="90" cy="40" r="2" fill="rgba(34, 211, 238, 0.8)" />
      <Circle cx="170" cy="80" r="2" fill="rgba(34, 211, 238, 0.8)" />
    </G>
    
    {/* "PROCRAP" text integrated into design */}
    <Rect x="90" y="150" width="50" height="15" rx="7" fill="rgba(59, 130, 246, 0.2)" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="1" />
    <Text x="100" y="161" fontSize="10" fill="rgba(59, 130, 246, 1)" fontFamily="sans-serif" fontWeight="bold">PROCRAP</Text>
  </Svg>
);

export default function WelcomeScreen() {
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

  const handleContinue = () => {
    // Run content exit animation
    animationRef.current?.runExitAnimation(() => {
      // Continue to rewire page
      router.push('/(onboarding)/rewire');
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
              <ScienceSystemIllustration />
            </View>
          </AnimatedContent>

          {/* Text content */}
          <AnimatedContent delay={200}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>Welcome to PROCRAP</Text>
              
              <Text style={styles.description}>
                A science-backed system to crush procrastination. Fast, simple, and proven to work.
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