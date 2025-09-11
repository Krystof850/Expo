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
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
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
  // Floating background elementy podle HTML template
  floatingElement1: {
    position: 'absolute',
    left: -width * 0.33,
    top: -height * 0.25,
    width: 650,
    height: 650,
    borderRadius: 325,
    backgroundColor: `${COLORS.primaryAction}40`, // sky-400/40
    opacity: 0.6,
  },
  floatingElement2: {
    position: 'absolute',
    right: -width * 0.25,
    bottom: -height * 0.45,
    width: 750,
    height: 750,
    borderRadius: 375,
    backgroundColor: `${COLORS.secondaryBackground}40`, // blue-700/40
    opacity: 0.5,
  },
  floatingElement3: {
    position: 'absolute',
    bottom: height * 0.33,
    right: width * 0.25,
    width: 288, // 72 * 4 = 288px (w-72)
    height: 288,
    borderRadius: 144,
    backgroundColor: `${COLORS.primaryAction}33`, // primaryAction/20
    opacity: 1,
  },
  floatingElement4: {
    position: 'absolute',
    left: width * 0.25,
    top: height * 0.33,
    width: 256, // 64 * 4 = 256px (w-64)
    height: 256,
    borderRadius: 128,
    backgroundColor: `${COLORS.accentGreen}33`, // accentGreen/20
    opacity: 1,
  },
});