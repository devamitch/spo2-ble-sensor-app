import {
  Bell,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ExternalLink,
  Heart,
  Info,
  Lightbulb,
  Shield,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../theme/colors';

// Health History Screen
export function HealthHistory({ navigation }: any) {
  const mockHistory = [
    { id: '1', date: 'Today 10:30 AM', hr: 72, hrv: 34 },
    { id: '2', date: 'Today 08:15 AM', hr: 68, hrv: 38 },
    { id: '3', date: 'Yesterday 9:45 PM', hr: 75, hrv: 32 },
    { id: '4', date: 'Yesterday 2:30 PM', hr: 70, hrv: 35 },
    { id: '5', date: 'Jan 17, 11:20 AM', hr: 73, hrv: 33 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={24} color={COLORS.TEXT} />
        </TouchableOpacity>
        <Text style={styles.title}>Health History</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsCard}>
          <Text style={styles.sectionTitle}>Last 7 Days</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Heart size={20} color={COLORS.PRIMARY} />
              <Text style={styles.statValue}>71</Text>
              <Text style={styles.statLabel}>Avg BPM</Text>
            </View>
            <View style={styles.statBox}>
              <Calendar size={20} color={COLORS.PURPLE} />
              <Text style={styles.statValue}>34</Text>
              <Text style={styles.statLabel}>Avg HRV</Text>
            </View>
            <View style={styles.statBox}>
              <CheckCircle2 size={20} color={COLORS.SUCCESS} />
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Scans</Text>
            </View>
          </View>
        </View>

        <Text style={styles.listTitle}>Recent Measurements</Text>
        {mockHistory.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.historyCard,
              index === 0 && styles.firstCard,
              index === mockHistory.length - 1 && styles.lastCard,
            ]}
          >
            <View style={styles.historyLeft}>
              <Calendar size={18} color={COLORS.TEXT_MUTED} />
              <Text style={styles.historyDate}>{item.date}</Text>
            </View>
            <View style={styles.historyRight}>
              <Text style={styles.historyValue}>
                {item.hr} <Text style={styles.historyUnit}>bpm</Text>
              </Text>
              <Text style={styles.historyHrv}>HRV: {item.hrv}ms</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// Notifications Screen
export function Notifications({ navigation }: any) {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [measurementReminders, setMeasurementReminders] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={24} color={COLORS.TEXT} />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.infoCard}>
          <Bell size={20} color={COLORS.INFO_BLUE} />
          <Text style={styles.infoText}>
            Get timely reminders to measure your heart rate and stay on track with your health
            goals.
          </Text>
        </View>

        <View style={styles.settingSection}>
          <Text style={styles.sectionTitle}>Push Notifications</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Enable Notifications</Text>
              <Text style={styles.settingDescription}>Receive push notifications</Text>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: COLORS.SLATE_300, true: COLORS.PRIMARY }}
              thumbColor={COLORS.SURFACE}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Measurement Reminders</Text>
              <Text style={styles.settingDescription}>Daily reminder to measure</Text>
            </View>
            <Switch
              value={measurementReminders}
              onValueChange={setMeasurementReminders}
              trackColor={{ false: COLORS.SLATE_300, true: COLORS.PRIMARY }}
              thumbColor={COLORS.SURFACE}
              disabled={!pushEnabled}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Weekly Reports</Text>
              <Text style={styles.settingDescription}>Health summary every week</Text>
            </View>
            <Switch
              value={weeklyReports}
              onValueChange={setWeeklyReports}
              trackColor={{ false: COLORS.SLATE_300, true: COLORS.PRIMARY }}
              thumbColor={COLORS.SURFACE}
              disabled={!pushEnabled}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Sound</Text>
              <Text style={styles.settingDescription}>Play sound with notifications</Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: COLORS.SLATE_300, true: COLORS.PRIMARY }}
              thumbColor={COLORS.SURFACE}
              disabled={!pushEnabled}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Privacy Screen
export function Privacy({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={24} color={COLORS.TEXT} />
        </TouchableOpacity>
        <Text style={styles.title}>Privacy</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.infoCard}>
          <Shield size={20} color={COLORS.SUCCESS} />
          <Text style={styles.infoText}>
            Your health data is encrypted and stored securely on your device. We never share your
            personal information.
          </Text>
        </View>

        <View style={styles.privacySection}>
          <Text style={styles.sectionTitle}>Data Collection</Text>
          <Text style={styles.privacyText}>
            • Heart rate measurements{'\n'}• Heart rate variability data{'\n'}• Measurement
            timestamps{'\n'}• App usage statistics
          </Text>
        </View>

        <View style={styles.privacySection}>
          <Text style={styles.sectionTitle}>Data Storage</Text>
          <Text style={styles.privacyText}>
            All your health data is stored locally on your device. We use industry-standard
            encryption to protect your information.
          </Text>
        </View>

        <View style={styles.privacySection}>
          <Text style={styles.sectionTitle}>Data Sharing</Text>
          <Text style={styles.privacyText}>
            We do not sell or share your personal health data with third parties. Your data belongs
            to you.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => Linking.openURL('https://example.com/privacy')}
        >
          <Text style={styles.linkButtonText}>Read Full Privacy Policy</Text>
          <ExternalLink size={16} color={COLORS.PRIMARY} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// About Screen
export function About({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={24} color={COLORS.TEXT} />
        </TouchableOpacity>
        <Text style={styles.title}>About</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.aboutContent}>
        <View style={styles.appIconContainer}>
          <Heart size={60} color={COLORS.PRIMARY} />
        </View>

        <Text style={styles.appName}>SPO Health</Text>
        <Text style={styles.appVersion}>Version 1.0.0</Text>

        <View style={styles.aboutSection}>
          <Text style={styles.aboutText}>
            SPO Health uses advanced photoplethysmography (PPG) technology to measure your heart
            rate and heart rate variability using just your phone's camera.
          </Text>
        </View>

        <View style={styles.aboutSection}>
          <Text style={styles.sectionTitle}>Features</Text>
          <Text style={styles.aboutText}>
            • Real-time heart rate monitoring{'\n'}• Heart rate variability analysis{'\n'}• Signal
            quality indicators{'\n'}• Historical data tracking{'\n'}• Beautiful visualizations
          </Text>
        </View>

        <View style={styles.aboutSection}>
          <Text style={styles.sectionTitle}>Developer</Text>
          <Text style={styles.aboutText}>Built with ❤️ by Your Team</Text>
        </View>

        <View style={styles.linkButtons}>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => Linking.openURL('https://example.com/terms')}
          >
            <Text style={styles.linkButtonText}>Terms of Service</Text>
            <ExternalLink size={16} color={COLORS.PRIMARY} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => Linking.openURL('https://example.com/privacy')}
          >
            <Text style={styles.linkButtonText}>Privacy Policy</Text>
            <ExternalLink size={16} color={COLORS.PRIMARY} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => Linking.openURL('https://example.com/support')}
          >
            <Text style={styles.linkButtonText}>Support</Text>
            <ExternalLink size={16} color={COLORS.PRIMARY} />
          </TouchableOpacity>
        </View>

        <Text style={styles.copyright}>© 2026 SPO Health. All rights reserved.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// Scanning Tips Screen (Modal)
export function ScanningTips({ navigation }: any) {
  const tips = [
    {
      icon: <Lightbulb size={24} color={COLORS.PRIMARY} />,
      title: 'Good Lighting',
      description: 'Measure in a well-lit environment for best results',
    },
    {
      icon: <Heart size={24} color={COLORS.ERROR} />,
      title: 'Cover the Lens',
      description: 'Completely cover the camera lens with your fingertip',
    },
    {
      icon: <CheckCircle2 size={24} color={COLORS.SUCCESS} />,
      title: 'Stay Still',
      description: 'Hold your phone steady during the entire measurement',
    },
    {
      icon: <Bell size={24} color={COLORS.WARNING} />,
      title: 'Gentle Pressure',
      description: 'Apply light pressure - not too hard, not too soft',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={24} color={COLORS.TEXT} />
        </TouchableOpacity>
        <Text style={styles.title}>Scanning Tips</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.infoCard}>
          <Info size={20} color={COLORS.INFO_BLUE} />
          <Text style={styles.infoText}>
            Follow these tips for the most accurate heart rate measurements
          </Text>
        </View>

        {tips.map((tip, index) => (
          <View key={index} style={styles.tipCard}>
            <View style={styles.tipIcon}>{tip.icon}</View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>{tip.title}</Text>
              <Text style={styles.tipDescription}>{tip.description}</Text>
            </View>
          </View>
        ))}

        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>Note</Text>
          <Text style={styles.noteText}>
            For best results, use the back camera with the torch/flash enabled. Wait 5-10 seconds
            for the signal to stabilize.
          </Text>
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
    fontWeight: '700',
    color: COLORS.TEXT,
  },
  content: {
    flex: 1,
    padding: 16,
  },

  // Health History
  statsCard: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.TEXT,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.TEXT,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.TEXT_MUTED,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.TEXT,
    marginBottom: 12,
  },
  historyCard: {
    backgroundColor: COLORS.SURFACE,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  firstCard: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  lastCard: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderBottomWidth: 0,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  historyDate: {
    fontSize: 14,
    color: COLORS.TEXT,
    fontWeight: '500',
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  historyValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.TEXT,
  },
  historyHrv: {
    fontSize: 13,
    color: COLORS.TEXT_MUTED,
    marginTop: 2,
  },
  historyUnit: {
    fontSize: 12,
    color: COLORS.TEXT_MUTED,
  },

  // Notifications
  infoCard: {
    backgroundColor: COLORS.INFO_BLUE + '15',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.INFO_BLUE + '30',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.TEXT,
    lineHeight: 20,
  },
  settingSection: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  settingLeft: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.TEXT,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: COLORS.TEXT_MUTED,
  },

  // Privacy
  privacySection: {
    marginBottom: 24,
  },
  privacyText: {
    fontSize: 14,
    color: COLORS.TEXT,
    lineHeight: 22,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.SURFACE,
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  linkButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.PRIMARY,
  },

  // About
  aboutContent: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  appIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.PRIMARY + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.TEXT,
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: COLORS.TEXT_MUTED,
    marginBottom: 32,
  },
  aboutSection: {
    width: '100%',
    marginBottom: 24,
  },
  aboutText: {
    fontSize: 14,
    color: COLORS.TEXT,
    lineHeight: 22,
    textAlign: 'center',
  },
  linkButtons: {
    width: '100%',
    gap: 8,
    marginTop: 16,
  },
  copyright: {
    fontSize: 12,
    color: COLORS.TEXT_MUTED,
    marginTop: 32,
    textAlign: 'center',
  },

  // Scanning Tips
  tipCard: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  tipIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.BG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT,
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    color: COLORS.TEXT_MUTED,
    lineHeight: 20,
  },
  noteCard: {
    backgroundColor: COLORS.WARNING + '15',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: COLORS.WARNING + '30',
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.WARNING,
    marginBottom: 8,
  },
  noteText: {
    fontSize: 14,
    color: COLORS.TEXT,
    lineHeight: 20,
  },
});
