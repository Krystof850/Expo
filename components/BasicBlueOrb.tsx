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

interface BasicBlueOrbProps {
  size?: number;
}

export default function BasicBlueOrb({ size = 192 }: BasicBlueOrbProps) {
  // Animation values for level 1 - simple but visible effects
  const gentlePulse = useSharedValue(0);
  const softRotation = useSharedValue(0);
  const innerGlow = useSharedValue(0);

  useEffect(() => {
    // Gentle pulsing animation - not too dramatic for level 1
    gentlePulse.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // Slow, subtle rotation
    softRotation.value = withRepeat(
      withTiming(360, { duration: 6000, easing: Easing.linear }),
      -1,
      false
    );

    // Soft inner glow pulsing
    innerGlow.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  // Main orb gentle scaling
  const orbStyle = useAnimatedStyle(() => {
    const scale = interpolate(gentlePulse.value, [0, 1], [0.95, 1.05]);
    return {
      transform: [{ scale }],
    };
  });

  // Outer ring slow rotation
  const outerStyle = useAnimatedStyle(() => {
    const rotateZ = interpolate(softRotation.value, [0, 360], [0, 360]);
    return {
      transform: [{ rotate: `${rotateZ}deg` }],
    };
  });

  // Inner glow animation
  const glowStyle = useAnimatedStyle(() => {
    const opacity = interpolate(innerGlow.value, [0, 1], [0.6, 0.9]);
    const scale = interpolate(innerGlow.value, [0, 1], [0.98, 1.02]);
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  const radius = size / 2;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Outer glow layer */}
      <Animated.View style={[styles.outerGlow, { width: size * 1.2, height: size * 1.2 }, outerStyle]}>
        <LinearGradient
          colors={['rgba(125, 211, 252, 0.3)', 'rgba(103, 232, 249, 0.5)', 'rgba(125, 211, 252, 0.3)']}
          style={styles.glowGradient}
        />
      </Animated.View>

      {/* Main orb container */}
      <Animated.View style={[styles.orbContainer, { width: size, height: size }, orbStyle]}>
        {/* Outer animated ring */}
        <LinearGradient
          colors={['#7DD3FC', '#67E8F9', '#7DD3FC']}
          style={[styles.orbLayer, { width: size, height: size, borderRadius: radius }]}
        />
        
        {/* Middle layer with glow */}
        <Animated.View style={[styles.middleLayer, glowStyle]}>
          <LinearGradient
            colors={['#E0F2FE', '#BAE6FD']}
            style={[styles.orbLayer, { width: size * 0.7, height: size * 0.7, borderRadius: radius * 0.7 }]}
          />
        </Animated.View>
        
        {/* Inner white center */}
        <LinearGradient
          colors={['#FFFFFF', '#F1F5F9']}
          style={[styles.orbLayer, { width: size * 0.4, height: size * 0.4, borderRadius: radius * 0.4 }]}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerGlow: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 1000,
  },
  orbContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7DD3FC',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  orbLayer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleLayer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});