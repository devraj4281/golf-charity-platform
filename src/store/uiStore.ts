import { create } from 'zustand';

interface UIState {
  isBottomSheetOpen: boolean;
  openBottomSheet: () => void;
  closeBottomSheet: () => void;
  toggleBottomSheet: () => void;
  
  // Generic modal state (could be expanded to manage multiple specific modals)
  activeModal: string | null;
  openModal: (modalId: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isBottomSheetOpen: false,
  openBottomSheet: () => set({ isBottomSheetOpen: true }),
  closeBottomSheet: () => set({ isBottomSheetOpen: false }),
  toggleBottomSheet: () => set((state) => ({ isBottomSheetOpen: !state.isBottomSheetOpen })),

  activeModal: null,
  openModal: (modalId) => set({ activeModal: modalId }),
  closeModal: () => set({ activeModal: null }),
}));
