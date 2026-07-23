import { create } from "zustand";

interface AppState {
  activeScene: number;
  setActiveScene: (scene: number) => void;
  bootComplete: boolean;
  setBootComplete: (v: boolean) => void;
  mousePos: { x: number; y: number };
  setMousePos: (pos: { x: number; y: number }) => void;
}

export const useStore = create<AppState>((set) => ({
  activeScene: 0,
  setActiveScene: (scene) => set({ activeScene: scene }),
  bootComplete: false,
  setBootComplete: (v) => set({ bootComplete: v }),
  mousePos: { x: 0, y: 0 },
  setMousePos: (pos) => set({ mousePos: pos }),
}));
