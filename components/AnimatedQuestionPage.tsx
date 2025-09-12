import React, { useEffect, useImperativeHandle, forwardRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { SPACING } from '../constants/theme';

interface AnimatedQuestionPageProps {
  children: React.ReactNode;
  onAnimationComplete?: () => void;
}

export interface AnimatedQuestionPageRef {
  runExitAnimation: (callback: () => void) => void;
}

export const AnimatedQuestionPage = forwardRef<AnimatedQuestionPageRef, AnimatedQuestionPageProps>(
  ({ children, onAnimationComplete }, ref) => {
    // Animation values
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.8);
    const translateY = useSharedValue(20);

    useEffect(() => {
      // Start entrance animations
      opacity.value = withTiming(1, {
        duration: 400,
      });
      
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 150,
        mass: 1,
      });
      
      translateY.value = withTiming(0, {
        duration: 350,
      }, (finished) => {
        if (finished && onAnimationComplete) {
          runOnJS(onAnimationComplete)();
        }
      });
    }, []);

    // Reset animation values when screen comes back into focus
    useFocusEffect(
      React.useCallback(() => {
        // Reset animation values to initial state to prevent blank screen on back navigation
        opacity.value = 1;
        scale.value = 1;
        translateY.value = 0;
      }, [opacity, scale, translateY])
    );

    // Expose exit animation method
    useImperativeHandle(ref, () => ({
      runExitAnimation: (callback: () => void) => {
        opacity.value = withTiming(0, { duration: 300 });
        scale.value = withTiming(0.9, { duration: 300 });
        translateY.value = withTiming(-10, { 
          duration: 300 
        }, (finished) => {
          if (finished) {
            runOnJS(callback)();
          }
        });
      },
    }));

    // Animated styles for the entire page
    const pageAnimatedStyle = useAnimatedStyle(() => {
      return {
        opacity: opacity.value,
        transform: [
          {
            scale: scale.value,
          },
          {
            translateY: translateY.value,
          },
        ],
      };
    });

    return (
      <View style={styles.container}>
        <Animated.View style={[styles.content, pageAnimatedStyle]}>
          {children}
        </Animated.View>
      </View>
    );
  }
);

// Content wrapper for animated scaling of question content while keeping header static
interface AnimatedContentProps {
  children: React.ReactNode;
  delay?: number;
}

export function AnimatedContent({ children, delay = 200 }: AnimatedContentProps) {
  const contentOpacity = useSharedValue(0);
  const contentScale = useSharedValue(0.9);

  useEffect(() => {
    // Use withDelay instead of setTimeout for better performance
    contentOpacity.value = withDelay(delay, withTiming(1, {
      duration: 300,
    }));
    
    contentScale.value = withDelay(delay, withSpring(1, {
      damping: 12,
      stiffness: 100,
      mass: 0.8,
    }));
  }, [delay]);

  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: contentOpacity.value,
      transform: [
        {
          scale: contentScale.value,
        },
      ],
    };
  });

  return (
    <Animated.View style={[styles.animatedContent, contentAnimatedStyle]}>
      {children}
    </Animated.View>
  );
}

// Animated buttons for smooth interactions
interface AnimatedButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  isSelected?: boolean;
  delay?: number;
  style?: any;
}

export function AnimatedButton({ 
  children, 
  onPress, 
  isSelected = false, 
  delay = 0, 
  style 
}: AnimatedButtonProps) {
  const buttonOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(0.8);
  const pressScale = useSharedValue(1);

  useEffect(() => {
    // Use withDelay instead of setTimeout for better performance
    buttonOpacity.value = withDelay(delay, withTiming(1, {
      duration: 250,
    }));
    
    buttonScale.value = withDelay(delay, withSpring(1, {
      damping: 10,
      stiffness: 120,
      mass: 0.7,
    }));
  }, [delay]);

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: buttonOpacity.value,
      transform: [
        {
          scale: buttonScale.value * pressScale.value,
        },
      ],
    };
  });

  const handlePressIn = () => {
    pressScale.value = withSpring(0.95, {
      damping: 10,
      stiffness: 400,
    });
  };

  const handlePressOut = () => {
    pressScale.value = withSpring(1, {
      damping: 10,
      stiffness: 400,
    });
  };

  return (
    <Animated.View style={[buttonAnimatedStyle]}>
      <Animated.View
        style={style}
        onTouchStart={handlePressIn}
        onTouchEnd={handlePressOut}
        onTouchCancel={handlePressOut}
      >
        {children}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  animatedContent: {
    // Removed flex: 1 to prevent pushing content down
  },
});