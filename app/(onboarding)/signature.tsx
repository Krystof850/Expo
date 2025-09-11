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
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SignatureScreen from 'react-native-signature-canvas';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SPACING } from '@/constants/theme';

export default function CommitmentSignatureScreen() {
  const insets = useSafeAreaInsets();
  const signatureRef = useRef<any>(null);
  const [hasSignature, setHasSignature] = useState<boolean>(false);

  const handleOK = async (signature: string) => {
    try {
      // Uložit podpis
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
    signatureRef.current?.clearSignature();
    setHasSignature(false);
  };

  const handleFinish = async () => {
    if (!hasSignature) {
      Alert.alert(
        'Podpis chybí',
        'Prosím podepište svůj závazek před pokračováním.',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    // Pokračovat na auth
    router.push('/(auth)/sign-in');
  };

  const signatureStyle = `
    .m-signature-pad--footer {display: none; margin: 0px;}
    .m-signature-pad {box-shadow: none; border: none; margin: 0px;}
    .m-signature-pad--body {border: none;}
    .m-signature-pad--body canvas {border-radius: 20px;}
    body,html {width: 100%; height: 100%; margin: 0; padding: 0;}
  `;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.gradientStart} />
      
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientMiddle, COLORS.gradientEnd]}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.mainText} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.titleText}>
              Podepište svůj závazek
            </Text>
            <Text style={styles.commitmentText}>
              Konečně se zavazuji, že budu pracovat{'\n'}
              na překonání své prokrastinace.
            </Text>
          </View>

          {/* Signature Canvas */}
          <View style={styles.signatureSection}>
            <View style={styles.canvasContainer}>
              <SignatureScreen
                ref={signatureRef}
                onOK={handleOK}
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
              <Text style={styles.clearButtonText}>Vymazat</Text>
            </TouchableOpacity>
          </View>

          {/* Instructions */}
          <View style={styles.instructionsSection}>
            <Text style={styles.instructionsText}>
              Nakreslete svůj podpis do pole výše
            </Text>
          </View>
        </View>

        {/* Finish Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[
              styles.finishButton,
              !hasSignature && styles.disabledButton
            ]}
            onPress={handleFinish}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.finishButtonText,
              !hasSignature && styles.disabledButtonText
            ]}>
              Dokončit
            </Text>
          </TouchableOpacity>
        </View>
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
    paddingTop: 20,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  titleText: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.mainText,
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  commitmentText: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.questionLabel,
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
    color: COLORS.questionLabel,
    textAlign: 'center',
  },
  instructionsSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  instructionsText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.questionLabel,
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
  disabledButton: {
    backgroundColor: 'rgba(74, 144, 226, 0.5)',
    shadowOpacity: 0.1,
  },
  finishButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
  },
  disabledButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
});