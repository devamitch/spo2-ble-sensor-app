/**
 * Based on: Fukunishi et al. "Video Based Measurement of Heart Rate and Heart Rate Variability
 * Spectrogram from Estimated Hemoglobin Information" (CVPR 2018)
 */

export interface HRMetrics {
  heartRate: number;
  hrv: number;
  hrSeries: { x: number; y: number }[];
  hrvSeries: { x: number; y: number }[];
}

export interface DataPoint {
  x: number;
  y: number;
}

/**
 * Detrending: Remove slow-moving baseline variations using moving average subtraction
 */
const detrend = (
  data: number[],
  windowSize: number = Math.floor(data.length * 0.1)
): number[] => {
  if (data.length < windowSize * 2) return data;

  const detrended: number[] = [];
  const halfWindow = Math.floor(windowSize / 2);

  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - halfWindow);
    const end = Math.min(data.length, i + halfWindow);

    let sum = 0;
    for (let j = start; j < end; j++) {
      sum += data[j];
    }
    const localMean = sum / (end - start);
    detrended.push(data[i] - localMean);
  }

  return detrended;
};

/**
 * Band-pass filter using Butterworth approximation
 * Pass band: 0.75 Hz to 3.0 Hz (45-180 BPM)
 */
const bandPassFilter = (
  data: number[],
  sampleRate: number,
  lowCut: number = 0.75,
  highCut: number = 3.0
): number[] => {
  const filtered = [...data];

  // High-pass component: subtract low-frequency trend
  const highPassWindow = Math.ceil(sampleRate / lowCut);
  const highPassed = detrend(filtered, highPassWindow);

  // Low-pass component: smooth to remove high-frequency noise
  const lowPassWindow = Math.ceil(sampleRate / (highCut * 2));
  const smoothed: number[] = [];
  for (let i = 0; i < highPassed.length; i++) {
    const start = Math.max(0, i - Math.floor(lowPassWindow / 2));
    const end = Math.min(highPassed.length, i + Math.ceil(lowPassWindow / 2));
    let sum = 0;
    for (let j = start; j < end; j++) {
      sum += highPassed[j];
    }
    smoothed.push(sum / (end - start));
  }

  return smoothed;
};

/**
 * Detect peaks in BVP waveform
 */
const detectPeaks = (
  data: number[],
  minDistance: number | null = null,
  sampleRate: number = 30
): number[] => {
  if (!minDistance) {
    minDistance = Math.floor(sampleRate / 3);
  }

  const peaks: number[] = [];
  const sorted = [...data].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  const q75 = sorted[Math.floor(sorted.length * 0.75)];
  const threshold = median + (q75 - median) * 0.5;

  for (let i = 1; i < data.length - 1; i++) {
    const isLocalMax = data[i] > data[i - 1] && data[i] > data[i + 1];
    const aboveThreshold = data[i] > threshold;

    if (isLocalMax && aboveThreshold) {
      if (peaks.length === 0 || i - peaks[peaks.length - 1] >= minDistance) {
        peaks.push(i);
      }
    }
  }

  return peaks;
};

/**
 * Remove outliers from RR intervals using median absolute deviation (MAD)
 */
const removeOutliers = (rrIntervals: number[]): number[] => {
  if (rrIntervals.length < 3) return rrIntervals;

  const sorted = [...rrIntervals].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];

  const deviations = rrIntervals.map((rr) => Math.abs(rr - median));
  const sortedDeviations = deviations.sort((a, b) => a - b);
  const mad = sortedDeviations[Math.floor(sortedDeviations.length / 2)];

  const threshold = 3 * mad;
  return rrIntervals.filter((rr) => Math.abs(rr - median) <= threshold);
};

export const calculateHRMetrics = (
  data: number[],
  targetFps: number = 30,
  prevHrSeries: { x: number; y: number }[] = [],
  prevHrvSeries: { x: number; y: number }[] = []
): HRMetrics | null => {
  if (!data || data.length < 50) return null;

  const detrended = detrend(data);
  const filtered = bandPassFilter(detrended, targetFps, 0.75, 3.0);
  const peaks = detectPeaks(filtered, null, targetFps);

  if (peaks.length < 2) return null;

  const frameIntervalMs = 1000 / targetFps;
  const rrIntervals: number[] = [];
  for (let i = 1; i < peaks.length; i++) {
    const diff = (peaks[i] - peaks[i - 1]) * frameIntervalMs;
    if (diff >= 333 && diff <= 1333) {
      rrIntervals.push(diff);
    }
  }

  if (rrIntervals.length < 2) return null;

  const cleanedRR = removeOutliers(rrIntervals);
  if (cleanedRR.length < 2) return null;

  const avgRR = cleanedRR.reduce((a, b) => a + b, 0) / cleanedRR.length;
  const hr = 60000 / avgRR;

  const mean = avgRR;
  const variance =
    cleanedRR.reduce((sum, val) => sum + (val - mean) ** 2, 0) /
    cleanedRR.length;
  const sdnn = Math.sqrt(variance);

  if (hr < 40 || hr > 200) return null;

  const heartRate = parseFloat(hr.toFixed(1));
  const hrv = parseFloat(sdnn.toFixed(1));

  const t = Date.now();

  const hrSeries = [...prevHrSeries, { x: t, y: heartRate }];
  const hrvSeries = [...prevHrvSeries, { x: t, y: hrv }];

  return {
    heartRate,
    hrv,
    hrSeries,
    hrvSeries,
  };
};
