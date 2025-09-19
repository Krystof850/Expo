import React, { createContext, useContext, useState, useCallback } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
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
          <View style={styles.modal}>
            {/* Icon */}
            <View style={styles.iconContainer}>
              <Ionicons
                name={getErrorIcon(error.type)}
                size={24}
                color={getErrorColor(error.type)}
              />
            </View>

            {/* Title */}
            <Text style={styles.title}>{error.title}</Text>

            {/* Message */}
            <Text style={styles.message}>{error.message}</Text>

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
          </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    maxWidth: 300,
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.small,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    width: '100%',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  closeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  closeButtonFull: {
    flex: 1,
  },
  closeButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },
});