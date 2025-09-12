import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { COLORS, GRADIENTS, ANIMATIONS } from '../constants/theme';

interface AppBackgroundProps {
  children?: React.ReactNode;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function AppBackground({ children }: AppBackgroundProps) {
  // Shared value for gradient animation
  const gradientProgress = useSharedValue(0);
  
  // Shared values for blur ball animations
  const ball1Y = useSharedValue(0);
  const ball1X = useSharedValue(0);
  const ball1Rotate = useSharedValue(0);
  const ball1Scale = useSharedValue(1);

  const ball2Y = useSharedValue(0);
  const ball2X = useSharedValue(0);
  const ball2Rotate = useSharedValue(0);
  const ball2Scale = useSharedValue(1);

  const ball3Y = useSharedValue(0);
  const ball3Rotate = useSharedValue(0);

  const ball4Y = useSharedValue(0);
  const ball4Rotate = useSharedValue(0);

  const ball5Y = useSharedValue(0);
  const ball5Rotate = useSharedValue(0);

  const ball6Y = useSharedValue(0);
  const ball6Rotate = useSharedValue(0);

  useEffect(() => {
    // Start gradient animation
    gradientProgress.value = withRepeat(
      withTiming(1, { duration: ANIMATIONS.gradient, easing: Easing.linear }),
      -1,
      false
    );
    
    // Ball 1 animation: translateY(0 to -50px), translateX(0 to 30px), rotate(0 to 35deg), scale(1 to 1.2)
    ball1Y.value = withRepeat(
      withTiming(-50, { duration: ANIMATIONS.blurBall1 / 2, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    ball1X.value = withRepeat(
      withTiming(30, { duration: ANIMATIONS.blurBall1 / 2, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    ball1Rotate.value = withRepeat(
      withTiming(35, { duration: ANIMATIONS.blurBall1 / 2, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    ball1Scale.value = withRepeat(
      withTiming(1.2, { duration: ANIMATIONS.blurBall1 / 2, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // Ball 2 animation: translateY(0 to -70px), translateX(0 to -40px), rotate(0 to -40deg), scale(1 to 1.3)
    ball2Y.value = withRepeat(
      withTiming(-70, { duration: ANIMATIONS.blurBall2 / 2, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    ball2X.value = withRepeat(
      withTiming(-40, { duration: ANIMATIONS.blurBall2 / 2, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    ball2Rotate.value = withRepeat(
      withTiming(-40, { duration: ANIMATIONS.blurBall2 / 2, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    ball2Scale.value = withRepeat(
      withTiming(1.3, { duration: ANIMATIONS.blurBall2 / 2, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // Ball 3 animation: translateY(0 to -40px), rotate(0 to 20deg) with delay
    ball3Y.value = withDelay(1000, withRepeat(
      withTiming(-40, { duration: ANIMATIONS.blurBall3 / 2, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    ));
    ball3Rotate.value = withDelay(1000, withRepeat(
      withTiming(20, { duration: ANIMATIONS.blurBall3 / 2, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    ));

    // Ball 4 animation: translateY(0 to -35px), rotate(0 to -15deg) with delay
    ball4Y.value = withDelay(1500, withRepeat(
      withTiming(-35, { duration: ANIMATIONS.blurBall4 / 2, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    ));
    ball4Rotate.value = withDelay(1500, withRepeat(
      withTiming(-15, { duration: ANIMATIONS.blurBall4 / 2, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    ));

    // Ball 5 animation: similar to ball 3 with staggered delay
    ball5Y.value = withDelay(2000, withRepeat(
      withTiming(-40, { duration: ANIMATIONS.blurBall3 / 2, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    ));
    ball5Rotate.value = withDelay(2000, withRepeat(
      withTiming(20, { duration: ANIMATIONS.blurBall3 / 2, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    ));

    // Ball 6 animation: similar to ball 2 with staggered delay
    ball6Y.value = withDelay(3500, withRepeat(
      withTiming(-35, { duration: ANIMATIONS.blurBall2 / 2, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    ));
    ball6Rotate.value = withDelay(3500, withRepeat(
      withTiming(-15, { duration: ANIMATIONS.blurBall2 / 2, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    ));
  }, []);

  // Animated styles for each blur ball
  const ball1Style = useAnimatedStyle(() => ({
    transform: [
      { translateY: ball1Y.value },
      { translateX: ball1X.value },
      { rotate: `${ball1Rotate.value}deg` },
      { scale: ball1Scale.value },
    ],
  }));

  const ball2Style = useAnimatedStyle(() => ({
    transform: [
      { translateY: ball2Y.value },
      { translateX: ball2X.value },
      { rotate: `${ball2Rotate.value}deg` },
      { scale: ball2Scale.value },
    ],
  }));

  const ball3Style = useAnimatedStyle(() => ({
    transform: [
      { translateY: ball3Y.value },
      { rotate: `${ball3Rotate.value}deg` },
    ],
  }));

  const ball4Style = useAnimatedStyle(() => ({
    transform: [
      { translateY: ball4Y.value },
      { rotate: `${ball4Rotate.value}deg` },
    ],
  }));

  const ball5Style = useAnimatedStyle(() => ({
    transform: [
      { translateY: ball5Y.value },
      { rotate: `${ball5Rotate.value}deg` },
    ],
  }));

  const ball6Style = useAnimatedStyle(() => ({
    transform: [
      { translateY: ball6Y.value },
      { rotate: `${ball6Rotate.value}deg` },
    ],
  }));

  // Animated gradient opacities for crossfade effect
  const gradient1Style = useAnimatedStyle(() => {
    const opacity = interpolate(
      gradientProgress.value,
      [0, 0.33, 0.66, 1],
      [1, 0, 0, 1] // Fade in at start, fade out, then fade back in
    );
    return {
      opacity,
    };
  });

  const gradient2Style = useAnimatedStyle(() => {
    const opacity = interpolate(
      gradientProgress.value,
      [0, 0.33, 0.66, 1],
      [0, 1, 0, 0] // Fade in at 33%, fade out at 66%
    );
    return {
      opacity,
    };
  });

  const gradient3Style = useAnimatedStyle(() => {
    const opacity = interpolate(
      gradientProgress.value,
      [0, 0.33, 0.66, 1],
      [0, 0, 1, 0] // Fade in at 66%, fade out at end
    );
    return {
      opacity,
    };
  });

  return (
    <View style={styles.container}>
      {/* Background layer with pointer events disabled */}
      <View style={styles.backgroundLayer} pointerEvents="none">
        {/* Animated gradient background - multiple gradients with crossfade */}
        
        {/* Gradient 1: Original combination */}
        <Animated.View style={[styles.gradient, gradient1Style]}>
          <LinearGradient
            colors={[COLORS.gradientStart, COLORS.gradientMiddle, COLORS.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          />
        </Animated.View>
        
        {/* Gradient 2: Shifted combination */}
        <Animated.View style={[styles.gradient, gradient2Style]}>
          <LinearGradient
            colors={[COLORS.gradientMiddle, COLORS.gradientEnd, COLORS.gradientStart]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          />
        </Animated.View>
        
        {/* Gradient 3: Reverse shifted combination */}
        <Animated.View style={[styles.gradient, gradient3Style]}>
          <LinearGradient
            colors={[COLORS.gradientEnd, COLORS.gradientStart, COLORS.gradientMiddle]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          />
        </Animated.View>
        
        {/* Floating blur balls */}
        <View style={styles.blurContainer}>
        {/* Ball 1: Large blur ball - left top */}
        <Animated.View
          style={[
            styles.blurBall,
            styles.blurBall1,
            { backgroundColor: COLORS.blurBall1 },
            ball1Style,
          ]}
        />
        
        {/* Ball 2: Large blur ball - right bottom */}
        <Animated.View
          style={[
            styles.blurBall,
            styles.blurBall2,
            { backgroundColor: COLORS.blurBall2 },
            ball2Style,
          ]}
        />
        
        {/* Ball 3: Medium blur ball - bottom right */}
        <Animated.View
          style={[
            styles.blurBall,
            styles.blurBall3,
            { backgroundColor: COLORS.blurBall3 },
            ball3Style,
          ]}
        />
        
        {/* Ball 4: Medium blur ball - left top */}
        <Animated.View
          style={[
            styles.blurBall,
            styles.blurBall4,
            { backgroundColor: COLORS.blurBall4 },
            ball4Style,
          ]}
        />
        
        {/* Ball 5: Large blur ball - left top with delay */}
        <Animated.View
          style={[
            styles.blurBall,
            styles.blurBall5,
            { backgroundColor: COLORS.blurBall1 },
            ball5Style,
          ]}
        />
        
        {/* Ball 6: Large blur ball - right bottom with delay */}
        <Animated.View
          style={[
            styles.blurBall,
            styles.blurBall6,
            { backgroundColor: COLORS.blurBall2 },
            ball6Style,
          ]}
        />
        </View>
      </View>
      
      {/* Content layer */}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  blurContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  blurBall: {
    position: 'absolute',
    borderRadius: 9999, // Perfect circle
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 50, // Blur effect
    elevation: 0, // Disable Android shadow for blur effect
    ...Platform.select({
      android: {
        shadowOpacity: 0.5, // Reduce shadow on Android for better performance
        elevation: 3, // Use elevation for better Android blur effect
      },
    }),
  },
  // Ball 1: -left-1/3 -top-1/4 h-[650px] w-[650px]
  blurBall1: {
    width: 650,
    height: 650,
    left: -screenWidth / 3,
    top: -screenHeight / 4,
    shadowRadius: 60,
  },
  // Ball 2: -right-1/4 bottom-[-45%] h-[750px] w-[750px]
  blurBall2: {
    width: 750,
    height: 750,
    right: -screenWidth / 4,
    bottom: -screenHeight * 0.45,
    shadowRadius: 70,
  },
  // Ball 3: bottom-1/3 right-1/4 h-72 w-72
  blurBall3: {
    width: 288, // h-72 = 288px
    height: 288,
    bottom: screenHeight / 3,
    right: screenWidth / 4,
    shadowRadius: 50,
  },
  // Ball 4: left-1/4 top-1/3 h-64 w-64
  blurBall4: {
    width: 256, // h-64 = 256px
    height: 256,
    left: screenWidth / 4,
    top: screenHeight / 3,
    shadowRadius: 45,
  },
  // Ball 5: left-[-25%] top-[10%] h-[550px] w-[550px]
  blurBall5: {
    width: 550,
    height: 550,
    left: -screenWidth * 0.25,
    top: screenHeight * 0.1,
    shadowRadius: 55,
  },
  // Ball 6: right-[-25%] bottom-[5%] h-[450px] w-[450px]
  blurBall6: {
    width: 450,
    height: 450,
    right: -screenWidth * 0.25,
    bottom: screenHeight * 0.05,
    shadowRadius: 45,
  },
});