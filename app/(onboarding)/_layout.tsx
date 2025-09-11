import React, { useEffect, useRef } from 'react';
import { Stack } from 'expo-router';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { COLORS, GRADIENTS } from '../../constants/theme';

const { width, height } = Dimensions.get('window');

function SharedBackground() {
  // Floating animace
  const float1 = useRef(new Animated.Value(0)).current;
  const float2 = useRef(new Animated.Value(0)).current;
  const float3 = useRef(new Animated.Value(0)).current;
  const float4 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animace pro floating elementy - jemné pohyby
    const createFloatingAnimation = (animatedValue: Animated.Value, duration: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
          }),
        ]),
      );
    };

    // Spuštění animací podle HTML template (9-13s durations)
    setTimeout(() => createFloatingAnimation(float1, 9000).start(), 0);
    setTimeout(() => createFloatingAnimation(float2, 11000).start(), 1000);
    setTimeout(() => createFloatingAnimation(float3, 13000).start(), 2000);
    setTimeout(() => createFloatingAnimation(float4, 10000).start(), 4000);
  }, []);

  return (
    <View style={styles.backgroundContainer}>
      <StatusBar style="light" />
      <LinearGradient
        colors={GRADIENTS.background}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        locations={[0, 0.5, 1]}
        style={styles.gradient}
      >
        {/* Floating background elementy */}
        <Animated.View
          style={[
            styles.floatingElement1,
            {
              transform: [
                {
                  translateY: float1.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -30],
                  }),
                },
                {
                  translateX: float1.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 15],
                  }),
                },
                {
                  scale: float1.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.05],
                  }),
                },
              ],
            },
          ]}
        />
        
        <Animated.View
          style={[
            styles.floatingElement2,
            {
              transform: [
                {
                  translateY: float2.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -40],
                  }),
                },
                {
                  translateX: float2.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -20],
                  }),
                },
                {
                  scale: float2.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.08],
                  }),
                },
              ],
            },
          ]}
        />

        <Animated.View
          style={[
            styles.floatingElement3,
            {
              transform: [
                {
                  translateY: float3.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -20],
                  }),
                },
              ],
            },
          ]}
        />

        <Animated.View
          style={[
            styles.floatingElement4,
            {
              transform: [
                {
                  translateY: float4.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -25],
                  }),
                },
              ],
            },
          ]}
        />
      </LinearGradient>
    </View>
  );
}

export default function OnboardingLayout() {
  return (
    <View style={styles.container}>
      {/* Shared static background */}
      <SharedBackground />
      
      {/* Content with transparent background and fade transitions */}
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: 'transparent',
          },
          animation: 'slide_from_right',
          gestureEnabled: false,
          detachPreviousScreen: true,
        }}
      >
        <Stack.Screen name="question1" />
        <Stack.Screen name="question2" />
        <Stack.Screen name="question3" />
        <Stack.Screen name="question4" />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  gradient: {
    flex: 1,
    position: 'relative',
  },
  // Floating background elementy - jemné modré tvary pro gradient efekt
  floatingElement1: {
    position: 'absolute',
    left: -width * 0.3,
    top: -height * 0.2,
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // Jemný bílý efekt
    opacity: 0.4,
  },
  floatingElement2: {
    position: 'absolute',
    right: -width * 0.3,
    bottom: -height * 0.2,
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    opacity: 1,
  },
  floatingElement3: {
    position: 'absolute',
    bottom: height * 0.4,
    right: width * 0.1,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    opacity: 1,
  },
  floatingElement4: {
    position: 'absolute',
    left: width * 0.1,
    top: height * 0.4,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    opacity: 1,
  },
});