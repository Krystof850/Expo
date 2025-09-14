import React from 'react';
import { Platform, KeyboardAvoidingView, ScrollView, View, ViewProps } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = ViewProps & {
  scroll?: boolean;          // když screen potřebuje ScrollView
  children: React.ReactNode;
};

export default function ScreenContainer({ scroll = false, style, children, ...rest }: Props) {
  const insets = useSafeAreaInsets();
  const topSafe = Math.max(insets.top, Platform.OS === 'android' ? 24 : 0); // záloha pro starší zařízení

  const Content = (
    <>
      {/* Top spacer zaručí, že titul nikdy neleze do notche */}
      <View style={{ height: topSafe + 24 }} />
      <View style={[{ paddingHorizontal: 20 }, style]} {...rest}>
        {children}
      </View>
    </>
  );

  if (scroll) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['left', 'right']} >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentInsetAdjustmentBehavior="always"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {Content}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {Content}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}