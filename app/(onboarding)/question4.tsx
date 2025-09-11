import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
  Platform,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { OnboardingHeader } from '../../components/OnboardingHeader';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants/theme';

export default function OnboardingQuestion4() {
  const insets = useSafeAreaInsets();
  const [selectedSource, setSelectedSource] = useState<string>('');

  const sourceOptions = [
    { label: 'Instagram', value: 'instagram', iconFamily: 'AntDesign', iconName: 'instagram' },
    { label: 'TikTok', value: 'tiktok', iconFamily: 'MaterialCommunityIcons', iconName: 'music-note' },
    { label: 'Facebook', value: 'facebook', iconFamily: 'AntDesign', iconName: 'facebook-square' },
    { label: 'X', value: 'x', iconFamily: 'AntDesign', iconName: 'twitter' },
    { label: 'Google', value: 'google', iconFamily: 'AntDesign', iconName: 'google' },
    { label: 'TV', value: 'tv', iconFamily: 'MaterialCommunityIcons', iconName: 'television' }
  ];

  // Blokování hardware back button pouze na Androidu
  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS !== 'android') {
        return; // BackHandler funguje pouze na Androidu
      }
      
      const onBackPress = () => {
        return true; // Blokuje hardware back
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription?.remove();
    }, [])
  );

  const handleSourceSelect = (source: string) => {
    setSelectedSource(source);
  };

  const renderIcon = (iconFamily: string, iconName: string) => {
    const iconProps = {
      name: iconName as any,
      size: 24,
      color: COLORS.mainText,
    };

    if (iconFamily === 'AntDesign') {
      return <AntDesign {...iconProps} />;
    } else if (iconFamily === 'MaterialCommunityIcons') {
      return <MaterialCommunityIcons {...iconProps} />;
    }
    
    return null;
  };

  const handleNext = async () => {
    if (!selectedSource) return;
    
    try {
      // Uložit odpověď
      await AsyncStorage.setItem('onboarding_source', selectedSource);
      // Označit onboarding jako dokončený
      await AsyncStorage.setItem('onboarding_completed', 'true');
      // Přejít na auth
      router.replace('/(auth)/sign-in');
    } catch (error) {
      console.log('Error saving source:', error);
      // I při chybě pokračovat
      router.replace('/(auth)/sign-in');
    }
  };

  return (
    <View style={styles.container}>
      <OnboardingHeader 
        step={4} 
        total={4} 
        questionLabel="Question 4"
      />
      
      <View style={styles.content}>
        <View style={styles.questionSection}>
          <Text style={styles.questionText}>Where did you hear about us?</Text>
        </View>
        
        <View style={styles.answersSection}>
          {sourceOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.answerButton,
                selectedSource === option.value && styles.answerButtonSelected
              ]}
              onPress={() => handleSourceSelect(option.value)}
              activeOpacity={0.8}
            >
              <View style={styles.answerButtonContent}>
                {renderIcon(option.iconFamily, option.iconName)}
                <Text style={styles.answerText}>{option.label}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={[styles.nextContainer, { paddingBottom: insets.bottom + SPACING.page }]}>
        <TouchableOpacity 
          style={[
            styles.nextButton,
            !selectedSource && styles.nextButtonDisabled
          ]}
          onPress={handleNext}
          disabled={!selectedSource}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between', // justify-between z HTML
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.page,
    marginTop: -64, // -mt-16 z HTML
  },
  questionSection: {
    width: '100%',
    maxWidth: 384, // max-w-sm (384px)
    alignItems: 'center',
    marginBottom: 32, // space-y-8 = 32px
  },
  questionText: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.mainText,
    textAlign: 'center',
    lineHeight: 32,
    letterSpacing: -0.5,
    // Removed textShadow for better web compatibility
  },
  answersSection: {
    width: '100%',
    maxWidth: 384, // max-w-sm
    gap: 16, // space-y-4
    paddingTop: 16, // pt-4
  },
  answerButton: {
    backgroundColor: COLORS.answerButton,
    borderWidth: 2,
    borderColor: COLORS.answerButtonBorder,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 50,
    alignItems: 'center',
  },
  answerButtonSelected: {
    backgroundColor: COLORS.answerButtonSelected,
    borderColor: COLORS.answerButtonBorder,
  },
  answerButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  answerText: {
    ...TYPOGRAPHY.answerText,
  },
  nextContainer: {
    paddingHorizontal: SPACING.page,
    zIndex: 10,
  },
  nextButton: {
    backgroundColor: COLORS.nextButton,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    ...TYPOGRAPHY.nextButton,
  },
});