import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface WaveOrbProps {
  size: number;
}

const WaveOrb: React.FC<WaveOrbProps> = ({ size }) => {
  // Animation values
  const waveFlow1 = useSharedValue(0);
  const waveFlow2 = useSharedValue(0);
  const waveFlow3 = useSharedValue(0);
  const tidePulse = useSharedValue(0);
  const bubbleRise1 = useSharedValue(0);
  const bubbleRise2 = useSharedValue(0);
  const liquidSwirl = useSharedValue(0);
  const depthGlow = useSharedValue(1);

  useEffect(() => {
    // Flowing wave animations - different speeds for layered effect
    waveFlow1.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.bezier(0.4, 0, 0.6, 1) }),
      -1,
      false
    );

    waveFlow2.value = withRepeat(
      withTiming(1, { duration: 4500, easing: Easing.bezier(0.3, 0, 0.7, 1) }),
      -1,
      false
    );

    waveFlow3.value = withRepeat(
      withTiming(1, { duration: 2200, easing: Easing.bezier(0.5, 0, 0.5, 1) }),
      -1,
      false
    );

    // Tidal pulse - slow breathing effect
    tidePulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );

    // Rising bubbles
    bubbleRise1.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3500, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 0 })
      ),
      -1,
      false
    );

    bubbleRise2.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 1500 }),
        withTiming(1, { duration: 4000, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 0 })
      ),
      -1,
      false
    );

    // Liquid swirl motion
    liquidSwirl.value = withRepeat(
      withTiming(360, { duration: 8000, easing: Easing.linear }),
      -1,
      false
    );

    // Deep water glow variation
    depthGlow.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1800, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.8, { duration: 2200, easing: Easing.inOut(Easing.quad) }),
        withTiming(1.1, { duration: 1600, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.9, { duration: 1400, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );
  }, []);

  // Main orb body animation (liquid shape)
  const orbBodyStyle = useAnimatedStyle(() => {
    const scale = interpolate(tidePulse.value, [0, 1], [1, 1.08]);
    const rotateZ = `${liquidSwirl.value * 0.3}deg`;
    
    return {
      transform: [{ scale }, { rotateZ }],
    };
  });

  // Wave layer animations
  const wave1Style = useAnimatedStyle(() => {
    const translateY = interpolate(waveFlow1.value, [0, 1], [0, -20]);
    const scaleY = interpolate(waveFlow1.value, [0, 1], [1, 1.15]);
    const opacity = interpolate(waveFlow1.value, [0, 0.5, 1], [0.4, 0.8, 0.3]);
    
    return {
      opacity,
      transform: [{ translateY }, { scaleY }],
    };
  });

  const wave2Style = useAnimatedStyle(() => {
    const translateY = interpolate(waveFlow2.value, [0, 1], [10, -15]);
    const scaleY = interpolate(waveFlow2.value, [0, 1], [1, 1.12]);
    const opacity = interpolate(waveFlow2.value, [0, 0.6, 1], [0.3, 0.7, 0.4]);
    
    return {
      opacity,
      transform: [{ translateY }, { scaleY }],
    };
  });

  const wave3Style = useAnimatedStyle(() => {
    const translateY = interpolate(waveFlow3.value, [0, 1], [5, -25]);
    const scaleY = interpolate(waveFlow3.value, [0, 1], [1, 1.2]);
    const opacity = interpolate(waveFlow3.value, [0, 0.4, 1], [0.5, 0.9, 0.2]);
    
    return {
      opacity,
      transform: [{ translateY }, { scaleY }],
    };
  });

  // Bubble animations
  const bubble1Style = useAnimatedStyle(() => {
    const translateY = interpolate(bubbleRise1.value, [0, 1], [40, -50]);
    const opacity = interpolate(bubbleRise1.value, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
    const scale = interpolate(bubbleRise1.value, [0, 1], [0.5, 1.2]);
    
    return {
      opacity,
      transform: [{ translateY }, { scale }],
    };
  });

  const bubble2Style = useAnimatedStyle(() => {
    const translateY = interpolate(bubbleRise2.value, [0, 1], [50, -60]);
    const opacity = interpolate(bubbleRise2.value, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    const scale = interpolate(bubbleRise2.value, [0, 1], [0.3, 1]);
    
    return {
      opacity,
      transform: [{ translateY }, { scale }],
    };
  });

  // Depth glow animation
  const depthGlowStyle = useAnimatedStyle(() => {
    const opacity = interpolate(depthGlow.value, [0.8, 1.2], [0.6, 1]);
    const scale = interpolate(depthGlow.value, [0.8, 1.2], [0.9, 1.3]);
    
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  // Liquid swirl animation
  const liquidSwirlStyle = useAnimatedStyle(() => {
    const rotateZ = `${liquidSwirl.value}deg`;
    
    return {
      transform: [{ rotateZ }],
    };
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Deep Water Background */}
      <Animated.View style={[styles.depthGlow, depthGlowStyle]}>
        <LinearGradient
          colors={['rgba(0, 119, 190, 0.4)', 'rgba(0, 150, 199, 0.3)', 'rgba(72, 202, 228, 0.2)']}
          style={styles.depthGradient}
          start={{ x: 0.5, y: 1 }}
          end={{ x: 0.5, y: 0 }}
        />
      </Animated.View>

      {/* Main Orb Body - Liquid Shape */}
      <Animated.View style={[styles.orbBody, orbBodyStyle]}>
        <LinearGradient
          colors={['#0077BE', '#0096C7', '#48CAE4', '#00B4D8']}
          style={styles.bodyGradient}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
        />
      </Animated.View>

      {/* Liquid Swirl Pattern */}
      <Animated.View style={[styles.liquidSwirl, liquidSwirlStyle]}>
        <LinearGradient
          colors={['rgba(72, 202, 228, 0.6)', 'rgba(0, 150, 199, 0.4)', 'rgba(0, 119, 190, 0.7)']}
          style={styles.swirlGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {/* Wave Layers */}
      <Animated.View style={[styles.wave, styles.wave1, wave1Style]}>
        <LinearGradient
          colors={['rgba(72, 202, 228, 0.7)', 'rgba(0, 180, 216, 0.5)', 'rgba(173, 232, 244, 0.4)']}
          style={styles.waveGradient}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
        />
      </Animated.View>
      
      <Animated.View style={[styles.wave, styles.wave2, wave2Style]}>
        <LinearGradient
          colors={['rgba(0, 180, 216, 0.6)', 'rgba(173, 232, 244, 0.4)', 'rgba(207, 250, 254, 0.3)']}
          style={styles.waveGradient}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
        />
      </Animated.View>
      
      <Animated.View style={[styles.wave, styles.wave3, wave3Style]}>
        <LinearGradient
          colors={['rgba(173, 232, 244, 0.5)', 'rgba(207, 250, 254, 0.3)', 'rgba(240, 253, 255, 0.2)']}
          style={styles.waveGradient}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
        />
      </Animated.View>

      {/* Rising Bubbles */}
      <Animated.View style={[styles.bubble, styles.bubble1, bubble1Style]}>
        <LinearGradient
          colors={['rgba(173, 232, 244, 0.8)', 'rgba(207, 250, 254, 0.6)']}
          style={styles.bubbleGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>
      
      <Animated.View style={[styles.bubble, styles.bubble2, bubble2Style]}>
        <LinearGradient
          colors={['rgba(207, 250, 254, 0.7)', 'rgba(240, 253, 255, 0.5)']}
          style={styles.bubbleGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {/* Core Highlight */}
      <View style={styles.coreHighlight}>
        <LinearGradient
          colors={['rgba(240, 253, 255, 0.9)', 'rgba(173, 232, 244, 0.7)', 'rgba(0, 180, 216, 0.5)']}
          style={styles.highlightGradient}
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
  depthGlow: {
    position: 'absolute',
    width: '130%',
    height: '130%',
    borderRadius: 1000,
  },
  depthGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 1000,
  },
  orbBody: {
    position: 'absolute',
    width: '85%',
    height: '85%',
    borderRadius: 1000,
  },
  bodyGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 1000,
  },
  liquidSwirl: {
    position: 'absolute',
    width: '70%',
    height: '70%',
    borderRadius: 1000,
  },
  swirlGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 1000,
  },
  wave: {
    position: 'absolute',
    borderRadius: 1000,
  },
  wave1: {
    width: '90%',
    height: '90%',
    top: '5%',
    left: '5%',
  },
  wave2: {
    width: '75%',
    height: '75%',
    top: '12.5%',
    left: '12.5%',
  },
  wave3: {
    width: '60%',
    height: '60%',
    top: '20%',
    left: '20%',
  },
  waveGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 1000,
  },
  bubble: {
    position: 'absolute',
    borderRadius: 1000,
  },
  bubble1: {
    width: 8,
    height: 8,
    left: '30%',
    bottom: '30%',
  },
  bubble2: {
    width: 6,
    height: 6,
    right: '35%',
    bottom: '25%',
  },
  bubbleGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 1000,
  },
  coreHighlight: {
    position: 'absolute',
    width: '25%',
    height: '25%',
    top: '25%',
    left: '30%',
    borderRadius: 1000,
  },
  highlightGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 1000,
  },
});

export default WaveOrb;