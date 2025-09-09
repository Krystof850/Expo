import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class AuthErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    console.error('[AuthErrorBoundary] Error caught:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[AuthErrorBoundary] Error details:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>🚫 Něco se pokazilo</Text>
          <Text style={styles.message}>
            Aplikace narazila na neočekávanou chybu.
          </Text>
          <Text style={styles.errorText}>
            {this.state.error?.message || 'Neznámá chyba'}
          </Text>
          <Button title="Zkusit znovu" onPress={this.handleReset} />
          <Text style={styles.hint}>
            Pokud problém přetrvává, restartuj aplikaci nebo zkontroluj Firebase konfiguraci.
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#d32f2f',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    color: '#424242',
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'monospace',
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 4,
    marginBottom: 16,
    color: '#d32f2f',
  },
  hint: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
    color: '#757575',
    fontStyle: 'italic',
  },
});