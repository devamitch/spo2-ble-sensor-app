import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { Asset } from 'expo-asset';
import { createURL } from 'expo-linking';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Navigation
import { RootNavigator } from './navigation/Rootnavigator';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Preload assets
Asset.loadAsync([
  require('./assets/GuidIllustation.png'),
  // Add other assets here as needed
]).catch((error) => {
  console.warn('Asset loading error:', error);
});

export function App() {
  const colorScheme = useColorScheme();
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts or make API calls here if needed
        // await Font.loadAsync({ ... });

        // Simulate loading time (remove in production)
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn('App preparation error:', e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  // Deep linking configuration
  const prefix = createURL('/');
  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        Auth: {
          screens: {
            Onboarding: 'onboarding',
            Welcome: 'welcome',
          },
        },
        Main: {
          screens: {
            HomeTab: {
              screens: {
                Dashboard: 'home',
                HeartRateMeasuring: 'measure',
                SessionDetail: 'session/:id',
              },
            },
            ProfileTab: {
              screens: {
                ProfileMain: 'profile',
                EditProfile: 'profile/edit',
                HealthHistory: 'profile/history',
              },
            },
            SettingsTab: {
              screens: {
                SettingsMain: 'settings',
                Notifications: 'settings/notifications',
                Privacy: 'settings/privacy',
                About: 'settings/about',
              },
            },
          },
        },
        ScanningTips: 'tips',
      },
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <SafeAreaProvider>
        <NavigationContainer theme={theme} linking={linking}>
          <StatusBar
            barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
            backgroundColor="transparent"
            translucent
          />
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
