/**
 * Improved Heart Rate calculation based on photoplethysmography (PPG)
 * Enhanced filtering and peak detection for more accurate results
 */

export interface HRMetrics {
  heartRate: number;
  hrv: number;
  confidence: number;
  hrSeries: { x: number; y: number }[];
  hrvSeries: { x: number; y: number }[];
}

export interface DataPoint {
  x: number;
  y: number;
}

/**
 * Apply Butterworth-inspired bandpass filter
 * Optimized for heart rate detection (0.75Hz - 3.0Hz = 45-180 BPM)
 */
const bandPassFilter = (
  data: number[],
  sampleRate: number,
  lowCut: number = 0.75,
  highCut: number = 3.0
): number[] => {
  if (data.length < 10) return data;

  // High-pass filter: remove DC component and low frequency drift
  const highPassed = data.map((val, idx) => {
    if (idx === 0) return 0;
    const windowSize = Math.min(Math.ceil(sampleRate / lowCut), idx);
    const start = Math.max(0, idx - windowSize);
    const sum = data.slice(start, idx).reduce((a, b) => a + b, 0);
    const avg = sum / (idx - start);
    return val - avg;
  });

  // Low-pass filter: smooth high-frequency noise
  const lowPassWindow = Math.ceil(sampleRate / (highCut * 4));
  const filtered: number[] = [];

  for (let i = 0; i < highPassed.length; i++) {
    const start = Math.max(0, i - Math.floor(lowPassWindow / 2));
    const end = Math.min(highPassed.length, i + Math.ceil(lowPassWindow / 2));
    const sum = highPassed.slice(start, end).reduce((a, b) => a + b, 0);
    filtered.push(sum / (end - start));
  }

  return filtered;
};

/**
 * Normalize signal to 0-1 range for consistent peak detection
 */
const normalizeSignal = (data: number[]): number[] => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;
  if (range === 0) return data.map(() => 0);
  return data.map((val) => (val - min) / range);
};

/**
 * Detect peaks with adaptive threshold and minimum distance
 */
const detectPeaks = (
  data: number[],
  sampleRate: number = 30,
  minBPM: number = 45,
  maxBPM: number = 180
): number[] => {
  if (data.length < 10) return [];

  // Minimum distance between peaks based on max heart rate
  const minDistance = Math.floor((sampleRate * 60) / maxBPM);

  // Normalize data
  const normalized = normalizeSignal(data);

  // Calculate adaptive threshold using percentile method
  const sorted = [...normalized].sort((a, b) => a - b);
  const percentile75 = sorted[Math.floor(sorted.length * 0.75)];
  const percentile25 = sorted[Math.floor(sorted.length * 0.25)];
  const threshold = percentile25 + (percentile75 - percentile25) * 0.6;

  const peaks: number[] = [];

  for (let i = 2; i < data.length - 2; i++) {
    // Check if it's a local maximum
    const isLocalMax =
      normalized[i] > normalized[i - 1] &&
      normalized[i] > normalized[i + 1] &&
      normalized[i] > normalized[i - 2] &&
      normalized[i] > normalized[i + 2];

    const aboveThreshold = normalized[i] > threshold;

    if (isLocalMax && aboveThreshold) {
      // Check minimum distance from last peak
      if (peaks.length === 0 || i - peaks[peaks.length - 1] >= minDistance) {
        peaks.push(i);
      } else if (normalized[i] > normalized[peaks[peaks.length - 1]]) {
        // Replace last peak if current peak is higher
        peaks[peaks.length - 1] = i;
      }
    }
  }

  return peaks;
};

/**
 * Remove outliers using Median Absolute Deviation (MAD)
 */
const removeOutliers = (intervals: number[], threshold: number = 2.5): number[] => {
  if (intervals.length < 3) return intervals;

  const sorted = [...intervals].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];

  const deviations = intervals.map((val) => Math.abs(val - median));
  const sortedDeviations = [...deviations].sort((a, b) => a - b);
  const mad = sortedDeviations[Math.floor(sortedDeviations.length / 2)];

  if (mad === 0) return intervals;

  return intervals.filter((val) => Math.abs(val - median) / mad <= threshold);
};

/**
 * Calculate signal quality metrics
 */
const calculateSignalQuality = (data: number[], peaks: number[]): number => {
  if (peaks.length < 2) return 0;

  // Calculate SNR-like metric
  const normalized = normalizeSignal(data);
  const peakValues = peaks.map((idx) => normalized[idx]);
  const avgPeakHeight = peakValues.reduce((a, b) => a + b, 0) / peakValues.length;

  // Calculate noise level (standard deviation of non-peak areas)
  const nonPeakIndices = data.map((_, idx) => idx).filter((idx) => !peaks.includes(idx));
  const nonPeakValues = nonPeakIndices.map((idx) => normalized[idx]);
  const avgNoise = nonPeakValues.reduce((a, b) => a + b, 0) / nonPeakValues.length;
  const noiseStd = Math.sqrt(
    nonPeakValues.reduce((sum, val) => sum + (val - avgNoise) ** 2, 0) / nonPeakValues.length
  );

  // SNR-based confidence (0-1)
  const snr = avgPeakHeight / (noiseStd + 0.001);
  const confidence = Math.min(1, snr / 10);

  return confidence;
};

/**
 * Main function to calculate heart rate metrics
 */
export const calculateHRMetrics = (
  data: number[],
  targetFps: number = 30,
  prevHrSeries: DataPoint[] = [],
  prevHrvSeries: DataPoint[] = []
): HRMetrics | null => {
  // Need at least 3 seconds of data
  const minSamples = targetFps * 3;
  if (!data || data.length < minSamples) return null;

  try {
    // Apply bandpass filter
    const filtered = bandPassFilter(data, targetFps, 0.75, 3.0);

    // Detect peaks
    const peaks = detectPeaks(filtered, targetFps);

    if (peaks.length < 3) return null;

    // Calculate RR intervals (time between peaks in milliseconds)
    const frameIntervalMs = 1000 / targetFps;
    const rrIntervals: number[] = [];

    for (let i = 1; i < peaks.length; i++) {
      const interval = (peaks[i] - peaks[i - 1]) * frameIntervalMs;
      // Filter physiologically plausible intervals (40-200 BPM)
      if (interval >= 300 && interval <= 1500) {
        rrIntervals.push(interval);
      }
    }

    if (rrIntervals.length < 2) return null;

    // Remove outliers
    const cleanedRR = removeOutliers(rrIntervals, 2.0);
    if (cleanedRR.length < 2) return null;

    // Calculate heart rate
    const avgRR = cleanedRR.reduce((a, b) => a + b, 0) / cleanedRR.length;
    const hr = 60000 / avgRR;

    // Validate heart rate range
    if (hr < 40 || hr > 200) return null;

    // Calculate HRV (SDNN - Standard Deviation of NN intervals)
    const mean = avgRR;
    const variance = cleanedRR.reduce((sum, val) => sum + (val - mean) ** 2, 0) / cleanedRR.length;
    const sdnn = Math.sqrt(variance);

    // Calculate confidence
    const confidence = calculateSignalQuality(filtered, peaks);

    // Only return results with sufficient confidence
    if (confidence < 0.3) return null;

    const heartRate = Math.round(hr * 10) / 10;
    const hrv = Math.round(sdnn * 10) / 10;

    const t = Date.now();
    const hrSeries = [...prevHrSeries, { x: t, y: heartRate }];
    const hrvSeries = [...prevHrvSeries, { x: t, y: hrv }];

    return {
      heartRate,
      hrv,
      confidence,
      hrSeries,
      hrvSeries,
    };
  } catch (error) {
    console.error('Error calculating HR metrics:', error);
    return null;
  }
};

/**
 * Smooth the intensity data to reduce noise
 */
export const smoothIntensity = (data: number[], windowSize: number = 3): number[] => {
  if (data.length < windowSize) return data;

  const smoothed: number[] = [];
  const halfWindow = Math.floor(windowSize / 2);

  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - halfWindow);
    const end = Math.min(data.length, i + halfWindow + 1);
    const window = data.slice(start, end);
    const avg = window.reduce((a, b) => a + b, 0) / window.length;
    smoothed.push(avg);
  }

  return smoothed;
};
