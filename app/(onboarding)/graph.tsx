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
import Svg, { Path, Circle, Line, G, Text as SvgText } from 'react-native-svg';

// Create animated components for SVG
const AnimatedPath = Animated.createAnimatedComponent(Path);
import AppBackground from '../../components/AppBackground';
import { COLORS, SPACING } from '@/constants/theme';

const { width } = Dimensions.get('window');

// Chart data as specified
const weeks = ['Week 1', 'Week 2', 'Week 3'];
const procrap = [0.25, 0.6, 0.9]; // smooth growth (normalized Y: 0=low, 1=high)
const willpower = [0.3, 0.35, 0.2]; // stagnation/decline
const relapses = [
  { x: 0.4, y: 0.28 },
  { x: 1.3, y: 0.38 },
  { x: 1.8, y: 0.32 },
  { x: 1.9, y: 0.22 }
];

export default function ProcrapGraphScreen() {
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const pathAnimationRef = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in content
    Animated.timing(contentOpacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Animate path drawing with strokeDashoffset
    setTimeout(() => {
      Animated.timing(pathAnimationRef, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }, 400);
  }, []);

  const handleContinue = () => {
    // Navigate to next onboarding screen (dummy route as requested)
    router.push('/(onboarding)/symptoms'); // placeholder - user can change this
  };

  // Chart dimensions - responsive with padding
  const chartPadding = SPACING.page;
  const chartWidth = width - (chartPadding * 2);
  const chartHeight = Math.round(chartWidth * (9/16)); // 16:9 aspect ratio
  const chartInnerPadding = 24;
  const plotWidth = chartWidth - (chartInnerPadding * 2);
  const plotHeight = chartHeight - (chartInnerPadding * 2) - 40; // extra space for X-axis labels

  // Helper function to convert normalized coordinates to pixel coordinates
  const normalizeToPixel = (x: number, y: number) => {
    const pixelX = chartInnerPadding + (x / 2) * plotWidth; // x goes from 0-2 (3 weeks)
    const pixelY = chartInnerPadding + (1 - y) * plotHeight; // invert Y (0=bottom, 1=top)
    return { x: pixelX, y: pixelY };
  };

  // Generate smooth Bezier curve path
  const generateSmoothPath = (values: number[]) => {
    const points = values.map((value, index) => normalizeToPixel(index, value));
    
    if (points.length < 2) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      
      // Simple smoothing using cubic bezier
      const cpx1 = prev.x + (curr.x - prev.x) * 0.3;
      const cpy1 = prev.y;
      const cpx2 = curr.x - (curr.x - prev.x) * 0.3;
      const cpy2 = curr.y;
      
      path += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${curr.x} ${curr.y}`;
    }
    
    return path;
  };

  const procrapPath = generateSmoothPath(procrap);
  const willpowerPath = generateSmoothPath(willpower);

  // Calculate path length for dash animation (approximate)
  const pathLength = plotWidth * 1.5; // rough estimate for smooth curves

  const animatedDashOffset = pathAnimationRef.interpolate({
    inputRange: [0, 1],
    outputRange: [pathLength, 0],
  });

  return (
    <AppBackground>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>PROCRAP vs Willpower</Text>
        </View>

        {/* Main Content */}
        <Animated.View style={[styles.contentContainer, { opacity: contentOpacity }]}>
          
          {/* Chart Container */}
          <View style={styles.chartContainer}>
            
            {/* Legend */}
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: COLORS.accentGreen }]} />
                <Text style={styles.legendText}>With PROCRAP</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
                <Text style={styles.legendText}>Willpower only</Text>
              </View>
            </View>

            {/* SVG Chart */}
            <View style={[styles.svgContainer, { width: chartWidth, height: chartHeight }]}>
              <Svg width={chartWidth} height={chartHeight}>
                {/* Grid lines (hidden/low contrast) */}
                <G opacity={0.15}>
                  {[0.25, 0.5, 0.75].map((ratio, index) => {
                    const y = chartInnerPadding + ratio * plotHeight;
                    return (
                      <Line
                        key={index}
                        x1={chartInnerPadding}
                        y1={y}
                        x2={chartWidth - chartInnerPadding}
                        y2={y}
                        stroke={COLORS.mainText}
                        strokeWidth={0.5}
                      />
                    );
                  })}
                </G>

                {/* Willpower curve (red) */}
                <AnimatedPath
                  d={willpowerPath}
                  stroke="#EF4444"
                  strokeWidth={3}
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={`${pathLength} ${pathLength}`}
                  strokeDashoffset={animatedDashOffset}
                />

                {/* PROCRAP curve (green) */}
                <AnimatedPath
                  d={procrapPath}
                  stroke={COLORS.accentGreen}
                  strokeWidth={3}
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={`${pathLength} ${pathLength}`}
                  strokeDashoffset={animatedDashOffset}
                />

                {/* Relapse markers (red X) */}
                {relapses.map((relapse, index) => {
                  const pixel = normalizeToPixel(relapse.x, relapse.y);
                  const size = 4;
                  return (
                    <G key={index} opacity={0.8}>
                      <Line
                        x1={pixel.x - size}
                        y1={pixel.y - size}
                        x2={pixel.x + size}
                        y2={pixel.y + size}
                        stroke="#EF4444"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                      />
                      <Line
                        x1={pixel.x - size}
                        y1={pixel.y + size}
                        x2={pixel.x + size}
                        y2={pixel.y - size}
                        stroke="#EF4444"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                      />
                    </G>
                  );
                })}

                {/* End point marker (green dot) with label */}
                <G>
                  {(() => {
                    const endPoint = normalizeToPixel(2, procrap[2]);
                    return (
                      <>
                        <Circle
                          cx={endPoint.x}
                          cy={endPoint.y}
                          r={6}
                          fill={COLORS.accentGreen}
                        />
                        <SvgText
                          x={endPoint.x}
                          y={endPoint.y - 12}
                          fontSize="10"
                          fill={COLORS.accentGreen}
                          textAnchor="middle"
                          fontWeight="600"
                        >
                          Focus & Discipline
                        </SvgText>
                      </>
                    );
                  })()}
                </G>

                {/* Y-axis labels */}
                {['Low', 'Med', 'High'].map((label, index) => {
                  const y = chartInnerPadding + (index * plotHeight / 2);
                  const x = 12;
                  return (
                    <SvgText
                      key={`y-${index}`}
                      x={x}
                      y={y + 4}
                      fontSize="10"
                      fill={COLORS.questionLabel}
                      textAnchor="start"
                      fontWeight="500"
                      opacity={0.6}
                    >
                      {label}
                    </SvgText>
                  );
                })}
                
                {/* X-axis labels */}
                {weeks.map((week, index) => {
                  const x = chartInnerPadding + (index / 2) * plotWidth;
                  const y = chartHeight - 15;
                  return (
                    <SvgText
                      key={index}
                      x={x}
                      y={y}
                      fontSize="12"
                      fill={COLORS.questionLabel}
                      textAnchor="middle"
                      fontWeight="500"
                    >
                      {week}
                    </SvgText>
                  );
                })}
              </Svg>
            </View>
          </View>

          {/* Descriptive text */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText}>
              PROCRAP helps you beat procrastination faster
            </Text>
            <Text style={styles.descriptionText}>
              and stay consistent with daily action.
            </Text>
          </View>
        </Animated.View>

        {/* CTA Button - consistent with results.tsx */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.ctaButton} onPress={handleContinue}>
            <Text style={styles.ctaButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingBottom: 24,
    paddingHorizontal: 0,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 28,
    paddingHorizontal: 32,
    paddingTop: 8,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.mainText,
    textAlign: 'center',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
    lineHeight: 26,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: SPACING.page,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: SPACING.gap,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.questionLabel,
  },
  svgContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  descriptionContainer: {
    alignItems: 'center',
    marginTop: SPACING.gap,
    maxWidth: width - 64,
  },
  descriptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.descriptionText,
    textAlign: 'center',
    lineHeight: 22,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: SPACING.page,
  },
  ctaButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    shadowColor: 'rgba(255, 255, 255, 0.2)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
    width: '100%',
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B1120',
    textAlign: 'center',
  },
});