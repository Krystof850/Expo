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

interface SpiralGalaxyOrbProps {
  size?: number;
}

export default function SpiralGalaxyOrb({ size = 192 }: SpiralGalaxyOrbProps) {
  // Animation values for galaxy spiral effects
  const galaxyRotation = useSharedValue(0);
  const spiralPulse = useSharedValue(0);
  const stardust = useSharedValue(0);
  const coreGlow = useSharedValue(0);
  const armsRotation = useSharedValue(0);

  useEffect(() => {
    // Slow galaxy rotation
    galaxyRotation.value = withRepeat(
      withTiming(360, { duration: 12000, easing: Easing.linear }),
      -1,
      false
    );

    // Counter-rotating spiral arms
    armsRotation.value = withRepeat(
      withTiming(360, { duration: 15000, easing: Easing.linear }),
      -1,
      false
    );

    // Spiral pulse from center
    spiralPulse.value = withRepeat(
      withTiming(1, { duration: 3500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // Stardust particles effect
    stardust.value = withRepeat(
      withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // Core brightness
    coreGlow.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  // Main galaxy rotation
  const galaxyStyle = useAnimatedStyle(() => {
    const rotateZ = interpolate(galaxyRotation.value, [0, 360], [0, 360]);
    const scale = interpolate(spiralPulse.value, [0, 1], [0.9, 1.1]);
    return {
      transform: [{ rotate: `${rotateZ}deg` }, { scale }],
    };
  });

  // Spiral arms rotation (counter to main galaxy)
  const armsStyle = useAnimatedStyle(() => {
    const rotateZ = interpolate(armsRotation.value, [0, 360], [360, 0]); // Counter rotation
    const scale = interpolate(spiralPulse.value, [0, 1], [1, 1.15]);
    return {
      transform: [{ rotate: `${rotateZ}deg` }, { scale }],
    };
  });

  // Stardust particle effects
  const stardustStyle = useAnimatedStyle(() => {
    const opacity = interpolate(stardust.value, [0, 1], [0.3, 0.8]);
    const scale = interpolate(stardust.value, [0, 1], [0.8, 1.2]);
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  // Core brightness
  const coreStyle = useAnimatedStyle(() => {
    const opacity = interpolate(coreGlow.value, [0, 1], [0.6, 1]);
    const scale = interpolate(coreGlow.value, [0, 1], [0.9, 1.3]);
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Outer galaxy glow */}
      <Animated.View style={[styles.galaxyGlow, stardustStyle, { width: size * 1.4, height: size * 1.4 }]}>
        <LinearGradient
          colors={[
            'rgba(139, 92, 246, 0.3)', // Purple
            'rgba(79, 70, 229, 0.3)', // Indigo
            'rgba(30, 58, 138, 0.2)', // Dark blue
            'transparent',
          ]}
          style={[styles.glowGradient, { width: size * 1.4, height: size * 1.4, borderRadius: size * 0.7 }]}
        />
      </Animated.View>

      {/* Main galaxy disc */}
      <Animated.View style={[styles.galaxyDisc, galaxyStyle, { width: size, height: size }]}>
        <LinearGradient
          colors={[
            '#1E1B4B', // Dark purple
            '#312E81', // Purple
            '#4338CA', // Blue
            '#1E40AF', // Darker blue
          ]}
          style={[styles.discGradient, { width: size, height: size, borderRadius: size / 2 }]}
        />
      </Animated.View>

      {/* Spiral arms */}
      <Animated.View style={[styles.spiralArms, armsStyle, { width: size * 0.9, height: size * 0.9 }]}>
        <LinearGradient
          colors={[
            'transparent',
            'rgba(139, 92, 246, 0.6)', // Purple arm
            'transparent',
            'rgba(79, 70, 229, 0.5)', // Indigo arm
            'transparent',
          ]}
          style={[styles.armsGradient, { width: size * 0.9, height: size * 0.9, borderRadius: size * 0.45 }]}
        />
      </Animated.View>

      {/* Stardust particles layer */}
      <Animated.View style={[styles.stardust, stardustStyle, { width: size * 0.7, height: size * 0.7 }]}>
        <LinearGradient
          colors={[
            'rgba(255, 255, 255, 0.1)',
            'rgba(196, 181, 253, 0.3)', // Light purple
            'rgba(255, 255, 255, 0.2)',
            'rgba(147, 197, 253, 0.3)', // Light blue
            'transparent',
          ]}
          style={[styles.stardustGradient, { width: size * 0.7, height: size * 0.7, borderRadius: size * 0.35 }]}
        />
      </Animated.View>

      {/* Bright galactic core */}
      <Animated.View style={[styles.galacticCore, coreStyle, { width: size * 0.2, height: size * 0.2 }]}>
        <LinearGradient
          colors={['#FFFFFF', '#C4B5FD', '#8B5CF6']} // White to light purple to purple
          style={[styles.coreGradient, { width: size * 0.2, height: size * 0.2, borderRadius: size * 0.1 }]}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  galaxyGlow: {
    position: 'absolute',
    alignSelf: 'center',
  },
  glowGradient: {
    width: '100%',
    height: '100%',
  },
  galaxyDisc: {
    position: 'absolute',
    alignSelf: 'center',
    shadowColor: 'rgba(139, 92, 246, 0.8)', // Purple shadow
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 25,
    elevation: 20,
  },
  discGradient: {
    width: '100%',
    height: '100%',
  },
  spiralArms: {
    position: 'absolute',
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  armsGradient: {
    width: '100%',
    height: '100%',
  },
  stardust: {
    position: 'absolute',
    alignSelf: 'center',
  },
  stardustGradient: {
    width: '100%',
    height: '100%',
  },
  galacticCore: {
    position: 'absolute',
    alignSelf: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 25,
  },
  coreGradient: {
    width: '100%',
    height: '100%',
  },
});