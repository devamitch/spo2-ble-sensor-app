import { ChevronRight, Heart } from "lucide-react-native";
import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../theme/colors";

interface RecentItemProps {
  time?: string;
  bpm?: number;
  title?: string;
  onClick?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

const RecentItem: React.FC<RecentItemProps> = ({
  time = "10:30am",
  bpm = 72,
  title = "Heart Rate",
  onClick,
  isFirst,
  isLast,
}) => {
  const data = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      value: 60 + Math.sin(i / 2) * 6 + Math.random() * 3,
    }));
  }, []);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isFirst && styles.cardFirst,
        isLast && styles.cardLast,
      ]}
      onPress={onClick}
      activeOpacity={0.7}
    >
      <View style={styles.cardLeft}>
        <View style={styles.iconContainer}>
          <Heart size={20} color={COLORS.INFO_BLUE} />
        </View>
        <View>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.time}>{time}</Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.value}>{bpm}</Text>
            <Text style={styles.unit}>bpm</Text>
            <Text style={styles.subtitle}>• Normal</Text>
          </View>
        </View>
      </View>

      <View style={styles.cardRight}>
        <View style={styles.chartContainer}>
          <LineChart
            data={data}
            height={40}
            width={80}
            hideDataPoints
            hideAxesAndRules
            curved
            thickness={2}
            color={COLORS.INFO_BLUE}
            startFillColor={COLORS.BLUE_500_20}
            endFillColor={COLORS.BLUE_500_00}
            startOpacity={0.5}
            endOpacity={0.0}
            initialSpacing={0}
            areaChart
          />
        </View>
        <ChevronRight size={20} color={COLORS.SLATE_300} />
      </View>
    </TouchableOpacity>
  );
};

const RecentSection = () => {
  const navigation = useNavigation();

  const openDetail = (time: string, bpm: number) => {
    const prettyTime = String(time).replace("am", "AM").replace("pm", "PM");
    const date = new Date();
    const dateLabel = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    navigation.navigate("SessionDetail", {
      time: prettyTime,
      bpm,
      hrv: 34,
      date: dateLabel,
      rangeLabel: "Normal",
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Scan</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        <RecentItem
          time="10:30am"
          bpm={72}
          onClick={() => openDetail("10:30 AM", 72)}
          isFirst
        />
        <RecentItem
          time="06:30pm"
          title="Heart Rate"
          bpm={70}
          onClick={() => openDetail("06:30 PM", 70)}
        />
        <RecentItem
          time="08:15pm"
          title="Heart Rate"
          bpm={75}
          onClick={() => openDetail("08:15 PM", 75)}
          isLast
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.TEXT,
  },
  seeAll: {
    fontSize: 14,
    color: COLORS.PRIMARY,
    fontWeight: "600",
  },
  listContainer: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: 24,
    shadowColor: COLORS.TEXT,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.SLATE_100,
  },
  cardFirst: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  cardLast: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderBottomWidth: 0,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.BLUE_50,
    justifyContent: "center",
    alignItems: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.TEXT,
  },
  time: {
    fontSize: 12,
    color: COLORS.TEXT_MUTED,
    fontWeight: "500",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.TEXT,
  },
  unit: {
    fontSize: 12,
    color: COLORS.TEXT_MUTED,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.SUCCESS_TEXT,
    fontWeight: "500",
  },
  cardRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  chartContainer: {
    width: 80,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
});

export default RecentSection;
