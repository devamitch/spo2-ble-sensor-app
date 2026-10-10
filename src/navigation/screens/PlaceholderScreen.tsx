import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../theme/colors';

// Generic placeholder screen component
function PlaceholderScreen({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ChevronLeft size={24} color={COLORS.TEXT} />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.placeholder}>{title}</Text>
        <Text style={styles.subtitle}>Screen content goes here</Text>
      </View>
    </SafeAreaView>
  );
}

// Health History Screen
export function HealthHistory({ navigation }: any) {
  return <PlaceholderScreen title="Health History" onBack={() => navigation.goBack()} />;
}

// Notifications Screen
export function Notifications({ navigation }: any) {
  return <PlaceholderScreen title="Notifications" onBack={() => navigation.goBack()} />;
}

// Privacy Screen
export function Privacy({ navigation }: any) {
  return <PlaceholderScreen title="Privacy" onBack={() => navigation.goBack()} />;
}

// About Screen
export function About({ navigation }: any) {
  return <PlaceholderScreen title="About" onBack={() => navigation.goBack()} />;
}

// Scanning Tips Screen (Modal)
export function ScanningTips({ navigation }: any) {
  return <PlaceholderScreen title="Scanning Tips" onBack={() => navigation.goBack()} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  placeholder: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.TEXT,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.TEXT_MUTED,
  },
});
