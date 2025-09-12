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

interface AppBackgroundProps {
  children?: React.ReactNode;
}

export default function AppBackground({ children }: AppBackgroundProps) {
  // Simple gradient animation for subtle color flow
  const gradientProgress = useSharedValue(0);

  useEffect(() => {
    // Subtle gradient animation - slow and smooth
    gradientProgress.value = withRepeat(
      withTiming(1, { duration: 8000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  // Simple gradient animation - gentle color shifts
  const gradientStyle = useAnimatedStyle(() => {
    // Interpolate between slightly different blue tones for subtle animation
    const colorStart = interpolate(
      gradientProgress.value,
      [0, 0.5, 1],
      [0.6, 0.7, 0.6] // Slight opacity variation for color shift
    );
    
    const colorEnd = interpolate(
      gradientProgress.value,
      [0, 0.5, 1],
      [0.9, 0.8, 0.9] // Gentle variation in end color opacity
    );

    return {
      opacity: interpolate(gradientProgress.value, [0, 0.5, 1], [0.95, 1, 0.95]),
    };
  });

  return (
    <View style={styles.container}>
      {/* Background layer with pointer events disabled */}
      <View style={styles.backgroundLayer} pointerEvents="none">
        {/* Simple animated gradient background */}
        <Animated.View style={[styles.gradient, gradientStyle]}>
          <LinearGradient
            colors={[COLORS.gradientStart, COLORS.gradientMiddle, COLORS.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          />
        </Animated.View>
        
        {/* Subtle overlay gradient for depth */}
        <LinearGradient
          colors={[
            'rgba(56, 189, 248, 0.05)', // sky-400/5 at top
            'transparent',
            'rgba(30, 58, 138, 0.1)', // blue-800/10 at bottom
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
});