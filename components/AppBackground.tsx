import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { COLORS } from '../constants/theme';

// Modern light blue gradient colors
const MODERN_COLORS = {
  lightBlue1: '#F0F9FF', // sky-50
  lightBlue2: '#E0F2FE', // sky-100
  lightBlue3: '#BAE6FD', // sky-200
  lightBlue4: '#7DD3FC', // sky-300
  lightBlue5: '#38BDF8', // sky-400
  accent1: 'rgba(56, 189, 248, 0.15)', // sky-400/15
  accent2: 'rgba(125, 211, 252, 0.12)', // sky-300/12
  accent3: 'rgba(14, 165, 233, 0.08)', // sky-500/8
};

interface AppBackgroundProps {
  children?: React.ReactNode;
}

export default function AppBackground({ children }: AppBackgroundProps) {
  // Modern gradient animations for dynamic background
  const gradientProgress = useSharedValue(0);
  const blurProgress = useSharedValue(0);
  const accentProgress = useSharedValue(0);

  useEffect(() => {
    // Main gradient animation - slow and smooth
    gradientProgress.value = withRepeat(
      withTiming(1, { duration: 10000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // Blur accent animation - slightly faster
    blurProgress.value = withRepeat(
      withTiming(1, { duration: 7000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // Accent elements animation - different timing for organic feel
    accentProgress.value = withRepeat(
      withTiming(1, { duration: 12000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  // Main background gradient animation
  const backgroundStyle = useAnimatedStyle(() => {
    const opacity = interpolate(gradientProgress.value, [0, 0.5, 1], [0.98, 1, 0.98]);
    return { opacity };
  });

  // Blur accent animation - creates subtle movement
  const blurStyle = useAnimatedStyle(() => {
    const translateX = interpolate(blurProgress.value, [0, 1], [0, 20]);
    const translateY = interpolate(blurProgress.value, [0, 1], [0, -15]);
    const scale = interpolate(blurProgress.value, [0, 0.5, 1], [1, 1.1, 1]);
    return {
      transform: [
        { translateX },
        { translateY },
        { scale },
      ],
    };
  });

  // Accent elements animation
  const accentStyle = useAnimatedStyle(() => {
    const rotation = interpolate(accentProgress.value, [0, 1], [0, 10]);
    const opacity = interpolate(accentProgress.value, [0, 0.5, 1], [0.8, 1, 0.8]);
    return {
      transform: [{ rotate: `${rotation}deg` }],
      opacity,
    };
  });

  return (
    <View style={styles.container}>
      {/* Background layer with pointer events disabled */}
      <View style={styles.backgroundLayer} pointerEvents="none">
        {/* Main modern light blue gradient */}
        <Animated.View style={[styles.gradient, backgroundStyle]}>
          <LinearGradient
            colors={[
              MODERN_COLORS.lightBlue1,    // Very light blue at top
              MODERN_COLORS.lightBlue2,    // Light blue
              MODERN_COLORS.lightBlue3,    // Medium light blue at bottom
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          />
        </Animated.View>

        {/* Accent blur layer - creates subtle depth */}
        <Animated.View style={[styles.blurAccent, accentStyle]}>
          <LinearGradient
            colors={[
              MODERN_COLORS.accent1,       // Subtle blue accent
              'transparent',
              MODERN_COLORS.accent2,       // Another subtle accent
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          />
        </Animated.View>

        {/* Moving blur elements for organic feel */}
        <Animated.View style={[styles.movingBlur, blurStyle]}>
          <LinearGradient
            colors={[
              MODERN_COLORS.accent3,
              'transparent',
              MODERN_COLORS.accent1,
              'transparent',
            ]}
            start={{ x: 0, y: 0.2 }}
            end={{ x: 1, y: 0.8 }}
            style={styles.gradient}
          />
        </Animated.View>

        {/* Subtle overlay for additional depth */}
        <LinearGradient
          colors={[
            'rgba(56, 189, 248, 0.04)', // Very subtle top accent
            'transparent',
            'rgba(125, 211, 252, 0.06)', // Subtle middle
            'transparent',
            'rgba(14, 165, 233, 0.03)', // Very subtle bottom
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
      </View>
      
      {/* Content layer */}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  blurAccent: {
    position: 'absolute',
    top: '20%',
    left: '10%',
    right: '10%',
    bottom: '30%',
    borderRadius: 100,
    transform: [{ rotate: '15deg' }],
  },
  movingBlur: {
    position: 'absolute',
    top: '40%',
    left: '70%',
    width: '60%',
    height: '40%',
    borderRadius: 80,
    transform: [{ rotate: '-10deg' }],
  },
});