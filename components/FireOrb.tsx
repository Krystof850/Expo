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
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface FireOrbProps {
  size: number;
}

const FireOrb: React.FC<FireOrbProps> = ({ size }) => {
  // Animation values
  const flameFlicker1 = useSharedValue(0);
  const flameFlicker2 = useSharedValue(0);
  const flameFlicker3 = useSharedValue(0);
  const emberGlow = useSharedValue(1);
  const heatWave = useSharedValue(0);
  const coreIntensity = useSharedValue(1);
  const flameDance = useSharedValue(0);

  useEffect(() => {
    // Random flame flicker - Flame 1
    flameFlicker1.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 200 + Math.random() * 100 }),
        withTiming(0.3, { duration: 150 + Math.random() * 100 }),
        withTiming(0.8, { duration: 180 + Math.random() * 120 }),
        withTiming(0.5, { duration: 160 + Math.random() * 80 }),
        withTiming(1, { duration: 190 + Math.random() * 110 })
      ),
      -1,
      false
    );

    // Random flame flicker - Flame 2
    flameFlicker2.value = withDelay(
      300,
      withRepeat(
        withSequence(
          withTiming(0.7, { duration: 180 + Math.random() * 90 }),
          withTiming(1, { duration: 220 + Math.random() * 100 }),
          withTiming(0.4, { duration: 160 + Math.random() * 80 }),
          withTiming(0.9, { duration: 200 + Math.random() * 120 }),
          withTiming(0.6, { duration: 170 + Math.random() * 90 })
        ),
        -1,
        false
      )
    );

    // Random flame flicker - Flame 3
    flameFlicker3.value = withDelay(
      600,
      withRepeat(
        withSequence(
          withTiming(0.5, { duration: 190 + Math.random() * 110 }),
          withTiming(0.8, { duration: 170 + Math.random() * 80 }),
          withTiming(1, { duration: 210 + Math.random() * 100 }),
          withTiming(0.3, { duration: 150 + Math.random() * 70 }),
          withTiming(0.7, { duration: 180 + Math.random() * 90 })
        ),
        -1,
        false
      )
    );

    // Ember glow pulsing
    emberGlow.value = withRepeat(
      withSequence(
        withTiming(1.4, { duration: 800, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.8, { duration: 600, easing: Easing.inOut(Easing.sin) }),
        withTiming(1.2, { duration: 700, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.9, { duration: 500, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );

    // Heat wave distortion
    heatWave.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000, easing: Easing.bezier(0.4, 0, 0.6, 1) }),
        withTiming(0, { duration: 1200, easing: Easing.bezier(0.4, 0, 0.6, 1) })
      ),
      -1,
      false
    );

    // Core intensity variation
    coreIntensity.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 400, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.7, { duration: 600, easing: Easing.inOut(Easing.quad) }),
        withTiming(1.1, { duration: 500, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.9, { duration: 300, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );

    // Flame dancing motion
    flameDance.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.bezier(0.4, 0, 0.6, 1) }),
        withTiming(-1, { duration: 2500, easing: Easing.bezier(0.4, 0, 0.6, 1) }),
        withTiming(0, { duration: 1500, easing: Easing.bezier(0.4, 0, 0.6, 1) })
      ),
      -1,
      false
    );
  }, []);

  // Main orb body animation (organic flame shape)
  const orbBodyStyle = useAnimatedStyle(() => {
    const scaleX = interpolate(emberGlow.value, [0.8, 1.4], [1, 1.05]);
    const scaleY = interpolate(emberGlow.value, [0.8, 1.4], [1, 1.1]);
    const translateX = interpolate(flameDance.value, [-1, 1], [-2, 2]);
    
    return {
      transform: [{ scaleX }, { scaleY }, { translateX }],
    };
  });

  // Flame animations
  const flame1Style = useAnimatedStyle(() => {
    const opacity = interpolate(flameFlicker1.value, [0.3, 1], [0.4, 1]);
    const scaleY = interpolate(flameFlicker1.value, [0.3, 1], [0.7, 1.2]);
    const translateY = interpolate(flameFlicker1.value, [0.3, 1], [10, -5]);
    
    return {
      opacity,
      transform: [{ scaleY }, { translateY }],
    };
  });

  const flame2Style = useAnimatedStyle(() => {
    const opacity = interpolate(flameFlicker2.value, [0.4, 1], [0.5, 0.9]);
    const scaleY = interpolate(flameFlicker2.value, [0.4, 1], [0.8, 1.1]);
    const translateY = interpolate(flameFlicker2.value, [0.4, 1], [8, -3]);
    
    return {
      opacity,
      transform: [{ scaleY }, { translateY }],
    };
  });

  const flame3Style = useAnimatedStyle(() => {
    const opacity = interpolate(flameFlicker3.value, [0.3, 1], [0.3, 0.8]);
    const scaleY = interpolate(flameFlicker3.value, [0.3, 1], [0.6, 1.0]);
    const translateY = interpolate(flameFlicker3.value, [0.3, 1], [12, -2]);
    
    return {
      opacity,
      transform: [{ scaleY }, { translateY }],
    };
  });

  // Heat wave animation
  const heatWaveStyle = useAnimatedStyle(() => {
    const scale = interpolate(heatWave.value, [0, 1], [1, 1.4]);
    const opacity = interpolate(heatWave.value, [0, 1], [0.1, 0.6]);
    
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  // Core glow animation
  const coreGlowStyle = useAnimatedStyle(() => {
    const opacity = interpolate(coreIntensity.value, [0.7, 1.3], [0.7, 1]);
    const scale = interpolate(coreIntensity.value, [0.7, 1.3], [0.9, 1.3]);
    
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Heat Wave Background */}
      <Animated.View style={[styles.heatWave, heatWaveStyle]}>
        <LinearGradient
          colors={['rgba(255, 69, 0, 0.3)', 'rgba(255, 140, 0, 0.2)', 'rgba(255, 215, 0, 0.1)']}
          style={styles.heatGradient}
          start={{ x: 0.5, y: 1 }}
          end={{ x: 0.5, y: 0 }}
        />
      </Animated.View>

      {/* Main Orb Body - Organic Flame Shape */}
      <Animated.View style={[styles.orbBody, orbBodyStyle]}>
        <LinearGradient
          colors={['#FF4500', '#FF8C00', '#FFD700', '#FF6347']}
          style={styles.bodyGradient}
          start={{ x: 0.5, y: 1 }}
          end={{ x: 0.5, y: 0 }}
        />
      </Animated.View>

      {/* Flame Layers */}
      <Animated.View style={[styles.flame, styles.flame1, flame1Style]}>
        <LinearGradient
          colors={['rgba(255, 69, 0, 0.8)', 'rgba(255, 140, 0, 0.6)', 'rgba(255, 215, 0, 0.4)']}
          style={styles.flameGradient}
          start={{ x: 0.5, y: 1 }}
          end={{ x: 0.5, y: 0 }}
        />
      </Animated.View>
      
      <Animated.View style={[styles.flame, styles.flame2, flame2Style]}>
        <LinearGradient
          colors={['rgba(255, 140, 0, 0.7)', 'rgba(255, 215, 0, 0.5)', 'rgba(255, 255, 0, 0.3)']}
          style={styles.flameGradient}
          start={{ x: 0.5, y: 1 }}
          end={{ x: 0.5, y: 0 }}
        />
      </Animated.View>
      
      <Animated.View style={[styles.flame, styles.flame3, flame3Style]}>
        <LinearGradient
          colors={['rgba(255, 215, 0, 0.6)', 'rgba(255, 255, 0, 0.4)', 'rgba(255, 255, 255, 0.2)']}
          style={styles.flameGradient}
          start={{ x: 0.5, y: 1 }}
          end={{ x: 0.5, y: 0 }}
        />
      </Animated.View>

      {/* Core Glow */}
      <Animated.View style={[styles.coreGlow, coreGlowStyle]}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 215, 0, 0.8)', 'rgba(255, 69, 0, 0.6)']}
          style={styles.coreGradient}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {/* Inner Core */}
      <View style={styles.innerCore}>
        <LinearGradient
          colors={['#FFFFFF', '#FFD700', '#FF4500']}
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
  heatWave: {
    position: 'absolute',
    width: '140%',
    height: '140%',
    borderRadius: 1000,
  },
  heatGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 1000,
  },
  orbBody: {
    position: 'absolute',
    width: '80%',
    height: '80%',
    // Organic flame shape
    borderRadius: 1000,
  },
  bodyGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 1000,
  },
  flame: {
    position: 'absolute',
    borderRadius: 1000,
  },
  flame1: {
    width: '90%',
    height: '90%',
    top: '5%',
    left: '5%',
  },
  flame2: {
    width: '70%',
    height: '70%',
    top: '15%',
    left: '15%',
  },
  flame3: {
    width: '50%',
    height: '50%',
    top: '25%',
    left: '25%',
  },
  flameGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 1000,
  },
  coreGlow: {
    position: 'absolute',
    width: '40%',
    height: '40%',
    borderRadius: 1000,
  },
  coreGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 1000,
  },
  innerCore: {
    position: 'absolute',
    width: '20%',
    height: '20%',
    borderRadius: 1000,
  },
  coreInner: {
    width: '100%',
    height: '100%',
    borderRadius: 1000,
  },
});

export default FireOrb;