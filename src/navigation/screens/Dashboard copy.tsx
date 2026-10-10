import { useIsFocused, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, HeartPlus, Settings } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../../store/useAppStore';

import MetricCard from '../../Components/dashboard/MetricCard';
import RecentSection from '../../Components/dashboard/RecentSection';
import PrimaryButton from '../../Components/ui/PrimaryButton';
import StartScanModal from '../../Components/ui/StartScanModal';
import { COLORS } from '../../theme/colors';

const { width } = Dimensions.get('window');

export function Dashboard() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Store
  const heartRate = useAppStore((state) => state.heartRate);
  const hrv = useAppStore((state) => state.hrv);
  const hideStartScanModal = useAppStore((state) => state.hideStartScanModal);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY > 10 && !isScrolled) {
      setIsScrolled(true);
    } else if (offsetY <= 10 && isScrolled) {
      setIsScrolled(false);
    }
  };

  const previewData = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      value: 65 + Math.sin(i / 3) * 10 + Math.random() * 5,
    }));
  }, []);

  const onStartMeasuring = () => {
    if (hideStartScanModal) {
      navigation.navigate('HeartRateMeasuring');
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.BG }} edges={['left', 'right']}>
      {isFocused && (
        <StatusBar
          barStyle={isScrolled ? 'dark-content' : 'light-content'}
          backgroundColor={COLORS.TRANSPARENT}
          translucent
        />
      )}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: insets.top,
          backgroundColor: isScrolled ? COLORS.SURFACE : COLORS.TRANSPARENT,
          zIndex: 100,
        }}
      />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        bounces={false}
      >
        {/* Hero Section */}
        <LinearGradient
          colors={[COLORS.PRIMARY, COLORS.PRIMARY_DARK]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.heroSection, { paddingTop: 24 + insets.top }]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Hey, Preetam</Text>
              <Text style={styles.welcome}>Keep tracking your health</Text>
            </View>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => navigation.navigate('HomeTabs', { screen: 'Settings' })}
            >
              <Settings size={20} color={COLORS.SURFACE} />
            </TouchableOpacity>
          </View>

          {/* Heart Rate Measuring Card */}
          <View style={styles.heroCard}>
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <HeartPlus size={24} color={COLORS.PRIMARY} />
              </View>
              <View>
                <Text style={styles.cardTitle}>Instant Analysis</Text>
                <Text style={styles.recordCount}>Check your vital signs</Text>
              </View>
            </View>

            {/* Preview Chart */}
            <View style={styles.chartContainer}>
              <LineChart
                data={previewData}
                height={80}
                width={width - 80}
                hideDataPoints
                hideAxesAndRules
                curved
                thickness={3}
                color={COLORS.INFO_BLUE}
                startFillColor={COLORS.INFO_BLUE}
                endFillColor={COLORS.INFO_BLUE}
                startOpacity={0.2}
                endOpacity={0.0}
                initialSpacing={0}
                areaChart
              />
            </View>

            <PrimaryButton onClick={onStartMeasuring}>Start New Scan</PrimaryButton>
          </View>
        </LinearGradient>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Metric Cards */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricWrapper}>
              <MetricCard
                icon={<HeartPlus size={22} color={COLORS.ERROR} />}
                title="Heart Rate"
                value={heartRate}
                unit="bpm"
              />
            </View>
            <View style={styles.metricWrapper}>
              <MetricCard
                icon={<Heart size={22} color={COLORS.PURPLE} />}
                title="HRV"
                value={hrv}
                unit="ms"
              />
            </View>
          </View>

          {/* Recent Scan */}
          <View style={styles.recentSection}>
            <RecentSection />
          </View>
        </View>
      </ScrollView>

      {/* Start Scan Modal */}
      <StartScanModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStartScan={() => {
          setIsModalOpen(false);
          navigation.navigate('HeartRateMeasuring');
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  heroSection: {
    paddingTop: 'auto',
    paddingBottom: 32,
    paddingHorizontal: '4%',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.SURFACE,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  welcome: {
    fontSize: 14,
    color: COLORS.WHITE_80,
    fontWeight: '500',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.WHITE_15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.WHITE_10,
  },
  heroCard: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: 24,
    padding: 24,
    shadowColor: COLORS.TEXT,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 40,
    elevation: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.BLUE_50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.TEXT,
  },
  recordCount: {
    fontSize: 13,
    color: COLORS.TEXT_MUTED,
    marginTop: 2,
  },
  chartContainer: {
    marginBottom: 24,
    alignItems: 'center',
    overflow: 'hidden',
    height: 80,
    marginHorizontal: -24,
  },
  mainContent: {
    paddingHorizontal: '4%',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  metricWrapper: {
    flex: 1,
  },
  recentSection: {
    marginBottom: 24,
  },
});
