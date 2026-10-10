import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AppState {
  heartRate: string;
  hrv: string;
  hideStartScanModal: boolean;
  setMetrics: (hr: string, hrv: string) => void;
  setHideStartScanModal: (value: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      heartRate: "--",
      hrv: "--",
      hideStartScanModal: false,
      setMetrics: (heartRate, hrv) => set({ heartRate, hrv }),
      setHideStartScanModal: (hideStartScanModal) =>
        set({ hideStartScanModal }),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
