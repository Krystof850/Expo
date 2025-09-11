import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SPACING } from '@/constants/theme';

export default function ReferralScreen() {
  const insets = useSafeAreaInsets();
  const [referralCode, setReferralCode] = useState<string>('');

  const handleContinue = async () => {
    try {
      // Save referral code (even if empty)
      if (referralCode.trim()) {
        await AsyncStorage.setItem('referral_code', referralCode.trim());
        console.log('🔗 Referral code saved:', referralCode.trim());
      } else {
        console.log('🔗 No referral code provided');
      }
      
      // Pokračovat na rating
      router.push('/(onboarding)/rating');
    } catch (error) {
      console.log('Error saving referral code:', error);
      // Continue to rating even on error
      router.push('/(onboarding)/rating');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.gradientStart} />
      
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientMiddle, COLORS.gradientEnd]}
        style={styles.gradient}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          {/* Header */}
          <View style={[styles.header, { paddingTop: insets.top }]}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={COLORS.mainText} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <View style={styles.textSection}>
              <Text style={styles.titleText}>
                Do you have a referral code?
              </Text>
              <Text style={styles.subtitleText}>
                You can skip this step.
              </Text>
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
            <TouchableOpacity 
              style={styles.continueButton}
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <Text style={styles.continueButtonText}>
                Next
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gradientStart,
  },
  gradient: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.page,
    paddingBottom: SPACING.small,
    zIndex: 10,
  },
  backButton: {
    padding: 8,
    alignSelf: 'flex-start',
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
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.mainText,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
    lineHeight: 42,
  },
  subtitleText: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.questionLabel,
    textAlign: 'center',
    lineHeight: 24,
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
    backgroundColor: 'white',
    borderRadius: 25,
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.gradientEnd,
    textAlign: 'center',
  },
});