import React from 'react';
import { TouchableWithoutFeedback, View, Text } from 'react-native';
import { router } from 'expo-router';

// Debug entry point registration
// Only works in development mode
export function registerDebugEntry(WrappedComponent: React.ComponentType<any>) {
  if (!__DEV__) {
    // No changes in production
    console.log('[SUBDBG] Production mode - debug entry disabled');
    return WrappedComponent;
  }

  return React.forwardRef<any, any>((props, ref) => {
    console.log('[SUBDBG] Debug entry wrapper registered for dev mode');

    return React.createElement(
      TouchableWithoutFeedback,
      {
        onLongPress: () => {
          console.log('[SUBDBG] Debug gesture completed via onLongPress - opening subscription debug');
          try {
            router.push('/subscription-debug' as any);
          } catch (e) {
            console.error('[SUBDBG] Failed to navigate to debug screen:', e);
          }
        },
        delayLongPress: 3000,
      },
      React.createElement(
        View,
        { style: { flex: 1 } },
        React.createElement(WrappedComponent, { ...props, ref })
      )
    );
  });
}

// Wrapper function for use with any component
export function withDebugEntry<T extends React.ComponentType<any>>(
  Component: T
): T {
  return registerDebugEntry(Component) as T;
}