import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GRADIENTS } from '../constants/theme';

interface AppBackgroundProps {
  children?: React.ReactNode;
}

export default function AppBackground({ children }: AppBackgroundProps) {

  return (
    <View style={styles.container}>
      {/* Original gradient background */}
      <LinearGradient
        colors={GRADIENTS.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />
      
      {/* Content layer */}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});