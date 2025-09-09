import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { assertFirebaseConfig } from '../lib/firebase';

export const FirebaseConfigBanner: React.FC = () => {
  const configCheck = assertFirebaseConfig();
  
  if (configCheck.isValid) {
    return null;
  }
  
  return (
    <View style={styles.banner}>
      <Text style={styles.title}>⚠️ Firebase konfigurace chybí</Text>
      <Text style={styles.text}>
        Chybějící ENV proměnné: {configCheck.missing.join(', ')}
      </Text>
      <Text style={styles.instruction}>
        Vyplň je v .env souboru nebo nastav jako environment variables.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#FFF3CD',
    borderColor: '#FFEAA7',
    borderWidth: 1,
    padding: 12,
    margin: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 4,
  },
  text: {
    fontSize: 12,
    color: '#856404',
    marginBottom: 4,
  },
  instruction: {
    fontSize: 11,
    color: '#6C5700',
    fontStyle: 'italic',
  },
});