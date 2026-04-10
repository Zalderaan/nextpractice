import { create } from "zustand";

const PERIODS = [
  { label: "3m", months: 3 },
  { label: "6m", months: 6 },
  { label: "12m", months: 12 },
  { label: "All", months: 0 },
] as const;

export type Period = (typeof PERIODS)[number]["months"];
export { PERIODS };

interface DashboardStore {
  globalPeriod: Period;
  setGlobalPeriod: (p: Period) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  globalPeriod: 12,
  setGlobalPeriod: (globalPeriod) => set({ globalPeriod }),
}));
