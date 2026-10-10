import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { HomeStackParamList } from './types';

// Screens
import { Dashboard } from './screens/Dashboard';
import { HeartRateMeasuring } from './screens/HeartRateMeasuring';
import { SessionDetail } from './screens/SessionDetail';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          title: 'Home',
        }}
      />
      <Stack.Screen
        name="HeartRateMeasuring"
        component={HeartRateMeasuring}
        options={{
          presentation: 'card',
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name="SessionDetail"
        component={SessionDetail}
        options={{
          presentation: 'card',
        }}
      />
    </Stack.Navigator>
  );
}
