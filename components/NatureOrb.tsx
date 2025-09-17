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

interface NatureOrbProps {
  size: number;
}

const NatureOrb: React.FC<NatureOrbProps> = ({ size }) => {
  // Animation values
  const leafGrowth1 = useSharedValue(0);
  const leafGrowth2 = useSharedValue(0);
  const leafGrowth3 = useSharedValue(0);
  const vineSpread = useSharedValue(0);
  const photosynthesis = useSharedValue(0);
  const seedlingPulse = useSharedValue(1);
  const organicFlow = useSharedValue(0);
  const earthBreathing = useSharedValue(0);

  useEffect(() => {
    // Leaf growth animations - staggered natural growth
    leafGrowth1.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 4000, easing: Easing.bezier(0.2, 0, 0.3, 1) }),
        withTiming(0.8, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 3000, easing: Easing.out(Easing.quad) })
      ),
      -1,
      false
    );

    leafGrowth2.value = withDelay(
      1500,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 3500, easing: Easing.bezier(0.25, 0, 0.35, 1) }),
          withTiming(0.7, { duration: 1800, easing: Easing.inOut(Easing.quad) }),
          withTiming(1, { duration: 2800, easing: Easing.out(Easing.quad) })
        ),
        -1,
        false
      )
    );

    leafGrowth3.value = withDelay(
      3000,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 4200, easing: Easing.bezier(0.3, 0, 0.4, 1) }),
          withTiming(0.9, { duration: 2200, easing: Easing.inOut(Easing.quad) }),
          withTiming(1, { duration: 3200, easing: Easing.out(Easing.quad) })
        ),
        -1,
        false
      )
    );

    // Vine spreading motion
    vineSpread.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 6000, easing: Easing.bezier(0.2, 0, 0.3, 1) }),
        withTiming(0, { duration: 4000, easing: Easing.bezier(0.7, 0, 0.8, 1) })
      ),
      -1,
      false
    );

    // Photosynthesis glow (energy from sunlight)
    photosynthesis.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.3, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.8, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.5, { duration: 1800, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );

    // Seedling pulse - life force
    seedlingPulse.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 1800, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.9, { duration: 1400, easing: Easing.inOut(Easing.quad) }),
        withTiming(1.1, { duration: 1600, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );

    // Organic flow - natural rhythms
    organicFlow.value = withRepeat(
      withTiming(360, { duration: 20000, easing: Easing.linear }),
      -1,
      false
    );

    // Earth breathing - root system pulse
    earthBreathing.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3500, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, []);

  // Main orb body animation (organic growth)
  const orbBodyStyle = useAnimatedStyle(() => {
    const scale = interpolate(seedlingPulse.value, [0.9, 1.3], [1, 1.05]);
    const rotateZ = `${organicFlow.value * 0.1}deg`;
    
    return {
      transform: [{ scale }, { rotateZ }],
    };
  });

  // Leaf animations
  const leaf1Style = useAnimatedStyle(() => {
    const scaleY = interpolate(leafGrowth1.value, [0, 1], [0.2, 1]);
    const opacity = interpolate(leafGrowth1.value, [0, 0.3, 1], [0, 0.8, 1]);
    const translateY = interpolate(leafGrowth1.value, [0, 1], [20, 0]);
    
    return {
      opacity,
      transform: [{ scaleY }, { translateY }],
    };
  });

  const leaf2Style = useAnimatedStyle(() => {
    const scaleY = interpolate(leafGrowth2.value, [0, 1], [0.1, 1]);
    const opacity = interpolate(leafGrowth2.value, [0, 0.4, 1], [0, 0.7, 0.9]);
    const translateX = interpolate(leafGrowth2.value, [0, 1], [15, 0]);
    
    return {
      opacity,
      transform: [{ scaleY }, { translateX }],
    };
  });

  const leaf3Style = useAnimatedStyle(() => {
    const scaleY = interpolate(leafGrowth3.value, [0, 1], [0.3, 1]);
    const opacity = interpolate(leafGrowth3.value, [0, 0.2, 1], [0, 0.6, 0.8]);
    const translateX = interpolate(leafGrowth3.value, [0, 1], [-10, 0]);
    
    return {
      opacity,
      transform: [{ scaleY }, { translateX }],
    };
  });

  // Vine animation
  const vineStyle = useAnimatedStyle(() => {
    const scaleX = interpolate(vineSpread.value, [0, 1], [0.5, 1.2]);
    const opacity = interpolate(vineSpread.value, [0, 0.5, 1], [0.3, 0.8, 0.5]);
    
    return {
      opacity,
      transform: [{ scaleX }],
    };
  });

  // Photosynthesis glow animation
  const photosynthesisStyle = useAnimatedStyle(() => {
    const opacity = interpolate(photosynthesis.value, [0.3, 1], [0.4, 1]);
    const scale = interpolate(photosynthesis.value, [0.3, 1], [0.9, 1.4]);
    
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  // Earth breathing animation
  const earthBreathingStyle = useAnimatedStyle(() => {
    const scale = interpolate(earthBreathing.value, [0, 1], [1, 1.2]);
    const opacity = interpolate(earthBreathing.value, [0, 1], [0.3, 0.7]);
    
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Earth Breathing Background */}
      <Animated.View style={[styles.earthBackground, earthBreathingStyle]}>
        <LinearGradient
          colors={['rgba(101, 67, 33, 0.4)', 'rgba(139, 69, 19, 0.3)', 'rgba(34, 139, 34, 0.2)']}
          style={styles.earthGradient}
          start={{ x: 0.5, y: 1 }}
          end={{ x: 0.5, y: 0 }}
        />
      </Animated.View>

      {/* Main Orb Body - Organic Growth Shape */}
      <Animated.View style={[styles.orbBody, orbBodyStyle]}>
        <LinearGradient
          colors={['#228B22', '#32CD32', '#90EE90', '#98FB98']}
          style={styles.bodyGradient}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
        />
      </Animated.View>

      {/* Vine Spreading */}
      <Animated.View style={[styles.vine, vineStyle]}>
        <LinearGradient
          colors={['rgba(34, 139, 34, 0.7)', 'rgba(50, 205, 50, 0.5)', 'rgba(144, 238, 144, 0.3)']}
          style={styles.vineGradient}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        />
      </Animated.View>

      {/* Growing Leaves */}
      <Animated.View style={[styles.leaf, styles.leaf1, leaf1Style]}>
        <LinearGradient
          colors={['rgba(34, 139, 34, 0.8)', 'rgba(50, 205, 50, 0.6)', 'rgba(152, 251, 152, 0.4)']}
          style={styles.leafGradient}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
        />
      </Animated.View>
      
      <Animated.View style={[styles.leaf, styles.leaf2, leaf2Style]}>
        <LinearGradient
          colors={['rgba(50, 205, 50, 0.7)', 'rgba(144, 238, 144, 0.5)', 'rgba(152, 251, 152, 0.3)']}
          style={styles.leafGradient}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
        />
      </Animated.View>
      
      <Animated.View style={[styles.leaf, styles.leaf3, leaf3Style]}>
        <LinearGradient
          colors={['rgba(144, 238, 144, 0.6)', 'rgba(152, 251, 152, 0.4)', 'rgba(240, 255, 240, 0.2)']}
          style={styles.leafGradient}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
        />
      </Animated.View>

      {/* Photosynthesis Glow */}
      <Animated.View style={[styles.photosynthesisGlow, photosynthesisStyle]}>
        <LinearGradient
          colors={['rgba(255, 255, 0, 0.6)', 'rgba(152, 251, 152, 0.4)', 'rgba(34, 139, 34, 0.3)']}
          style={styles.photosynthesisGradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </Animated.View>

      {/* Life Core */}
      <View style={styles.lifeCore}>
        <LinearGradient
          colors={['#98FB98', '#32CD32', '#228B22']}
          style={styles.coreGradient}
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
  earthBackground: {
    position: 'absolute',
    width: '140%',
    height: '140%',
    borderRadius: 1000,
  },
  earthGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 1000,
  },
  orbBody: {
    position: 'absolute',
    width: '80%',
    height: '80%',
    borderRadius: 1000,
  },
  bodyGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 1000,
  },
  vine: {
    position: 'absolute',
    width: '90%',
    height: '10%',
    top: '45%',
    left: '5%',
    borderRadius: 20,
  },
  vineGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  leaf: {
    position: 'absolute',
    borderRadius: 1000,
    // Transform origin at bottom for growth effect
    transformOrigin: 'bottom',
  },
  leaf1: {
    width: '35%',
    height: '40%',
    top: '10%',
    left: '10%',
    borderRadius: 100,
    transform: [{ rotate: '-20deg' }],
  },
  leaf2: {
    width: '30%',
    height: '35%',
    top: '15%',
    right: '15%',
    borderRadius: 100,
    transform: [{ rotate: '25deg' }],
  },
  leaf3: {
    width: '25%',
    height: '30%',
    bottom: '20%',
    left: '15%',
    borderRadius: 100,
    transform: [{ rotate: '45deg' }],
  },
  leafGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  photosynthesisGlow: {
    position: 'absolute',
    width: '60%',
    height: '60%',
    borderRadius: 1000,
  },
  photosynthesisGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 1000,
  },
  lifeCore: {
    position: 'absolute',
    width: '25%',
    height: '25%',
    borderRadius: 1000,
  },
  coreGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 1000,
  },
});

export default NatureOrb;