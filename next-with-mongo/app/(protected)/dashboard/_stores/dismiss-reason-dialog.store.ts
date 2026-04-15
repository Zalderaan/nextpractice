import { create } from "zustand";
import { Application } from "../types/application.types";

interface DismissReasonDialogStore {
  isOpen: boolean;
  app: Application | null;
  reason: string | null;
  openDialog: (appId: Application, reason: string) => void;
  closeDialog: () => void;
}

export const useDismissReasonDialogStore = create<DismissReasonDialogStore>(
  (set) => ({
    app: null,
    reason: null,
    isOpen: false,

    openDialog: (app, reason) => {
      set({ 
        isOpen: true, 
        app: app, 
        reason });
    },

    closeDialog: () => set({ 
        isOpen: false, 
        app: null, 
        reason: null 
    }),
  }),
);
