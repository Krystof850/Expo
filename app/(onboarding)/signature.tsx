import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SignatureScreen from 'react-native-signature-canvas';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TitleText, DescriptionText } from '../../components/Text';
import { NextButton } from '../../components/Button';
import AppBackground from '../../components/AppBackground';
import { COLORS, SPACING } from '@/constants/theme';
import * as Haptics from 'expo-haptics';

export default function CommitmentSignatureScreen() {
  const insets = useSafeAreaInsets();
  const signatureRef = useRef<any>(null);
  const [hasSignature, setHasSignature] = useState<boolean>(false);

  const handleOK = async (signature: string) => {
    try {
      // Save signature
      await AsyncStorage.setItem('commitment_signature', signature);
      console.log('✍️ Signature saved');
      setHasSignature(true);
    } catch (error) {
      console.log('Error saving signature:', error);
    }
  };

  const handleEmpty = () => {
    console.log('⚠️ No signature provided');
    setHasSignature(false);
  };

  const handleClear = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    signatureRef.current?.clearSignature();
    setHasSignature(false);
  };

  const handleFinish = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Try to read signature directly from canvas
    signatureRef.current?.readSignature();
  };

  const handleSignatureCapture = async (signature: string) => {
    try {
      if (signature) {
        await AsyncStorage.setItem('commitment_signature', signature);
        console.log('✍️ Signature captured and saved');
        setHasSignature(true);
        // Navigate to typing page after successful signature capture
        router.push('/(onboarding)/typing');
      } else {
        Alert.alert(
          'Signature Missing',
          'Please sign your commitment before continuing.',
          [{ text: 'OK', style: 'default' }]
        );
      }
    } catch (error) {
      console.log('Error saving signature:', error);
      Alert.alert(
        'Error',
        'Failed to save signature. Please try again.',
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  const signatureStyle = `
    .m-signature-pad--footer {display: none; margin: 0px;}
    .m-signature-pad {box-shadow: none; border: none; margin: 0px;}
    .m-signature-pad--body {border: none;}
    .m-signature-pad--body canvas {border-radius: 20px;}
    body,html {width: 100%; height: 100%; margin: 0; padding: 0;}
  `;

  return (
    <AppBackground>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.gradientStart} />
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.mainText} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <TitleText animated={false} style={styles.titleText}>
              Sign your commitment
            </TitleText>
            <DescriptionText animated={false} style={styles.commitmentText}>
              Finally, promise yourself that you will{'\n'}
              work to overcome your procrastination.
            </DescriptionText>
          </View>

          {/* Signature Canvas */}
          <View style={styles.signatureSection}>
            <View style={styles.canvasContainer}>
              <SignatureScreen
                ref={signatureRef}
                onOK={handleSignatureCapture}
                onEmpty={handleEmpty}
                descriptionText=""
                clearText=""
                confirmText=""
                webStyle={signatureStyle}
                autoClear={false}
                imageType="image/png"
                style={styles.signatureCanvas}
              />
            </View>
            
            <TouchableOpacity 
              onPress={handleClear} 
              style={styles.clearButton}
              activeOpacity={0.7}
            >
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>

          {/* Instructions */}
          <View style={styles.instructionsSection}>
            <DescriptionText animated={false} style={styles.instructionsText}>
              Draw on the open space above
            </DescriptionText>
          </View>
        </View>

        {/* Finish Button */}
        <View style={styles.buttonContainer}>
          <NextButton
            title="Finish"
            onPress={handleFinish}
            style={styles.finishButton}
          />
        </View>
      </SafeAreaView>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
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
    paddingTop: 0, // Remove extra padding to prevent overlap
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  titleText: {
    fontSize: 20, // Match other pages
    fontWeight: '700',
    color: COLORS.mainText,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
    lineHeight: 26, // Match other pages
  },
  commitmentText: {
    fontSize: 16, // Match other pages description text
    fontWeight: '500',
    color: 'rgba(186, 230, 253, 0.9)', // Match other pages sky-200/90
    textAlign: 'center',
    lineHeight: 24,
  },
  signatureSection: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    marginBottom: 32,
  },
  canvasContainer: {
    width: '100%',
    height: 250,
    backgroundColor: 'white',
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  signatureCanvas: {
    width: '100%',
    height: '100%',
  },
  clearButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(186, 230, 253, 0.9)', // Match other pages styling
    textAlign: 'center',
  },
  instructionsSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  instructionsText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(186, 230, 253, 0.8)', // Match other pages styling
    textAlign: 'center',
    opacity: 0.8,
  },
  buttonContainer: {
    paddingHorizontal: SPACING.page,
    paddingBottom: 40,
    paddingTop: 20,
  },
  finishButton: {
    backgroundColor: '#4A90E2',
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
  finishButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
  },
});