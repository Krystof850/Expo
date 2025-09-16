import { Stack } from 'expo-router';

export default function WorkflowLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 300,
      }}
    >
      <Stack.Screen name="procrastination-input" />
      <Stack.Screen name="task-timer" />
      <Stack.Screen name="task-complete" />
    </Stack>
  );
}