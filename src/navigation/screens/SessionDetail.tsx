import { ChevronLeft, Share2 } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { SafeAreaView } from "react-native-safe-area-context";
import { StaticScreenProps, useNavigation } from "@react-navigation/native";

type SessionDetailProps = StaticScreenProps<{
  bpm?: number;
  hrv?: number;
  time?: string;
  date?: string;
  rangeLabel?: string;
}>;

import { COLORS } from "../../theme/colors";

// Color Palette
const { PRIMARY, BG, SURFACE, TEXT, TEXT_MUTED, BORDER } = COLORS;

export function SessionDetail({ route }: SessionDetailProps) {
  const navigation = useNavigation();
  const params = route.params || {};

  const meta = {
    bpm: params.bpm ?? 72,
    hrv: params.hrv ?? 34,
    time: params.time ?? "10:30 AM",
    date: params.date ?? "Nov 10, 2025",
    rangeLabel: params.rangeLabel ?? "Normal",
  };

  const [period, setPeriod] = useState("Day");

  const chartData = useMemo(() => {
    return [
      { value: 72 },
      { value: 74 },
      { value: 71 },
      { value: 76 },
      { value: 78 },
      { value: 73 },
      { value: 80 },
      { value: 69 },
      { value: 75 },
      { value: 72 },
      { value: 79 },
    ].map((item) => ({ ...item, label: "" }));
  }, []);

  const renderOptionButtons = (
    options: string[],
    currentValue: string,
    onChange: (val: string) => void
  ) => (
    <View style={styles.periodSelector}>
      {options.map((option) => {
        const active = option === currentValue;
        return (
          <TouchableOpacity
            key={option}
            onPress={() => onChange(option)}
            style={[styles.periodButton, active && styles.periodButtonActive]}
          >
            <Text
              style={[
                styles.periodButtonText,
                active && styles.periodButtonTextActive,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconButton}
          >
            <ChevronLeft size={24} color={TEXT} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Session Details</Text>
            <Text style={styles.headerSubtitle}>
              {meta.date} • {meta.time}
            </Text>
          </View>
          <TouchableOpacity style={styles.iconButton}>
            <Share2 size={20} color={TEXT} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[styles.container, { flexGrow: 1 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Period buttons */}
          <View style={styles.periodContainer}>
            {renderOptionButtons(["Day", "Week", "Month"], period, setPeriod)}
          </View>

          {/* Graphs */}
          <View style={styles.chartCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Heart Rate Trend</Text>
              <Text style={styles.avgValue}>
                {meta.bpm} <Text style={styles.avgUnit}>bpm avg</Text>
              </Text>
            </View>

            <View style={styles.chartWrapper}>
              <LineChart
                data={chartData}
                height={200}
                width={Dimensions.get("window").width - 80}
                spacing={32}
                color={PRIMARY}
                thickness={3}
                hideDataPoints={false}
                dataPointsColor={PRIMARY}
                dataPointsRadius={4}
                hideRules
                hideYAxisText={false}
                yAxisTextStyle={{ fontSize: 11, color: TEXT_MUTED }}
                initialSpacing={20}
                yAxisLabelSuffix=""
                curved
                startFillColor={PRIMARY}
                endFillColor={PRIMARY}
                startOpacity={0.1}
                endOpacity={0.0}
                areaChart
              />
            </View>
          </View>

          {/* Summary Card */}
          <View style={styles.card}>
            <View style={styles.summaryHeader}>
              <View style={styles.rangeBadge}>
                <View style={styles.statusDot} />
                <Text style={styles.rangeBadgeText}>{meta.rangeLabel}</Text>
              </View>
              <Text style={styles.summaryTitle}>Health Status</Text>
            </View>

            {/* Range Slider Visual */}
            <View style={styles.rangeContainer}>
              <View style={styles.rangeBar}>
                <View
                  style={[
                    styles.rangeSegment,
                    { backgroundColor: COLORS.SUCCESS, flex: 3 },
                  ]}
                />
                <View
                  style={[
                    styles.rangeSegment,
                    { backgroundColor: COLORS.WARNING, flex: 1 },
                  ]}
                />
                <View
                  style={[
                    styles.rangeSegment,
                    { backgroundColor: COLORS.ERROR, flex: 1 },
                  ]}
                />
              </View>
              {/* Indicator Positioned Absolute */}
              <View style={[styles.indicator, { left: "45%" }]}>
                <View style={styles.indicatorOften} />
              </View>
            </View>

            {/* Legend */}
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: COLORS.SUCCESS },
                  ]}
                />
                <Text style={styles.legendText}>Normal</Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: COLORS.WARNING },
                  ]}
                />
                <Text style={styles.legendText}>Elevated</Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: COLORS.ERROR }]}
                />
                <Text style={styles.legendText}>High</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Metrics */}
            <View style={styles.metricsRow}>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Avg BPM</Text>
                <Text style={styles.metricValue}>
                  {meta.bpm} <Text style={styles.metricUnit}>bpm</Text>
                </Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Heart Var.</Text>
                <Text style={styles.metricValue}>
                  {meta.hrv} <Text style={styles.metricUnit}>ms</Text>
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: "4%",
    paddingVertical: 16,
    backgroundColor: BG,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: SURFACE,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER,
  },
  headerTitleContainer: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT,
  },
  headerSubtitle: {
    fontSize: 12,
    color: TEXT_MUTED,
    marginTop: 2,
  },
  container: {
    paddingHorizontal: "4%",
    paddingBottom: 40,
  },
  periodContainer: {
    marginBottom: 16,
  },
  periodSelector: {
    flexDirection: "row",
    backgroundColor: COLORS.SLATE_100,
    padding: 4,
    borderRadius: 12,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 10,
  },
  periodButtonActive: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: COLORS.BLACK_05,
  },
  periodButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: TEXT_MUTED,
  },
  periodButtonTextActive: {
    color: TEXT,
  },
  chartCard: {
    backgroundColor: SURFACE,
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT,
  },
  avgValue: {
    fontSize: 20,
    fontWeight: "700",
    color: PRIMARY,
  },
  avgUnit: {
    fontSize: 12,
    fontWeight: "500",
    color: TEXT_MUTED,
  },
  chartWrapper: {
    alignItems: "center",
    marginHorizontal: -16,
  },
  card: {
    backgroundColor: SURFACE,
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: BORDER,
  },
  summaryHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT,
  },
  rangeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.SUCCESS_BG,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 100,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.SUCCESS_TEXT,
  },
  rangeBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.SUCCESS_TEXT,
  },
  rangeContainer: {
    height: 24,
    justifyContent: "center",
    marginBottom: 24,
  },
  rangeBar: {
    flexDirection: "row",
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    gap: 2,
  },
  rangeSegment: {
    height: "100%",
    opacity: 0.8,
  },
  indicator: {
    position: "absolute",
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  indicatorOften: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.SURFACE,
    borderWidth: 4,
    borderColor: COLORS.TEXT,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    marginBottom: 24,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 12,
    color: TEXT_MUTED,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: BORDER,
    marginBottom: 24,
  },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metricItem: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    color: TEXT_MUTED,
    marginBottom: 4,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "700",
    color: TEXT,
  },
  metricUnit: {
    fontSize: 12,
    color: TEXT_MUTED,
    fontWeight: "500",
  },
});
