import { create } from "zustand";
import { Application } from "../../types/application.types";


interface ApplicationSheetStore {
  // 1. Data & Visibility State
  selectedApp: Application | null;
  isOpen: boolean;

  // 2. Local UI State
  isEditing: boolean;
  isRefreshing: boolean;

  // 3. Actions
  openSheet: (app: Application) => void;
  closeSheet: () => void;
  setIsEditing: (isEditing: boolean) => void;
  setIsRefreshing: (isRefreshing: boolean) => void;
}

export const useApplicationSheetStore = create<ApplicationSheetStore>(
  (set) => ({
    selectedApp: null,
    isOpen: false,
    isEditing: false,
    isRefreshing: false,

    openSheet: (app) =>
      set({ selectedApp: app, isOpen: true, isEditing: false }),
    closeSheet: () =>
      set({
        selectedApp: null,
        isOpen: false,
        isEditing: false,
        isRefreshing: false,
      }),
    setIsEditing: (isEditing) => set({ isEditing }),
    setIsRefreshing: (isRefreshing) => set({ isRefreshing }),
  }),
);
