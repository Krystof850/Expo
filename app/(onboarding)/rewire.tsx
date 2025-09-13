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
import Svg, { Path, Circle, G, Line } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedQuestionPage, AnimatedContent, AnimatedQuestionPageRef } from '../../components/AnimatedQuestionPage';
import { NextButton } from '../../components/Button';
import { SPACING } from '@/constants/theme';
import * as Haptics from 'expo-haptics';

// Brain Rewiring Circuit Illustration Component
const BrainRewireIllustration = () => (
  <Svg width="200" height="200" viewBox="0 0 200 200">
    {/* Brain outline */}
    <Path
      d="M100 40C115 40 130 45 140 55C145 50 155 48 160 52C165 40 175 35 180 45C185 40 195 45 192 55C195 65 190 75 185 80C190 90 185 100 175 105C170 115 160 120 150 115C140 125 125 130 110 125C95 130 80 125 70 115C60 120 50 115 45 105C35 100 30 90 35 80C30 75 25 65 28 55C25 45 35 40 40 45C45 35 55 40 60 52C65 48 75 50 80 55C90 45 95 40 100 40Z"
      fill="rgba(59, 130, 246, 0.3)"
      stroke="rgba(59, 130, 246, 0.8)"
      strokeWidth="2"
    />
    
    {/* Neural pathways - old (red/fading) */}
    <G opacity="0.4">
      <Path
        d="M70 70 Q85 65 90 75 Q95 85 110 80"
        stroke="rgba(239, 68, 68, 0.6)"
        strokeWidth="3"
        fill="none"
        strokeDasharray="5,5"
      />
      <Path
        d="M80 90 Q95 85 100 95 Q105 105 120 100"
        stroke="rgba(239, 68, 68, 0.6)"
        strokeWidth="3"
        fill="none"
        strokeDasharray="5,5"
      />
    </G>
    
    {/* Neural pathways - new (bright blue/cyan) */}
    <G opacity="0.9">
      <Path
        d="M75 75 Q90 70 95 80 Q100 90 115 85"
        stroke="rgba(34, 211, 238, 1)"
        strokeWidth="4"
        fill="none"
      />
      <Path
        d="M85 95 Q100 90 105 100 Q110 110 125 105"
        stroke="rgba(34, 211, 238, 1)"
        strokeWidth="4"
        fill="none"
      />
      <Path
        d="M90 65 Q105 60 110 70 Q115 80 130 75"
        stroke="rgba(34, 211, 238, 1)"
        strokeWidth="3"
        fill="none"
      />
    </G>
    
    {/* Electrical nodes/synapses */}
    <G>
      <Circle cx="90" cy="75" r="3" fill="rgba(251, 191, 36, 1)" />
      <Circle cx="110" cy="85" r="3" fill="rgba(251, 191, 36, 1)" />
      <Circle cx="100" cy="95" r="3" fill="rgba(251, 191, 36, 1)" />
      <Circle cx="120" cy="105" r="3" fill="rgba(251, 191, 36, 1)" />
      <Circle cx="105" cy="65" r="3" fill="rgba(251, 191, 36, 1)" />
      <Circle cx="125" cy="75" r="3" fill="rgba(251, 191, 36, 1)" />
    </G>
    
    {/* Electrical sparks around nodes */}
    <G opacity="0.8">
      <Line x1="87" y1="72" x2="93" y2="78" stroke="rgba(251, 191, 36, 0.8)" strokeWidth="1" />
      <Line x1="93" y1="72" x2="87" y2="78" stroke="rgba(251, 191, 36, 0.8)" strokeWidth="1" />
      <Line x1="107" y1="82" x2="113" y2="88" stroke="rgba(251, 191, 36, 0.8)" strokeWidth="1" />
      <Line x1="113" y1="82" x2="107" y2="88" stroke="rgba(251, 191, 36, 0.8)" strokeWidth="1" />
      <Line x1="97" y1="92" x2="103" y2="98" stroke="rgba(251, 191, 36, 0.8)" strokeWidth="1" />
      <Line x1="103" y1="92" x2="97" y2="98" stroke="rgba(251, 191, 36, 0.8)" strokeWidth="1" />
    </G>
    
    {/* Circuit board patterns */}
    <G opacity="0.6">
      {/* Horizontal circuit lines */}
      <Line x1="50" y1="130" x2="80" y2="130" stroke="rgba(34, 211, 238, 0.7)" strokeWidth="2" />
      <Line x1="120" y1="140" x2="150" y2="140" stroke="rgba(34, 211, 238, 0.7)" strokeWidth="2" />
      {/* Vertical circuit lines */}
      <Line x1="60" y1="125" x2="60" y2="145" stroke="rgba(34, 211, 238, 0.7)" strokeWidth="2" />
      <Line x1="140" y1="135" x2="140" y2="155" stroke="rgba(34, 211, 238, 0.7)" strokeWidth="2" />
      {/* Circuit junction points */}
      <Circle cx="60" cy="130" r="2" fill="rgba(34, 211, 238, 1)" />
      <Circle cx="140" cy="140" r="2" fill="rgba(34, 211, 238, 1)" />
    </G>
    
    {/* Energy waves emanating from brain */}
    <G opacity="0.5">
      <Circle cx="100" cy="90" r="60" fill="none" stroke="rgba(34, 211, 238, 0.3)" strokeWidth="1" strokeDasharray="3,6" />
      <Circle cx="100" cy="90" r="80" fill="none" stroke="rgba(34, 211, 238, 0.2)" strokeWidth="1" strokeDasharray="3,6" />
      <Circle cx="100" cy="90" r="100" fill="none" stroke="rgba(34, 211, 238, 0.1)" strokeWidth="1" strokeDasharray="3,6" />
    </G>
    
    {/* Focus and discipline indicators */}
    <G opacity="0.7">
      {/* Focus symbol (eye) */}
      <Circle cx="50" cy="60" r="12" fill="none" stroke="rgba(251, 191, 36, 0.8)" strokeWidth="2" />
      <Circle cx="50" cy="60" r="6" fill="rgba(251, 191, 36, 0.8)" />
      <Circle cx="50" cy="60" r="3" fill="rgba(59, 130, 246, 1)" />
      
      {/* Discipline symbol (strong pillar) */}
      <Path
        d="M145 50 L155 50 L155 80 L145 80 Z"
        fill="rgba(251, 191, 36, 0.8)"
        stroke="rgba(251, 191, 36, 1)"
        strokeWidth="1"
      />
      <Path
        d="M143 50 L157 50"
        stroke="rgba(251, 191, 36, 1)"
        strokeWidth="2"
      />
      <Path
        d="M143 80 L157 80"
        stroke="rgba(251, 191, 36, 1)"
        strokeWidth="2"
      />
    </G>
    
    {/* Transformation arrows */}
    <G opacity="0.6">
      <Path
        d="M40 100 L30 95 L40 90"
        stroke="rgba(34, 211, 238, 0.8)"
        strokeWidth="2"
        fill="none"
      />
      <Line x1="30" y1="95" x2="15" y2="95" stroke="rgba(34, 211, 238, 0.8)" strokeWidth="2" />
      
      <Path
        d="M160 110 L170 105 L160 100"
        stroke="rgba(34, 211, 238, 0.8)"
        strokeWidth="2"
        fill="none"
      />
      <Line x1="170" y1="105" x2="185" y2="105" stroke="rgba(34, 211, 238, 0.8)" strokeWidth="2" />
    </G>
  </Svg>
);

export default function RewireScreen() {
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
      // Continue to quit page
      router.push('/(onboarding)/quit');
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
              <BrainRewireIllustration />
            </View>
          </AnimatedContent>

          {/* Text content */}
          <AnimatedContent delay={200}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>Rewire your brain</Text>
              
              <Text style={styles.description}>
                You will reprogram your brain. Focus and discipline will become your default mode.
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