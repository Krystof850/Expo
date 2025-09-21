import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  BackHandler,
  Platform,
  TouchableOpacity,
  Text,
} from 'react-native';
import { router, Redirect } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { AnimatedQuestionPage, AnimatedContent, AnimatedQuestionPageRef } from '../../components/AnimatedQuestionPage';
import { NextButton } from '../../components/Button';
import { TitleText } from '../../components/Text';
import AppBackground from '../../components/AppBackground';
import { SPACING } from '../../constants/theme';
import * as Haptics from 'expo-haptics';
import TypeWriterEffect from 'react-native-typewriter-effect';
import { useAuth } from '../../src/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function WelcomeNewScreen() {
  const { user, loading } = useAuth();
  const insets = useSafeAreaInsets();
  const animationRef = useRef<AnimatedQuestionPageRef>(null);

  // Block hardware back button on Android only - MUST be called before conditional returns
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

  // Conditional renders AFTER all hooks are called
  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  if (loading) {
    return null; // Show nothing while loading
  }

  const handleStartQuiz = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Run content exit animation
    animationRef.current?.runExitAnimation(() => {
      router.push('/(onboarding)/question1');
    });
  };

  const handleSignIn = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(auth)/sign-in');
  };

  return (
    <AppBackground>
      <View style={styles.container}>
        {/* Animated content wrapper for smooth transitions */}
        <AnimatedQuestionPage ref={animationRef}>
          <View style={[styles.content, { paddingTop: insets.top + 60 }]}>
            <AnimatedContent delay={100}>
              <View style={styles.welcomeSection}>
                {/* Unloop Logo */}
                <Image
                  source={require('../../assets/images/unloop-logo-new.png')}
                  style={styles.logo}
                  contentFit="contain"
                />
                <TitleText animated={false} style={styles.title}>
                  Welcome!
                </TitleText>
              </View>
            </AnimatedContent>
            
            <View style={styles.textSection}>
              <TypeWriterEffect
                content="Let's start by finding out if you have a problem with procrastination."
                maxDelay={50}
                minDelay={30}
                style={styles.typingText}
                onEnd={() => console.log('Typing animation completed')}
              />
            </View>
          </View>
        </AnimatedQuestionPage>
        
        {/* Buttons - OUTSIDE of animation wrapper */}
        <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + SPACING.page }]}>
          <NextButton
            title="Start Quiz >"
            onPress={handleStartQuiz}
          />
          
          {/* Secondary button for existing users */}
          <TouchableOpacity style={styles.secondaryButton} onPress={handleSignIn}>
            <Ionicons name="log-in-outline" size={18} color="#DBEAFE" style={styles.buttonIcon} />
            <Text style={styles.secondaryButtonText}>Already have an account? Sign in</Text>
          </TouchableOpacity>
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
    paddingBottom: 120, // Space for Next button to prevent overlap
  },
  welcomeSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 48, // Increased spacing for better visual balance
  },
  title: {
    textAlign: 'center',
    fontSize: 48, // Větší nadpis
    fontWeight: '800',
    marginTop: 0, // Odstranit margin kvůli lepšímu umístění
  },
  logo: {
    width: 200,
    height: 120,
    alignSelf: 'center',
    marginBottom: 40,
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
  buttonContainer: {
    paddingHorizontal: SPACING.page,
    zIndex: 10,
    gap: 12,
  },
  secondaryButton: {
    backgroundColor: 'rgba(219, 234, 254, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(219, 234, 254, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 25,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonIcon: {
    marginRight: 6,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#DBEAFE',
    opacity: 0.9,
  },
});