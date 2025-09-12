import React from 'react';
import { Text as RNText, StyleSheet, TextStyle } from 'react-native';
import Animated, { 
  FadeIn, 
  SlideInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { TYPOGRAPHY, COLORS } from '../constants/theme';

const AnimatedText = Animated.createAnimatedComponent(RNText);

interface TextProps {
  children: React.ReactNode;
  variant: 'title' | 'description' | 'questionLabel';
  style?: TextStyle;
  animated?: boolean;
  delay?: number;
}

export const Text: React.FC<TextProps> = ({ 
  children, 
  variant, 
  style, 
  animated = true,
  delay = 0 
}) => {
  const getTextStyle = (): TextStyle => {
    switch (variant) {
      case 'title':
        return {
          ...TYPOGRAPHY.title,
        };
      case 'description':
        return {
          ...TYPOGRAPHY.description,
        };
      case 'questionLabel':
        return {
          ...TYPOGRAPHY.questionLabel,
        };
      default:
        return {};
    }
  };

  // Animation entrance based on variant
  const getAnimation = () => {
    switch (variant) {
      case 'title':
        return FadeIn.delay(delay).duration(500).springify();
      case 'description':
        return SlideInUp.delay(delay).duration(400).springify();
      case 'questionLabel':
        return FadeIn.delay(delay).duration(300).springify();
      default:
        return FadeIn.delay(delay).duration(300);
    }
  };

  if (animated) {
    return (
      <AnimatedText
        entering={getAnimation()}
        style={[getTextStyle(), style]}
      >
        {children}
      </AnimatedText>
    );
  }

  return (
    <RNText style={[getTextStyle(), style]}>
      {children}
    </RNText>
  );
};

// Pre-configured text variants for easier usage
export const TitleText: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text {...props} variant="title" />
);

export const DescriptionText: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text {...props} variant="description" />
);

export const QuestionLabelText: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text {...props} variant="questionLabel" />
);

const styles = StyleSheet.create({
  // Additional custom styles can be added here if needed
});