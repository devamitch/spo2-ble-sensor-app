import { Bell, ChevronRight, HelpCircle, Info, Shield } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../theme/colors';
import { SettingsStackScreenProps } from '../types';

type Props = SettingsStackScreenProps<'SettingsMain'>;

interface SettingItem {
  id: string;
  icon: any;
  title: string;
  subtitle: string;
  screen: 'Notifications' | 'Privacy' | 'About' | 'ScanningTips';
  color: string;
}

const settingItems: SettingItem[] = [
  {
    id: 'notifications',
    icon: Bell,
    title: 'Notifications',
    subtitle: 'Manage alerts and reminders',
    screen: 'Notifications',
    color: '#FF6B6B',
  },
  {
    id: 'privacy',
    icon: Shield,
    title: 'Privacy',
    subtitle: 'Data and privacy settings',
    screen: 'Privacy',
    color: '#A960EE',
  },
  {
    id: 'tips',
    icon: HelpCircle,
    title: 'Scanning Tips',
    subtitle: 'How to get the best results',
    screen: 'ScanningTips',
    color: '#4FACFE',
  },
  {
    id: 'about',
    icon: Info,
    title: 'About',
    subtitle: 'App info and version',
    screen: 'About',
    color: '#10B981',
  },
];

export function Settings({ navigation }: Props) {
  const handleItemPress = (screen: SettingItem['screen']) => {
    navigation.navigate(screen);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Customize your SPO Health experience</Text>
        </View>

        {/* Settings Items */}
        <View style={styles.section}>
          {settingItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.settingItem, index === settingItems.length - 1 && styles.lastItem]}
                onPress={() => handleItemPress(item.screen)}
                activeOpacity={0.7}
              >
                <View style={styles.itemLeft}>
                  <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
                    <Icon size={22} color={item.color} strokeWidth={2} />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                  </View>
                </View>
                <ChevronRight size={20} color={COLORS.TEXT_MUTED} strokeWidth={2.5} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
          <Text style={styles.versionSubtext}>© 2025 SPO Health. All rights reserved.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.TEXT,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.TEXT_MUTED,
    lineHeight: 22,
  },
  section: {
    marginHorizontal: 16,
    backgroundColor: COLORS.SURFACE,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 14,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT,
  },
  itemSubtitle: {
    fontSize: 13,
    color: COLORS.TEXT_MUTED,
    lineHeight: 18,
  },
  versionContainer: {
    alignItems: 'center',
    paddingTop: 32,
    gap: 4,
  },
  versionText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.TEXT_MUTED,
  },
  versionSubtext: {
    fontSize: 12,
    color: COLORS.TEXT_MUTED,
    opacity: 0.7,
  },
});
