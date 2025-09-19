import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  BackHandler,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatedQuestionPage, AnimatedContent, AnimatedQuestionPageRef } from '../../components/AnimatedQuestionPage';
import { NextButton } from '../../components/Button';
import { TitleText } from '../../components/Text';
import AppBackground from '../../components/AppBackground';
import { SPACING } from '../../constants/theme';
import * as Haptics from 'expo-haptics';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming 
} from 'react-native-reanimated';

// Typing Animation Text Component
interface TypingTextProps {
  text: string;
  speed?: number;
  delay?: number;
}

const TypingText: React.FC<TypingTextProps> = ({ text, speed = 50, delay = 500 }) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const opacity = useSharedValue(0);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const typeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Reset state when text changes
    setDisplayText('');
    setIsComplete(false);
    
    // Start with fade in after delay
    fadeTimeoutRef.current = setTimeout(() => {
      opacity.value = withTiming(1, { duration: 300 });
    }, delay);

    // Start typing animation after fade in
    startTimeoutRef.current = setTimeout(() => {
      let index = 0;
      typeIntervalRef.current = setInterval(() => {
        if (index <= text.length) {
          setDisplayText(text.slice(0, index));
          index++;
        } else {
          // Animation complete - ensure text stays and mark as complete
          setDisplayText(text);
          setIsComplete(true);
          if (typeIntervalRef.current) {
            clearInterval(typeIntervalRef.current);
            typeIntervalRef.current = null;
          }
        }
      }, speed);
    }, delay + 400);

    return () => {
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
        fadeTimeoutRef.current = null;
      }
      if (startTimeoutRef.current) {
        clearTimeout(startTimeoutRef.current);
        startTimeoutRef.current = null;
      }
      if (typeIntervalRef.current) {
        clearInterval(typeIntervalRef.current);
        typeIntervalRef.current = null;
      }
    };
  }, [text, speed, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.Text style={[styles.typingText, animatedStyle]}>
      {displayText}
      {!isComplete && displayText.length < text.length && (
        <Animated.Text style={styles.cursor}>|</Animated.Text>
      )}
    </Animated.Text>
  );
};

export default function WelcomeNewScreen() {
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

  const handleStartQuiz = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Run content exit animation
    animationRef.current?.runExitAnimation(() => {
      router.push('/(onboarding)/question1');
    });
  };

  return (
    <AppBackground>
      <View style={styles.container}>
        {/* Animated content wrapper for smooth transitions */}
        <AnimatedQuestionPage ref={animationRef}>
          <View style={styles.content}>
            <AnimatedContent delay={100}>
              <View style={styles.welcomeSection}>
                <TitleText animated={false} style={styles.title}>
                  Welcome!
                </TitleText>
              </View>
            </AnimatedContent>
            
            <View style={styles.textSection}>
              <TypingText 
                text="Let's start by finding out if you have a problem with procrastination."
                speed={30}
                delay={500}
              />
            </View>
          </View>
        </AnimatedQuestionPage>
        
        {/* Start Quiz button - OUTSIDE of animation wrapper */}
        <View style={[styles.nextContainer, { paddingBottom: insets.bottom + SPACING.page }]}>
          <NextButton
            title="Start Quiz >"
            onPress={handleStartQuiz}
          />
        </View>
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.page,
    paddingTop: 8,
    paddingBottom: 120, // Space for Next button to prevent overlap
  },
  welcomeSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 48, // Increased spacing for better visual balance
  },
  title: {
    textAlign: 'center',
  },
  textSection: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: SPACING.small,
  },
  typingText: {
    fontSize: 20, // text-xl
    fontWeight: '600', // font-semibold  
    color: '#DBEAFE', // text-blue-100 equivalent (matching quiz questions)
    textAlign: 'center',
    lineHeight: 28,
    maxWidth: 400, // Wider boundary to prevent word breaking
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  cursor: {
    opacity: 1,
  },
  nextContainer: {
    paddingHorizontal: SPACING.page,
    zIndex: 10,
  },
});