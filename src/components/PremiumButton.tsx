import React, { useCallback } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { isSuperwallSupported } from '../utils/environment';

interface PremiumButtonProps {
  style?: any;
  textStyle?: any;
  placement?: string;
}

// OFICIÁLNÍ SUPERWALL PATTERN - Komponenta s unconditional hooks
const SuperwallEnabledButton: React.FC<PremiumButtonProps> = ({ 
  style, 
  textStyle, 
  placement = 'zario-template-3a85-2025-09-10' 
}) => {
  // OFICIÁLNÍ ZPŮSOB: Unconditional hooks podle React rules
  const { usePlacement } = require('expo-superwall');
  
  // OFICIÁLNÍ PATTERN: usePlacement hook podle dokumentace
  const { registerPlacement, state } = usePlacement({
    onError: (error: string) => {
      console.error('[PremiumButton] Paywall error:', error);
    },
    onPresent: (paywallInfo: any) => {
      console.log('[PremiumButton] Paywall presented:', paywallInfo?.name ?? 'unknown');
    },
    onDismiss: (paywallInfo: any, result: any) => {
      console.log('[PremiumButton] Paywall dismissed:', paywallInfo?.name, result?.type);
    },
    onSkip: (reason: any) => {
      console.log('[PremiumButton] Paywall skipped:', reason?.type ?? 'unknown');
    },
  });

  const handlePress = useCallback(async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // OFICIÁLNÍ ZPŮSOB: Safe placement registration podle dokumentace
      if (placement && typeof placement === 'string') {
        await registerPlacement({
          placement,
          params: {
            // Safe params object
            source: 'premium_button',
            timestamp: Date.now(),
          },
          feature: () => {
            console.log('[PremiumButton] Premium feature unlocked!');
          }
        });
      } else {
        console.warn('[PremiumButton] Invalid placement provided');
      }
    } catch (error) {
      console.error('[PremiumButton] Error during placement registration:', error);
      // Continue gracefully - don't crash the app
    }
  }, [registerPlacement, placement]);

  const isLoading = state.status === 'presented';

  return (
    <TouchableOpacity 
      style={[styles.paywallButton, style, isLoading && styles.buttonDisabled]} 
      onPress={handlePress}
      disabled={isLoading}
    >
      <Ionicons name="diamond-outline" size={20} color="#E67E22" style={styles.buttonIcon} />
      <Text style={[styles.paywallButtonText, textStyle]}>
        {isLoading ? 'Loading...' : 'View Premium'}
      </Text>
    </TouchableOpacity>
  );
};

// Komponenta pro Expo Go (bez Superwall)
const ExpoGoButton: React.FC<PremiumButtonProps> = ({ style, textStyle }) => {
  const handlePress = useCallback(async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      console.log('📱 Superwall not supported in Expo Go - use development build for full functionality');
    } catch (error) {
      console.error('[PremiumButton] Haptics error:', error);
    }
  }, []);

  return (
    <TouchableOpacity style={[styles.paywallButton, style]} onPress={handlePress}>
      <Ionicons name="diamond-outline" size={20} color="#E67E22" style={styles.buttonIcon} />
      <Text style={[styles.paywallButtonText, textStyle]}>View Premium</Text>
    </TouchableOpacity>
  );
};

// OFICIÁLNÍ PATTERN: Environment-aware component selection
const PremiumButton: React.FC<PremiumButtonProps> = (props) => {
  const superwallSupported = isSuperwallSupported();

  if (superwallSupported) {
    try {
      return <SuperwallEnabledButton {...props} />;
    } catch (error) {
      console.error('[PremiumButton] Superwall component failed to load:', error);
      // Graceful fallback to Expo Go button
      return <ExpoGoButton {...props} />;
    }
  }

  return <ExpoGoButton {...props} />;
};

const styles = StyleSheet.create({
  paywallButton: {
    backgroundColor: 'rgba(230, 126, 34, 0.1)',
    borderWidth: 2,
    borderColor: '#E67E22',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 28,
    shadowColor: 'rgba(230, 126, 34, 0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonIcon: {
    marginRight: 8,
  },
  paywallButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E67E22',
  },
});

export default PremiumButton;