import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface LightningOrbProps {
  size: number;
}

const LightningOrb: React.FC<LightningOrbProps> = ({ size }) => {
  // Animation values
  const electricPulse = useSharedValue(0);
  const lightningStrike1 = useSharedValue(0);
  const lightningStrike2 = useSharedValue(0);
  const lightningStrike3 = useSharedValue(0);
  const coreGlow = useSharedValue(1);
  const rotation = useSharedValue(0);

  useEffect(() => {
    // Continuous electric pulse
    electricPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800, easing: Easing.bezier(0.4, 0, 0.6, 1) }),
        withTiming(0, { duration: 1200, easing: Easing.bezier(0.4, 0, 0.6, 1) })
      ),
      -1,
      false
    );

    // Random lightning strikes - Strike 1
    const startLightning1 = () => {
      lightningStrike1.value = withSequence(
        withTiming(1, { duration: 50 }),
        withTiming(0, { duration: 100 }),
        withTiming(1, { duration: 50 }),
        withTiming(0, { duration: 200 }),
        withDelay(Math.random() * 3000 + 1000, withTiming(0, { duration: 0 }))
      );
    };

    // Random lightning strikes - Strike 2
    const startLightning2 = () => {
      lightningStrike2.value = withDelay(
        Math.random() * 1500 + 500,
        withSequence(
          withTiming(1, { duration: 30 }),
          withTiming(0, { duration: 80 }),
          withTiming(1, { duration: 40 }),
          withTiming(0, { duration: 150 })
        )
      );
    };

    // Random lightning strikes - Strike 3
    const startLightning3 = () => {
      lightningStrike3.value = withDelay(
        Math.random() * 2000 + 800,
        withSequence(
          withTiming(1, { duration: 40 }),
          withTiming(0, { duration: 120 }),
          withTiming(1, { duration: 60 }),
          withTiming(0, { duration: 180 })
        )
      );
    };

    // Core glow intensity
    coreGlow.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 600, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.8, { duration: 900, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );

    // Slow rotation
    rotation.value = withRepeat(
      withTiming(360, { duration: 15000, easing: Easing.linear }),
      -1,
      false
    );

    // Start lightning sequences
    const lightning1Interval = setInterval(startLightning1, 2500);
    const lightning2Interval = setInterval(startLightning2, 3200);
    const lightning3Interval = setInterval(startLightning3, 4100);

    return () => {
      clearInterval(lightning1Interval);
      clearInterval(lightning2Interval);
      clearInterval(lightning3Interval);
    };
  }, []);

  // Main orb body animation (angular/electric shape)
  const orbBodyStyle = useAnimatedStyle(() => {
    const scale = interpolate(electricPulse.value, [0, 1], [1, 1.1]);
    const rotateZ = `${rotation.value}deg`;
    
    return {
      transform: [{ scale }, { rotateZ }],
    };
  });

  // Core glow animation
  const coreGlowStyle = useAnimatedStyle(() => {
    const opacity = interpolate(coreGlow.value, [0.8, 1.3], [0.6, 1]);
    const scale = interpolate(coreGlow.value, [0.8, 1.3], [0.9, 1.2]);
    
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  // Lightning strike animations
  const lightning1Style = useAnimatedStyle(() => ({
    opacity: lightningStrike1.value,
  }));

  const lightning2Style = useAnimatedStyle(() => ({
    opacity: lightningStrike2.value,
  }));

  const lightning3Style = useAnimatedStyle(() => ({
    opacity: lightningStrike3.value,
  }));

  // Electric field animation
  const electricFieldStyle = useAnimatedStyle(() => {
    const scale = interpolate(electricPulse.value, [0, 1], [1, 1.3]);
    const opacity = interpolate(electricPulse.value, [0, 1], [0.3, 0.7]);
    
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Electric Field Background */}
      <Animated.View style={[styles.electricField, electricFieldStyle]}>
        <LinearGradient
          colors={['rgba(59, 130, 246, 0.3)', 'rgba(147, 197, 253, 0.2)', 'rgba(254, 240, 138, 0.3)']}
          style={styles.electricFieldGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {/* Main Orb Body - Angular/Electric Shape */}
      <Animated.View style={[styles.orbBody, orbBodyStyle]}>
        <LinearGradient
          colors={['#3B82F6', '#60A5FA', '#93C5FD', '#FEF08A']}
          style={styles.bodyGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {/* Lightning Bolts */}
      <Animated.View style={[styles.lightningBolt, styles.lightning1, lightning1Style]}>
        <View style={styles.boltLine} />
      </Animated.View>
      
      <Animated.View style={[styles.lightningBolt, styles.lightning2, lightning2Style]}>
        <View style={styles.boltLine} />
      </Animated.View>
      
      <Animated.View style={[styles.lightningBolt, styles.lightning3, lightning3Style]}>
        <View style={styles.boltLine} />
      </Animated.View>

      {/* Core Glow */}
      <Animated.View style={[styles.coreGlow, coreGlowStyle]}>
        <LinearGradient
          colors={['rgba(254, 240, 138, 0.9)', 'rgba(59, 130, 246, 0.6)']}
          style={styles.coreGradient}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {/* Electric Core */}
      <View style={styles.electricCore}>
        <LinearGradient
          colors={['#FEF08A', '#3B82F6', '#1E40AF']}
          style={styles.coreInner}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  electricField: {
    position: 'absolute',
    width: '130%',
    height: '130%',
    borderRadius: 1000,
  },
  electricFieldGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 1000,
  },
  orbBody: {
    position: 'absolute',
    width: '85%',
    height: '85%',
    // Angular shape - octagon-like
    transform: [{ rotate: '22.5deg' }],
  },
  bodyGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 8, // Angular corners for electric feel
  },
  lightningBolt: {
    position: 'absolute',
    backgroundColor: '#FEF08A',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  lightning1: {
    width: 2,
    height: '70%',
    top: '15%',
    left: '25%',
    transform: [{ rotate: '15deg' }],
  },
  lightning2: {
    width: 2,
    height: '80%',
    top: '10%',
    right: '30%',
    transform: [{ rotate: '-20deg' }],
  },
  lightning3: {
    width: 2,
    height: '60%',
    bottom: '20%',
    left: '50%',
    transform: [{ rotate: '45deg' }],
  },
  boltLine: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FEF08A',
  },
  coreGlow: {
    position: 'absolute',
    width: '50%',
    height: '50%',
    borderRadius: 1000,
  },
  coreGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 1000,
  },
  electricCore: {
    position: 'absolute',
    width: '25%',
    height: '25%',
    borderRadius: 1000,
  },
  coreInner: {
    width: '100%',
    height: '100%',
    borderRadius: 1000,
  },
});

export default LightningOrb;