import { create } from 'zustand';

interface FeatureModalStore {
  isOpen: boolean;
  feature: string | null;
  openModal: (feature: string) => void;
  closeModal: () => void;
}

export const useFeatureModal = create<FeatureModalStore>((set) => ({
  isOpen: false,
  feature: null,
  openModal: (feature) => set({ isOpen: true, feature }),
  closeModal: () => set({ isOpen: false, feature: null }),
}));