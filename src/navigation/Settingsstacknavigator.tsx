import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { SettingsStackParamList } from './types';

import { About, Notifications, Privacy } from './screens/HealthHistory';
import { Settings } from './screens/Settings';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export function SettingsStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="SettingsMain"
        component={Settings}
        options={{
          title: 'Settings',
        }}
      />
      <Stack.Screen
        name="Notifications"
        component={Notifications}
        options={{
          title: 'Notifications',
        }}
      />
      <Stack.Screen
        name="Privacy"
        component={Privacy}
        options={{
          title: 'Privacy',
        }}
      />
      <Stack.Screen
        name="About"
        component={About}
        options={{
          title: 'About',
        }}
      />
    </Stack.Navigator>
  );
}
