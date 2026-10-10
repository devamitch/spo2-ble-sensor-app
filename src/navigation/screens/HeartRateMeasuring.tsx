import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";
import { useNavigation } from "@react-navigation/native";
import { LineChart } from "react-native-gifted-charts";
import { LinearGradient } from "expo-linear-gradient";
import PrimaryButton from "../../Components/ui/PrimaryButton";
import MetricCard from "../../Components/dashboard/MetricCard";
import { calculateHRMetrics, DataPoint } from "../../Utils/hrUtils";
import { useFrameProcessor } from "react-native-vision-camera";
import { useAppStore } from "../../store/useAppStore";
import {
  Activity,
  ChevronLeft,
  Heart,
  Maximize2,
  Minimize2,
  RefreshCw,
  Zap,
  ZapOff,
} from "lucide-react-native";
import { Worklets } from "react-native-worklets-core";

import { COLORS } from "../../theme/colors";

const TARGET_FPS = 30;
const MAX_POINTS = 100;

const { PRIMARY, BG, SURFACE, BORDER, TEXT, TEXT_MUTED } = COLORS;

export function HeartRateMeasuring() {
  const navigation = useNavigation();
  const { hasPermission, requestPermission } = useCameraPermission();
  const insets = useSafeAreaInsets();
  const setMetrics = useAppStore((state) => state.setMetrics);

  // Camera State
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const device = useCameraDevice(isFrontCamera ? "front" : "back");

  const [torchEnabled, setTorchEnabled] = useState(true);
  const [isCamCollapsed, setIsCamCollapsed] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [intensitySeries, setIntensitySeries] = useState<DataPoint[]>([]);
  const [heartRate, setHeartRate] = useState("--");
  const [hrv, setHrv] = useState("--");
  const [accumulatedIntensity, setAccumulatedIntensity] = useState<number[]>(
    []
  );

  // Refs
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Refs for guarding effects
  const permissionRequestedRef = useRef(false);

  // Request permission once
  useEffect(() => {
    if (!hasPermission && !permissionRequestedRef.current) {
      permissionRequestedRef.current = true;
      requestPermission();
    }
  }, [hasPermission]);

  // Auto-start mechanism: Set isRecording to true when permission is granted
  useEffect(() => {
    if (hasPermission && !isRecording && startTimeRef.current === null) {
      setIsRecording(true);
    }
  }, [hasPermission]);

  const updateData = useCallback(
    (intensity: number) => {
      const now = Date.now();
      if (!startTimeRef.current) startTimeRef.current = now;

      const newDataPoint = { x: now, y: Number(intensity.toFixed(2)) };

      setIntensitySeries((prev) => {
        const next = [...prev, newDataPoint];
        if (next.length > MAX_POINTS)
          return next.slice(next.length - MAX_POINTS);
        return next;
      });

      setAccumulatedIntensity((prev) => {
        const next = [...prev, intensity];
        // Debug Log
        console.log("Current Intensity:", intensity);

        if (next.length % 30 === 0) {
          const metrics = calculateHRMetrics(next, TARGET_FPS);
          if (metrics) {
            setHeartRate(metrics.heartRate.toString());
            setHrv(metrics.hrv.toString());
          }
        }
        return next;
      });
    },
    [isRecording]
  );

  const updateDataJS = useMemo(
    () => Worklets.createRunOnJS(updateData),
    [updateData]
  );

  const frameProcessor = useFrameProcessor(
    (frame) => {
      "worklet";
      try {
        if (frame.pixelFormat === "yuv") {
          // ✅ Y channel intensity (Android default)
          const buffer = frame.toArrayBuffer();
          const bytes = new Uint8Array(buffer);

          // In YUV, the Y (luminance) plane is the first width * height bytes
          const ySize = frame.width * frame.height;
          let sum = 0;
          let count = 0;

          // Sum only the Y channel
          const limit = Math.min(bytes.length, ySize);
          // Optimization: Sample every 4th pixel
          for (let i = 0; i < limit; i += 4) {
            sum += bytes[i];
            count++;
          }
          const avg = count > 0 ? sum / count : 0;

          updateDataJS(avg);
          return;
        }

        if (frame.pixelFormat === "rgb") {
          // ✅ RGB intensity (iOS or forced RGB)
          const buffer = frame.toArrayBuffer();
          const bytes = new Uint8Array(buffer);
          let total = 0;
          let count = 0;

          // Optimization: Sample every 4th pixel
          for (let i = 0; i < bytes.length; i += 12) {
            // 4 pixels * 3 bytes
            const r = bytes[i];
            const g = bytes[i + 1];
            const b = bytes[i + 2];
            if (r !== undefined) {
              total += 0.299 * r + 0.587 * g + 0.114 * b;
              count++;
            }
          }
          const avg = count > 0 ? total / count : 0;
          updateDataJS(avg);
          return;
        }

        console.log("Unsupported pixel format:", frame.pixelFormat);
      } catch (err: unknown) {
        console.error(
          "Frame processing error:",
          (err as Error)?.message ?? String(err)
        );
      }
    },
    [updateDataJS]
  );

  const handleStop = () => {
    setIsRecording(false);
    setMetrics(heartRate.toString(), hrv.toString());

    navigation.navigate("HomeTabs", { screen: "Home" });
  };

  const chartData = useMemo(() => {
    return intensitySeries.map((p) => ({ value: p.y }));
  }, [intensitySeries]);

  const switchCamera = () => {
    setIsFrontCamera((prev) => !prev);
  };

  const chartConfig = useMemo(() => {
    if (intensitySeries.length === 0) return { min: 0, max: 255 };
    const values = intensitySeries.map((d) => d.y);
    const min = Math.min(...values);
    const max = Math.max(...values);

    return {
      min: Math.max(0, min - 2),
      max: Math.min(255, max + 2),
    };
  }, [intensitySeries]);

  if (!device || !hasPermission) {
    return (
      <View style={styles.center}>
        <Text style={{ color: TEXT }}>No Camera Device or Permission</Text>
        <PrimaryButton onClick={requestPermission}>
          Request Permission
        </PrimaryButton>
      </View>
    );
  }

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
          <Text style={styles.title}>Measuring</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[styles.content, { flexGrow: 1 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Instruction Card */}
          <View style={styles.instructionCard}>
            <Text style={styles.instructionText}>
              Hold your hand steady and apply light pressure on the camera lens.
            </Text>
          </View>

          {/* Metrics Grid */}
          <View style={styles.metricsRow}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <MetricCard
                icon={<Heart size={20} color={COLORS.ERROR} />}
                title="HR"
                value={heartRate}
                unit="bpm"
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <MetricCard
                icon={<Activity size={20} color={COLORS.PURPLE} />}
                title="HRV"
                value={hrv}
                unit="ms"
              />
            </View>
          </View>

          {/* Intensity Graph Card */}
          <View style={styles.graphCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.graphTitle}>Live Signal</Text>
              <View style={styles.liveBadge}>
                <View style={styles.pulseDot} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            </View>

            <View style={styles.chartContainer}>
              {intensitySeries.length === 0 ? (
                <View style={styles.placeholderChart}>
                  <Text style={styles.placeholderText}>
                    Waiting for signal...
                  </Text>
                </View>
              ) : (
                <LineChart
                  data={chartData}
                  height={200}
                  width={Dimensions.get("window").width - 80}
                  hideDataPoints
                  hideRules
                  curved
                  color={PRIMARY}
                  thickness={3}
                  startFillColor={PRIMARY}
                  endFillColor={PRIMARY}
                  startOpacity={0.1}
                  endOpacity={0.0}
                  initialSpacing={0}
                  yAxisOffset={chartConfig.min}
                  maxValue={chartConfig.max}
                  areaChart
                  yAxisThickness={0}
                  xAxisThickness={0}
                  yAxisTextStyle={{ color: TEXT_MUTED, fontSize: 10 }}
                />
              )}
            </View>
          </View>

          {/* Padding for sticky button */}
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>

      {/* Floating Camera Preview */}
      <View
        style={[
          styles.cameraWindow,
          isCamCollapsed ? styles.cameraCollapsed : styles.cameraExpanded,
        ]}
      >
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={isRecording}
          frameProcessor={frameProcessor}
          pixelFormat="yuv"
          torch={
            device && device.hasTorch && isRecording && torchEnabled
              ? "on"
              : "off"
          }
        />

        {/* Controls Overlay */}
        <View style={styles.camOverlay}>
          {/* Collapse Button */}
          <TouchableOpacity
            onPress={() => setIsCamCollapsed((v) => !v)}
            style={styles.camBtn}
          >
            {isCamCollapsed ? (
              <Maximize2 size={14} color={COLORS.WHITE} />
            ) : (
              <Minimize2 size={14} color={COLORS.WHITE} />
            )}
          </TouchableOpacity>

          <View style={{ flex: 1 }} />

          {/* Switch Button */}
          <TouchableOpacity onPress={switchCamera} style={styles.camBtn}>
            <RefreshCw size={14} color={COLORS.WHITE} />
          </TouchableOpacity>

          {/* Torch Button */}
          {device?.hasTorch && (
            <TouchableOpacity
              onPress={() => setTorchEnabled((prev) => !prev)}
              style={[styles.camBtn, { marginLeft: 6 }]}
            >
              {torchEnabled ? (
                <Zap size={14} color={COLORS.WHITE} />
              ) : (
                <ZapOff size={14} color={COLORS.WHITE} />
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Sticky Bottom Button */}
      <View style={[styles.footer, { paddingBottom: 16 + insets.bottom }]}>
        <PrimaryButton onClick={handleStop} style={{ width: "100%" }}>
          Stop Measuring
        </PrimaryButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT,
  },
  content: {
    paddingHorizontal: "4%",
    paddingBottom: 40,
  },
  instructionCard: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  instructionText: {
    color: TEXT_MUTED,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  metricsRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  graphCard: {
    backgroundColor: SURFACE,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 24,
    marginBottom: 24,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  graphTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.SUCCESS_BG,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 4,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.SUCCESS_TEXT,
  },
  liveText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.SUCCESS_TEXT,
  },
  chartContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginHorizontal: -16,
  },
  placeholderChart: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.BG,
    borderRadius: 12,
  },
  placeholderText: {
    color: TEXT_MUTED,
    fontSize: 14,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: SURFACE,
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },

  // Floating Camera Styles
  cameraWindow: {
    position: "absolute",
    top: 80,
    right: 24,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: COLORS.WHITE,
    backgroundColor: COLORS.BLACK,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
    zIndex: 50,
  },
  cameraExpanded: {
    width: 140,
    height: 180,
  },
  cameraCollapsed: {
    width: 80,
    height: 80,
  },
  camOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    flexDirection: "row",
    backgroundColor: COLORS.BLACK_30,
    alignItems: "center",
  },
  camBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.BLACK_40,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HeartRateMeasuring;
