import React from 'react';
import { TouchableWithoutFeedback, View, Text } from 'react-native';
import { router } from 'expo-router';

// Neinvazivní registrace debug entry pointu
// Funguje jen v dev módu (__DEV__ = true)
export function registerDebugEntry(WrappedComponent: React.ComponentType<any>) {
  if (!__DEV__) {
    // V produkci neděláme žádné změny
    console.log('[SUBDBG] Production mode - debug entry disabled');
    return WrappedComponent;
  }

  return React.forwardRef<any, any>((props, ref) => {
    console.log('[SUBDBG] Debug entry wrapper registered for dev mode');

    return (
      <TouchableWithoutFeedback
        onLongPress={() => {
          console.log('[SUBDBG] Debug gesture completed via onLongPress - opening subscription debug');
          try {
            router.push('/subscription-debug' as any);
          } catch (e) {
            console.error('[SUBDBG] Failed to navigate to debug screen:', e);
          }
        }}
        delayLongPress={3000}
      >
        <View style={{ flex: 1 }}>
          <WrappedComponent {...props} ref={ref} />
        </View>
      </TouchableWithoutFeedback>
    );
  });
}

// Wrapper funkce pro použití s libovolnou komponentou
export function withDebugEntry<T extends React.ComponentType<any>>(
  Component: T
): T {
  return registerDebugEntry(Component) as T;
}