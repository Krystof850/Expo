import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppBackground from '../../components/AppBackground';
import { COLORS, SPACING } from '@/constants/theme';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TypingScreen() {
  const insets = useSafeAreaInsets();
  const [currentText, setCurrentText] = useState('');
  const [currentSentenceIndex, setSentenceIndex] = useState(0);
  const [currentLetterIndex, setLetterIndex] = useState(0);
  const [userName, setUserName] = useState('');
  const [isNameLoaded, setIsNameLoaded] = useState(false);
  
  const sentences = [
    'Hey, [NAME].',
    'Welcome to PROCRAPP, your path to freedom.',
    'Based on your answers, we\'ve built a custom plan just for you.',
    'It is designed to help you overcome procrastination forever.',
    'Now, it\'s time to invest in yourself.'
  ];

  // Load user name on component mount
  useEffect(() => {
    const loadUserName = async () => {
      try {
        const savedName = await AsyncStorage.getItem('onboarding_name');
        setUserName(savedName || 'Friend');
        setIsNameLoaded(true);
      } catch (error) {
        console.log('Error loading user name:', error);
        setUserName('Friend');
        setIsNameLoaded(true);
      }
    };
    loadUserName();
  }, []);

  // Main typing effect - only start after name is loaded
  useEffect(() => {
    if (!isNameLoaded) return; // Wait for name to load
    
    if (currentSentenceIndex >= sentences.length) {
      // All sentences complete, navigate to invest page
      setTimeout(() => {
        router.push('/(onboarding)/invest');
      }, 2000);
      return;
    }

    const currentSentence = sentences[currentSentenceIndex].replace('[NAME]', userName);
    
    if (currentLetterIndex < currentSentence.length) {
      // Type next letter
      const timer = setTimeout(() => {
        setCurrentText(prev => prev + currentSentence[currentLetterIndex]);
        setLetterIndex(prev => prev + 1);
        
        // Vibrate only on every 3rd letter to avoid overwhelming
        if (currentLetterIndex % 3 === 0) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }, 100); // 100ms delay between letters

      return () => clearTimeout(timer);
    } else {
      // Sentence complete, wait 1 second then clear and move to next
      const timer = setTimeout(() => {
        setCurrentText('');
        setLetterIndex(0);
        setSentenceIndex(prev => prev + 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [currentLetterIndex, currentSentenceIndex, userName, isNameLoaded]);

  return (
    <AppBackground>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        
        {/* Content */}
        <View style={[styles.content, { paddingTop: insets.top + 60 }]}>
          <View style={styles.textContainer}>
            <Text style={styles.typingText}>
              {currentText}
              <Text style={styles.cursor}>|</Text>
            </Text>
          </View>
        </View>
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.page,
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
    width: '100%',
  },
  typingText: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.mainText,
    textAlign: 'center',
    lineHeight: 32,
    textShadow: '0 3px 6px rgba(0, 0, 0, 0.4)',
  },
  cursor: {
    color: COLORS.mainText,
    opacity: 0.8,
  },
});