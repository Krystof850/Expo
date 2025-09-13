import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { router } from 'expo-router';

import AppBackground from '../../components/AppBackground';
import { COLORS, SPACING } from '@/constants/theme';

const { width } = Dimensions.get('window');

export default function BenefitsScreen() {
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const imageScale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Fade in animation
    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(imageScale, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleContinue = () => {
    router.push('/(onboarding)/goals');
  };

  return (
    <AppBackground>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>PROCRAP benefits</Text>
        </View>

        {/* Main Content */}
        <Animated.View style={[styles.contentContainer, { opacity: contentOpacity }]}>
          {/* Image Section */}
          <View style={styles.imageSection}>
            <Animated.View style={[styles.imageWrapper, { transform: [{ scale: imageScale }] }]}>
              <Image
                source={require('@/attached_assets/ChatGPT Image Sep 13, 2025, 02_31_47 PM_1757745241749.png')}
                style={styles.chartImage}
                resizeMode="contain"
              />
            </Animated.View>
          </View>

          {/* Description Section */}
          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionText}>
              PROCRAPP helps you overcome procrastination <Text style={styles.percentageHighlight}>76% faster</Text> than willpower alone.
            </Text>
          </View>
        </Animated.View>

        {/* CTA Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.ctaButton} onPress={handleContinue}>
            <Text style={styles.ctaButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingBottom: 24,
    paddingHorizontal: 0, // Remove container padding since titleContainer handles it
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 28, // Same spacing as other question pages
    paddingHorizontal: 32, // Same as other pages
    paddingTop: 8, // Same as other pages
  },
  titleText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.mainText,
    textAlign: 'center',
    letterSpacing: -0.5,
    textShadow: '0 3px 6px rgba(0, 0, 0, 0.4)',
    lineHeight: 26, // Proportional to fontSize like other titles
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 32,
    width: '100%',
  },
  imageWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    // Shadow properties to match other elements
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    // Border to add subtle definition
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  chartImage: {
    width: width - 96, // Account for padding and wrapper padding
    height: (width - 96) * 0.75, // Maintain aspect ratio
    maxWidth: 300,
    maxHeight: 225,
  },
  descriptionSection: {
    alignItems: 'center',
    maxWidth: width - 64,
    marginBottom: 32,
  },
  descriptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(186, 230, 253, 0.9)', // sky-200/90 - slightly more opaque for better readability
    textAlign: 'center',
    lineHeight: 24,
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
  },
  percentageHighlight: {
    fontWeight: '700',
    color: COLORS.mainText,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 32,
  },
  ctaButton: {
    backgroundColor: '#FFFFFF', // var(--vibrant-cta)
    borderRadius: 50, // Same as other NextButtons
    paddingVertical: 16, // Same as SPACING.button
    paddingHorizontal: 32, // Same as other NextButtons (SPACING.button * 2)
    alignItems: 'center',
    boxShadow: '0 8px 24px rgba(255, 255, 255, 0.2)', // Same shadow as other NextButtons
    elevation: 8,
    width: '100%', // Make it full width like other NextButtons
  },
  ctaButtonText: {
    fontSize: 18, // Same as TYPOGRAPHY.buttonNext
    fontWeight: '700',
    color: '#0B1120', // var(--vibrant-cta-text)
    textAlign: 'center',
  },
});