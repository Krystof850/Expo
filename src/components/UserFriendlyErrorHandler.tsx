import React, { createContext, useContext, useState, useCallback } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';
import * as Haptics from 'expo-haptics';

export interface ErrorInfo {
  title: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  actionText?: string;
  onAction?: () => void;
  allowClose?: boolean;
}

interface ErrorContextType {
  showError: (error: ErrorInfo) => void;
  hideError: () => void;
  isVisible: boolean;
}

const ErrorContext = createContext<ErrorContextType | null>(null);

export const useErrorHandler = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useErrorHandler must be used within ErrorProvider');
  }
  return context;
};

const getErrorIcon = (type: 'error' | 'warning' | 'info') => {
  switch (type) {
    case 'error':
      return 'close-circle';
    case 'warning':
      return 'warning';
    case 'info':
      return 'information-circle';
    default:
      return 'alert-circle';
  }
};

const getErrorColor = (type: 'error' | 'warning' | 'info') => {
  switch (type) {
    case 'error':
      return '#FF6B6B';
    case 'warning':
      return '#FFB347';
    case 'info':
      return '#4ECDC4';
    default:
      return '#FF6B6B';
  }
};

const ErrorModal: React.FC<{
  error: ErrorInfo | null;
  isVisible: boolean;
  onClose: () => void;
}> = ({ error, isVisible, onClose }) => {
  const insets = useSafeAreaInsets();

  if (!error) return null;

  const handleClose = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  const handleAction = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (error.onAction) {
      error.onAction();
    }
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { paddingTop: insets.top + SPACING.md }]}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.98)', 'rgba(255, 255, 255, 0.95)']}
            style={styles.modal}
          >
            {/* Header with Icon */}
            <View style={styles.header}>
              <View style={[styles.iconContainer, { backgroundColor: getErrorColor(error.type) }]}>
                <Ionicons
                  name={getErrorIcon(error.type)}
                  size={32}
                  color="#FFFFFF"
                />
              </View>
              <Text style={styles.title}>{error.title}</Text>
            </View>

            {/* Message */}
            <View style={styles.content}>
              <Text style={styles.message}>{error.message}</Text>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              {error.actionText && error.onAction && (
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: getErrorColor(error.type) }]}
                  onPress={handleAction}
                >
                  <Text style={styles.actionButtonText}>{error.actionText}</Text>
                </TouchableOpacity>
              )}
              
              {(error.allowClose !== false) && (
                <TouchableOpacity
                  style={[styles.closeButton, !error.actionText && styles.closeButtonFull]}
                  onPress={handleClose}
                >
                  <Text style={styles.closeButtonText}>OK</Text>
                </TouchableOpacity>
              )}
            </View>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [error, setError] = useState<ErrorInfo | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showError = useCallback((errorInfo: ErrorInfo) => {
    setError(errorInfo);
    setIsVisible(true);
  }, []);

  const hideError = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => setError(null), 300); // Wait for animation
  }, []);

  const contextValue: ErrorContextType = {
    showError,
    hideError,
    isVisible,
  };

  return (
    <ErrorContext.Provider value={contextValue}>
      {children}
      <ErrorModal
        error={error}
        isVisible={isVisible}
        onClose={hideError}
      />
    </ErrorContext.Provider>
  );
};

// Helper functions for common error types
export const createAuthError = (message: string): ErrorInfo => ({
  title: 'Authentication Error',
  message,
  type: 'error',
  allowClose: true,
});

export const createNetworkError = (message: string): ErrorInfo => ({
  title: 'Connection Problem',
  message: message || 'Please check your internet connection and try again.',
  type: 'warning',
  actionText: 'Retry',
  allowClose: true,
});

export const createFirebaseError = (message: string): ErrorInfo => ({
  title: 'Something went wrong',
  message: message || 'We encountered an issue. Please try again.',
  type: 'error',
  allowClose: true,
});

export const createSuperwallError = (message: string): ErrorInfo => ({
  title: 'Subscription Issue',
  message: message || 'There was a problem with your subscription. Please try again.',
  type: 'warning',
  allowClose: true,
});

export const createGeneralError = (title: string, message: string): ErrorInfo => ({
  title,
  message,
  type: 'error',
  allowClose: true,
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  modal: {
    width: '100%',
    maxWidth: 340,
    borderRadius: RADIUS.card,
    padding: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  title: {
    ...TYPOGRAPHY.title,
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.mainText,
    textAlign: 'center',
  },
  content: {
    marginBottom: SPACING.lg,
  },
  message: {
    ...TYPOGRAPHY.description,
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.descriptionText,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.card,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.card,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  closeButtonFull: {
    flex: 1,
  },
  closeButtonText: {
    color: COLORS.mainText,
    fontSize: 16,
    fontWeight: '600',
  },
});