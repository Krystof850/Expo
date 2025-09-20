import React, { useCallback, useMemo } from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  interpolate
} from 'react-native-reanimated';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants/theme';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant: 'select' | 'next';
  selected?: boolean; // For select variant
  style?: ViewStyle;
}

const Button: React.FC<ButtonProps> = React.memo(({ 
  title, 
  onPress, 
  disabled = false, 
  variant, 
  selected = false,
  style 
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  // Memoize event handlers to prevent unnecessary re-renders
  const handlePressIn = useCallback(() => {
    scale.value = withSpring(variant === 'next' ? 1.05 : 0.95, {
      damping: 12,
      stiffness: 100,
    });
    
    if (variant === 'select') {
      opacity.value = withTiming(0.8, { duration: 150 });
    }
  }, [variant, scale, opacity]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, {
      damping: 12,
      stiffness: 100,
    });
    
    if (variant === 'select') {
      opacity.value = withTiming(1, { duration: 150 });
    }
  }, [variant, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const getButtonStyle = (): ViewStyle => {
    const baseStyle = {
      paddingVertical: SPACING.button,
      paddingHorizontal: SPACING.button * 2, // px-8 equivalent
      borderRadius: RADIUS.button,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    };

    if (variant === 'select') {
      return {
        ...baseStyle,
        backgroundColor: selected 
          ? COLORS.selectButton.hover 
          : COLORS.selectButton.background,
        borderWidth: 2,
        borderColor: COLORS.selectButton.border,
        width: '100%', // Make select buttons full width
      };
    }

    // Next button variant
    return {
      ...baseStyle,
      backgroundColor: COLORS.nextButton.background,
      ...SHADOWS.button, // Large white shadow
    };
  };

  const getTextStyle = (): TextStyle => {
    if (variant === 'select') {
      return {
        ...TYPOGRAPHY.buttonSelect,
      };
    }

    return {
      ...TYPOGRAPHY.buttonNext,
    };
  };

  return (
    <AnimatedTouchable
      style={[
        getButtonStyle(),
        disabled && styles.disabled,
        animatedStyle,
        style,
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={1} // We handle opacity with animations
    >
      <Text style={getTextStyle()}>{title}</Text>
    </AnimatedTouchable>
  );
});

export { Button };

// Pre-configured button variants for easier usage
export const SelectButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="select" />
);

export const NextButton: React.FC<Omit<ButtonProps, 'variant' | 'selected'>> = (props) => (
  <Button {...props} variant="next" />
);

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
});