import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { isSuperwallSupported } from '../utils/environment';

interface PremiumButtonProps {
  style?: any;
  textStyle?: any;
}

// Komponenta s Superwall hooks (použije se jen v development buildu)
const SuperwallEnabledButton: React.FC<PremiumButtonProps> = ({ style, textStyle }) => {
  const { usePlacement } = require('expo-superwall');
  
  const { registerPlacement } = usePlacement({
    onError: (error: any) => console.log('Paywall error:', error),
    onPresent: (info: any) => console.log('Paywall presented:', info),
    onDismiss: (info: any, result: any) => console.log('Paywall dismissed:', info, result),
  });

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    try {
      await registerPlacement({
        placement: 'campaign_trigger',
        feature() {
          console.log('Premium feature unlocked!');
        }
      });
    } catch (error) {
      console.log('Paywall presentation error:', error);
    }
  };

  return (
    <TouchableOpacity style={[styles.paywallButton, style]} onPress={handlePress}>
      <Ionicons name="diamond-outline" size={20} color="#E67E22" style={styles.buttonIcon} />
      <Text style={[styles.paywallButtonText, textStyle]}>View Premium</Text>
    </TouchableOpacity>
  );
};

// Komponenta pro Expo Go (bez Superwall)
const ExpoGoButton: React.FC<PremiumButtonProps> = ({ style, textStyle }) => {
  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    console.log('📱 Superwall not supported in Expo Go - use development build for full functionality');
  };

  return (
    <TouchableOpacity style={[styles.paywallButton, style]} onPress={handlePress}>
      <Ionicons name="diamond-outline" size={20} color="#E67E22" style={styles.buttonIcon} />
      <Text style={[styles.paywallButtonText, textStyle]}>View Premium</Text>
    </TouchableOpacity>
  );
};

// Hlavní komponenta
const PremiumButton: React.FC<PremiumButtonProps> = (props) => {
  const superwallSupported = isSuperwallSupported();

  if (superwallSupported) {
    try {
      return <SuperwallEnabledButton {...props} />;
    } catch (error) {
      console.warn('⚠️ Superwall component failed to load:', error);
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