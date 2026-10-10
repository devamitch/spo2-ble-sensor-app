import { EllipsisVertical } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../theme/colors";

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  unit: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  title,
  value,
  unit,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>{icon}</View>
        <TouchableOpacity>
          <EllipsisVertical size={20} color={COLORS.TEXT_MUTED} />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{title}</Text>

      <View style={styles.valueContainer}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.unit}>{unit}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: 24,
    padding: 16,
    shadowColor: COLORS.TEXT,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.BG,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.TEXT_MUTED,
    marginBottom: 8,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 8,
  },
  value: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.TEXT,
    letterSpacing: -1,
  },
  unit: {
    fontSize: 14,
    color: COLORS.TEXT_MUTED,
    fontWeight: "500",
    marginLeft: 4,
  },
});

export default MetricCard;
