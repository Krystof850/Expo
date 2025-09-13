import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import * as Haptics from 'expo-haptics';

interface HapticButtonProps extends TouchableOpacityProps {
  onPress?: () => void;
  hapticType?: 'light' | 'medium' | 'heavy';
}

export default function HapticButton({ 
  onPress, 
  hapticType = 'light',
  ...props 
}: HapticButtonProps) {
  const handlePress = () => {
    // Trigger haptic feedback
    switch (hapticType) {
      case 'light':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'heavy':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
    }
    
    // Call the original onPress
    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity {...props} onPress={handlePress} />
  );
}