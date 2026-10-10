import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AppState {
  // Onboarding
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (value: boolean) => void;

  // Metrics
  heartRate: string;
  hrv: string;
  setMetrics: (hr: string, hrv: string) => void;

  // Modal preferences
  hideStartScanModal: boolean;
  setHideStartScanModal: (value: boolean) => void;

  // Session history
  sessions: Array<{
    id: string;
    heartRate: number;
    hrv: number;
    timestamp: number;
    duration: number;
    confidence: number;
  }>;
  addSession: (session: {
    heartRate: number;
    hrv: number;
    duration: number;
    confidence: number;
  }) => void;

  // User preferences
  preferredCamera: 'front' | 'back';
  setPreferredCamera: (camera: 'front' | 'back') => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Onboarding
      hasCompletedOnboarding: false,
      setHasCompletedOnboarding: (hasCompletedOnboarding) => set({ hasCompletedOnboarding }),

      // Metrics
      heartRate: '--',
      hrv: '--',
      setMetrics: (heartRate, hrv) => set({ heartRate, hrv }),

      // Modal preferences
      hideStartScanModal: false,
      setHideStartScanModal: (hideStartScanModal) => set({ hideStartScanModal }),

      // Session history
      sessions: [],
      addSession: (session) =>
        set((state) => ({
          sessions: [
            {
              id: Date.now().toString(),
              timestamp: Date.now(),
              ...session,
            },
            ...state.sessions,
          ].slice(0, 50), // Keep last 50 sessions
        })),

      // User preferences
      preferredCamera: 'back',
      setPreferredCamera: (preferredCamera) => set({ preferredCamera }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
