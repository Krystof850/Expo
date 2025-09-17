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

interface AnimatedAuraOrbProps {
  size?: number;
}

export default function AnimatedAuraOrb({ size = 192 }: AnimatedAuraOrbProps) {
  // Animation values for obvious visual difference
  const mainPulse = useSharedValue(0);
  const rotation = useSharedValue(0);
  const innerGlow = useSharedValue(0);
  const outerRing = useSharedValue(0);

  useEffect(() => {
    // VERY obvious pulsing animation
    mainPulse.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // Continuous rotation for obvious movement
    rotation.value = withRepeat(
      withTiming(360, { duration: 3000, easing: Easing.linear }),
      -1,
      false
    );

    // Inner glow pulsing
    innerGlow.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // Outer ring animation
    outerRing.value = withRepeat(
      withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  // Main orb dramatic pulsing
  const orbStyle = useAnimatedStyle(() => {
    const scale = interpolate(mainPulse.value, [0, 1], [0.8, 1.2]); // Much more dramatic scaling
    return {
      transform: [{ scale }],
    };
  });

  // Rotating outer ring
  const ringStyle = useAnimatedStyle(() => {
    const rotateZ = interpolate(rotation.value, [0, 360], [0, 360]);
    const scale = interpolate(outerRing.value, [0, 1], [1, 1.15]);
    return {
      transform: [{ rotate: `${rotateZ}deg` }, { scale }],
    };
  });

  // Inner glow animation
  const glowStyle = useAnimatedStyle(() => {
    const opacity = interpolate(innerGlow.value, [0, 1], [0.3, 0.9]);
    const scale = interpolate(innerGlow.value, [0, 1], [0.9, 1.1]);
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  const radius = size / 2;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Dramatic outer glow - PURPLE/PINK to be obviously different */}
      <Animated.View style={[styles.outerGlow, { width: size * 1.4, height: size * 1.4 }]}>
        <LinearGradient
          colors={[
            'rgba(147, 51, 234, 0.4)', // Purple
            'rgba(168, 85, 247, 0.3)', // Lighter purple  
            'rgba(236, 72, 153, 0.2)', // Pink
            'transparent',
          ]}
          style={[styles.glowGradient, { borderRadius: radius * 1.4 }]}
        />
      </Animated.View>

      {/* Rotating outer ring - OBVIOUSLY MOVING */}
      <Animated.View style={[styles.rotatingRing, ringStyle, { width: size * 1.2, height: size * 1.2 }]}>
        <LinearGradient
          colors={[
            'rgba(219, 39, 119, 0.6)', // Pink
            'transparent',
            'rgba(147, 51, 234, 0.6)', // Purple  
            'transparent',
          ]}
          style={[styles.ringGradient, { borderRadius: radius * 1.2 }]}
        />
      </Animated.View>

      {/* Main orb - DRAMATICALLY PULSING */}
      <Animated.View style={[styles.mainOrb, orbStyle, { width: size, height: size }]}>
        <LinearGradient
          colors={[
            '#EC4899', // Bright pink
            '#F97316', // Orange
            '#EF4444', // Red
            '#DC2626', // Dark red
          ]}
          style={[styles.orbGradient, { borderRadius: radius }]}
        />
      </Animated.View>

      {/* Inner animated glow */}
      <Animated.View style={[styles.innerGlow, glowStyle, { width: size * 0.6, height: size * 0.6 }]}>
        <LinearGradient
          colors={[
            'rgba(255, 255, 255, 0.9)',
            'rgba(251, 191, 36, 0.8)', // Yellow glow
            'transparent',
          ]}
          style={[styles.innerGlowGradient, { borderRadius: radius * 0.6 }]}
        />
      </Animated.View>

      {/* Central bright core */}
      <View style={[styles.core, { width: size * 0.2, height: size * 0.2, borderRadius: radius * 0.2 }]}>
        <LinearGradient
          colors={['#FFFFFF', '#FDE047']} // White to bright yellow
          style={[styles.coreGradient, { borderRadius: radius * 0.2 }]}
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
  outerGlow: {
    position: 'absolute',
    alignSelf: 'center',
  },
  glowGradient: {
    width: '100%',
    height: '100%',
  },
  rotatingRing: {
    position: 'absolute',
    alignSelf: 'center',
  },
  ringGradient: {
    width: '100%',
    height: '100%',
    borderWidth: 3,
    borderColor: 'rgba(147, 51, 234, 0.3)',
  },
  mainOrb: {
    position: 'absolute',
    alignSelf: 'center',
    shadowColor: 'rgba(236, 72, 153, 0.8)', // Pink shadow
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 25,
    elevation: 20,
  },
  orbGradient: {
    width: '100%',
    height: '100%',
  },
  innerGlow: {
    position: 'absolute',
    alignSelf: 'center',
  },
  innerGlowGradient: {
    width: '100%',
    height: '100%',
  },
  core: {
    position: 'absolute',
    alignSelf: 'center',
    shadowColor: '#FDE047',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 25,
  },
  coreGradient: {
    width: '100%',
    height: '100%',
  },
});