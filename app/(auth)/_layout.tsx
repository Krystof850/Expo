import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="sign-in" options={{ title: 'Přihlášení' }} />
      <Stack.Screen name="sign-up" options={{ title: 'Registrace' }} />
      <Stack.Screen name="forgot" options={{ title: 'Zapomenuté heslo' }} />
    </Stack>
  );
}