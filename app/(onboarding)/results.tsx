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
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
import AppBackground from '../../components/AppBackground';
import { COLORS, SPACING } from '@/constants/theme';

const { width } = Dimensions.get('window');
const GAUGE_SIZE = 200;
const GAUGE_STROKE_WIDTH = 12;
const GAUGE_RADIUS = (GAUGE_SIZE - GAUGE_STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * GAUGE_RADIUS;

export default function ResultsScreen() {
  const gaugeProgress = useRef(new Animated.Value(0)).current;
  const yourBarHeight = useRef(new Animated.Value(0)).current;
  const averageBarHeight = useRef(new Animated.Value(0)).current;
  const emojiScale = useRef(new Animated.Value(0)).current;
  const emojiRotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations after component mounts
    const animationDelay = 500;

    // Animate gauge progress to 73%
    setTimeout(() => {
      Animated.timing(gaugeProgress, {
        toValue: 0.73,
        duration: 2000,
        useNativeDriver: false,
      }).start();
    }, animationDelay);

    // Animate bars
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(yourBarHeight, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(averageBarHeight, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
      ]).start();
    }, animationDelay + 1000);

    // Animate emoji with scale and rotation
    setTimeout(() => {
      Animated.parallel([
        Animated.spring(emojiScale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(emojiRotation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start();
    }, animationDelay + 200);
  }, []);

  const strokeDashoffset = gaugeProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCUMFERENCE, 0],
  });

  const yourBarAnimatedHeight = yourBarHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 156], // 78% of 200px = 156px
  });

  const averageBarAnimatedHeight = averageBarHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 44], // 22% of 200px = 44px
  });

  const emojiTransform = [{
    scale: emojiScale
  }, {
    rotate: emojiRotation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: ['15deg', '-5deg', '0deg']
    })
  }];

  const handleContinue = () => {
    router.push('/(onboarding)/symptoms');
  };

  return (
    <AppBackground>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        
        {/* No header - removed back arrow */}

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Your Analysis is Complete</Text>
        </View>

        {/* Main Content */}
        <View style={styles.contentContainer}>
          {/* Circular Gauge */}
          <View style={styles.gaugeContainer}>
            <Svg width={GAUGE_SIZE} height={GAUGE_SIZE}>
              {/* Basic gray circle - no animation, no colors */}
              <Circle
                cx={GAUGE_SIZE / 2}
                cy={GAUGE_SIZE / 2}
                r={GAUGE_RADIUS}
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth={GAUGE_STROKE_WIDTH}
                fill="none"
              />
            </Svg>
            
            {/* Center content */}
            <View style={styles.gaugeCenter}>
              <Animated.Text style={[styles.emoji, { transform: emojiTransform }]}>
                😕
              </Animated.Text>
              <Text style={styles.gaugeCenterText}>Your productivity is low</Text>
            </View>
          </View>

          {/* Headline */}
          <View style={styles.headlineContainer}>
            <Text style={styles.headlineText}>Oof. That's rough.</Text>
            <Text style={styles.descriptionText}>
              You're procrastinating more than <Text style={styles.percentageHighlight}>78%</Text> of people your age. But hey, that's why you're here, right?
            </Text>
          </View>

          {/* Bar Comparison Chart */}
          <View style={styles.chartContainer}>
            <View style={styles.barsContainer}>
              {/* Your Bar */}
              <View style={styles.barColumn}>
                <Text style={styles.barLabel}>YOU</Text>
                <View style={styles.barWrapper}>
                  <Animated.View style={[styles.barBackground, { height: yourBarAnimatedHeight }]}>
                    <LinearGradient
                      colors={['#EF4444', '#F97316', '#EAB308']}
                      style={styles.barGradient}
                      start={{ x: 0, y: 1 }}
                      end={{ x: 0, y: 0 }}
                    />
                  </Animated.View>
                </View>
              </View>

              {/* Average Bar */}
              <View style={styles.barColumn}>
                <Text style={styles.barLabel}>AVERAGE</Text>
                <View style={styles.barWrapper}>
                  <Animated.View style={[styles.barBackground, { height: averageBarAnimatedHeight }]}>
                    <LinearGradient
                      colors={['#22D3EE', '#06B6D4']}
                      style={styles.barGradient}
                      start={{ x: 0, y: 1 }}
                      end={{ x: 0, y: 0 }}
                    />
                  </Animated.View>
                </View>
              </View>
            </View>
            
            {/* Percentages below bars */}
            <View style={styles.percentagesContainer}>
              <Text style={styles.barPercentageBelow}>78%</Text>
              <Text style={styles.barPercentageBelow}>22%</Text>
            </View>
          </View>
        </View>

        {/* CTA Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.ctaButton} onPress={handleContinue}>
            <Text style={styles.ctaButtonText}>Let's Fix This!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60, // Reduced top padding
    paddingBottom: 32,
    paddingHorizontal: 32,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 120, // Extra large spacing to completely prevent overlap with gauge
    paddingTop: 20, // Add top padding for better spacing
  },
  titleText: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.mainText,
    textAlign: 'center',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start', // Changed to flex-start for better spacing control
    paddingTop: 0, // No top padding to give more space for title
  },
  gaugeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 60, // Much more spacing after gauge
    position: 'relative',
  },
  gauge: {
    transform: [{ scaleY: -1 }],
  },
  gaugeCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 48,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  gaugeCenterText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(186, 230, 253, 0.8)', // sky-200/80
    marginTop: 8,
    textAlign: 'center',
  },
  headlineContainer: {
    alignItems: 'center',
    marginBottom: 48, // More spacing after headline
    maxWidth: width - 64,
  },
  headlineText: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.mainText,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  descriptionText: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(186, 230, 253, 0.8)', // sky-200/80
    textAlign: 'center',
    lineHeight: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  percentageHighlight: {
    fontWeight: '700',
    color: COLORS.mainText,
  },
  chartContainer: {
    marginBottom: 20, // Less spacing to make room for percentages
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 48,
    height: 240,
  },
  barColumn: {
    alignItems: 'center',
  },
  barLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(103, 232, 249, 0.8)', // sky-300/80
    letterSpacing: 1,
    marginBottom: 12,
  },
  barWrapper: {
    width: 48,
    height: 200,
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  barBackground: {
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  barGradient: {
    flex: 1,
    borderRadius: 8,
  },
  percentagesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 48, // Match the exact gap between bars
    marginTop: 16, // Space between bars and percentages
    marginBottom: 32, // Add bottom margin for better spacing
  },
  barPercentageBelow: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.mainText,
    textAlign: 'center',
    minWidth: 48, // Minimum width to ensure proper alignment
  },
  buttonContainer: {
    width: '100%',
  },
  ctaButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    shadowColor: 'rgba(255, 255, 255, 0.2)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B1120',
    textAlign: 'center',
  },
});