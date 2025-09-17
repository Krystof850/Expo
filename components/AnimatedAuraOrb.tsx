import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
  useAnimatedProps,
  withSequence,
} from 'react-native-reanimated';
import { Svg, Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface AnimatedAuraOrbProps {
  size?: number;
}

export default function AnimatedAuraOrb({ size = 192 }: AnimatedAuraOrbProps) {
  // Animation values
  const mainPulse = useSharedValue(0);
  const energyFlow1 = useSharedValue(0);
  const energyFlow2 = useSharedValue(0);
  const energyFlow3 = useSharedValue(0);
  const auraGlow = useSharedValue(0);
  const innerMovement = useSharedValue(0);

  useEffect(() => {
    // Main pulsating animation - slow and gentle
    mainPulse.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // Energy flow animations - different speeds for organic movement
    energyFlow1.value = withRepeat(
      withTiming(1, { duration: 4000, easing: Easing.linear }),
      -1,
      false
    );

    energyFlow2.value = withRepeat(
      withTiming(1, { duration: 5500, easing: Easing.linear }),
      -1,
      false
    );

    energyFlow3.value = withRepeat(
      withTiming(1, { duration: 7000, easing: Easing.linear }),
      -1,
      false
    );

    // Aura glow - gentle pulsing
    auraGlow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.7, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false
    );

    // Inner energy movement
    innerMovement.value = withRepeat(
      withTiming(1, { duration: 6000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  // Main orb scale animation
  const orbAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(mainPulse.value, [0, 1], [0.98, 1.02]);
    return {
      transform: [{ scale }],
    };
  });

  // Aura glow animation
  const auraAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(auraGlow.value, [0, 1], [1, 1.15]);
    const opacity = interpolate(auraGlow.value, [0, 1], [0.6, 0.9]);
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  // Inner energy layers animations
  const energy1Style = useAnimatedStyle(() => {
    const rotation = interpolate(energyFlow1.value, [0, 1], [0, 360]);
    const scale = interpolate(innerMovement.value, [0, 1], [0.9, 1.1]);
    return {
      transform: [
        { rotate: `${rotation}deg` },
        { scale },
      ],
    };
  });

  const energy2Style = useAnimatedStyle(() => {
    const rotation = interpolate(energyFlow2.value, [0, 1], [360, 0]);
    const scale = interpolate(innerMovement.value, [0, 1], [1.1, 0.95]);
    return {
      transform: [
        { rotate: `${rotation}deg` },
        { scale },
      ],
    };
  });

  const energy3Style = useAnimatedStyle(() => {
    const rotation = interpolate(energyFlow3.value, [0, 1], [0, 270]);
    return {
      transform: [{ rotate: `${rotation}deg` }],
    };
  });

  // SVG circle animated props for inner energy
  const innerCircleProps = useAnimatedProps(() => {
    const r = interpolate(innerMovement.value, [0, 1], [size * 0.3, size * 0.35]);
    const opacity = interpolate(innerMovement.value, [0, 1], [0.4, 0.7]);
    return {
      r,
      opacity,
    };
  });

  const radius = size / 2;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Outer Aura Glow */}
      <Animated.View style={[styles.auraGlow, auraAnimatedStyle, { width: size * 1.3, height: size * 1.3 }]}>
        <LinearGradient
          colors={[
            'rgba(103, 215, 232, 0.3)',
            'rgba(135, 206, 235, 0.2)',
            'rgba(56, 189, 248, 0.1)',
            'transparent',
          ]}
          style={styles.glowGradient}
        />
      </Animated.View>

      {/* Main Orb Container */}
      <Animated.View style={[styles.orbContainer, orbAnimatedStyle, { width: size, height: size }]}>
        
        {/* Energy Flow Layer 1 - Rotating background energy */}
        <Animated.View style={[styles.energyLayer, energy1Style]}>
          <LinearGradient
            colors={[
              'rgba(135, 206, 235, 0.4)',
              'rgba(103, 215, 232, 0.6)',
              'rgba(135, 206, 235, 0.4)',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.energyGradient, { borderRadius: radius }]}
          />
        </Animated.View>

        {/* Energy Flow Layer 2 - Counter-rotating energy */}
        <Animated.View style={[styles.energyLayer, energy2Style]}>
          <LinearGradient
            colors={[
              'rgba(103, 215, 232, 0.3)',
              'rgba(56, 189, 248, 0.5)',
              'rgba(103, 215, 232, 0.3)',
            ]}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[styles.energyGradient, { borderRadius: radius }]}
          />
        </Animated.View>

        {/* SVG Inner Energy Particles */}
        <Animated.View style={[styles.svgContainer, energy3Style]}>
          <Svg width={size} height={size} style={styles.svg}>
            <Defs>
              <RadialGradient id="innerEnergy" cx="50%" cy="50%" r="50%">
                <Stop offset="0%" stopColor="rgba(255, 255, 255, 0.8)" />
                <Stop offset="50%" stopColor="rgba(135, 206, 235, 0.6)" />
                <Stop offset="100%" stopColor="rgba(56, 189, 248, 0.3)" />
              </RadialGradient>
              <RadialGradient id="coreEnergy" cx="50%" cy="50%" r="30%">
                <Stop offset="0%" stopColor="rgba(255, 255, 255, 0.9)" />
                <Stop offset="100%" stopColor="rgba(178, 216, 235, 0.7)" />
              </RadialGradient>
            </Defs>
            
            {/* Animated inner energy circle */}
            <AnimatedCircle
              cx={radius}
              cy={radius}
              fill="url(#innerEnergy)"
              animatedProps={innerCircleProps}
            />
            
            {/* Core energy dot */}
            <Circle
              cx={radius}
              cy={radius}
              r={size * 0.12}
              fill="url(#coreEnergy)"
              opacity={0.8}
            />
          </Svg>
        </Animated.View>

        {/* Main Orb Shell */}
        <LinearGradient
          colors={[
            'rgba(56, 189, 248, 0.7)',  // Outer edge - darker blue
            'rgba(103, 215, 232, 0.5)', // Middle layer
            'rgba(135, 206, 235, 0.6)', // Inner layer  
            'rgba(178, 216, 235, 0.4)', // Center - lightest
          ]}
          style={[styles.orbShell, { borderRadius: radius }]}
        />

        {/* Highlight overlay for 3D effect */}
        <View style={[styles.highlight, { borderRadius: radius }]}>
          <LinearGradient
            colors={[
              'rgba(255, 255, 255, 0.6)',
              'rgba(255, 255, 255, 0.2)',
              'transparent',
              'transparent',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.highlightGradient, { borderRadius: radius }]}
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  auraGlow: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 1000, // Large radius for perfect circle
  },
  orbContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  energyLayer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  energyGradient: {
    width: '100%',
    height: '100%',
  },
  svgContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  svg: {
    position: 'absolute',
  },
  orbShell: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    shadowColor: 'rgba(56, 189, 248, 0.4)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 15,
  },
  highlight: {
    position: 'absolute',
    width: '85%',
    height: '85%',
    top: '7.5%',
    left: '7.5%',
  },
  highlightGradient: {
    width: '100%',
    height: '100%',
  },
});