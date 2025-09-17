import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface HeartbeatOrbProps {
  size?: number;
}

export default function HeartbeatOrb({ size = 192 }: HeartbeatOrbProps) {
  // Animation values for heartbeat effects
  const heartbeatPulse = useSharedValue(0);
  const energyWave = useSharedValue(0);
  const coreIntensity = useSharedValue(0);
  const auraFlicker = useSharedValue(0);
  const rhythmPulse = useSharedValue(0);

  useEffect(() => {
    // Double heartbeat pulse (lub-dub pattern)
    heartbeatPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 200, easing: Easing.out(Easing.exp) }), // Lub
        withTiming(0, { duration: 100, easing: Easing.in(Easing.exp) }),
        withTiming(0.7, { duration: 150, easing: Easing.out(Easing.exp) }), // Dub  
        withTiming(0, { duration: 200, easing: Easing.in(Easing.exp) }),
        withTiming(0, { duration: 800 }), // Rest period
      ),
      -1,
      false
    );

    // Energy waves radiating outward
    energyWave.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.out(Easing.ease) }),
      -1,
      false
    );

    // Core intensity variation
    coreIntensity.value = withRepeat(
      withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // Subtle aura flicker
    auraFlicker.value = withRepeat(
      withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // Steady rhythm pulse
    rhythmPulse.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  // Main heartbeat scaling effect
  const heartbeatStyle = useAnimatedStyle(() => {
    const scale = interpolate(heartbeatPulse.value, [0, 1], [1, 1.4]);
    return {
      transform: [{ scale }],
    };
  });

  // Energy wave expansion
  const waveStyle = useAnimatedStyle(() => {
    const scale = interpolate(energyWave.value, [0, 1], [0.5, 2]);
    const opacity = interpolate(energyWave.value, [0, 0.3, 1], [0.8, 0.4, 0]);
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  // Core intensity
  const coreStyle = useAnimatedStyle(() => {
    const opacity = interpolate(coreIntensity.value, [0, 1], [0.7, 1]);
    const scale = interpolate(heartbeatPulse.value, [0, 1], [1, 1.2]);
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  // Aura flicker
  const auraStyle = useAnimatedStyle(() => {
    const opacity = interpolate(auraFlicker.value, [0, 1], [0.4, 0.7]);
    const scale = interpolate(rhythmPulse.value, [0, 1], [0.95, 1.05]);
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Energy wave rings */}
      <Animated.View style={[styles.energyWave, waveStyle, { width: size * 1.5, height: size * 1.5 }]}>
        <LinearGradient
          colors={[
            'rgba(239, 68, 68, 0.6)', // Red
            'rgba(220, 38, 127, 0.4)', // Pink-red
            'rgba(239, 68, 68, 0.2)', // Light red
            'transparent',
          ]}
          style={[styles.waveGradient, { width: size * 1.5, height: size * 1.5, borderRadius: size * 0.75 }]}
        />
      </Animated.View>

      {/* Outer aura with flicker */}
      <Animated.View style={[styles.aura, auraStyle, { width: size * 1.2, height: size * 1.2 }]}>
        <LinearGradient
          colors={[
            'rgba(239, 68, 68, 0.4)', // Red
            'rgba(251, 113, 133, 0.3)', // Light red
            'rgba(254, 202, 202, 0.2)', // Very light red
            'transparent',
          ]}
          style={[styles.auraGradient, { width: size * 1.2, height: size * 1.2, borderRadius: size * 0.6 }]}
        />
      </Animated.View>

      {/* Main heartbeat orb */}
      <Animated.View style={[styles.heartOrb, heartbeatStyle, { width: size, height: size }]}>
        <LinearGradient
          colors={[
            '#DC2626', // Dark red
            '#EF4444', // Red
            '#F87171', // Light red
            '#FCA5A5', // Very light red
          ]}
          style={[styles.orbGradient, { width: size, height: size, borderRadius: size / 2 }]}
        />
      </Animated.View>

      {/* Inner pulse chambers */}
      <Animated.View style={[styles.innerChamber, heartbeatStyle, { width: size * 0.6, height: size * 0.6 }]}>
        <LinearGradient
          colors={[
            'rgba(239, 68, 68, 0.8)', // Semi-transparent red
            'rgba(220, 38, 127, 0.6)', // Pink-red
            'transparent',
          ]}
          style={[styles.chamberGradient, { width: size * 0.6, height: size * 0.6, borderRadius: size * 0.3 }]}
        />
      </Animated.View>

      {/* Bright core */}
      <Animated.View style={[styles.core, coreStyle, { width: size * 0.15, height: size * 0.15 }]}>
        <LinearGradient
          colors={['#FFFFFF', '#FEE2E2', '#EF4444']} // White to light red to red
          style={[styles.coreGradient, { width: size * 0.15, height: size * 0.15, borderRadius: size * 0.075 }]}
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
  energyWave: {
    position: 'absolute',
    alignSelf: 'center',
  },
  waveGradient: {
    width: '100%',
    height: '100%',
  },
  aura: {
    position: 'absolute',
    alignSelf: 'center',
  },
  auraGradient: {
    width: '100%',
    height: '100%',
  },
  heartOrb: {
    position: 'absolute',
    alignSelf: 'center',
    shadowColor: 'rgba(239, 68, 68, 0.8)', // Red shadow
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 25,
    elevation: 20,
  },
  orbGradient: {
    width: '100%',
    height: '100%',
  },
  innerChamber: {
    position: 'absolute',
    alignSelf: 'center',
  },
  chamberGradient: {
    width: '100%',
    height: '100%',
  },
  core: {
    position: 'absolute',
    alignSelf: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 25,
  },
  coreGradient: {
    width: '100%',
    height: '100%',
  },
});