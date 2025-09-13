import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  withSpring,
  withSequence,
  withRepeat 
} from 'react-native-reanimated';
import AppBackground from '../../components/AppBackground';
import { NextButton } from '../../components/Button';
import { TitleText, DescriptionText } from '../../components/Text';
import { COLORS, SPACING } from '@/constants/theme';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

export default function InvestScreen() {
  const insets = useSafeAreaInsets();
  
  // Animation values
  const titleOpacity = useSharedValue(0);
  const titleScale = useSharedValue(0.8);
  const iconScale = useSharedValue(0);
  const iconRotation = useSharedValue(-180);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(30);
  const buttonOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(0.9);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    // Animation timeouts for cleanup
    const timeouts: NodeJS.Timeout[] = [];
    
    // Icon animation first
    iconScale.value = withSpring(1, { damping: 15, stiffness: 200 });
    iconRotation.value = withSpring(0, { damping: 20, stiffness: 150 });
    
    // Title animation with delay
    const titleTimeout = setTimeout(() => {
      titleOpacity.value = withTiming(1, { duration: 800 });
      titleScale.value = withSpring(1, { damping: 15, stiffness: 100 });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }, 300);
    timeouts.push(titleTimeout);
    
    // Content animation
    const contentTimeout = setTimeout(() => {
      contentOpacity.value = withTiming(1, { duration: 600 });
      contentTranslateY.value = withSpring(0, { damping: 20, stiffness: 100 });
    }, 800);
    timeouts.push(contentTimeout);
    
    // Button animation with continuous glow effect
    const buttonTimeout = setTimeout(() => {
      buttonOpacity.value = withTiming(1, { duration: 500 });
      buttonScale.value = withSpring(1, { damping: 15, stiffness: 120 });
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 2000 }),
          withTiming(0.4, { duration: 2000 })
        ), 
        -1, 
        true
      );
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, 1200);
    timeouts.push(buttonTimeout);
    
    // Cleanup function
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    // For now, navigate directly to auth
    // TODO: Integrate Superwall paywall presentation here
    // When paywall is properly integrated, this should trigger the paywall
    // and only navigate to auth after successful subscription or free trial
    router.push('/(auth)/sign-in');
  };

  // Animated styles
  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ scale: titleScale.value }],
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: iconScale.value },
      { rotate: `${iconRotation.value}deg` }
    ],
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ scale: buttonScale.value }],
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <AppBackground>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        
        {/* Animated glow effect behind content */}
        <Animated.View style={[styles.glowContainer, glowAnimatedStyle]}>
          <LinearGradient
            colors={['rgba(34, 211, 238, 0.3)', 'transparent', 'rgba(59, 130, 246, 0.2)']}
            style={styles.glowGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>

        {/* Main content */}
        <View style={[styles.content, { paddingTop: insets.top + 60 }]}>
          {/* Premium icon */}
          <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
            <View style={styles.iconBackground}>
              <LinearGradient
                colors={['#FFD700', '#FFA500', '#FF8C00']}
                style={styles.iconGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="diamond" size={48} color="#FFFFFF" />
              </LinearGradient>
            </View>
          </Animated.View>

          {/* Premium title */}
          <Animated.View style={[styles.titleContainer, titleAnimatedStyle]}>
            <TitleText style={styles.titleText}>Ready to Transform?</TitleText>
            <DescriptionText style={styles.subtitleText}>Your personalized plan awaits</DescriptionText>
          </Animated.View>

          {/* Value proposition content */}
          <Animated.View style={[styles.valueContainer, contentAnimatedStyle]}>
            
            {/* Key benefits */}
            <View style={styles.benefitsContainer}>
              <View style={styles.benefitItem}>
                <View style={styles.checkIcon}>
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                </View>
                <DescriptionText style={styles.benefitText}>Science-backed procrastination system</DescriptionText>
              </View>
              
              <View style={styles.benefitItem}>
                <View style={styles.checkIcon}>
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                </View>
                <DescriptionText style={styles.benefitText}>Personalized action plan built for you</DescriptionText>
              </View>
              
              <View style={styles.benefitItem}>
                <View style={styles.checkIcon}>
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                </View>
                <DescriptionText style={styles.benefitText}>Break free from procrastination forever</DescriptionText>
              </View>
            </View>

            {/* Premium message */}
            <View style={styles.premiumMessage}>
              <DescriptionText style={styles.premiumText}>
                You've completed the assessment. Now unlock your full potential with PROCRAPP Premium.
              </DescriptionText>
            </View>
          </Animated.View>
        </View>

        {/* CTA Button with glow */}
        <Animated.View style={[styles.buttonContainer, buttonAnimatedStyle, { paddingBottom: insets.bottom + SPACING.page }]}>
          <Animated.View style={[styles.buttonGlow, glowAnimatedStyle]}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.3)', 'transparent']}
              style={styles.buttonGlowGradient}
            />
          </Animated.View>
          <NextButton
            title="Unlock PROCRAPP Premium"
            onPress={handleContinue}
            style={styles.premiumButton}
            textStyle={styles.premiumButtonText}
          />
        </Animated.View>
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  glowContainer: {
    position: 'absolute',
    top: height * 0.2,
    left: -width * 0.2,
    right: -width * 0.2,
    height: height * 0.6,
    zIndex: 0,
  },
  glowGradient: {
    flex: 1,
    borderRadius: width,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.page,
    zIndex: 1,
  },
  iconContainer: {
    marginBottom: 32,
  },
  iconBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    elevation: 20,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  iconGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  titleText: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.mainText,
    textAlign: 'center',
    lineHeight: 38,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 18,
    fontWeight: '500',
    color: 'rgba(186, 230, 253, 0.8)',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  valueContainer: {
    width: '100%',
    alignItems: 'center',
  },
  benefitsContainer: {
    width: '100%',
    marginBottom: 32,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  checkIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(34, 197, 94, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    elevation: 4,
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  benefitText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.mainText,
    flex: 1,
    lineHeight: 22,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  premiumMessage: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  premiumText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(186, 230, 253, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: SPACING.page,
    position: 'relative',
  },
  buttonGlow: {
    position: 'absolute',
    top: -20,
    left: SPACING.page - 20,
    right: SPACING.page - 20,
    height: 80,
    zIndex: 0,
  },
  buttonGlowGradient: {
    flex: 1,
    borderRadius: 60,
  },
  premiumButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.5)',
    elevation: 12,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    zIndex: 1,
  },
  premiumButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B1120',
  },
});