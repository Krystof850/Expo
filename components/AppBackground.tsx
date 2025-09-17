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
  // Multiple animation values for dynamic lighting effects
  const gradientFlow = useSharedValue(0);
  const glowShift = useSharedValue(0);
  const lightDance = useSharedValue(0);

  useEffect(() => {
    // Primary gradient flow - slow and smooth
    gradientFlow.value = withRepeat(
      withTiming(1, { duration: 12000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    
    // Glow shift for brightness variations
    glowShift.value = withRepeat(
      withTiming(1, { duration: 8000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    
    // Light dance for subtle brightness spots
    lightDance.value = withRepeat(
      withTiming(1, { duration: 15000, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
  }, []);

  // Primary gradient animation
  const primaryGradientStyle = useAnimatedStyle(() => {
    const opacity = interpolate(gradientFlow.value, [0, 0.5, 1], [0.9, 1, 0.9]);
    return { opacity };
  });
  
  // Secondary glow overlay
  const glowOverlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(glowShift.value, [0, 0.5, 1], [0.3, 0.6, 0.3]);
    const translateX = interpolate(glowShift.value, [0, 1], [-50, 50]);
    const translateY = interpolate(glowShift.value, [0, 1], [-30, 30]);
    return {
      opacity,
      transform: [{ translateX }, { translateY }],
    };
  });
  
  // Light spot animation
  const lightSpotStyle = useAnimatedStyle(() => {
    const opacity = interpolate(lightDance.value, [0, 0.3, 0.7, 1], [0.1, 0.4, 0.4, 0.1]);
    const scale = interpolate(lightDance.value, [0, 0.5, 1], [0.8, 1.2, 0.8]);
    const translateX = interpolate(lightDance.value, [0, 1], [100, -100]);
    const translateY = interpolate(lightDance.value, [0, 1], [50, -50]);
    return {
      opacity,
      transform: [{ scale }, { translateX }, { translateY }],
    };
  });

  return (
    <View style={styles.container}>
      {/* Background layer with pointer events disabled */}
      <View style={styles.backgroundLayer} pointerEvents="none">
        {/* Primary animated gradient background */}
        <Animated.View style={[styles.gradient, primaryGradientStyle]}>
          <LinearGradient
            colors={[
              '#E0F2FE', // sky-100
              '#BAE6FD', // sky-200
              '#7DD3FC', // sky-300
              '#38BDF8', // sky-400
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          />
        </Animated.View>
        
        {/* Glowing overlay for brightness variations */}
        <Animated.View style={[styles.glowOverlay, glowOverlayStyle]}>
          <LinearGradient
            colors={[
              'rgba(240, 249, 255, 0.8)', // blue-50/80
              'rgba(219, 234, 254, 0.6)', // blue-100/60
              'rgba(147, 197, 253, 0.4)', // blue-300/40
              'transparent',
            ]}
            start={{ x: 0.2, y: 0.2 }}
            end={{ x: 0.8, y: 0.8 }}
            style={styles.gradient}
          />
        </Animated.View>
        
        {/* Moving light spots for dynamic brightness */}
        <Animated.View style={[styles.lightSpot, lightSpotStyle]}>
          <LinearGradient
            colors={[
              'rgba(255, 255, 255, 0.6)',
              'rgba(240, 249, 255, 0.4)',
              'transparent',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.lightSpotGradient}
          />
        </Animated.View>
        
        {/* Additional soft light spot */}
        <View style={styles.additionalLightSpot}>
          <LinearGradient
            colors={[
              'rgba(255, 255, 255, 0.3)',
              'rgba(219, 234, 254, 0.2)',
              'transparent',
            ]}
            start={{ x: 0.6, y: 0.3 }}
            end={{ x: 0.9, y: 0.7 }}
            style={styles.gradient}
          />
        </View>
        
        {/* Subtle depth overlay */}
        <LinearGradient
          colors={[
            'rgba(56, 189, 248, 0.03)', // sky-400/3 at top
            'transparent',
            'rgba(30, 58, 138, 0.05)', // blue-800/5 at bottom
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
  glowOverlay: {
    position: 'absolute',
    top: -100,
    left: -100,
    right: -100,
    bottom: -100,
  },
  lightSpot: {
    position: 'absolute',
    top: '20%',
    left: '30%',
    width: 300,
    height: 300,
  },
  lightSpotGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 150,
  },
  additionalLightSpot: {
    position: 'absolute',
    top: '60%',
    right: '10%',
    width: 200,
    height: 200,
  },
});