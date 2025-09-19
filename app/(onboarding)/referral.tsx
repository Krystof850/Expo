import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TitleText, DescriptionText } from '../../components/Text';
import { NextButton } from '../../components/Button';
import AppBackground from '../../components/AppBackground';
import { COLORS, SPACING } from '@/constants/theme';
import { Asset } from 'expo-asset';
import * as Haptics from 'expo-haptics';

export default function ReferralScreen() {
  const insets = useSafeAreaInsets();
  const [referralCode, setReferralCode] = useState<string>('');

  const handleContinue = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      // Save referral code (even if empty)
      if (referralCode.trim()) {
        await AsyncStorage.setItem('referral_code', referralCode.trim());
        console.log('🔗 Referral code saved');
      } else {
        console.log('🔗 No referral code provided');
      }
      
      // Preload all rating profile images for instant loading
      const profileImages = [
        require('@/attached_assets/22_1757748931161.jpg'),
        require('@/attached_assets/2_1757748931159.jpg'), 
        require('@/attached_assets/42_1757748931161.jpg'),
        require('@/attached_assets/79_1757748931161.jpg'),
      ];
      
      await Promise.all(profileImages.map(img => 
        Asset.fromModule(img).downloadAsync().catch(e => console.log('Profile preload failed:', e))
      ));
      console.log('✅ All profile images preloaded');
      
      // Pokračovat na rating
      router.push('/(onboarding)/rating');
    } catch (error) {
      console.log('Error saving referral code:', error);
      // Continue to rating even on error
      router.push('/(onboarding)/rating');
    }
  };

  return (
    <AppBackground>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.gradientStart} />
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >

          {/* Content */}
          <View style={[styles.content, { paddingTop: insets.top + 40 }]}>
            <View style={styles.textSection}>
              <TitleText animated={false} style={styles.titleText}>
                Do you have a referral code?
              </TitleText>
              <DescriptionText animated={false} style={styles.subtitleText}>
                You can skip this step.
              </DescriptionText>
            </View>

            <View style={styles.inputSection}>
              <TextInput
                style={styles.input}
                placeholder="Referral code"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                value={referralCode}
                onChangeText={setReferralCode}
                autoCapitalize="characters"
                autoCorrect={false}
                selectionColor={COLORS.mainText}
              />
            </View>
          </View>

          {/* Continue Button */}
          <View style={styles.buttonContainer}>
            <NextButton
              title="Next"
              onPress={handleContinue}
              style={styles.continueButton}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.page,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  textSection: {
    alignItems: 'center',
    marginBottom: 80,
  },
  titleText: {
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitleText: {
    textAlign: 'center',
  },
  inputSection: {
    width: '100%',
    maxWidth: 384,
    marginBottom: 40,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 25,
    paddingVertical: 18,
    paddingHorizontal: 24,
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.mainText,
    textAlign: 'center',
    letterSpacing: 1,
  },
  buttonContainer: {
    paddingHorizontal: SPACING.page,
    paddingBottom: 40,
    paddingTop: 20,
  },
  continueButton: {
    // NextButton will handle its own styling
  },
});