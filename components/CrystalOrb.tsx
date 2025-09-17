import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface CrystalOrbProps {
  size?: number;
}

export default function CrystalOrb({ size = 192 }: CrystalOrbProps) {
  // Animation values for crystal-specific effects
  const crystallShimmer = useSharedValue(0);
  const facetRotation = useSharedValue(0);
  const prismGlow = useSharedValue(0);
  const crystallPulse = useSharedValue(0);

  useEffect(() => {
    // Shimmer effect across crystal faces
    crystallShimmer.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // Slow rotation of facets
    facetRotation.value = withRepeat(
      withTiming(360, { duration: 8000, easing: Easing.linear }),
      -1,
      false
    );

    // Prism light effect
    prismGlow.value = withRepeat(
      withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // Gentle crystal pulse
    crystallPulse.value = withRepeat(
      withTiming(1, { duration: 2800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  // Main crystal shape scaling
  const crystalStyle = useAnimatedStyle(() => {
    const scale = interpolate(crystallPulse.value, [0, 1], [0.95, 1.05]);
    return {
      transform: [{ scale }],
    };
  });

  // Rotating facets
  const facetStyle = useAnimatedStyle(() => {
    const rotateZ = interpolate(facetRotation.value, [0, 360], [0, 360]);
    return {
      transform: [{ rotate: `${rotateZ}deg` }],
    };
  });

  // Shimmer effect
  const shimmerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(crystallShimmer.value, [0, 1], [0.2, 0.8]);
    const translateX = interpolate(crystallShimmer.value, [0, 1], [-size, size]);
    return {
      opacity,
      transform: [{ translateX }],
    };
  });

  // Prism glow
  const prismStyle = useAnimatedStyle(() => {
    const opacity = interpolate(prismGlow.value, [0, 1], [0.4, 0.9]);
    const scale = interpolate(prismGlow.value, [0, 1], [0.8, 1.2]);
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Outer prism glow */}
      <Animated.View style={[styles.prismGlow, prismStyle, { width: size * 1.3, height: size * 1.3 }]}>
        <LinearGradient
          colors={[
            'rgba(34, 197, 94, 0.3)', // Green
            'rgba(59, 130, 246, 0.3)', // Blue
            'rgba(147, 51, 234, 0.3)', // Purple
            'rgba(236, 72, 153, 0.2)', // Pink
            'transparent',
          ]}
          style={[styles.prismGradient, { width: size * 1.3, height: size * 1.3 }]}
        />
      </Animated.View>

      {/* Main crystal body - diamond shape */}
      <Animated.View style={[styles.crystalBody, crystalStyle, { width: size, height: size }]}>
        <LinearGradient
          colors={[
            '#10B981', // Emerald green
            '#06B6D4', // Cyan  
            '#3B82F6', // Blue
            '#8B5CF6', // Purple
          ]}
          style={[styles.crystalGradient, { width: size, height: size }]}
        />
      </Animated.View>

      {/* Rotating facets overlay */}
      <Animated.View style={[styles.facets, facetStyle, { width: size * 0.8, height: size * 0.8 }]}>
        <LinearGradient
          colors={[
            'transparent',
            'rgba(255, 255, 255, 0.4)',
            'transparent',
            'rgba(255, 255, 255, 0.2)',
          ]}
          style={[styles.facetGradient, { width: size * 0.8, height: size * 0.8 }]}
        />
      </Animated.View>

      {/* Shimmer light ray */}
      <Animated.View style={[styles.shimmer, shimmerStyle, { width: size * 0.3, height: size }]}>
        <LinearGradient
          colors={[
            'transparent',
            'rgba(255, 255, 255, 0.8)',
            'transparent',
          ]}
          style={[styles.shimmerGradient, { width: size * 0.3, height: size }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </Animated.View>

      {/* Central bright core */}
      <View style={[styles.core, { width: size * 0.15, height: size * 0.15 }]}>
        <LinearGradient
          colors={['#FFFFFF', '#F0FDF4']} // White to light green
          style={[styles.coreGradient, { width: size * 0.15, height: size * 0.15 }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  prismGlow: {
    position: 'absolute',
    alignSelf: 'center',
  },
  prismGradient: {
    borderRadius: 8, // Angular, not circular
  },
  crystalBody: {
    position: 'absolute',
    alignSelf: 'center',
    shadowColor: 'rgba(34, 197, 94, 0.8)', // Green shadow
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 20,
    // Diamond shape using transform
    transform: [{ rotate: '45deg' }],
  },
  crystalGradient: {
    borderRadius: 12, // Angular crystal shape
  },
  facets: {
    position: 'absolute',
    alignSelf: 'center',
    borderRadius: 8,
  },
  facetGradient: {
    borderRadius: 8,
  },
  shimmer: {
    position: 'absolute',
    alignSelf: 'center',
  },
  shimmerGradient: {
    borderRadius: 4,
  },
  core: {
    position: 'absolute',
    alignSelf: 'center',
    borderRadius: 4, // Angular core
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 25,
  },
  coreGradient: {
    borderRadius: 4,
  },
});