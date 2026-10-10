import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { RootStackParamList } from './types';

// Modal Screens
import { AuthNavigator } from './Authnavigator';
import { MainTabNavigator } from './Maintabnavigator';
import { ScanningTips } from './screens/HealthHistory';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const hasCompletedOnboarding = useAppStore((state) => state.hasCompletedOnboarding);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!hasCompletedOnboarding ? (
        // Auth Stack (Onboarding)
        <Stack.Screen
          name="Auth"
          component={AuthNavigator}
          options={{
            animationTypeForReplace: 'push',
          }}
        />
      ) : (
        // Main App Stack
        <Stack.Screen name="Main" component={MainTabNavigator} />
      )}

      {/* Modal Screens - Available from anywhere */}
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen
          name="ScanningTips"
          component={ScanningTips}
          options={{
            title: 'Scanning Tips',
            headerShown: true,
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}
