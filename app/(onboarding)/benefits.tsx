import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

import AppBackground from '../../components/AppBackground';
import { NextButton } from '../../components/Button';
import { COLORS, SPACING } from '@/constants/theme';

const { width } = Dimensions.get('window');

// Preload the optimized chart image for instant loading
const chartImageSource = require('@/attached_assets/ChatGPT Image Sep 13, 2025, 03_26_59 PM_1757748428786.png');

export default function BenefitsScreen() {
  // No preloading needed for local assets - they load instantly

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(onboarding)/goals');
  };

  return (
    <AppBackground>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        
        {/* Title - moved to top */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>PROCRAPP benefits</Text>
        </View>
        
        {/* Main Content */}
        <View style={styles.contentContainer}>
          {/* Image Section */}
          <View style={styles.imageSection}>
            <Image
              source={chartImageSource}
              style={styles.chartImage}
              contentFit="contain"
              transition={0}
              cachePolicy="memory-disk"
              priority="high"
            />
          </View>

          {/* Description Section */}
          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionText}>
              PROCRAPP helps you overcome procrastination <Text style={styles.percentageHighlight}>76% faster</Text> than willpower alone.
            </Text>
          </View>
        </View>

        {/* CTA Button */}
        <View style={styles.buttonContainer}>
          <NextButton
            title="Continue"
            onPress={handleContinue}
          />
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
    marginBottom: 24,
    paddingHorizontal: 32,
    marginTop: 20, // Space above title after image
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
    paddingTop: 40, // Add top padding to center content better
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 20, // Reduced since title moved below
    width: '100%',
  },
  chartImage: {
    width: width - 64, // Larger image - less padding
    height: (width - 64) * 0.75, // Maintain aspect ratio
    maxWidth: 350, // Increased max width
    maxHeight: 262, // Increased max height proportionally
    borderRadius: 12, // Rounded corners directly on image
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
  // NextButton handles all styling
});