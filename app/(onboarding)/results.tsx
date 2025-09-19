import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import AppBackground from '../../components/AppBackground';
import { COLORS, SPACING } from '@/constants/theme';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function ResultsScreen() {
  const insets = useSafeAreaInsets();
  const emojiScale = useRef(new Animated.Value(0.8)).current;
  const emojiRotation = useRef(new Animated.Value(0)).current;
  const yourBarHeight = useRef(new Animated.Value(0)).current;
  const averageBarHeight = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Emoji animation matching HTML keyframes (sad-face-anim)
    Animated.sequence([
      Animated.parallel([
        Animated.timing(emojiScale, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(emojiRotation, {
          toValue: -5,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(emojiScale, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(emojiRotation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ]).start();

    // Animate bars after a delay - smoother animation
    setTimeout(() => {
      Animated.stagger(200, [
        Animated.spring(yourBarHeight, {
          toValue: 1,
          tension: 80,
          friction: 8,
          useNativeDriver: false,
        }),
        Animated.spring(averageBarHeight, {
          toValue: 1,
          tension: 80,
          friction: 8,
          useNativeDriver: false,
        }),
      ]).start();
    }, 1000);
  }, []);

  const emojiTransform = [
    {
      scale: emojiScale
    },
    {
      rotate: emojiRotation.interpolate({
        inputRange: [-5, 0],
        outputRange: ['-5deg', '0deg']
      })
    }
  ];

  const yourBarAnimatedHeight = yourBarHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 220], // 78% representation - bigger tall bar
  });

  const averageBarAnimatedHeight = averageBarHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 80], // 22% representation - bigger shorter bar
  });

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(onboarding)/symptoms');
  };

  return (
    <AppBackground>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Your Analysis is Complete</Text>
        </View>

        {/* Main Content */}
        <Animated.View style={[styles.contentContainer, { opacity: contentOpacity }]}>
          {/* Large Emoji Section */}
          <View style={styles.emojiSection}>
            <Animated.Text style={[styles.largeEmoji, { transform: emojiTransform }]}>
              😕
            </Animated.Text>
            <Text style={styles.productivityText}>Your productivity is low</Text>
          </View>

          {/* Headline Section */}
          <View style={styles.headlineSection}>
            <Text style={styles.headlineText}>Oof. That's rough.</Text>
            <Text style={styles.descriptionText}>
              Based on your responses, you procrastinate more than <Text style={styles.percentageHighlight}>78%</Text> of people. But don't worry - you're in the right place to change that!
            </Text>
          </View>

          {/* Vertical Bar Chart */}
          <View style={styles.chartSection}>
            <View style={styles.barsContainer}>
              {/* Your Bar */}
              <View style={styles.barColumn}>
                <Text style={styles.barLabel}>YOU</Text>
                <View style={styles.barWrapper}>
                  <Animated.View style={[styles.barBackground, { height: yourBarAnimatedHeight }]}>
                    <LinearGradient
                      colors={['#EF4444', '#F97316', '#EAB308']} // red-500, orange-500, yellow-500
                      style={styles.barGradient}
                      start={{ x: 0, y: 1 }}
                      end={{ x: 0, y: 0 }}
                    />
                  </Animated.View>
                </View>
                <Text style={styles.barPercentage}>78%</Text>
              </View>

              {/* Average Bar */}
              <View style={styles.barColumn}>
                <Text style={styles.barLabel}>AVERAGE</Text>
                <View style={styles.barWrapper}>
                  <Animated.View style={[styles.barBackground, { height: averageBarAnimatedHeight }]}>
                    <LinearGradient
                      colors={['#06B6D4', '#22D3EE']} // cyan-500, sky-400
                      style={styles.barGradient}
                      start={{ x: 0, y: 1 }}
                      end={{ x: 0, y: 0 }}
                    />
                  </Animated.View>
                </View>
                <Text style={styles.barPercentage}>22%</Text>
              </View>
            </View>
          </View>
          
          {/* Disclaimer */}
          <View style={styles.disclaimerSection}>
            <Text style={styles.disclaimerText}>
              * This assessment is for educational purposes and provides general insights based on your responses.
            </Text>
          </View>
        </Animated.View>
      </View>
      
      {/* CTA Button - OUTSIDE of main content, matching other onboarding pages */}
      <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + SPACING.page }]}>
        <TouchableOpacity style={styles.ctaButton} onPress={handleContinue}>
          <Text style={styles.ctaButtonText}>Let's Fix This!</Text>
        </TouchableOpacity>
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between', // Match other onboarding pages
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 15, // Same spacing as other question pages
    paddingHorizontal: SPACING.page, // Same as other pages
    marginTop: 50, // Consistent with other pages
  },
  titleText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.mainText,
    textAlign: 'center',
    letterSpacing: -0.5,
    textShadow: '0 3px 6px rgba(0, 0, 0, 0.4)',
    lineHeight: 26, // Proportional to fontSize like other titles
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: SPACING.page,
    paddingBottom: 120, // Space for button, matching other onboarding pages
  },
  emojiSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  largeEmoji: {
    fontSize: 80, // Smaller emoji to fit better
    textShadow: '0 3px 6px rgba(0, 0, 0, 0.4)',
    marginBottom: 8,
  },
  productivityText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(186, 230, 253, 0.8)', // sky-200/80
    textAlign: 'center',
  },
  headlineSection: {
    alignItems: 'center',
    maxWidth: width - 64,
    marginBottom: 16,
    marginTop: 16,
  },
  headlineText: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.mainText,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.8,
    textShadow: '0 3px 6px rgba(0, 0, 0, 0.4)',
  },
  descriptionText: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(186, 230, 253, 0.8)', // sky-200/80
    textAlign: 'center',
    lineHeight: 20,
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  },
  percentageHighlight: {
    fontWeight: '700',
    color: COLORS.mainText,
  },
  chartSection: {
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 20,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 60, // More spacing between bars for bigger bars
    height: 280, // Bigger container for larger bars
  },
  barColumn: {
    alignItems: 'center',
  },
  barLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(103, 232, 249, 0.8)', // sky-300/80
    letterSpacing: 1.2,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  barWrapper: {
    width: 60, // Bigger bars to fill more space
    height: 220,
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  barBackground: {
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.25)',
    elevation: 8,
  },
  barGradient: {
    flex: 1,
    borderRadius: 8,
  },
  barPercentage: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.mainText,
    textAlign: 'center',
    marginTop: 6,
  },
  buttonContainer: {
    paddingHorizontal: SPACING.page,
    zIndex: 10, // Match other onboarding pages
  },
  disclaimerSection: {
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 16,
  },
  disclaimerText: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(186, 230, 253, 0.6)', // sky-200/60 - more subtle
    textAlign: 'center',
    lineHeight: 16,
    fontStyle: 'italic',
  },
  ctaButton: {
    backgroundColor: '#FFFFFF', // var(--vibrant-cta)
    borderRadius: 50, // Same as other NextButtons
    paddingVertical: 16, // Same as SPACING.button
    paddingHorizontal: 32, // Same as other NextButtons (SPACING.button * 2)
    alignItems: 'center',
    boxShadow: '0 8px 24px rgba(255, 255, 255, 0.2)', // Same shadow as other NextButtons
    elevation: 8,
    width: '100%', // Make it full width like other NextButtons
  },
  ctaButtonText: {
    fontSize: 18, // Same as TYPOGRAPHY.buttonNext
    fontWeight: '700',
    color: '#0B1120', // var(--vibrant-cta-text)
    textAlign: 'center',
  },
});