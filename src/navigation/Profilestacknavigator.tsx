import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ProfileStackParamList } from './types';

// Screens

import { EditProfile } from './screens/EditProfile';
import { HealthHistory } from './screens/HealthHistory';
import { Profile } from './screens/Profile';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="ProfileMain"
        component={Profile}
        options={{
          title: 'Profile',
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{
          title: 'Edit Profile',
        }}
      />
      <Stack.Screen
        name="HealthHistory"
        component={HealthHistory}
        options={{
          title: 'Health History',
        }}
      />
    </Stack.Navigator>
  );
}
