import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
  ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  withRepeat,
  withTiming,
  FadeInDown,
  FadeInUp,
  SlideInLeft,
  SlideInRight,
  BounceIn
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppBackground from '../../components/AppBackground';
import { TitleText, DescriptionText } from '../../components/Text';
import HapticButton from '../../components/HapticButton';
import { COLORS, SPACING } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

export default function JourneyScreen() {
  const insets = useSafeAreaInsets();
  const [userName, setUserName] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load user name and calculate target date
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load user name
        const savedName = await AsyncStorage.getItem('onboarding_name');
        setUserName(savedName || 'Friend');

        // Calculate date 60 days from now
        const date = new Date();
        date.setDate(date.getDate() + 60);
        const options: Intl.DateTimeFormatOptions = {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        };
        const futureDate = date.toLocaleDateString('en-US', options);
        setTargetDate(futureDate);

        setIsLoaded(true);
      } catch (error) {
        console.log('Error loading data:', error);
        setUserName('Friend');
        setTargetDate('Soon');
        setIsLoaded(true);
      }
    };
    loadData();
  }, []);

  const handleStartJourney = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // TODO: Integrate Superwall paywall trigger here
    // For now, navigate to auth
    router.push('/(auth)/sign-in');
  };

  if (!isLoaded) {
    return (
      <AppBackground>
        <View style={styles.loadingContainer} />
      </AppBackground>
    );
  }

  return (
    <AppBackground>
      <StatusBar barStyle="light-content" />
      <ScrollView 
        style={styles.container}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 80 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <TitleText style={styles.headerTitle}>Almost There!</TitleText>
        </Animated.View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <Animated.View entering={FadeInUp.delay(200)} style={styles.messageSection}>
            <TitleText style={styles.personalizedTitle}>
              {userName}, we've made a custom plan for you.
            </TitleText>
            <DescriptionText style={styles.dateText}>
              You will overcome procrastination until{' '}
              <DescriptionText style={styles.highlightedDate}>
                {targetDate}
              </DescriptionText>
            </DescriptionText>
          </Animated.View>

          {/* Features Grid */}
          <Animated.View entering={FadeInUp.delay(300)} style={styles.featuresSection}>
            <TitleText style={styles.featuresTitle}>Here's what you'll get:</TitleText>
            
            <View style={styles.featuresGrid}>
              <Animated.View entering={SlideInLeft.delay(400)} style={styles.featureCard}>
                <Animated.View entering={BounceIn.delay(600).springify()}>
                  <Ionicons 
                    name="checkmark-circle" 
                    size={32} 
                    color={COLORS.primaryAction} 
                    style={styles.featureIcon}
                  />
                </Animated.View>
                <DescriptionText style={styles.featureText}>
                  Personalized daily tasks
                </DescriptionText>
              </Animated.View>

              <Animated.View entering={SlideInRight.delay(500)} style={styles.featureCard}>
                <Animated.View entering={BounceIn.delay(700).springify()}>
                  <Ionicons 
                    name="bulb" 
                    size={32} 
                    color="#FFD700" 
                    style={styles.featureIcon}
                  />
                </Animated.View>
                <DescriptionText style={styles.featureText}>
                  AI-powered motivation coach
                </DescriptionText>
              </Animated.View>

              <Animated.View entering={SlideInLeft.delay(600)} style={styles.featureCard}>
                <Animated.View entering={BounceIn.delay(800).springify()}>
                  <Ionicons 
                    name="trending-up" 
                    size={32} 
                    color="#00D2FF" 
                    style={styles.featureIcon}
                  />
                </Animated.View>
                <DescriptionText style={styles.featureText}>
                  Advanced progress tracking
                </DescriptionText>
              </Animated.View>

              <Animated.View entering={SlideInRight.delay(700)} style={styles.featureCard}>
                <Animated.View entering={BounceIn.delay(900).springify()}>
                  <Ionicons 
                    name="people" 
                    size={32} 
                    color="#FF6B6B" 
                    style={styles.featureIcon}
                  />
                </Animated.View>
                <DescriptionText style={styles.featureText}>
                  Exclusive community access
                </DescriptionText>
              </Animated.View>
            </View>
          </Animated.View>
        </View>

        {/* Bottom Section */}
        <Animated.View entering={FadeInUp.delay(800)} style={styles.bottomSection}>
          <HapticButton
            style={styles.startButton}
            onPress={handleStartJourney}
          >
            <TitleText style={styles.startButtonText}>Start My Journey</TitleText>
          </HapticButton>

          <View style={styles.guaranteesSection}>
            <View style={styles.guaranteeItem}>
              <Ionicons name="shield-checkmark" size={14} color="rgba(255, 255, 255, 0.7)" />
              <DescriptionText style={styles.guaranteeText}>Cancel anytime</DescriptionText>
            </View>
            <View style={styles.guaranteeItem}>
              <Ionicons name="rocket" size={14} color="rgba(255, 255, 255, 0.7)" />
              <DescriptionText style={styles.guaranteeText}>Finally quit procrastination</DescriptionText>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  loadingContainer: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  mainContent: {
    flex: 1,
    paddingBottom: SPACING.xl,
  },
  messageSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  personalizedTitle: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: SPACING.md,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  dateText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  highlightedDate: {
    color: COLORS.mainText,
    fontWeight: '600',
  },
  featuresSection: {
    alignItems: 'center',
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: SPACING.lg,
    color: COLORS.mainText,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 320,
  },
  featureCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  featureIcon: {
    marginBottom: SPACING.sm,
  },
  featureText: {
    fontSize: 14,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 18,
  },
  bottomSection: {
    paddingBottom: SPACING.xl,
  },
  startButton: {
    backgroundColor: COLORS.mainText,
    borderRadius: 50,
    paddingVertical: SPACING.md + 2,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.md,
    shadowColor: 'rgba(255, 255, 255, 0.2)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.defaultBg,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  guaranteesSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: SPACING.sm,
  },
  guaranteeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  guaranteeText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
  },
});